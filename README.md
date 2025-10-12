# 🎯 Trello-Style Project Management Dashboard

## ✨ Features

- **🔐 Email-based OTP login** (no password required) with JWT authentication
- **📋 Project & Task Management** - Add, Update operations with real-time synchronization
- **🔄 Phase Management** - Workflow phases (Proposed, Todo, In Progress, Done, Deployed)
- **👑 Super-User Controls** - Password-protected admin mode (`admin123`)
- **🔔 Real-time Notifications** - Multi-channel delivery (UI, Email) with WebSocket integration

## 🌐 Live Demo

- **Frontend:** [https://trello-psi-cyan.vercel.app/](https://trello-psi-cyan.vercel.app/)
- **Backend API:** [https://trello-production-298c.up.railway.app](https://trello-production-298c.up.railway.app)

## 🛠️ Tech Stack

**Backend:** Node.js, Express.js, TypeScript, MongoDB, Socket.IO, JWT, SendGrid  
**Frontend:** React 19, TypeScript, Vite, Redux Toolkit, React Router, Axios, Socket.IO Client

## 🗄️ Architecture Decisions

**MongoDB:** Chosen for flexible schema evolution, horizontal scaling, and developer productivity with TypeScript/Node.js stack. Perfect for semi-structured project management data.

**Notification Strategy Pattern:** Multi-channel delivery with priority-based routing:
- **UINotificationStrategy** (priority 1): Real-time WebSocket for active users
- **EmailNotificationStrategy** (priority 3): SendGrid fallback for offline users
- Context-aware delivery with user preferences and quiet hours support

## 🚀 Quick Start

### Prerequisites
Node.js (v18+), MongoDB, SendGrid account, Git

### Installation
```bash
# Clone repository
git clone https://github.com/AnkitPatel1999/trello.git
cd trello

# Backend setup
cd backend && npm install
# Edit .env with your configuration
npm run dev

# Frontend setup (new terminal)
cd frontend && npm install
# Edit .env with your API URL
npm run dev
```

### Environment Variables

**Backend (.env):**
```env
# Server Configuration
NODE_ENV=development
PORT=3001
API_VERSION=v1

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/trello

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourapp.com
SENDGRID_FROM_NAME=Your App Name

# Super User Configuration
SUPER_USER_PASSWORD=admin123

```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3001/api/v1
```

## 🔒 Security & Access

- **JWT Authentication** with secure token management
- **Super User Mode**: Password `admin123` for enhanced metadata access
- **CORS Configuration** and environment variable protection

## 📱 Deployment

**Backend (Railway):** Auto-deploy from GitHub with MongoDB Atlas + SendGrid  
**Frontend (Vercel):** Auto-deploy from GitHub with environment configuration