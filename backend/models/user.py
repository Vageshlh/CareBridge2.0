import enum
from datetime import datetime
from passlib.hash import pbkdf2_sha256

from extensions import db
from models.base import Base

class Role(enum.Enum):
    PATIENT = 'patient'
    DOCTOR = 'doctor'
    CLINIC_ADMIN = 'clinic_admin'
    ADMIN = 'admin'

class User(Base):
    """User model for authentication and profile information"""
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.Enum(Role), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    date_of_birth = db.Column(db.Date, nullable=True)
    gender = db.Column(db.String(20), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    postal_code = db.Column(db.String(20), nullable=True)
    profile_picture = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    is_verified = db.Column(db.Boolean, default=False, nullable=False)
    last_login = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    doctor_profile = db.relationship('DoctorProfile', back_populates='user', uselist=False, cascade='all, delete-orphan')
    clinic_admin = db.relationship('Clinic', back_populates='admin', uselist=False)
    appointments_as_patient = db.relationship('Appointment', foreign_keys='Appointment.patient_id', back_populates='patient')
    appointments_as_doctor = db.relationship('Appointment', foreign_keys='Appointment.doctor_id', back_populates='doctor')
    reviews_given = db.relationship('Review', foreign_keys='Review.patient_id', back_populates='patient')
    reviews_received = db.relationship('Review', foreign_keys='Review.doctor_id', back_populates='doctor')
    messages_sent = db.relationship('Message', foreign_keys='Message.sender_id', back_populates='sender')
    
    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')
    
    @password.setter
    def password(self, password):
        self.password_hash = pbkdf2_sha256.hash(password)
    
    def verify_password(self, password):
        return pbkdf2_sha256.verify(password, self.password_hash)
    
    def update_last_login(self):
        self.last_login = datetime.utcnow()
        db.session.commit()
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def has_role(self, role):
        if isinstance(role, str):
            return self.role.value == role
        return self.role == role
    
    def to_dict(self):
        data = super().to_dict()
        # Remove sensitive information
        data.pop('password_hash', None)
        return data