from extensions import db
from models.base import Base

class Clinic(Base):
    """Clinic model for storing clinic information"""
    name = db.Column(db.String(255), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(100), nullable=False)
    postal_code = db.Column(db.String(20), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    website = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    logo = db.Column(db.String(255), nullable=True)  # Path to uploaded logo
    admin_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Relationships
    admin = db.relationship('User', back_populates='clinic_admin', foreign_keys=[admin_id])
    doctor_associations = db.relationship('ClinicDoctor', back_populates='clinic', cascade='all, delete-orphan')
    
    def to_dict(self):
        data = super().to_dict()
        # Add related data
        if self.admin:
            data['admin'] = {
                'id': str(self.admin.id),
                'first_name': self.admin.first_name,
                'last_name': self.admin.last_name,
                'email': self.admin.email
            }
        return data

class ClinicDoctor(Base):
    """Association model between clinics and doctors"""
    clinic_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('clinic.id'), nullable=False)
    doctor_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('doctorprofile.id'), nullable=False)
    is_primary = db.Column(db.Boolean, default=False, nullable=False)  # Whether this is the doctor's primary clinic
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)  # Null means still active
    notes = db.Column(db.Text, nullable=True)
    
    # Relationships
    clinic = db.relationship('Clinic', back_populates='doctor_associations')
    doctor = db.relationship('DoctorProfile', back_populates='clinic_associations')
    
    # Unique constraint to prevent duplicate associations
    __table_args__ = (db.UniqueConstraint('clinic_id', 'doctor_id', name='uq_clinic_doctor'),)