from flask import Blueprint

def create_blueprint():
    """Create and return the reviews blueprint"""
    from api.reviews.routes import reviews_bp
    return reviews_bp