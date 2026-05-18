# 🌿 HealHabit — AI-Powered Digital Wellness Platform (MERN Stack)

HealHabit is a premium, highly responsive AI-driven digital wellness platform designed to track screen time, establish healthy habits, manage stress levels, and gamify daily wellness routines. 

This project is built using a modern, scalable **MERN Stack Architecture** (MongoDB, React, Node.js) with a presentational **Frontend Layer** and a live **MongoDB Cloud-connected Backend Server**.

---

## 🌟 Key Features & Core Highlights
* 🤖 **Neural AI Wellness Coach**: Direct integration with Google Gemini AI for cognitive behavioral therapy, productivity coaching, and personalized stress advice.
* 📊 **Dynamic Screen-Time Analytics**: Full metrics logging across categories (Entertainment, News, Coding, Focus) with clean manual check-ins and responsive SVG charts.
* 🏆 **Gamified Challenges & Leaderboard**: Complete custom daily tasks to earn XP, level up, and rank on a competitive Global Leaderboard.
* 🌿 **Elite Premium Dashboard**: Sage Green & Soft Beige styled elite modules that unlock custom goals, deep trends analytics, and advanced wellness advice.
* 📱 **100% Responsive Design**: Collapsible sliding navigation drawer sidebar that scales perfectly from 4K desktop screens down to smartphones.
* 🛡️ **Dual-Database Resiliency**: Advanced connection architecture that automatically syncs to a live **MongoDB Cloud Database**, with seamless local caching and offline fallback.

---

## 🖥️ 1. FRONTEND ARCHITECTURE (Visual Presentation & UI Components)
The frontend layer handles visual styles, routing, animations, and user page states.
* **📂 Directory: `src/components/` & `src/pages/`**:
  * **`src/main.jsx`**: Bootstraps and mounts the React application to the DOM.
  * **`src/App.jsx`**: Handles core page routing (`/login`, `/habits`, `/focus`, `/sleep`, `/challenges`, `/premium`).
  * **`src/components/Layout.jsx`**: Main wrapper containing the responsive layout, header controls, and responsive toggles.
  * **`src/components/Sidebar.jsx`**: Collapsible left slide-drawer sidebar with animated hamburger triggers for small viewports.
  * **`src/components/Chatbot.jsx`**: Floating AI wellness coach interface with micro-animations.
  * **`src/pages/Dashboard.jsx`**: Visual overview screen displaying daily wellness metrics, stress indexes, and consistent streaks.
  * **`src/pages/FocusMode.jsx`**: Interactive Pomodoro timer with dynamic visual rings and focus sound triggers.
  * **`src/styles/`**: Custom-tailored vanilla CSS layout engines (`Layout.css`, `Premium.css`, etc.) with contrast-safe light and dark mode support inside `src/index.css`.

---

## ⚙️ 2. BACKEND & DATABASE ARCHITECTURE (Node, Express & MongoDB)
The backend manages live user sessions, database schemas, secure transactions, and server endpoints.

### 📂 The Database Setup: `.env` File
Security configurations are separated from the codebase inside the environment variable file (`.env`):
```env
MONGODB_URI="mongodb+srv://pkv07b_db_user:B9POq9UoH9dD6jjQ@pravin.ljvsevp.mongodb.net/healhabit?retryWrites=true&w=majority"
```

### 📂 The Backend Engine: `server.js`
A robust Node.js HTTP server that runs in your terminal, manages port binding conflicts, and queries the database:
* **Automatic Port Conflict Resolver**: Attempts to bind to port `5000` first. If occupied (e.g. by macOS AirPlay), it automatically detects the conflict and increments to port `5001`, starting without crashing!
* **Mongoose Schema & Models**:
  ```javascript
  const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isPremium: { type: Boolean, default: false },
    theme: { type: String, default: 'dark' },
    water: { type: Number, default: 0 },
    screenTime: {
      total: { type: Number, default: 252 },
      categories: {
        entertainment: { type: Number, default: 120 },
        news: { type: Number, default: 60 },
        coding: { type: Number, default: 72 },
        focus: { type: Number, default: 0 },
        custom: { type: mongoose.Schema.Types.Mixed, default: {} }
      }
    },
    sleepDuration: { type: Number, default: 0 },
    focusScore: { type: Number, default: 0 },
    history: { type: Array, default: [] }
  });
  ```

### 🛣️ Live Server API Routes (MERN Pipeline)
* 🟢 `GET /api/status`: Returns server health status.
* 🔵 `GET /api/users`: Fetches the entire collection of registered users from MongoDB.
* 🟡 `POST /api/users/signup`: Registers a new user and saves their core profile parameters in MongoDB Atlas.
* 🟠 `POST /api/users/login`: Authenticates user credentials directly against saved database documents.
* 🟣 `POST /api/users/update`: Performs automated cloud synchronizations to save checked-off habits, stress updates, and logged water.

### 📂 Reactive Data Provider: `src/context/AuthContext.jsx`
* **Dynamic API Sniffer**: On load, React automatically sends a fast probe to `localhost:5000` and `localhost:5001` to identify where the backend server is active, making connection configuration completely hands-free!
* **Hybrid Storage & Offline Resiliency**: Connects with live database endpoints. If the backend server is offline, it seamlessly falls back to local browser storage (`localStorage`) so the user's experience is never interrupted.

---

## 🛠️ How to Launch the Application (In Two Different Terminals)

### 🖥️ Terminal 1: Run the React Frontend
1. Install project dependencies:
   ```bash
   npm install
   ```
2. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *Frontend is live on: `http://localhost:5173`*

### ⚙️ Terminal 2: Run the MongoDB Backend
1. Open a new, separate terminal window in the project folder and run:
   ```bash
   npm run backend
   ```
   *Backend is live on: `http://localhost:5001` (or `5000`)*

---

## 📊 How to View and Inspect Stored Data

### 🖥️ 1. Inspecting Local Data (Browser Developer Tools)
1. Go to your frontend URL: `http://localhost:5173`
2. Open **Developer Tools** (Right-click -> Inspect, or press `F12` / `Cmd + Option + I`).
3. Click on the **Application** tab at the top.
4. Expand **Local Storage** in the left sidebar and select `http://localhost:5173`.
5. You will see:
   * `currentUser`: Detail of who is currently signed in.
   * `aura_db`: Local cached database of all registered accounts.

### ☁️ 2. Inspecting Live Cloud Data (MongoDB Atlas)
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Database** and click **Browse Collections** next to your cluster.
3. Select the **`healhabit`** database from the left-hand Explorer menu.
4. Click on the **`users`** collection to see live MongoDB documents containing names, emails, water metrics, and active check-ins!
