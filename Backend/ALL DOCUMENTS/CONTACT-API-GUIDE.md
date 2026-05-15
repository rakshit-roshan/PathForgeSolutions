# Contact API Guide - Beginner Friendly

This guide explains how to use the Contact API that we just created for your PathForge Solutions project.

## 🚀 What We Built

We created a complete contact form API system that includes:

1. **Backend Components:**
   - `ContactEntity` - Database table to store contact information
   - `ContactRequestDto` - Data validation for API requests
   - `ContactRepository` - Database operations
   - `ContactService` - Business logic
   - `ContactController` - API endpoints

2. **Frontend Components:**
   - Updated `Contact.jsx` - Form now sends data to API
   - Updated `api.js` - Added contact API functions
   - Success/Error messages - User-friendly feedback

## 📋 API Endpoints

### Main Contact Endpoint
- **POST** `/main/contact` - Submit a new contact inquiry

### Admin/Management Endpoints
- **GET** `/main/contact/all` - Get all contact inquiries
- **GET** `/main/contact/{id}` - Get contact by ID
- **GET** `/main/contact/email/{email}` - Get contacts by email
- **GET** `/main/contact/service/{serviceType}` - Get contacts by service type
- **GET** `/main/contact/status/{status}` - Get contacts by status
- **GET** `/main/contact/recent` - Get recent contacts (last 30 days)
- **PUT** `/main/contact/{id}/status` - Update contact status
- **GET** `/main/contact/statistics` - Get contact statistics
- **GET** `/main/contact/health` - Health check

## 📝 Contact Form Data Structure

When submitting a contact form, the API expects this data:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com", 
  "phone": "+91 9876543210",
  "serviceType": "internship",
  "message": "I need help with my project",
  "preferredContactMethod": "email",
  
  // Optional fields for internship:
  "internshipTrack": "fullstack",
  "duration": "3-months", 
  "experienceLevel": "beginner",
  "customIdea": "My project idea...",
  
  // Optional fields for phone call scheduling:
  "preferredDate": "2024-01-15",
  "preferredTime": "10:00 AM"
}
```

## 🎯 Service Type Values (with IDs)

The dropdown values are mapped as follows:

### Service Types:
1. `project-assistance` - Final Year Project Assistance
2. `internship` - Internship Program  
3. `career-guidance` - Career Guidance
4. `job-consultancy` - Job Consultancy
5. `other` - Other

### Internship Tracks:
1. `data-genai` - Data & Gen-AI
2. `fullstack` - Full-Stack Web Development
3. `frontend` - Frontend Development
4. `backend` - Backend Development
5. `uiux` - UI/UX Design
6. `technical-writing` - Technical Writing
7. `custom` - Custom/Ideas

### Duration Options:
1. `1-month` - 1 Month
2. `2-months` - 2 Months
3. `3-months` - 3 Months
4. `6-months` - 6 Months

### Experience Levels:
1. `beginner` - Beginner (0-1 year)
2. `intermediate` - Intermediate (1-3 years)
3. `advanced` - Advanced (3+ years)

### Contact Methods:
1. `email` - Email Response
2. `phone-call` - Phone Call
3. `whatsapp` - WhatsApp Chat

## 🧪 How to Test

1. **Start your Spring Boot application:**
   ```bash
   cd Backend
   ./mvnw spring-boot:run
   ```

2. **Test using the provided test file:**
   - Open `test-contact-api.http` in VS Code
   - Install "REST Client" extension
   - Click "Send Request" above each test

3. **Test using your frontend:**
   - Start your React app: `npm run dev`
   - Go to the contact page
   - Fill out the form and submit

## 💡 Frontend Usage (Beginner Friendly)

In your React components, you can use the contact API like this:

```javascript
import { contactAPI } from '../utils/api';

// Submit a contact inquiry
const handleSubmit = async (contactData) => {
  try {
    const response = await contactAPI.submitInquiry(contactData);
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

// Get all inquiries (admin)
const getAllInquiries = async () => {
  try {
    const response = await contactAPI.getAllInquiries();
    console.log('All inquiries:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 🔧 Database Setup

The API automatically creates a table called `contact_inquiries` with these columns:
- `id` - Auto-generated ID
- `name` - Contact name
- `email` - Contact email
- `phone` - Contact phone
- `service_type` - Selected service
- `message` - Contact message
- `preferred_contact_method` - How they want to be contacted
- `internship_track` - Selected track (if internship)
- `duration` - Selected duration (if internship)
- `experience_level` - Experience level (if internship)
- `custom_idea` - Custom project idea (if custom track)
- `preferred_date` - Preferred call date (if phone call)
- `preferred_time` - Preferred call time (if phone call)
- `created_at` - When inquiry was submitted
- `status` - Inquiry status (NEW, CONTACTED, CLOSED)

## 🎉 Success!

Your contact form now:
- ✅ Collects all form data
- ✅ Validates required fields
- ✅ Saves to database with unique ID
- ✅ Shows success/error messages
- ✅ Provides admin endpoints to manage inquiries
- ✅ Uses beginner-friendly code with clear comments

The API is ready to use! 🚀
