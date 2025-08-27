import enum
from extensions import db
from models.base import Base

class FileType(enum.Enum):
    IMAGE = 'image'
    DOCUMENT = 'document'
    MEDICAL_RECORD = 'medical_record'
    PRESCRIPTION = 'prescription'
    OTHER = 'other'

class File(Base):
    """File model for handling file uploads"""
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)  # Path to the file in storage
    file_type = db.Column(db.Enum(FileType), default=FileType.OTHER, nullable=False)
    mime_type = db.Column(db.String(100), nullable=False)
    file_size = db.Column(db.Integer, nullable=False)  # Size in bytes
    uploader_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False)
    appointment_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('appointment.id'), nullable=True)
    
    # Relationships
    uploader = db.relationship('User')
    appointment = db.relationship('Appointment', back_populates='files')
    
    @property
    def url(self):
        """Get the URL for accessing the file"""
        return f"/uploads/{self.filename}"
    
    def to_dict(self):
        data = super().to_dict()
        data['url'] = self.url
        # Add related data
        if self.uploader:
            data['uploader'] = {
                'id': str(self.uploader.id),
                'first_name': self.uploader.first_name,
                'last_name': self.uploader.last_name,
                'role': self.uploader.role.value
            }
        return data