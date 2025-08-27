from extensions import db
from models.base import Base

class AdminSettings(Base):
    """Singleton model for system-wide admin settings"""
    # Booking settings
    min_booking_notice_hours = db.Column(db.Integer, default=1, nullable=False)
    max_booking_days_ahead = db.Column(db.Integer, default=30, nullable=False)
    appointment_duration_minutes = db.Column(db.Integer, default=30, nullable=False)
    buffer_time_minutes = db.Column(db.Integer, default=10, nullable=False)
    allow_same_day_booking = db.Column(db.Boolean, default=True, nullable=False)
    
    # Data retention
    retention_days_chat = db.Column(db.Integer, default=90, nullable=False)  # How long to keep chat messages
    retention_days_files = db.Column(db.Integer, default=365, nullable=False)  # How long to keep uploaded files
    
    # Email settings
    send_appointment_reminders = db.Column(db.Boolean, default=True, nullable=False)
    reminder_hours_before = db.Column(db.Integer, default=24, nullable=False)
    send_booking_confirmations = db.Column(db.Boolean, default=True, nullable=False)
    
    # System modes
    maintenance_mode = db.Column(db.Boolean, default=False, nullable=False)
    allow_new_registrations = db.Column(db.Boolean, default=True, nullable=False)
    allow_new_doctor_applications = db.Column(db.Boolean, default=True, nullable=False)
    
    # Email templates
    email_template_booking = db.Column(db.Text, nullable=True)
    email_template_reminder = db.Column(db.Text, nullable=True)
    email_template_cancellation = db.Column(db.Text, nullable=True)
    email_template_prescription = db.Column(db.Text, nullable=True)
    
    @classmethod
    def get_settings(cls):
        """Get the singleton settings instance, creating it if it doesn't exist"""
        settings = cls.query.first()
        if not settings:
            settings = cls()
            db.session.add(settings)
            db.session.commit()
        return settings
    
    def update(self, **kwargs):
        """Update settings with the provided values"""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        db.session.commit()
        return self