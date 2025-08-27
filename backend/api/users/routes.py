from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
import os
import uuid

from extensions import db
from models.user import User
from models.file import File, FileType
from models.audit_log import AuditLog, AuditAction
from api.auth.utils import validate_password

users_bp = Blueprint('users', __name__, url_prefix='/users')

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'user': user.to_dict()
    }), 200

@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Fields that can be updated
    updatable_fields = [
        'first_name', 'last_name', 'phone', 'date_of_birth',
        'gender', 'address', 'city', 'state', 'country', 'postal_code'
    ]
    
    # Update user fields
    for field in updatable_fields:
        if field in data:
            setattr(user, field, data[field])
    
    try:
        db.session.commit()
        
        # Log the profile update
        AuditLog.log(
            user_id=user.id,
            action=AuditAction.PROFILE_UPDATED,
            resource_type='User',
            resource_id=str(user.id),
            description=f'User profile updated for {user.email}',
            ip_address=request.remote_addr,
            user_agent=request.user_agent.string
        )
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error updating profile: {str(e)}')
        return jsonify({'error': 'Failed to update profile'}), 500

@users_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    """Change user password"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Validate required fields
    if not data or not data.get('current_password') or not data.get('new_password'):
        return jsonify({'error': 'Current password and new password are required'}), 400
    
    # Verify current password
    if not user.check_password(data['current_password']):
        return jsonify({'error': 'Current password is incorrect'}), 401
    
    # Validate new password strength
    password_validation = validate_password(data['new_password'])
    if not password_validation['valid']:
        return jsonify({'error': password_validation['message']}), 400
    
    # Update password
    user.password_hash = generate_password_hash(data['new_password'])
    
    try:
        db.session.commit()
        
        # Log the password change
        AuditLog.log(
            user_id=user.id,
            action=AuditAction.PASSWORD_CHANGED,
            resource_type='User',
            resource_id=str(user.id),
            description=f'Password changed for user {user.email}',
            ip_address=request.remote_addr,
            user_agent=request.user_agent.string
        )
        
        return jsonify({
            'message': 'Password changed successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error changing password: {str(e)}')
        return jsonify({'error': 'Failed to change password'}), 500

@users_bp.route('/profile-picture', methods=['POST'])
@jwt_required()
def upload_profile_picture():
    """Upload user profile picture"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file and allowed_file(file.filename, ['jpg', 'jpeg', 'png']):
        # Secure the filename
        filename = secure_filename(file.filename)
        
        # Generate a unique filename
        unique_filename = f"{uuid.uuid4()}_{filename}"
        
        # Create uploads directory if it doesn't exist
        uploads_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'profile_pictures')
        os.makedirs(uploads_dir, exist_ok=True)
        
        # Save the file
        file_path = os.path.join(uploads_dir, unique_filename)
        file.save(file_path)
        
        # Create file record
        file_record = File(
            id=uuid.uuid4(),
            filename=unique_filename,
            original_filename=filename,
            file_path=f"profile_pictures/{unique_filename}",
            file_type=FileType.IMAGE,
            mime_type=file.content_type,
            file_size=os.path.getsize(file_path),
            uploader_id=user.id
        )
        
        # Update user profile picture
        user.profile_picture = file_record.file_path
        
        try:
            db.session.add(file_record)
            db.session.commit()
            
            # Log the profile picture update
            AuditLog.log(
                user_id=user.id,
                action=AuditAction.PROFILE_PICTURE_UPDATED,
                resource_type='User',
                resource_id=str(user.id),
                description=f'Profile picture updated for user {user.email}',
                ip_address=request.remote_addr,
                user_agent=request.user_agent.string
            )
            
            return jsonify({
                'message': 'Profile picture uploaded successfully',
                'profile_picture': file_record.file_url
            }), 200
            
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f'Error uploading profile picture: {str(e)}')
            return jsonify({'error': 'Failed to upload profile picture'}), 500
    
    return jsonify({'error': 'File type not allowed'}), 400

@users_bp.route('/appointments', methods=['GET'])
@jwt_required()
def get_user_appointments():
    """Get user appointments"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get query parameters
    status = request.args.get('status')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    
    # Get appointments based on user role
    if user.is_patient:
        query = user.appointments_as_patient
    elif user.is_doctor:
        query = user.appointments_as_doctor
    else:
        return jsonify({'error': 'User role not supported for appointments'}), 400
    
    # Filter by status if provided
    if status:
        query = query.filter_by(status=status)
    
    # Order by start time descending (most recent first)
    query = query.order_by(db.desc('created_at'))
    
    # Paginate results
    appointments_page = query.paginate(page=page, per_page=per_page)
    
    # Format response
    appointments = [appointment.to_dict() for appointment in appointments_page.items]
    
    return jsonify({
        'appointments': appointments,
        'pagination': {
            'total': appointments_page.total,
            'pages': appointments_page.pages,
            'page': page,
            'per_page': per_page,
            'has_next': appointments_page.has_next,
            'has_prev': appointments_page.has_prev
        }
    }), 200

def allowed_file(filename, allowed_extensions):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions