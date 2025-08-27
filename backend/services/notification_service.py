from models import Notification, NotificationType, User, Role
from extensions import db, socketio
from datetime import datetime
import json

class NotificationService:
    @staticmethod
    def send_notification(user_id, type, title, message, resource_type=None, resource_id=None):
        """Send a notification to a specific user"""
        # Create the notification in the database
        notification = Notification.create(
            user_id=user_id,
            type=type,
            title=title,
            message=message,
            resource_type=resource_type,
            resource_id=resource_id
        )
        
        # Emit a socket.io event to the user
        notification_data = notification.to_dict()
        socketio.emit('notification', notification_data, room=str(user_id))
        
        return notification
    
    @staticmethod
    def send_notification_to_role(role, type, title, message, resource_type=None, resource_id=None):
        """Send a notification to all users with a specific role"""
        users = User.query.filter_by(role=role).all()
        notifications = []
        
        for user in users:
            notification = NotificationService.send_notification(
                user_id=user.id,
                type=type,
                title=title,
                message=message,
                resource_type=resource_type,
                resource_id=resource_id
            )
            notifications.append(notification)
        
        return notifications
    
    @staticmethod
    def send_notification_to_all(type, title, message, resource_type=None, resource_id=None):
        """Send a notification to all users"""
        users = User.query.all()
        notifications = []
        
        for user in users:
            notification = NotificationService.send_notification(
                user_id=user.id,
                type=type,
                title=title,
                message=message,
                resource_type=resource_type,
                resource_id=resource_id
            )
            notifications.append(notification)
        
        return notifications
    
    @staticmethod
    def send_appointment_notification(appointment, notification_type, additional_message=None):
        """Send appointment-related notifications to relevant users"""
        # Get the appointment details
        patient = appointment.patient
        doctor = appointment.doctor
        
        # Determine the notification title and message based on the type
        title_map = {
            NotificationType.APPOINTMENT_CREATED: "New Appointment",
            NotificationType.APPOINTMENT_UPDATED: "Appointment Updated",
            NotificationType.APPOINTMENT_CANCELLED: "Appointment Cancelled",
            NotificationType.APPOINTMENT_CONFIRMED: "Appointment Confirmed",
            NotificationType.APPOINTMENT_COMPLETED: "Appointment Completed",
            NotificationType.APPOINTMENT_REMINDER: "Appointment Reminder"
        }
        
        message_map = {
            NotificationType.APPOINTMENT_CREATED: f"Appointment scheduled with Dr. {doctor.user.last_name} on {appointment.start_time.strftime('%Y-%m-%d at %H:%M')}",
            NotificationType.APPOINTMENT_UPDATED: f"Your appointment on {appointment.start_time.strftime('%Y-%m-%d at %H:%M')} has been updated",
            NotificationType.APPOINTMENT_CANCELLED: f"Your appointment on {appointment.start_time.strftime('%Y-%m-%d at %H:%M')} has been cancelled",
            NotificationType.APPOINTMENT_CONFIRMED: f"Your appointment on {appointment.start_time.strftime('%Y-%m-%d at %H:%M')} has been confirmed",
            NotificationType.APPOINTMENT_COMPLETED: f"Your appointment on {appointment.start_time.strftime('%Y-%m-%d at %H:%M')} has been marked as completed",
            NotificationType.APPOINTMENT_REMINDER: f"Reminder: You have an appointment on {appointment.start_time.strftime('%Y-%m-%d at %H:%M')}"
        }
        
        doctor_message_map = {
            NotificationType.APPOINTMENT_CREATED: f"New appointment scheduled with {patient.first_name} {patient.last_name} on {appointment.start_time.strftime('%Y-%m-%d at %H:%M')}",
            NotificationType.APPOINTMENT_UPDATED: f"Appointment with {patient.first_name} {patient.last_name} on {appointment.start_time.strftime('%Y-%m-%d at %H:%M')} has been updated",
            NotificationType.APPOINTMENT_CANCELLED: f"Appointment with {patient.first_name} {patient.last_name} on {appointment.start_time.strftime('%Y-%m-%d at %H:%M')} has been cancelled",
            NotificationType.APPOINTMENT_CONFIRMED: f"Appointment with {patient.first_name} {patient.last_name} on {appointment.start_time.strftime('%Y-%m-%d at %H:%M')} has been confirmed",
            NotificationType.APPOINTMENT_COMPLETED: f"Appointment with {patient.first_name} {patient.last_name} on {appointment.start_time.strftime('%Y-%m-%d at %H:%M')} has been marked as completed",
            NotificationType.APPOINTMENT_REMINDER: f"Reminder: You have an appointment with {patient.first_name} {patient.last_name} on {appointment.start_time.strftime('%Y-%m-%d at %H:%M')}"
        }
        
        title = title_map.get(notification_type, "Appointment Update")
        patient_message = message_map.get(notification_type, "Your appointment status has changed")
        doctor_message = doctor_message_map.get(notification_type, "An appointment status has changed")
        
        if additional_message:
            patient_message += f". {additional_message}"
            doctor_message += f". {additional_message}"
        
        # Send notification to patient
        patient_notification = NotificationService.send_notification(
            user_id=patient.id,
            type=notification_type,
            title=title,
            message=patient_message,
            resource_type='appointment',
            resource_id=str(appointment.id)
        )
        
        # Send notification to doctor
        doctor_notification = NotificationService.send_notification(
            user_id=doctor.user_id,
            type=notification_type,
            title=title,
            message=doctor_message,
            resource_type='appointment',
            resource_id=str(appointment.id)
        )
        
        return [patient_notification, doctor_notification]