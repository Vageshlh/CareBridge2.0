from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_socketio import join_room, leave_room
from datetime import datetime, timedelta
import uuid
import os
from werkzeug.utils import secure_filename

from extensions import db, socketio
from models.user import User, Role
from models.doctor_profile import DoctorProfile
from models.time_slot import TimeSlot
from models.appointment import Appointment, AppointmentStatus
from models.message import Message, MessageType
from models.file import File, FileType
from models.notification import Notification, NotificationType
from services.notification_service import NotificationService
from models.audit_log import AuditLog, AuditAction
from models.admin_settings import AdminSettings
from models.notification import Notification, NotificationType
from services.notification_service import NotificationService

appointments_bp = Blueprint('appointments', __name__, url_prefix='/appointments')

@appointments_bp.route('', methods=['POST'])
@jwt_required()
def create_appointment():
    """Create a new appointment"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Only patients can book appointments
    if user.role != Role.PATIENT:
        return jsonify({'error': 'Only patients can book appointments'}), 403
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['doctor_id', 'time_slot_id', 'reason']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Check if doctor exists
    doctor = User.query.filter_by(id=data['doctor_id'], role=Role.DOCTOR).first()
    if not doctor:
        return jsonify({'error': 'Doctor not found'}), 404
    
    # Check if doctor is verified and active
    doctor_profile = DoctorProfile.query.filter_by(user_id=doctor.id).first()
    if not doctor_profile or not doctor_profile.is_verified or not doctor.is_active:
        return jsonify({'error': 'Doctor is not available for appointments'}), 400
    
    # Check if time slot exists and is available
    time_slot = TimeSlot.query.get(data['time_slot_id'])
    if not time_slot or not time_slot.is_available or time_slot.is_past:
        return jsonify({'error': 'Time slot is not available'}), 400
    
    # Check if time slot belongs to the doctor
    if str(time_slot.doctor_id) != str(doctor_profile.id):
        return jsonify({'error': 'Time slot does not belong to the selected doctor'}), 400
    
    # Get admin settings for appointment validation
    admin_settings = AdminSettings.get()
    
    # Check if appointment is being booked with sufficient notice
    min_notice_hours = admin_settings.min_booking_notice_hours
    notice_time = datetime.utcnow() + timedelta(hours=min_notice_hours)
    if time_slot.start_time <= notice_time:
        return jsonify({
            'error': f'Appointments must be booked at least {min_notice_hours} hours in advance'
        }), 400
    
    # Create a unique room ID for WebRTC
    room_id = str(uuid.uuid4())
    
    # Create appointment
    try:
        appointment = Appointment(
            id=uuid.uuid4(),
            patient_id=user.id,
            doctor_id=doctor.id,
            time_slot_id=time_slot.id,
            status=AppointmentStatus.PENDING,
            reason=data.get('reason'),
            symptoms=data.get('symptoms'),
            medical_history=data.get('medical_history'),
            current_medications=data.get('current_medications'),
            allergies=data.get('allergies'),
            room_id=room_id
        )
        
        # Mark time slot as unavailable
        time_slot.is_available = False
        
        db.session.add(appointment)
        db.session.commit()
        
        # Log the appointment creation
        AuditLog.log(
            user_id=user.id,
            action=AuditAction.APPOINTMENT_CREATED,
            resource_type='Appointment',
            resource_id=str(appointment.id),
            description=f'Appointment created with doctor {doctor.email}',
            ip_address=request.remote_addr,
            user_agent=request.user_agent.string
        )
        
        # Create system message for the appointment
        system_message = Message(
            id=uuid.uuid4(),
            appointment_id=appointment.id,
            message_type=MessageType.SYSTEM,
            content=f"Appointment scheduled for {time_slot.start_time.strftime('%Y-%m-%d %H:%M')} to {time_slot.end_time.strftime('%H:%M')}"
        )
        
        db.session.add(system_message)
        db.session.commit()
        
        # Send notifications to both patient and doctor
        NotificationService.send_appointment_notification(
            appointment=appointment,
            notification_type=NotificationType.APPOINTMENT_CREATED,
            recipient_id=str(appointment.patient_id)
        )
        
        NotificationService.send_appointment_notification(
            appointment=appointment,
            notification_type=NotificationType.APPOINTMENT_CREATED,
            recipient_id=str(appointment.doctor_id)
        )
        
        return jsonify({
            'message': 'Appointment created successfully',
            'appointment': appointment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error creating appointment: {str(e)}')
        return jsonify({'error': 'Failed to create appointment'}), 500

@appointments_bp.route('/<appointment_id>', methods=['GET'])
@jwt_required()
def get_appointment(appointment_id):
    """Get appointment details"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get the appointment
    appointment = Appointment.query.get(appointment_id)
    
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    
    # Check if user is authorized to view this appointment
    if str(appointment.patient_id) != str(user.id) and str(appointment.doctor_id) != str(user.id) and not user.is_admin:
        return jsonify({'error': 'Unauthorized to view this appointment'}), 403
    
    return jsonify({
        'appointment': appointment.to_dict()
    }), 200

