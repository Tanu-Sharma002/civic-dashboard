# Civic Intelligence Dashboard

Civic Intelligence Dashboard is a full-stack web application that helps users explore air quality and pollution levels for different locations. Users can create an account, log in securely, search for a city, and view real-time environmental data along with historical air quality trends.

The goal of this project is to combine environmental data with simple analytics to provide meaningful insights about a city's air quality and overall civic health.

## Features

* User registration and login
* Secure password storage using BCrypt
* JWT-based authentication
* Search air quality data for any location
* View AQI (Air Quality Index)
* Pollution analysis (PM2.5, PM10, CO, NO₂, SO₂, O₃)
* Civic Health Score calculation
* Historical AQI trend visualization
* Search history stored in MySQL database

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router
* Chart.js

### Backend

* Node.js
* Express.js
* JWT Authentication
* BCrypt.js

### Database

* MySQL (Railway)

### APIs Used

* OpenCage Geocoding API
* OpenWeather Air Pollution API

### Deployment

* Frontend: Render
* Backend: Render
* Database: Railway

## Project Structure

```text
civic-dashboard
│
├── backend
│   ├── middleware
│   ├── db.js
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   └── App.js
│   └── package.json
│
└── README.md
```

## How It Works

1. Users create an account and log in.
2. The application verifies users using JWT tokens.
3. When a location is searched, the OpenCage API converts the location into latitude and longitude coordinates.
4. These coordinates are sent to the OpenWeather Air Pollution API.
5. The application displays AQI, pollution levels, and historical data.
6. Search details are stored in the MySQL database for future analysis.

## Database Tables

### Users

Stores user account information.

```sql
id
name
email
password
```

### Searches

Stores searched locations and their environmental data.

```sql
id
location
aqi
civic_score
created_at
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/Tanu-Sharma002/civic-dashboard.git
cd civic-dashboard
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Environment Variables

Create a `.env` file in the backend folder and add:

```env
MYSQLHOST=your_host
MYSQLUSER=your_user
MYSQLPASSWORD=your_password
MYSQLDATABASE=your_database
MYSQLPORT=your_port

JWT_SECRET=your_secret

OPENCAGE_KEY=your_api_key
OPENWEATHER_KEY=your_api_key
```

## Challenges Faced

While building this project, I worked on:

* Connecting a React frontend with a Node.js backend
* Implementing authentication using JWT
* Integrating third-party APIs
* Deploying frontend and backend separately on Render
* Connecting a cloud MySQL database using Railway
* Managing environment variables in production

## Future Improvements

* User-wise search history
* Favorite locations
* AQI forecasting
* PDF report generation
* More detailed pollution insights
* Improved dashboard UI

## Author

**Tanu Sharma**

GitHub: https://github.com/Tanu-Sharma002

## Project Status

Active and deployed, new features are under development.

This project was built as a practical full-stack application to strengthen my skills in React, Node.js, MySQL, API integration, authentication, and deployment.
