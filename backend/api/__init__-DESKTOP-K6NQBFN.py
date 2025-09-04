from flask import Blueprint

from api.auth.routes import auth_bp
from api.users.routes import users_bp
from api.doctors.routes import doctors_bp
from api.appointments.routes import appointments_bp
from api.prescriptions.routes import prescriptions_bp
from api.admin.routes import admin_bp
from api.clinics.routes import clinics_bp
from api.reviews.routes import reviews_bp
from api.notifications.routes import notifications_bp

def register_blueprints(app):
    """
    Register all API blueprints
    """
    # Create main API blueprint
    api_bp = Blueprint('api', __name__, url_prefix='/api')
    
    # Register individual module blueprints
    api_bp.register_blueprint(auth_bp)
    api_bp.register_blueprint(users_bp)
    api_bp.register_blueprint(doctors_bp)
    api_bp.register_blueprint(appointments_bp)
    api_bp.register_blueprint(prescriptions_bp)
    api_bp.register_blueprint(admin_bp)
    api_bp.register_blueprint(clinics_bp)
    api_bp.register_blueprint(reviews_bp)
    api_bp.register_blueprint(notifications_bp)
    
    # Register main API blueprint with app
    app.register_blueprint(api_bp)
    
    return app