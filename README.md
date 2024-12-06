# Contact Management System
A simple, responsive, and dynamic contact management application built with React.js and Material UI on the frontend and a backend API for managing contacts. Users can create, read, update, and delete (CRUD) contacts, with functionalities like sorting, pagination, and form validations.

# Setup Instructions
## Prerequisites
Node.js (v20.x)

# Installation
1. Clone the repository<br/>
git clone https://github.com/Nipunkhattri/Contact-Management-System.git

2. Navigate to frontend folder<br/>
cd frontend

3. Install Frontend Packages<br/>
npm i 

4. Start frontend server<br/>
npm start

5. Navigate to Backend folder<br/>
cd Backend

6. Install Backend Packages<br/>
npm i 

7. Start Backend Server<br/>
node server.js

## Enviornment Variables
1. Frontend<br/>
REACT_APP_BACKEND_URL=http://localhost:5000

2. Backend<br/>
MONGODB_URL=mongodb+srv://Contact:Contact@cluster0.g3htp.mongodb.net/<br/>
PORT=5000


# Project Description
## Features
CRUD Functionality: Add, edit, delete, and view contacts.<br/>
Sorting: Sort contacts by first name dynamically.<br/>
Pagination: Browse contacts with paginated views.<br/>

## Technical Decisions
React.js: Chosen for its component-based architecture and state management.<br/>
Material UI: Used for its prebuilt components and consistent design system.<br/>
Backend Integration: Build the RESTful API Endpoins for managing contacts <br/>
Sorting & Pagination: Implemented client-side for simplicity and performance.<br/>

## How It Works
### Frontend:
Built using React and Material UI components.<br/>
Create a New Contact by Filling the form details.<br/>
Included action buttons for editing and deleting each contact.<br/>
Pagination and Sorting <br/>

### Backend:
Provides RESTful API endpoints for managing contacts.<br/>
Validation for required fields.<br/>
Appropriate error messages on API failures.<br/>
Endpoints:<br/>
GET /api/contacts: Fetch all contacts.<br/>
POST /api/contacts: Create a new contact.<br/>
PUT /api/contacts/:id: Update an existing contact.<br/>
DELETE /api/contacts/:id: Delete a contact.<br/>

# Challenges and Solutions
1. Handling Sorting<br/>
Challenge: Implementing dynamic sorting based on user-selected columns.<br/>
Solution: Used TableSortLabel from Material UI, along with React state variables (order and orderBy), to toggle between ascending and descending order dynamically.<br/>

4. Pagination<br/>
Challenge: Efficiently displaying a large number of contacts with pagination.<br/>
Solution: Used Material UI's TablePagination component to manage page navigation and rows per page dynamically.<br/>
