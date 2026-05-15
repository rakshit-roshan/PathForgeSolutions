# Contact API Flow Diagram

## How the Contact API Works

```
Frontend (React)                    Backend (Spring Boot)                Database
     |                                      |                              |
     | 1. User fills form                   |                              |
     |    - Name, Email, Phone              |                              |
     |    - Service Type (with ID)          |                              |
     |    - Message                         |                              |
     |                                      |                              |
     | 2. Form submission                   |                              |
     |    (handleSubmit function)           |                              |
     |                                      |                              |
     | 3. POST /main/contact                |                              |
     |    + contactData object              |                              |
     |                                      |                              |
     |                                      | 4. ContactController         |
     |                                      |    receives request          |
     |                                      |                              |
     |                                      | 5. ContactService            |
     |                                      |    validates data             |
     |                                      |                              |
     |                                      | 6. ContactEntity             |
     |                                      |    creates database record   |
     |                                      |                              |
     |                                      | 7. ContactRepository         |
     |                                      |    saves to database         |
     |                                      |                              |
     |                                      |                              | 8. Database stores
     |                                      |                              |    contact_inquiries table
     |                                      |                              |
     |                                      | 9. Success response          |
     |                                      |    with inquiry ID            |
     |                                      |                              |
     | 10. Show success message             |                              |
     |     to user                          |                              |
     |                                      |                              |
```

## API Endpoints Structure

```
/main/contact (POST)           - Submit new contact inquiry
├── /all (GET)                 - Get all inquiries (admin)
├── /{id} (GET)                - Get inquiry by ID
├── /email/{email} (GET)       - Get inquiries by email
├── /service/{type} (GET)      - Get inquiries by service type
├── /status/{status} (GET)     - Get inquiries by status
├── /recent (GET)              - Get recent inquiries
├── /{id}/status (PUT)         - Update inquiry status
├── /statistics (GET)          - Get contact statistics
└── /health (GET)              - Health check
```

## Data Flow Example

1. **User Input**: "John Doe", "john@example.com", "internship", "fullstack"
2. **Frontend**: Creates contactData object with all form fields
3. **API Call**: POST request to `/main/contact` with JSON data
4. **Backend**: Validates, saves to database, returns success message
5. **Frontend**: Shows success message with inquiry ID
6. **Database**: Stores record with auto-generated ID

## Beginner-Friendly Features

- ✅ Clear error messages
- ✅ Form validation before submission
- ✅ Loading states (spinning button)
- ✅ Success/error feedback
- ✅ Automatic form reset after success
- ✅ All dropdown values have IDs for easy reference
- ✅ Comments explaining each step
