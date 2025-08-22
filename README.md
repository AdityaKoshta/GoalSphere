# GoalSphere 🎯

GoalSphere is a productivity and accountability web app that helps users set, track, and complete their goals.  
I built this project to sharpen my MERN stack skills and implement real-world features like authentication, CRUD operations, analytics, and deployment.

---

## 🚀 Features
- User Authentication (JWT) – Secure login and signup system.  
- Goal Management – Add, edit, delete, and mark goals as completed.  
- Weekly Progress Analytics – Visual charts to track completed goals.  
- Deadline Notifications – Goals due today or overdue are highlighted.  
- Responsive UI – Works smoothly on desktop and mobile.  
- Fully Deployed – Backend on Render, Frontend on Vercel.  

---

## 🛠️ Tech Stack
Frontend: React, Vite, Tailwind CSS, Recharts  
Backend: Node.js, Express.js  
Database: MongoDB  
Auth: JWT (JSON Web Token), bcrypt.js  
Other Tools: CORS, Multer (for handling uploads), Cron Jobs  
Deployment: Vercel (Frontend), Render (Backend)

---

## 🔑 REST API Endpoints
### Auth Routes
- `POST /auth/signup` → Register a new user  
- `POST /auth/login` → Login user and get JWT  

### Goal Routes
- `POST /goals` → Create a new goal  
- `GET /goals` → Fetch all goals for the logged-in user  
- `PUT /goals/:id` → Update a goal  
- `DELETE /goals/:id` → Delete a goal  
- `GET /goals/weekly-progress` → Get weekly completed goals data  
