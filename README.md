Smart Car Parking System - README
Overview
A full-stack Smart Car Parking System designed to simplify the process of booking and managing parking spots in real-time. Built with React, Spring Boot, and Razorpay, it offers a seamless experience with mapping, payments, and role-based access.
🔗 Live Demo
🌐 Live Frontend: https://your-frontend-url.com
🔧 Backend API: https://your-backend-url.com/api-docs
🔧 Tech Stack
• Frontend:

- React.js + Tailwind CSS
- React Router + Axios
- OpenStreetMap (Leaflet)
  • Backend:
- Spring Boot (Java)
- MySQL
- JWT + Google OAuth
- Razorpay Payments
  📦 Features
  • 🚙 User Features
- Secure login via JWT and Google
- Search & book parking via interactive map
- View slot availability in real-time
- Get navigation directions
- Booking history and invoices
  • 🅿️ Parking Owner Features
- Add/edit parking spaces and slots
- Floor-wise management
- Dynamic pricing and availability
- Bank account integration
  • 🛡️ Admin Features
- View and manage users, owners, bookings
- Monthly reports
- Role-based dashboard
  • 💳 Payments
- Razorpay integration
- Time-based pricing logic
- Invoice generation
  🏗️ Project Structure

smart-car-parking-system/
├── backend/
│ └── src/
│ └── main/java/com/parking/...
│ └── resources/application.properties
├── smart-parking/
│ └── /src/components, pages/
│  
└── README.md

🚀 Getting Started
Backend:
cd smart-parking-backend
mvn spring-boot:run
Frontend:
cd smart-parking
npm install
npm run dev

🤝 Team Members
Name Role
Ganesh Pansare Full Stack Dev
Atharv Raut Backend Specialist
