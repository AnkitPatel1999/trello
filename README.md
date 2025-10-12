# 🎯 Trello-Style Project Management Dashboard

## ✨ Features

### 🔐 **Authentication System**
- **Email-based OTP login** (no password required)
- Secure JWT token-based authentication
- Automatic session management and persistence
- Protected routes with role-based access

### 📋 **Project & Task Management**
- **Project Dashboard** - Create, view, and manage multiple projects
- **Task CRUD Operations** - Create, read, delete tasks
- **Real-time Updates** - Instant synchronization across all connected users
- **Phase Management** - workflow phases (Proposed, Todo, In Progress, Done, Deployed)

### 👑 **Super-User Controls**
- **Admin Toggle** - Secure password-protected super-user mode
- **Enhanced Metadata** - View creation/update timestamps and user information

### 🔔 **Real-time Notifications**
- **Live Activity Feed** - Real-time notifications for active users
- **Email Notifications** - Automatic email delivery for offline users
- **WebSocket Integration** - Instant updates across all connected clients
- **Notification Center** - Centralized notification management
- **Multi-channel Delivery** - Email, UI, and push notification support

## 🌐 Live Demo

- **Frontend:** [https://trello-psi-cyan.vercel.app/](https://trello-psi-cyan.vercel.app/)
- **Backend API:** [https://trello-production-298c.up.railway.app](https://trello-production-298c.up.railway.app)

## 🛠️ Technologies Used

### **Backend Stack**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript development
- **MongoDB** - NoSQL database with Mongoose ODM
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **SendGrid** - Email delivery service


### **Frontend Stack**
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe frontend development
- **Vite** - Fast build tool and development server
- **Redux Toolkit** - Predictable state management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Socket.IO Client** - Real-time communication

## 🗄️ Database and Design Decisions

### **MongoDB Selection Rationale**

This project leverages MongoDB's document-based architecture for several strategic advantages:

- **Dynamic Schema Evolution**: As the project management features expand, MongoDB's schema flexibility allows seamless addition of new fields without complex migrations
- **Horizontal Scaling**: Built for distributed environments, MongoDB supports future growth as user base and data volume increase
- **Developer Productivity**: BSON's JSON-like structure aligns perfectly with our TypeScript/Node.js stack, reducing data transformation overhead
- **Complex Data Relationships**: Project hierarchies, task dependencies, and user permissions map naturally to nested document structures

The semi-structured nature of project management data—where tasks may have varying metadata, custom fields, and evolving requirements—makes MongoDB's document model an ideal choice over rigid relational schemas.

### **Architecture Patterns**

#### **Multi-Channel Notification Strategy**

Our notification system implements a sophisticated Strategy pattern with priority-based delivery:

**Core Components:**
- **BaseNotificationStrategy**: Abstract foundation providing common validation logic (quiet hours, channel muting, expiration checks)
- **Delivery Channels**: UI (priority 1),  Email (priority 3)
- **Context-Aware Delivery**: Each strategy evaluates user preferences, online status, and notification metadata before delivery

**Implementation Highlights:**
- **UINotificationStrategy**: Real-time WebSocket delivery for active users with highest priority
- **EmailNotificationStrategy**: Fallback delivery for offline users via SendGrid integration


This architecture enables seamless addition of new notification channels (e.g., Slack, Teams) without modifying existing delivery logic, while maintaining user preference compliance and delivery reliability.

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18 or later)
- MongoDB (local or Atlas)
- SendGrid account (for email notifications)
- Git

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AnkitPatel1999/trello.git
   cd trello
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   # Edit .env with your API URL
   npm run dev
   ```

### **Environment Variables**

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

## 🎯 Key Features Implementation

### **1. Email-based Authentication**
- OTP generation and validation system
- Secure token management with JWT
- Session persistence across browser refreshes

### **2. Real-time Collaboration**
- WebSocket connection management
- Live task movement notifications

### **3. Super-User Mode**
- Password-protected admin toggle
- Conditional UI rendering based on permissions

### **4. Notification System**
- Multi-channel delivery (Email, UI, Push)
- Offline user email notifications
- Real-time UI notifications

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Protection** - Super-user mode security
- **CORS Configuration** - Secure cross-origin requests
- **Environment Variables** - Sensitive data protection

## 📱 Deployment

### **Backend (Railway)**
- Automatic deployment from GitHub
- Environment variable configuration
- MongoDB Atlas integration
- SendGrid email service

### **Frontend (Vercel)**
- Automatic deployment from GitHub
- Environment variable configuration
