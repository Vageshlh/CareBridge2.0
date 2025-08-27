import enum
from extensions import db
from models.base import Base

class NotificationType(enum.Enum):
    APPOINTMENT_REMINDER = 'appointment_reminder'
    APPOINTMENT_CREATED = 'appointment_created'
    APPOINTMENT_UPDATED = 'appointment_updated'
    APPOINTMENT_CANCELLED = 'appointment_cancelled'
    APPOINTMENT_CONFIRMED = 'appointment_confirmed'
    APPOINTMENT_COMPLETED = 'appointment_completed'
    MESSAGE_RECEIVED = 'message_received'
    PRESCRIPTION_CREATED = 'prescription_created'
    REVIEW_RECEIVED = 'review_received'
    DOCTOR_VERIFIED = 'doctor_verified'
    SYSTEM = 'system'

class NotificationStatus(enum.Enum):
    UNREAD = 'unread'
    READ = 'read'

class Notification(Base):
    """Notification model for user notifications"""
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.Enum(NotificationType), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum(NotificationStatus), default=NotificationStatus.UNREAD, nullable=False)
    read_at = db.Column(db.DateTime, nullable=True)
    resource_type = db.Column(db.String(100), nullable=True)  # E.g., 'appointment', 'message', 'prescription'
    resource_id = db.Column(db.String(100), nullable=True)  # ID of the related resource
    
    # Relationships
    user = db.relationship('User', backref=db.backref('notifications', lazy='dynamic'))
    
    def mark_as_read(self):
        """Mark the notification as read"""
        from datetime import datetime
        self.status = NotificationStatus.READ
        self.read_at = datetime.utcnow()
        db.session.commit()
    
    @classmethod
    def create(cls, user_id, type, title, message, resource_type=None, resource_id=None):
        """Create and save a notification"""
        notification = cls(
            user_id=user_id,
            type=type,
            title=title,
            message=message,
            resource_type=resource_type,
            resource_id=resource_id,
            status=NotificationStatus.UNREAD
        )
        db.session.add(notification)
        db.session.commit()
        return notification
    
    def to_dict(self):
        data = super().to_dict()
        # Add related data
        if self.user:
            data['user'] = {
                'id': str(self.user.id),
                'first_name': self.user.first_name,
                'last_name': self.user.last_name
            }
        return data