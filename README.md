# 🚗 Smart Car Parking System

A full-stack Smart Car Parking System that simplifies finding, booking, and managing parking slots. Built using **React**, **Spring Boot**, and **MySQL**, with **Razorpay** for payment integration and **OpenStreetMap** for real-time location-based search.

GitHub Repo: [grpansare/smark_car_parking](https://github.com/grpansare/smark_car_parking)

---

## 🔗 Live Demo

- 🌐 **Frontend**: [https://smart-parking-frontend.vercel.app](#)
- ⚙️ **Backend API**: [https://smart-parking-backend.onrender.com/api](#)  


---

## 📦 Features

### 👤 User
- JWT + Google OAuth login
- View nearby parking spaces on map
- Real-time slot availability
- Book parking with date/time
- Invoice & payment summary

### 🧑‍💼 Parking Owner
- Add/Edit/Delete parking slots
- Floor-wise availability
- Set dynamic pricing
- Manage bank details

### 🛡️ Admin
- View all users & parking owners
- Generate monthly reports
- Role-based access control

---

## 🛠 Tech Stack

| Layer       | Tech Stack                      |
|-------------|----------------------------------|
| Frontend    | React, Tailwind CSS, Leaflet.js |
| Backend     | Spring Boot, JWT, Google OAuth  |
| Database    | MySQL                           |
| Payments    | Razorpay API                    |
| Mapping     | OpenStreetMap                   |

---

## ⚙️ Setup Instructions

### 🔙 Backend

```bash
cd backend
# Configure application.properties
mvn clean install
mvn spring-boot:run
🔜 Frontend
bash
Copy
Edit
cd frontend/citycare
npm install
npm run dev
📁 Folder Structure
css
Copy
Edit
smart-car-parking-system/
├── backend/
│ └── src/
│ └── main/java/com/parking/...
│ └── resources/application.properties
├── smart-parking/
│ └── /src/components, pages/
│  
└── README.md


🧪 API Testing
Use Postman Collection

Swagger (optional): /swagger-ui.html if enabled



👥 Team
Name	Role
Ganesh Pansare	Full Stack Dev
Atharv Raut	Backend Dev
