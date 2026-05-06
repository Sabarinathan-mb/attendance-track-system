# Attendance Tracker System

A modern, production-ready, full-stack student attendance tracking application. Designed with a premium, glassmorphism-inspired light mode UI and built for seamless deployment.

##  Features

- **Beautiful Light-Mode Dashboard:** A crisp, airy, and high-contrast UI with royal blue and emerald green accents.
- **Attendance Logging:** Mark students as present or absent efficiently with satisfying toggle controls.
- **Real-Time Statistics:** Automatically calculates attendance percentages, overall days, and status tiers (Excellent, Average, At Risk).
- **Recent History Sparklines:** Visualize a student's last 5 days of attendance directly on the main dashboard using colored dot indicators.
- **Student Detail View:** Deep dive into a specific student's attendance records by semester, featuring animated circular progress rings.
- **Secure Backend:** Express server hardened with `helmet`, `express-rate-limit`, and `cors`.
- **Database Driven:** Powered by MongoDB Atlas for reliable and scalable data persistence.

##  Tech Stack

- **Frontend:** React, Vite, React Router DOM
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas, Mongoose
- **Styling:** Custom CSS (Premium SaaS Aesthetic)
- **Tooling:** Concurrently (Monorepo management)

##  Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sabarinathan-mb/attendance-track-system.git
   cd attendance-track-system
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory based on the provided `.env.example` file:
   ```env
   # MongoDB Atlas connection string
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/attendance-tracker?retryWrites=true&w=majority
   
   # Server port
   PORT=5000
   
   # Environment
   NODE_ENV=development
   
   # Client URL for CORS
   CLIENT_URL=http://localhost:5173
   ```
   *Make sure to whitelist your IP address in your MongoDB Atlas Network Access settings!*

4. **Seed the Database (Optional but recommended)**
   ```bash
   npm run seed
   ```

5. **Start the Development Servers**
   ```bash
   npm run dev
   ```
   The frontend will start at `http://localhost:5173` and the backend at `http://localhost:5000`.

##  Production Deployment (Render)

This application is configured out-of-the-box for deployment on [Render](https://render.com).

1. Create a new **Web Service** on Render and connect your GitHub repository.
2. Use the following configuration:
   - **Build Command:** `npm run install:all && npm run build`
   - **Start Command:** `npm start`
3. Add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your MongoDB Atlas Connection String
   - `CLIENT_URL`: Your deployed Render URL (e.g., `https://attendance-tracker.onrender.com`)
4. Click **Deploy**!

In production mode, the Express backend is configured to statically serve the compiled React frontend, meaning both your API and web application will run seamlessly on the same Render URL.

##  License

This project is open-source and available under the [MIT License](LICENSE).
