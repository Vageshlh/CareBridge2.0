from extensions import db
from models.base import Base

class Review(Base):
    """Review model for patient reviews of doctors after consultations"""
    appointment_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('appointment.id'), nullable=False, unique=True)
    patient_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False)
    doctor_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 rating
    comment = db.Column(db.Text, nullable=True)
    is_anonymous = db.Column(db.Boolean, default=False, nullable=False)
    
    # Relationships
    appointment = db.relationship('Appointment', back_populates='review')
    patient = db.relationship('User', foreign_keys=[patient_id], back_populates='reviews_given')
    doctor = db.relationship('User', foreign_keys=[doctor_id], back_populates='reviews_received')
    
    def save(self):
        """Save the review and update doctor's average rating"""
        result = super().save()
        
        # Update doctor's average rating
        if self.doctor and self.doctor.doctor_profile:
            self.doctor.doctor_profile.update_rating()
        
        return result
    
    def to_dict(self):
        data = super().to_dict()
        # Add related data
        if not self.is_anonymous and self.patient:
            data['patient'] = {
                'id': str(self.patient.id),
                'first_name': self.patient.first_name,
                'last_name': self.patient.last_name,
                'profile_picture': self.patient.profile_picture
            }
        else:
            data['patient'] = {
                'id': None,
                'first_name': 'Anonymous',
                'last_name': 'Patient',
                'profile_picture': None
            }
        
        if self.doctor:
            data['doctor'] = {
                'id': str(self.doctor.id),
                'first_name': self.doctor.first_name,
                'last_name': self.doctor.last_name
            }
        
        if self.appointment:
            data['appointment'] = {
                'id': str(self.appointment.id),
                'date': self.appointment.start_time.date().isoformat() if self.appointment.start_time else None
            }
        
        return data