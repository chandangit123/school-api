# School Management API

This project implements a simple RESTful API for managing schools using Node.js, Express.js, and MySQL.  
It allows users to add new schools and retrieve a list of schools sorted by proximity to a specified location.

---

## Features

- Add a new school with name, address, latitude, and longitude.  
- Retrieve all schools sorted by geographical distance from a user-provided location.  
- Input validation using Joi.  
- Distance calculation using the Haversine formula.  
- MySQL database for persistent storage.

---

## Technologies Used

- Node.js  
- Express.js  
- MySQL  
- Joi (validation)  
- dotenv (environment variable management)  
- cors  

---

## Setup & Installation

### Prerequisites

- Node.js (>=14.x)  
- MySQL Server  
- npm (comes with Node.js)

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/school-api.git
cd school-api

Install dependencies
bash
Copy
Edit
npm install
Database Setup
Create the database and table in MySQL:

sql
Copy
Edit
CREATE DATABASE schooldb;
USE schooldb;

CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Update .env file with your MySQL credentials:

Create a .env file in the root directory:

ini
Copy
Edit
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=schooldb
Running the server
For development with auto-reload:

bash
Copy
Edit
npm run dev
For production:

bash
Copy
Edit
npm start
The server will start on the port specified in .env (default 3000).

API Endpoints
1. Add School
URL: /addSchool

Method: POST

Content-Type: application/json

Body Parameters:

Parameter	Type	Description
name	string	Name of the school
address	string	School address
latitude	number	Latitude coordinate (-90 to 90)
longitude	number	Longitude coordinate (-180 to 180)

Success Response:

json
Copy
Edit
Status: 201 Created
{
  "id": 1,
  "message": "School added successfully"
}
Error Responses:

json
Copy
Edit
Status: 400 Bad Request
{
  "error": "Validation error message"
}
2. List Schools
URL: /listSchools

Method: GET

Query Parameters:

Parameter	Type	Description
latitude	number	User’s latitude (required)
longitude	number	User’s longitude (required)

Success Response:

json
Copy
Edit
Status: 200 OK
{
  "count": 3,
  "schools": [
    {
      "id": 2,
      "name": "Greenwood High",
      "address": "456 Park Ave",
      "latitude": 12.9720,
      "longitude": 77.5950,
      "distance_km": 0.05
    }
  ]
}
Error Responses:

json
Copy
Edit
Status: 400 Bad Request
{
  "error": "Query params latitude and longitude are required and must be numbers."
}
Testing with Postman
A Postman collection is provided in the /docs folder as school-api.postman_collection.json.
Import this collection in Postman to test the APIs with sample requests.

Deployment
You can deploy this API on any Node.js compatible hosting platform such as Render, Railway, Heroku, etc.
Make sure to set the environment variables accordingly and update your database connection settings.

License
This project is licensed under the MIT License.

Author
Chandan Gupta

