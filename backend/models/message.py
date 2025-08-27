import enum
from extensions import db
from models.base import Base

class MessageType(enum.Enum):
    TEXT = 'text'
    FILE = 'file'
    SYSTEM = 'system'

class Message(Base):
    """Message model for chat functionality during consultations"""
    appointment_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('appointment.id'), nullable=False)
    sender_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False)
    message_type = db.Column(db.Enum(MessageType), default=MessageType.TEXT, nullable=False)
    content = db.Column(db.Text, nullable=False)
    file_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('file.id'), nullable=True)
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    read_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    appointment = db.relationship('Appointment', back_populates='messages')
    sender = db.relationship('User', back_populates='messages_sent')
    file = db.relationship('File')
    
    def mark_as_read(self):
        """Mark the message as read"""
        from datetime import datetime
        self.is_read = True
        self.read_at = datetime.utcnow()
        db.session.commit()
    
    def to_dict(self):
        data = super().to_dict()
        # Add related data
        if self.sender:
            data['sender'] = {
                'id': str(self.sender.id),
                'first_name': self.sender.first_name,
                'last_name': self.sender.last_name,
                'role': self.sender.role.value,
                'profile_picture': self.sender.profile_picture
            }
        if self.file:
            data['file'] = {
                'id': str(self.file.id),
                'filename': self.file.filename,
                'file_type': self.file.file_type,
                'file_size': self.file.file_size,
                'file_path': self.file.file_path
            }
        return data