@appointments_bp.route('/<appointment_id>', methods=['PUT'])
@jwt_required()
def update_appointment(appointment_id):
    """Update appointment details"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get the appointment
    appointment = Appointment.query.get(appointment_id)
    
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    
    # Check if user is authorized to update this appointment
    if str(appointment.patient_id) != str(user.id) and not user.is_admin:
        return jsonify({'error': 'Unauthorized to update this appointment'}), 403
    
    # Check if appointment can be updated (not completed or cancelled)
    if appointment.status in [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED]:
        return jsonify({'error': 'Cannot update a completed or cancelled appointment'}), 400
    
    data = request.get_json()
    
    # Fields that can be updated by patient
    updatable_fields = [
        'reason', 'symptoms', 'medical_history', 'current_medications', 'allergies'
    ]
    
    # Update appointment fields
    for field in updatable_fields:
        if field in data:
            setattr(appointment, field, data[field])
    
    try:
        db.session.commit()
        
        # Log the appointment update
        AuditLog.log(
            user_id=user.id,
            action=AuditAction.APPOINTMENT_UPDATED,
            resource_type='Appointment',
            resource_id=str(appointment.id),
            description=f'Appointment updated',
            ip_address=request.remote_addr,
            user_agent=request.user_agent.string
        )
        
        return jsonify({
            'message': 'Appointment updated successfully',
            'appointment': appointment.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error updating appointment: {str(e)}')
        return jsonify({'error': 'Failed to update appointment'}), 500

@appointments_bp.route('/<appointment_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_appointment(appointment_id):
    """Cancel an appointment"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get the appointment
    appointment = Appointment.query.get(appointment_id)
    
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    
    # Check if user is authorized to cancel this appointment
    if str(appointment.patient_id) != str(user.id) and str(appointment.doctor_id) != str(user.id) and not user.is_admin:
        return jsonify({'error': 'Unauthorized to cancel this appointment'}), 403
    
    # Check if appointment can be cancelled (not completed or already cancelled)
    if appointment.status in [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED]:
        return jsonify({'error': 'Cannot cancel a completed or already cancelled appointment'}), 400
    
    data = request.get_json()
    reason = data.get('reason', 'No reason provided')
    
    # Cancel the appointment
    try:
        appointment.cancel(user_id=user.id, reason=reason)
        
        # Log the appointment cancellation
        AuditLog.log(
            user_id=user.id,
            action=AuditAction.APPOINTMENT_CANCELLED,
            resource_type='Appointment',
            resource_id=str(appointment.id),
            description=f'Appointment cancelled with reason: {reason}',
            ip_address=request.remote_addr,
            user_agent=request.user_agent.string
        )
        
        # Create system message for the cancellation
        system_message = Message(
            id=uuid.uuid4(),
            appointment_id=appointment.id,
            message_type=MessageType.SYSTEM,
            content=f"Appointment cancelled by {user.first_name} {user.last_name}. Reason: {reason}"
        )
        
        db.session.add(system_message)
        db.session.commit()
        
        # Send notification to the other party
        if user.role == Role.PATIENT:
            # Notify doctor
            NotificationService.send_appointment_notification(
                appointment=appointment,
                notification_type=NotificationType.APPOINTMENT_CANCELLED,
                recipient_id=str(appointment.doctor_id)
            )
        else:
            # Notify patient
            NotificationService.send_appointment_notification(
                appointment=appointment,
                notification_type=NotificationType.APPOINTMENT_CANCELLED,
                recipient_id=str(appointment.patient_id)
            )
        
        return jsonify({
            'message': 'Appointment cancelled successfully',
            'appointment': appointment.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error cancelling appointment: {str(e)}')
        return jsonify({'error': 'Failed to cancel appointment'}), 500

@appointments_bp.route('/<appointment_id>/confirm', methods=['POST'])
@jwt_required()
def confirm_appointment(appointment_id):
    """Confirm an appointment (doctor only)"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.role != Role.DOCTOR:
        return jsonify({'error': 'Only doctors can confirm appointments'}), 403
    
    # Get the appointment
    appointment = Appointment.query.get(appointment_id)
    
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    
    # Check if user is the doctor for this appointment
    if str(appointment.doctor_id) != str(user.id):
        return jsonify({'error': 'Unauthorized to confirm this appointment'}), 403
    
    # Check if appointment can be confirmed (must be pending)
    if appointment.status != AppointmentStatus.PENDING:
        return jsonify({'error': 'Only pending appointments can be confirmed'}), 400
    
    # Confirm the appointment
    try:
        appointment.confirm()
        
        # Log the appointment confirmation
        AuditLog.log(
            user_id=user.id,
            action=AuditAction.APPOINTMENT_CONFIRMED,
            resource_type='Appointment',
            resource_id=str(appointment.id),
            description=f'Appointment confirmed by doctor',
            ip_address=request.remote_addr,
            user_agent=request.user_agent.string
        )
        
        # Create system message for the confirmation
        system_message = Message(
            id=uuid.uuid4(),
            appointment_id=appointment.id,
            message_type=MessageType.SYSTEM,
            content=f"Appointment confirmed by Dr. {user.first_name} {user.last_name}"
        )
        
        db.session.add(system_message)
        db.session.commit()
        
        # Send notification to patient
        NotificationService.send_appointment_notification(
            appointment=appointment,
            notification_type=NotificationType.APPOINTMENT_CONFIRMED,
            recipient_id=str(appointment.patient_id)
        )
        
        return jsonify({
            'message': 'Appointment confirmed successfully',
            'appointment': appointment.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error confirming appointment: {str(e)}')
        return jsonify({'error': 'Failed to confirm appointment'}), 500

@appointments_bp.route('/<appointment_id>/complete', methods=['POST'])
@jwt_required()
def complete_appointment(appointment_id):
    """Mark an appointment as completed (doctor only)"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.role != Role.DOCTOR:
        return jsonify({'error': 'Only doctors can complete appointments'}), 403
    
    # Get the appointment
    appointment = Appointment.query.get(appointment_id)
    
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    
    # Check if user is the doctor for this appointment
    if str(appointment.doctor_id) != str(user.id):
        return jsonify({'error': 'Unauthorized to complete this appointment'}), 403
    
    # Check if appointment can be completed (must be confirmed)
    if appointment.status != AppointmentStatus.CONFIRMED:
        return jsonify({'error': 'Only confirmed appointments can be completed'}), 400
    
    # Complete the appointment
    try:
        appointment.complete()
        
        # Log the appointment completion
        AuditLog.log(
            user_id=user.id,
            action=AuditAction.APPOINTMENT_COMPLETED,
            resource_type='Appointment',
            resource_id=str(appointment.id),
            description=f'Appointment marked as completed by doctor',
            ip_address=request.remote_addr,
            user_agent=request.user_agent.string
        )
        
        # Create system message for the completion
        system_message = Message(
            id=uuid.uuid4(),
            appointment_id=appointment.id,
            message_type=MessageType.SYSTEM,
            content=f"Appointment completed by Dr. {user.first_name} {user.last_name}"
        )
        
        db.session.add(system_message)
        db.session.commit()
        
        # Send notification to patient
        NotificationService.send_appointment_notification(
            appointment=appointment,
            notification_type=NotificationType.APPOINTMENT_COMPLETED,
            recipient_id=str(appointment.patient_id)
        )
        
        return jsonify({
            'message': 'Appointment completed successfully',
            'appointment': appointment.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error completing appointment: {str(e)}')
        return jsonify({'error': 'Failed to complete appointment'}), 500

@appointments_bp.route('/<appointment_id>/no-show', methods=['POST'])
@jwt_required()
def mark_no_show(appointment_id):
    """Mark an appointment as no-show (doctor only)"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.role != Role.DOCTOR:
        return jsonify({'error': 'Only doctors can mark appointments as no-show'}), 403
    
    # Get the appointment
    appointment = Appointment.query.get(appointment_id)
    
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    
    # Check if user is the doctor for this appointment
    if str(appointment.doctor_id) != str(user.id):
        return jsonify({'error': 'Unauthorized to mark this appointment as no-show'}), 403
    
    # Check if appointment can be marked as no-show (must be confirmed)
    if appointment.status != AppointmentStatus.CONFIRMED:
        return jsonify({'error': 'Only confirmed appointments can be marked as no-show'}), 400
    
    # Mark as no-show
    try:
        appointment.mark_no_show()
        
        # Log the no-show
        AuditLog.log(
            user_id=user.id,
            action=AuditAction.APPOINTMENT_NO_SHOW,
            resource_type='Appointment',
            resource_id=str(appointment.id),
            description=f'Appointment marked as no-show by doctor',
            ip_address=request.remote_addr,
            user_agent=request.user_agent.string
        )
        
        # Create system message for the no-show
        system_message = Message(
            id=uuid.uuid4(),
            appointment_id=appointment.id,
            message_type=MessageType.SYSTEM,
            content=f"Patient did not attend the appointment"
        )
        
        db.session.add(system_message)
        db.session.commit()
        
        # Send notification to patient
        NotificationService.send_appointment_notification(
            appointment=appointment,
            notification_type=NotificationType.APPOINTMENT_NO_SHOW,
            recipient_id=str(appointment.patient_id)
        )
        
        return jsonify({
            'message': 'Appointment marked as no-show successfully',
            'appointment': appointment.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error marking appointment as no-show: {str(e)}')
        return jsonify({'error': 'Failed to mark appointment as no-show'}), 500

@appointments_bp.route('/<appointment_id>/messages', methods=['GET'])
@jwt_required()
def get_messages(appointment_id):
    """Get messages for an appointment"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get the appointment
    appointment = Appointment.query.get(appointment_id)
    
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    
    # Check if user is authorized to view messages for this appointment
    if str(appointment.patient_id) != str(user.id) and str(appointment.doctor_id) != str(user.id) and not user.is_admin:
        return jsonify({'error': 'Unauthorized to view messages for this appointment'}), 403
    
    # Get query parameters
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    
    # Get messages
    messages_page = Message.query.filter_by(appointment_id=appointment_id)\
                              .order_by(Message.created_at)\
                              .paginate(page=page, per_page=per_page)
    
    # Format response
    messages = [message.to_dict() for message in messages_page.items]
    
    # Mark messages as read if user is not the sender
    for message in messages_page.items:
        if message.sender_id and str(message.sender_id) != str(user.id) and not message.is_read:
            message.mark_as_read()
    
    db.session.commit()
    
    return jsonify({
        'appointment_id': appointment_id,
        'messages': messages,
        'pagination': {
            'total': messages_page.total,
            'pages': messages_page.pages,
            'page': page,
            'per_page': per_page,
            'has_next': messages_page.has_next,
            'has_prev': messages_page.has_prev
        }
    }), 200

@appointments_bp.route('/<appointment_id>/messages', methods=['POST'])
@jwt_required()
def send_message(appointment_id):
    """Send a message in an appointment"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get the appointment
    appointment = Appointment.query.get(appointment_id)
    
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    
    # Check if user is authorized to send messages for this appointment
    if str(appointment.patient_id) != str(user.id) and str(appointment.doctor_id) != str(user.id):
        return jsonify({'error': 'Unauthorized to send messages for this appointment'}), 403
    
    # Check if appointment is active (not cancelled or completed)
    if appointment.status in [AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED, AppointmentStatus.NO_SHOW]:
        return jsonify({'error': 'Cannot send messages for a cancelled, completed, or no-show appointment'}), 400
    
    data = request.get_json()
    
    # Validate required fields
    if not data or 'content' not in data:
        return jsonify({'error': 'Message content is required'}), 400
    
    # Create message
    try:
        message = Message(
            id=uuid.uuid4(),
            appointment_id=appointment_id,
            sender_id=user.id,
            message_type=MessageType.TEXT,
            content=data['content'],
            is_read=False
        )
        
        db.session.add(message)
        db.session.commit()
        
        # Emit message to socket.io room
        socketio.emit('new_message', {
            'message': message.to_dict()
        }, room=f'appointment_{appointment_id}')
        
        # Send notification to the recipient
        recipient_id = str(appointment.patient_id) if str(user.id) == str(appointment.doctor_id) else str(appointment.doctor_id)
        
        NotificationService.send_notification(
            user_id=recipient_id,
            notification_type=NotificationType.MESSAGE_RECEIVED,
            title="New message received",
            message=f"You have a new message in your appointment",
            resource_type="Appointment",
            resource_id=str(appointment_id)
        )
        
        return jsonify({
            'message': 'Message sent successfully',
            'message_data': message.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error sending message: {str(e)}')
        return jsonify({'error': 'Failed to send message'}), 500

@appointments_bp.route('/<appointment_id>/files', methods=['POST'])
@jwt_required()
def upload_file(appointment_id):
    """Upload a file for an appointment"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get the appointment
    appointment = Appointment.query.get(appointment_id)
    
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    
    # Check if user is authorized to upload files for this appointment
    if str(appointment.patient_id) != str(user.id) and str(appointment.doctor_id) != str(user.id):
        return jsonify({'error': 'Unauthorized to upload files for this appointment'}), 403
    
    # Check if appointment is active (not cancelled or completed)
    if appointment.status in [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW]:
        return jsonify({'error': 'Cannot upload files for a cancelled or no-show appointment'}), 400
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Get file type from form data
    file_type_str = request.form.get('file_type', 'DOCUMENT')
    try:
        file_type = FileType(file_type_str)
    except ValueError:
        file_type = FileType.DOCUMENT
    
    # Check file size
    max_file_size = current_app.config['MAX_CONTENT_LENGTH']
    if request.content_length > max_file_size:
        return jsonify({'error': f'File too large. Maximum size is {max_file_size / (1024 * 1024)}MB'}), 400
    
    # Check file extension
    allowed_extensions = current_app.config['ALLOWED_EXTENSIONS']
    if not allowed_file(file.filename, allowed_extensions):
        return jsonify({'error': f'File type not allowed. Allowed types: {", ".join(allowed_extensions)}'}), 400
    
    try:
        # Secure the filename
        filename = secure_filename(file.filename)
        
        # Generate a unique filename
        unique_filename = f"{uuid.uuid4()}_{filename}"
        
        # Create uploads directory if it doesn't exist
        uploads_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'appointment_files')
        os.makedirs(uploads_dir, exist_ok=True)
        
        # Save the file
        file_path = os.path.join(uploads_dir, unique_filename)
        file.save(file_path)
        
        # Create file record
        file_record = File(
            id=uuid.uuid4(),
            filename=unique_filename,
            original_filename=filename,
            file_path=f"appointment_files/{unique_filename}",
            file_type=file_type,
            mime_type=file.content_type,
            file_size=os.path.getsize(file_path),
            uploader_id=user.id,
            appointment_id=appointment_id
        )
        
        db.session.add(file_record)
        db.session.commit()
        
        # Send notification to the recipient
        recipient_id = str(appointment.patient_id) if str(user.id) == str(appointment.doctor_id) else str(appointment.doctor_id)
        
        NotificationService.send_notification(
            user_id=recipient_id,
            notification_type=NotificationType.FILE_UPLOADED,
            title="New file uploaded",
            message=f"A new file has been uploaded to your appointment",
            resource_type="Appointment",
            resource_id=str(appointment_id)
        )
        
        # Create a file message
        message = Message(
            id=uuid.uuid4(),
            appointment_id=appointment_id,
            sender_id=user.id,
            message_type=MessageType.FILE,
            content=f"File: {filename}",
            file_id=file_record.id,
            is_read=False
        )
        
        db.session.add(message)
        db.session.commit()
        
        # Emit message to socket.io room
        socketio.emit('new_message', {
            'message': message.to_dict()
        }, room=f'appointment_{appointment_id}')
        
        return jsonify({
            'message': 'File uploaded successfully',
            'file': file_record.to_dict(),
            'message_data': message.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error uploading file: {str(e)}')
        return jsonify({'error': 'Failed to upload file'}), 500

@appointments_bp.route('/<appointment_id>/join', methods=['POST'])
@jwt_required()
def join_appointment_room(appointment_id):
    """Join the WebRTC room for an appointment"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get the appointment
    appointment = Appointment.query.get(appointment_id)
    
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    
    # Check if user is authorized to join this appointment
    if str(appointment.patient_id) != str(user.id) and str(appointment.doctor_id) != str(user.id):
        return jsonify({'error': 'Unauthorized to join this appointment'}), 403
    
    # Check if appointment is confirmed
    if appointment.status != AppointmentStatus.CONFIRMED:
        return jsonify({'error': 'Can only join confirmed appointments'}), 400
    
    # Check if appointment time is valid (within 5 minutes before start time or during the appointment)
    now = datetime.utcnow()
    if now < (appointment.start_time - timedelta(minutes=5)):
        return jsonify({'error': 'Cannot join appointment more than 5 minutes before start time'}), 400
    
    if now > appointment.end_time:
        return jsonify({'error': 'Appointment has already ended'}), 400
    
    # Create system message for joining
    system_message = Message(
        id=uuid.uuid4(),
        appointment_id=appointment.id,
        sender_id=user.id,
        message_type=MessageType.SYSTEM,
        content=f"{user.first_name} {user.last_name} joined the consultation"
    )
    
    db.session.add(system_message)
    db.session.commit()
    
    # Emit message to socket.io room
    socketio.emit('user_joined', {
        'user': {
            'id': str(user.id),
            'name': f"{user.first_name} {user.last_name}",
            'role': user.role.value
        },
        'message': system_message.to_dict()
    }, room=f'appointment_{appointment_id}')
    
    return jsonify({
        'message': 'Joined appointment room successfully',
        'room_id': appointment.room_id
    }), 200

# Socket.IO event handlers
@socketio.on('join')
@jwt_required()
def on_join(data):
    """Socket.IO event for joining an appointment room"""
    appointment_id = data.get('appointment_id')
    if not appointment_id:
        return
    
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return
    
    # Get the appointment
    appointment = Appointment.query.get(appointment_id)
    
    if not appointment:
        return
    
    # Check if user is authorized to join this appointment
    if str(appointment.patient_id) != str(user.id) and str(appointment.doctor_id) != str(user.id):
        return
    
    # Join the room
    join_room(f'appointment_{appointment_id}')

@socketio.on('leave')
@jwt_required()
def on_leave(data):
    """Socket.IO event for leaving an appointment room"""
    appointment_id = data.get('appointment_id')
    if not appointment_id:
        return
    
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return
    
    # Leave the room
    leave_room(f'appointment_{appointment_id}')
    
    # Create system message for leaving
    system_message = Message(
        id=uuid.uuid4(),
        appointment_id=appointment_id,
        sender_id=user.id,
        message_type=MessageType.SYSTEM,
        content=f"{user.first_name} {user.last_name} left the consultation"
    )
    
    db.session.add(system_message)
    db.session.commit()
    
    # Emit message to socket.io room
    socketio.emit('user_left', {
        'user': {
            'id': str(user.id),
            'name': f"{user.first_name} {user.last_name}",
            'role': user.role.value
        },
        'message': system_message.to_dict()
    }, room=f'appointment_{appointment_id}')

def allowed_file(filename, allowed_extensions):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions