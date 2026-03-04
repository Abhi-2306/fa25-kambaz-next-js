# Kambaz Frontend - Learning Management System

Next.js frontend for Kambaz LMS. Fully containerized with Docker for seamless deployment.

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.7 (App Router)
- **UI**: React 19, React Bootstrap 2.10.10, Bootstrap 5.3.8
- **Styling**: Tailwind CSS 4
- **State**: Redux Toolkit 2.9.2
- **Rich Text**: React Quill New 3.6.0
- **Icons**: React Icons 5.5.0
- **HTTP**: Axios 1.13.2
- **DevOps**: Docker

## ✨ Features

- Role-based dashboards (Faculty, Student, Admin)
- Course enrollment and management
- Assignment submission interface
- Quiz taking with timer and auto-grading
- Rich text editor for content
- Responsive design
- 🐳 Dockerized with hot reload

## 🐳 Quick Start with Docker (Recommended)

### Prerequisites
- Docker Desktop installed and running
- Backend repository cloned in the same parent directory

### Setup
```bash
# Ensure folder structure:
# parent-folder/
# ├── kambaz-next-js/      (this repo)
# └── kambaz-node-server-app/  (backend repo)

# Clone backend if you haven't
cd ..
git clone <backend-repo-url>

# Create docker-compose.yml in parent directory
cd ..
# (See docker-compose.yml below)

# Start everything
docker-compose up --build
```

Access at **http://localhost:3000**

### docker-compose.yml

Create this file in the parent directory containing both repos:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./kambaz-node-server-app
      dockerfile: Dockerfile
    container_name: kambaz-backend
    restart: unless-stopped
    ports:
      - "4000:4000"
    volumes:
      - ./kambaz-node-server-app:/app
      - /app/node_modules
    environment:
      - SERVER_ENV=development
      - PORT=4000
      - CLIENT_URL=http://localhost:3000
      - SERVER_URL=http://localhost:4000
      - DATABASE_CONNECTION_STRING=${DATABASE_CONNECTION_STRING}
      - SESSION_SECRET=${SESSION_SECRET}
    networks:
      - kambaz-network

  frontend:
    build:
      context: ./kambaz-next-js
      dockerfile: Dockerfile
    container_name: kambaz-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./kambaz-next-js:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_HTTP_SERVER=http://localhost:4000
    depends_on:
      - backend
    networks:
      - kambaz-network

networks:
  kambaz-network:
    driver: bridge
```

### Environment Setup

Create `.env` in the parent directory:
```bash
DATABASE_CONNECTION_STRING=your_mongodb_atlas_connection_string
SESSION_SECRET=your_secret_key
```

## 📦 Manual Setup (Without Docker)

### Prerequisites
- Node.js 20+
- Backend server running at http://localhost:4000

### Installation
```bash
# Clone repository
git clone <your-repo-url>
cd kambaz-next-js

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_HTTP_SERVER=http://localhost:4000" > .env.local

# Start development server
npm run dev
```

Access at **http://localhost:3000**

## 👤 Test Accounts

| Username | Password | Role |
|----------|----------|------|
| iron_man | stark123 | Faculty |
| dark_knight | wayne123 | Student |
| ada | 123 | Admin |

## 🐳 Docker Commands

```bash
# Start containers
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Restart frontend
docker-compose restart frontend

# Stop containers
docker-compose down

# Fresh start (removes volumes)
docker-compose down -v
docker-compose up --build
```

## 📁 Project Structure

```
app/
├── Account/           # Authentication
│   ├── Signin/       # Login with demo credentials
│   ├── Signup/
│   └── Profile/
├── Courses/           # Course pages
│   └── [cid]/
│       ├── Assignments/
│       ├── Quizzes/
│       ├── Modules/
│       └── People/
├── Dashboard/         # Main dashboard
└── store.ts          # Redux store
Dockerfile            # Docker configuration
.dockerignore         # Docker ignore rules
```

## 🔧 Environment Variables

**`.env.local` (for manual setup):**
```bash
NEXT_PUBLIC_HTTP_SERVER=http://localhost:4000
```

**In docker-compose.yml (for Docker):**
```yaml
environment:
  - NEXT_PUBLIC_HTTP_SERVER=http://localhost:4000
```

## 🔗 Related Repositories

- **Backend**: [kambaz-node-server-app](https://github.com/Abhi-2306/kambaz-node-server-app)

## 🛠️ Development

### Hot Reload
With Docker, code changes automatically reflect without rebuild!

### Install New Package
```bash
# Manual setup
npm install <package-name>

# Docker setup
npm install <package-name>
docker-compose restart frontend
```

### Build for Production
```bash
npm run build
npm start
```

## 💼 Technical Highlights

- Dockerized Next.js application with hot reload
- Server-side rendering with App Router
- Redux state management with Redux Toolkit
- Role-based access control
- Real-time quiz system with countdown timer
- Responsive UI with Bootstrap and Tailwind CSS
- Rich text editing with React Quill

## 🐛 Troubleshooting

**Port 3000 already in use:**
```bash
# Stop other processes
lsof -ti:3000 | xargs kill  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Or use Docker
docker-compose down
docker-compose up
```

**Frontend can't reach backend:**
- Check `NEXT_PUBLIC_HTTP_SERVER` in .env.local
- Verify backend is running on port 4000
- Check CORS settings in backend

**Hot reload not working (Docker):**
```bash
docker-compose restart frontend
```