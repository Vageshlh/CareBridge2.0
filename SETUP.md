# CareBridge Setup Guide

## Prerequisites

- Docker and Docker Compose
- Git
- Node.js 18+ and npm (for local frontend development)
- Python 3.11 (for local backend development)

## Running with Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/carebridge.git
   cd carebridge
   ```

2. Create a `.env` file in the root directory (see `.env.example` for reference)

3. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

4. Run database migrations and seed data:
   ```bash
   docker-compose exec api flask db upgrade
   docker-compose exec api flask seed
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - API: http://localhost:5000/api
   - API Documentation: http://localhost:5000/api/docs

## Local Development Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows
   .\venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt  # Development dependencies
   ```

4. Set up environment variables (create a `.env` file in the backend directory)

5. Run migrations:
   ```bash
   flask db upgrade
   ```

6. Seed the database:
   ```bash
   flask seed
   ```

7. Start the development server:
   ```bash
   flask run --debug
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with necessary environment variables

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the frontend at http://localhost:5173

## Database Management

### Creating Migrations

```bash
# In Docker
docker-compose exec api flask db migrate -m "Migration description"

# Local development
flask db migrate -m "Migration description"
```

### Applying Migrations

```bash
# In Docker
docker-compose exec api flask db upgrade

# Local development
flask db upgrade
```

## Testing

### Running Backend Tests

```bash
# In Docker
docker-compose exec api pytest

# Local development
pytest
```

### Running Frontend Tests

```bash
# In Docker
docker-compose exec web npm test

# Local development
npm test
```

## Troubleshooting

### Resetting the Database

```bash
# In Docker
docker-compose down -v  # This will remove volumes
docker-compose up -d
docker-compose exec api flask db upgrade
docker-compose exec api flask seed

# Local development
flask db downgrade base
flask db upgrade
flask seed
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f db
```