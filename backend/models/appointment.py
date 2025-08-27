import enum
from extensions import db
from models.base import Base

class AppointmentStatus(enum.Enum):
    PENDING = 'pending'
    CONFIRMED = 'confirmed'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'
    NO_SHOW = 'no_show'

class Appointment(Base):
    """Appointment model for consultations between doctors and patients"""
    patient_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False)
    doctor_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False)
    time_slot_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('timeslot.id'), nullable=False, unique=True)
    status = db.Column(db.Enum(AppointmentStatus), default=AppointmentStatus.PENDING, nullable=False)
    reason = db.Column(db.Text, nullable=True)
    symptoms = db.Column(db.Text, nullable=True)
    medical_history = db.Column(db.Text, nullable=True)
    current_medications = db.Column(db.Text, nullable=True)
    allergies = db.Column(db.Text, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    cancellation_reason = db.Column(db.Text, nullable=True)
    cancelled_by = db.Column(db.UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=True)
    room_id = db.Column(db.String(100), nullable=True)  # For WebRTC room
    
    # Relationships
    patient = db.relationship('User', foreign_keys=[patient_id], back_populates='appointments_as_patient')
    doctor = db.relationship('User', foreign_keys=[doctor_id], back_populates='appointments_as_doctor')
    canceller = db.relationship('User', foreign_keys=[cancelled_by])
    time_slot = db.relationship('TimeSlot', back_populates='appointment')
    messages = db.relationship('Message', back_populates='appointment', cascade='all, delete-orphan')
    prescription = db.relationship('Prescription', back_populates='appointment', uselist=False, cascade='all, delete-orphan')
    review = db.relationship('Review', back_populates='appointment', uselist=False, cascade='all, delete-orphan')
    files = db.relationship('File', back_populates='appointment', cascade='all, delete-orphan')
    
    @property
    def start_time(self):
        """Get the start time of the appointment"""
        return self.time_slot.start_time if self.time_slot else None
    
    @property
    def end_time(self):
        """Get the end time of the appointment"""
        return self.time_slot.end_time if self.time_slot else None
    
    @property
    def duration_minutes(self):
        """Get the duration of the appointment in minutes"""
        return self.time_slot.duration_minutes if self.time_slot else None
    
    def cancel(self, user_id, reason=None):
        """Cancel the appointment"""
        self.status = AppointmentStatus.CANCELLED
        self.cancellation_reason = reason
        self.cancelled_by = user_id
        
        # Make the time slot available again
        if self.time_slot:
            self.time_slot.is_available = True
        
        db.session.commit()
    
    def complete(self):
        """Mark the appointment as completed"""
        self.status = AppointmentStatus.COMPLETED
        db.session.commit()
    
    def mark_no_show(self):
        """Mark the appointment as no-show"""
        self.status = AppointmentStatus.NO_SHOW
        db.session.commit()
    
    def confirm(self):
        """Confirm the appointment"""
        self.status = AppointmentStatus.CONFIRMED
        db.session.commit()
    
    def to_dict(self):
        data = super().to_dict()
        # Add related data
        if self.patient:
            data['patient'] = {
                'id': str(self.patient.id),
                'first_name': self.patient.first_name,
                'last_name': self.patient.last_name,
                'email': self.patient.email,
                'profile_picture': self.patient.profile_picture
            }
        if self.doctor:
            data['doctor'] = {
                'id': str(self.doctor.id),
                'first_name': self.doctor.first_name,
                'last_name': self.doctor.last_name,
                'email': self.doctor.email,
                'profile_picture': self.doctor.profile_picture
            }
        if self.time_slot:
            data['time_slot'] = {
                'id': str(self.time_slot.id),
                'start_time': self.time_slot.start_time.isoformat(),
                'end_time': self.time_slot.end_time.isoformat(),
                'duration_minutes': self.time_slot.duration_minutes
            }
        return data