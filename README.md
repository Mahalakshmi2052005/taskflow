# TaskFlow 🚀

A full-stack task management web app built with React, Node.js, Express, and MongoDB.

**Live Demo:** [your-deployment-url.vercel.app](#)  
**GitHub:** [your-github-url](#)

---

## Features

- **Real Authentication** — JWT-based login & registration with bcrypt password hashing
- **Protected Routes** — Frontend + backend route protection
- **Full CRUD** — Create, read, update, delete tasks
- **Rich Task Fields** — Status, priority, due date, tags, description
- **Smart Filters** — Filter by status, priority, or search text
- **Stats Dashboard** — Live task count breakdown
- **Responsive UI** — Works on mobile and desktop

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (via Mongoose) |
| Auth | JSON Web Tokens (JWT) + bcryptjs |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Local Development Setup

### Prerequisites
- Node.js v18+
- A [MongoDB Atlas](https://mongodb.com/atlas) account (free tier)

---

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/taskflow.git
cd taskflow
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow
JWT_SECRET=pick_a_long_random_secret_string
CLIENT_URL=http://localhost:5173
```

Start the server:
```bash
npm run dev
```
Server runs on `http://localhost:5000`

---

### 3. Frontend Setup
```bash
cd client
npm install
```

Create `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```
App runs on `http://localhost:5173`

---

## Deployment

### Backend → [Render](https://render.com)
1. Create a new **Web Service** on Render
2. Connect your GitHub repo
3. Set root directory to `server`
4. Build command: `npm install`
5. Start command: `node index.js`
6. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL)

### Frontend → [Vercel](https://vercel.com)
1. Import your GitHub repo on Vercel
2. Set root directory to `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env variable: `VITE_API_URL` = your Render backend URL + `/api`

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login & get token | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Tasks
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/tasks` | Get all user tasks | Private |
| POST | `/api/tasks` | Create a task | Private |
| PUT | `/api/tasks/:id` | Update a task | Private |
| DELETE | `/api/tasks/:id` | Delete a task | Private |
| GET | `/api/tasks/stats` | Get task counts | Private |

---

## Project Structure

```
taskflow/
├── server/
│   ├── index.js              # Entry point
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── Task.js           # Task schema
│   ├── routes/
│   │   ├── auth.js           # Auth endpoints
│   │   └── tasks.js          # Task CRUD endpoints
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification
│   └── .env.example
│
└── client/
    ├── src/
    │   ├── App.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx
    │   ├── components/
    │   │   ├── TaskCard.jsx
    │   │   └── TaskModal.jsx
    │   └── utils/
    │       └── api.js
    └── vite.config.js
```

---

## Security Highlights
- Passwords hashed with **bcrypt** (12 rounds)
- JWT tokens expire in **7 days**
- All task routes verify ownership before modifying data
- Input validation on both frontend and backend
- `.env` never committed to version control

---

Built for DekNek3D Full Stack Developer Internship — Round 2
