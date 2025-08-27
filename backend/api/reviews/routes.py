from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
import uuid
from datetime import datetime

from extensions import db
from models.review import Review
from models.user import User, Role
from models.doctor_profile import DoctorProfile
from models.appointment import Appointment, AppointmentStatus
from models.audit_log import AuditLog, AuditAction

reviews_bp = Blueprint('reviews', __name__, url_prefix='/reviews')

@reviews_bp.route('', methods=['POST'])
@jwt_required()
def create_review():
    """Create a new review for a doctor"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.role != Role.PATIENT:
        return jsonify({'error': 'Only patients can create reviews'}), 403
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['doctor_id', 'rating', 'comment']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Validate rating range (1-5)
    if not isinstance(data['rating'], int) or data['rating'] < 1 or data['rating'] > 5:
        return jsonify({'error': 'Rating must be an integer between 1 and 5'}), 400
    
    # Check if doctor exists
    doctor = DoctorProfile.query.get(data['doctor_id'])
    if not doctor:
        return jsonify({'error': 'Doctor not found'}), 404
    
    # Check if patient has had an appointment with this doctor
    completed_appointment = Appointment.query.filter(
        Appointment.patient_id == current_user_id,
        Appointment.doctor_id == data['doctor_id'],
        Appointment.status == AppointmentStatus.COMPLETED
    ).first()
    
    if not completed_appointment:
        return jsonify({'error': 'You can only review doctors after a completed appointment'}), 403
    
    # Check if patient has already reviewed this doctor
    existing_review = Review.query.filter_by(
        patient_id=current_user_id,
        doctor_id=data['doctor_id']
    ).first()
    
    if existing_review:
        return jsonify({'error': 'You have already reviewed this doctor'}), 409
    
    try:
        # Create new review
        new_review = Review(
            id=uuid.uuid4(),
            patient_id=current_user_id,
            doctor_id=data['doctor_id'],
            appointment_id=completed_appointment.id,
            rating=data['rating'],
            comment=data['comment'],
            created_at=datetime.utcnow()
        )
        
        db.session.add(new_review)
        
        # Update doctor's average rating
        avg_rating = db.session.query(func.avg(Review.rating)).filter_by(doctor_id=data['doctor_id']).scalar()
        doctor.average_rating = float(avg_rating) if avg_rating else 0.0
        doctor.review_count = Review.query.filter_by(doctor_id=data['doctor_id']).count()
        
        db.session.commit()
        
        # Log the review creation
        AuditLog.log(
            user_id=current_user_id,
            action=AuditAction.REVIEW_CREATED,
            resource_type='Review',
            resource_id=str(new_review.id),
            description=f'Review created for doctor {doctor.user.full_name}',
            ip_address=request.remote_addr,
            user_agent=request.user_agent.string
        )
        
        return jsonify({
            'message': 'Review created successfully',
            'review': new_review.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error creating review: {str(e)}')
        return jsonify({'error': 'Failed to create review'}), 500

@reviews_bp.route('/<review_id>', methods=['GET'])
def get_review(review_id):
    """Get a specific review"""
    review = Review.query.get(review_id)
    
    if not review:
        return jsonify({'error': 'Review not found'}), 404
    
    return jsonify({
        'review': review.to_dict()
    }), 200

@reviews_bp.route('/<review_id>', methods=['PUT'])
@jwt_required()
def update_review(review_id):
    """Update an existing review"""
    current_user_id = get_jwt_identity()
    
    review = Review.query.get(review_id)
    
    if not review:
        return jsonify({'error': 'Review not found'}), 404
    
    # Check if the current user is the author of the review
    if str(review.patient_id) != current_user_id:
        return jsonify({'error': 'You can only update your own reviews'}), 403
    
    data = request.get_json()
    
    # Validate rating if provided
    if 'rating' in data:
        if not isinstance(data['rating'], int) or data['rating'] < 1 or data['rating'] > 5:
            return jsonify({'error': 'Rating must be an integer between 1 and 5'}), 400
    
    try:
        # Update review fields
        if 'rating' in data:
            review.rating = data['rating']
        
        if 'comment' in data:
            review.comment = data['comment']
        
        review.updated_at = datetime.utcnow()
        
        # Update doctor's average rating
        avg_rating = db.session.query(func.avg(Review.rating)).filter_by(doctor_id=review.doctor_id).scalar()
        doctor = DoctorProfile.query.get(review.doctor_id)
        doctor.average_rating = float(avg_rating) if avg_rating else 0.0
        
        db.session.commit()
        
        # Log the review update
        AuditLog.log(
            user_id=current_user_id,
            action=AuditAction.REVIEW_UPDATED,
            resource_type='Review',
            resource_id=str(review.id),
            description=f'Review updated for doctor {doctor.user.full_name}',
            ip_address=request.remote_addr,
            user_agent=request.user_agent.string
        )
        
        return jsonify({
            'message': 'Review updated successfully',
            'review': review.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error updating review: {str(e)}')
        return jsonify({'error': 'Failed to update review'}), 500

@reviews_bp.route('/<review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    """Delete a review"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    review = Review.query.get(review_id)
    
    if not review:
        return jsonify({'error': 'Review not found'}), 404
    
    # Check if the current user is the author of the review or an admin
    if str(review.patient_id) != current_user_id and user.role != Role.ADMIN:
        return jsonify({'error': 'You can only delete your own reviews'}), 403
    
    try:
        doctor_id = review.doctor_id
        
        # Delete the review
        db.session.delete(review)
        
        # Update doctor's average rating
        avg_rating = db.session.query(func.avg(Review.rating)).filter_by(doctor_id=doctor_id).scalar()
        doctor = DoctorProfile.query.get(doctor_id)
        doctor.average_rating = float(avg_rating) if avg_rating else 0.0
        doctor.review_count = Review.query.filter_by(doctor_id=doctor_id).count()
        
        db.session.commit()
        
        # Log the review deletion
        AuditLog.log(
            user_id=current_user_id,
            action=AuditAction.REVIEW_DELETED,
            resource_type='Review',
            resource_id=review_id,
            description=f'Review deleted for doctor {doctor.user.full_name}',
            ip_address=request.remote_addr,
            user_agent=request.user_agent.string
        )
        
        return jsonify({
            'message': 'Review deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error deleting review: {str(e)}')
        return jsonify({'error': 'Failed to delete review'}), 500

@reviews_bp.route('/patient', methods=['GET'])
@jwt_required()
def get_patient_reviews():
    """Get all reviews created by the current patient"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.role != Role.PATIENT:
        return jsonify({'error': 'Only patients can access this endpoint'}), 403
    
    # Pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    # Get reviews with pagination
    reviews_query = Review.query.filter_by(patient_id=current_user_id)
    reviews_paginated = reviews_query.order_by(Review.created_at.desc()).paginate(page=page, per_page=per_page)
    
    return jsonify({
        'reviews': [review.to_dict() for review in reviews_paginated.items],
        'pagination': {
            'total_items': reviews_paginated.total,
            'total_pages': reviews_paginated.pages,
            'current_page': page,
            'per_page': per_page
        }
    }), 200