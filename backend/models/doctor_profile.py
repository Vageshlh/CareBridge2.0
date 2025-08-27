import enum
from extensions import db
from models.base import Base

class VerificationStatus(enum.Enum):
    PENDING = 'pending'
    APPROVED = 'approved'
    REJECTED = 'rejected'

class DoctorProfile(Base):
    """Doctor profile model for storing doctor-specific information"""
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False, unique=True)
    specialty = db.Column(db.String(100), nullable=False)
    license_number = db.Column(db.String(100), nullable=False, unique=True)
    license_document = db.Column(db.String(255), nullable=True)  # Path to uploaded license document
    id_document = db.Column(db.String(255), nullable=True)  # Path to uploaded ID document
    verification_status = db.Column(db.Enum(VerificationStatus), default=VerificationStatus.PENDING, nullable=False)
    verification_date = db.Column(db.DateTime, nullable=True)
    verified_by = db.Column(db.UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    education = db.Column(db.Text, nullable=True)
    experience_years = db.Column(db.Integer, nullable=True)
    languages = db.Column(db.String(255), nullable=True)  # Comma-separated list of languages
    consultation_fee = db.Column(db.Numeric(10, 2), nullable=False)
    available_for_appointments = db.Column(db.Boolean, default=True, nullable=False)
    average_rating = db.Column(db.Numeric(3, 2), default=0, nullable=False)
    total_reviews = db.Column(db.Integer, default=0, nullable=False)
    
    # Relationships
    user = db.relationship('User', back_populates='doctor_profile', foreign_keys=[user_id])
    verifier = db.relationship('User', foreign_keys=[verified_by])
    clinic_associations = db.relationship('ClinicDoctor', back_populates='doctor', cascade='all, delete-orphan')
    time_slots = db.relationship('TimeSlot', back_populates='doctor', cascade='all, delete-orphan')
    
    def update_rating(self):
        """Update the average rating based on reviews"""
        from models.review import Review
        reviews = Review.query.filter_by(doctor_id=self.user_id).all()
        if reviews:
            total_rating = sum(review.rating for review in reviews)
            self.average_rating = total_rating / len(reviews)
            self.total_reviews = len(reviews)
        else:
            self.average_rating = 0
            self.total_reviews = 0
        db.session.commit()
    
    def to_dict(self):
        data = super().to_dict()
        # Add related data
        if self.user:
            data['user'] = {
                'id': str(self.user.id),
                'first_name': self.user.first_name,
                'last_name': self.user.last_name,
                'email': self.user.email,
                'profile_picture': self.user.profile_picture
            }
        return data