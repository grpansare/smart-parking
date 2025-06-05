🚗 Smart Car Parking System
📖 Overview
A full-stack Smart Car Parking System designed to simplify the process of booking and managing parking spots in real-time. Built with React, Spring Boot, and Razorpay, it offers a seamless experience with mapping, payments, and role-based access.


🛠️ Tech Stack
🖥️ Frontend
React.js

Tailwind CSS

React Router

Axios

OpenStreetMap (Leaflet)

🧠 Backend
Spring Boot (Java)

MySQL

JWT Authentication + Google OAuth

Razorpay Payment Integration

📦 Features
🚙 User
Secure login via JWT and Google

Search & book parking via interactive map

Real-time slot availability

Navigation directions

Booking history & invoices

🅿️ Parking Owner
Add/Edit parking spaces and slots

Floor-wise management

Set dynamic pricing and availability

Bank account integration

🛡️ Admin
View and manage users, owners, and bookings

Monthly reports

Role-based dashboard

💳 Payments
Razorpay integration

Time-based pricing

Invoice generation

🗂️ Project Structure
css
Copy
Edit
smart-car-parking-system/
├── backend/
│   └── src/
│       ├── main/java/com/parking/...
│       └── resources/application.properties
├── smart-parking/
│   └── src/
│       ├── components/
│       └── pages/
└── README.md
🚀 Getting Started
▶️ Backend
bash
Copy
Edit
cd smart-parking-backend
mvn spring-boot:run
💻 Frontend
bash
Copy
Edit
cd smart-parking
npm install
npm run dev
🤝 Team Members
Name	Role
Ganesh Pansare	Full Stack Developer
Atharv Raut	Frontend Specialist
