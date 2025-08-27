import os
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv

from config import config_by_name
from extensions import db, migrate, jwt, socketio, limiter
from api import register_blueprints
from socket_events import register_socket_events

def create_app(config_name='development'):
    # Load environment variables
    load_dotenv()
    
    # Initialize Flask app
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config_by_name[config_name])
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)
    
    # Initialize Socket.IO
    socketio.init_app(app, cors_allowed_origins="*", async_mode='gevent')
    
    # Initialize rate limiter
    limiter.init_app(app)
    
    # Register API blueprints
    register_blueprints(app)
    
    # Register Socket.IO event handlers
    register_socket_events(app)
    
    # Create uploads directory if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Health check endpoint
    @app.route('/api/healthz')
    def health_check():
        return {'status': 'ok'}
    
    return app

if __name__ == '__main__':
    app = create_app()
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)