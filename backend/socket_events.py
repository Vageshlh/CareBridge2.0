from flask_socketio import emit, join_room, leave_room
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import socketio, db
from models import User, Notification, NotificationStatus

# Socket.IO event handlers for notifications
@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    # This is a placeholder for any connection setup logic
    pass

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    # This is a placeholder for any disconnection cleanup logic
    pass

@socketio.on('join_user_room')
@jwt_required()
def on_join_user_room():
    """Join a room specific to the user for receiving notifications"""
    current_user_id = get_jwt_identity()
    if not current_user_id:
        return
    
    # Join a room named after the user's ID
    join_room(str(current_user_id))
    emit('room_joined', {'room': str(current_user_id)}, room=str(current_user_id))

@socketio.on('leave_user_room')
@jwt_required()
def on_leave_user_room():
    """Leave the user-specific room"""
    current_user_id = get_jwt_identity()
    if not current_user_id:
        return
    
    # Leave the room
    leave_room(str(current_user_id))

@socketio.on('mark_notification_read')
@jwt_required()
def on_mark_notification_read(data):
    """Mark a notification as read via socket.io"""
    current_user_id = get_jwt_identity()
    notification_id = data.get('notification_id')
    
    if not notification_id:
        return
    
    # Find the notification
    notification = Notification.query.filter_by(
        id=notification_id, 
        user_id=current_user_id
    ).first()
    
    if not notification:
        return
    
    # Mark as read
    notification.mark_as_read()
    
    # Emit an event back to confirm
    emit('notification_marked_read', {
        'notification_id': str(notification.id)
    }, room=str(current_user_id))

# Register socket events with Flask app
def register_socket_events(app):
    """Register all socket.io event handlers with the Flask app"""
    # Import appointment socket events
    from api.appointments.routes import on_join, on_leave
    
    # This function doesn't need to do anything else as the decorators
    # already register the event handlers with socketio
    pass