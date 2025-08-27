import enum
from extensions import db
from models.base import Base

class AuditAction(enum.Enum):
    CREATE = 'create'
    READ = 'read'
    UPDATE = 'update'
    DELETE = 'delete'
    LOGIN = 'login'
    LOGOUT = 'logout'
    APPROVE = 'approve'
    REJECT = 'reject'
    CANCEL = 'cancel'
    COMPLETE = 'complete'
    GENERATE = 'generate'
    OTHER = 'other'

class AuditLog(Base):
    """Audit log model for tracking sensitive actions"""
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=True)  # Null for system actions
    action = db.Column(db.Enum(AuditAction), nullable=False)
    resource_type = db.Column(db.String(100), nullable=False)  # E.g., 'user', 'appointment', 'prescription'
    resource_id = db.Column(db.String(100), nullable=True)  # ID of the affected resource
    description = db.Column(db.Text, nullable=False)
    ip_address = db.Column(db.String(45), nullable=True)  # IPv4 or IPv6 address
    user_agent = db.Column(db.String(255), nullable=True)  # Browser/client info
    metadata = db.Column(db.Text, nullable=True)  # JSON string with additional details
    
    # Relationships
    user = db.relationship('User')
    
    @classmethod
    def log(cls, user_id, action, resource_type, resource_id, description, ip_address=None, user_agent=None, metadata=None):
        """Create and save an audit log entry"""
        log_entry = cls(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            description=description,
            ip_address=ip_address,
            user_agent=user_agent,
            metadata=metadata
        )
        db.session.add(log_entry)
        db.session.commit()
        return log_entry