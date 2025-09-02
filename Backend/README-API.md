# Backend API Documentation

## Authentication Endpoints

### 1. User Registration
- **URL**: `POST /main/auth/register`
- **Body**:
```json
{
  "username": "your_username",
  "email": "your_email@example.com",
  "password": "your_password"
}
```
- **Response**: String message ("User registered successfully" or "Email already exists")

### 2. User Login
- **URL**: `POST /main/auth/login`
- **Body**:
```json
{
  "email": "your_email@example.com",
  "password": "your_password"
}
```
- **Response**: String message ("Login successful", "User not found", or "Invalid password")

## Testing the API

### Using the test file:
1. Open `test-login.http` in VS Code with REST Client extension
2. Click "Send Request" above each endpoint
3. Or use tools like Postman, Insomnia, or curl

### Using curl:
```bash
# Test registration
curl -X POST http://localhost:8080/main/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:8080/main/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Frontend Integration

The frontend is now connected to these endpoints using axios. The Login component will:
1. Send login request to `/main/auth/login`
2. Handle success/error responses
3. Redirect on successful login
4. Store user email in localStorage if "Remember me" is checked

## CORS Configuration

CORS is enabled to allow frontend requests from any origin (for development).
In production, restrict this to your specific frontend domain.
