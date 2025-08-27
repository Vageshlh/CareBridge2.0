from extensions import db
from models.base import Base

class Prescription(Base):
    """Prescription model for e-prescriptions after consultations"""
    appointment_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('appointment.id'), nullable=False, unique=True)
    diagnosis = db.Column(db.Text, nullable=False)
    medications = db.Column(db.Text, nullable=False)  # JSON string of medications
    instructions = db.Column(db.Text, nullable=False)
    advice = db.Column(db.Text, nullable=True)
    follow_up = db.Column(db.Text, nullable=True)
    pdf_path = db.Column(db.String(255), nullable=True)  # Path to generated PDF
    
    # Relationships
    appointment = db.relationship('Appointment', back_populates='prescription')
    
    @property
    def doctor(self):
        """Get the doctor who issued the prescription"""
        return self.appointment.doctor if self.appointment else None
    
    @property
    def patient(self):
        """Get the patient who received the prescription"""
        return self.appointment.patient if self.appointment else None
    
    def to_dict(self):
        data = super().to_dict()
        # Add related data
        if self.appointment:
            data['appointment'] = {
                'id': str(self.appointment.id),
                'start_time': self.appointment.start_time.isoformat() if self.appointment.start_time else None,
                'end_time': self.appointment.end_time.isoformat() if self.appointment.end_time else None
            }
        if self.doctor:
            data['doctor'] = {
                'id': str(self.doctor.id),
                'first_name': self.doctor.first_name,
                'last_name': self.doctor.last_name,
                'license_number': self.doctor.doctor_profile.license_number if self.doctor.doctor_profile else None
            }
        if self.patient:
            data['patient'] = {
                'id': str(self.patient.id),
                'first_name': self.patient.first_name,
                'last_name': self.patient.last_name,
                'date_of_birth': self.patient.date_of_birth.isoformat() if self.patient.date_of_birth else None
            }
        return data