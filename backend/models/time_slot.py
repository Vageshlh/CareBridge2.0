import enum
from datetime import datetime, timedelta

from extensions import db
from models.base import Base

class SlotType(enum.Enum):
    RECURRING = 'recurring'
    CUSTOM = 'custom'

class RecurrencePattern(enum.Enum):
    DAILY = 'daily'
    WEEKLY = 'weekly'
    MONTHLY = 'monthly'

class TimeSlot(Base):
    """Time slot model for doctor availability"""
    doctor_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('doctorprofile.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    slot_type = db.Column(db.Enum(SlotType), nullable=False)
    is_available = db.Column(db.Boolean, default=True, nullable=False)
    
    # For recurring slots
    recurrence_pattern = db.Column(db.Enum(RecurrencePattern), nullable=True)
    recurrence_day = db.Column(db.Integer, nullable=True)  # Day of week (0-6) or day of month (1-31)
    recurrence_end_date = db.Column(db.Date, nullable=True)
    
    # Relationships
    doctor = db.relationship('DoctorProfile', back_populates='time_slots')
    appointment = db.relationship('Appointment', back_populates='time_slot', uselist=False)
    
    @property
    def duration_minutes(self):
        """Calculate the duration of the time slot in minutes"""
        delta = self.end_time - self.start_time
        return delta.total_seconds() / 60
    
    @property
    def is_booked(self):
        """Check if the time slot is booked"""
        return self.appointment is not None
    
    @property
    def is_past(self):
        """Check if the time slot is in the past"""
        return self.end_time < datetime.utcnow()
    
    @classmethod
    def get_available_slots(cls, doctor_id, start_date, end_date):
        """Get available time slots for a doctor within a date range"""
        return cls.query.filter(
            cls.doctor_id == doctor_id,
            cls.start_time >= start_date,
            cls.end_time <= end_date,
            cls.is_available == True,
            ~cls.appointment.has()
        ).order_by(cls.start_time).all()
    
    @classmethod
    def generate_slots_from_recurring(cls, doctor_id, start_date, days_ahead):
        """Generate time slots from recurring patterns for a specific period"""
        end_date = start_date + timedelta(days=days_ahead)
        recurring_slots = cls.query.filter(
            cls.doctor_id == doctor_id,
            cls.slot_type == SlotType.RECURRING,
            db.or_(
                cls.recurrence_end_date >= start_date,
                cls.recurrence_end_date == None
            )
        ).all()
        
        generated_slots = []
        for recurring_slot in recurring_slots:
            # Generate slots based on recurrence pattern
            current_date = start_date
            while current_date <= end_date:
                if recurring_slot.recurrence_pattern == RecurrencePattern.DAILY:
                    # Create a slot for each day
                    slot_start = datetime.combine(current_date, recurring_slot.start_time.time())
                    slot_end = datetime.combine(current_date, recurring_slot.end_time.time())
                    generated_slots.append({
                        'doctor_id': doctor_id,
                        'start_time': slot_start,
                        'end_time': slot_end,
                        'slot_type': SlotType.CUSTOM,
                        'is_available': True
                    })
                    current_date += timedelta(days=1)
                
                elif recurring_slot.recurrence_pattern == RecurrencePattern.WEEKLY:
                    # Create a slot if the day of week matches
                    if current_date.weekday() == recurring_slot.recurrence_day:
                        slot_start = datetime.combine(current_date, recurring_slot.start_time.time())
                        slot_end = datetime.combine(current_date, recurring_slot.end_time.time())
                        generated_slots.append({
                            'doctor_id': doctor_id,
                            'start_time': slot_start,
                            'end_time': slot_end,
                            'slot_type': SlotType.CUSTOM,
                            'is_available': True
                        })
                    current_date += timedelta(days=1)
                
                elif recurring_slot.recurrence_pattern == RecurrencePattern.MONTHLY:
                    # Create a slot if the day of month matches
                    if current_date.day == recurring_slot.recurrence_day:
                        slot_start = datetime.combine(current_date, recurring_slot.start_time.time())
                        slot_end = datetime.combine(current_date, recurring_slot.end_time.time())
                        generated_slots.append({
                            'doctor_id': doctor_id,
                            'start_time': slot_start,
                            'end_time': slot_end,
                            'slot_type': SlotType.CUSTOM,
                            'is_available': True
                        })
                    current_date += timedelta(days=1)
        
        return generated_slots