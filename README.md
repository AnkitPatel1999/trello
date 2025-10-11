# 🎯 Ticket Dashboard - Project Management System

A comprehensive Trello-style project management dashboard with email-based authentication, real-time notifications, and super-user controls.

## 🚀 Features

### ✅ **Authentication System**
- **Email-based OTP login** (no password required)
- Secure JWT token-based authentication
- Automatic session management

### ✅ **Project & Ticket Management**
- **Project Dashboard** - Lists all projects with creation capability
- **Ticket Management** - Create, update, move tickets across phases
- **Real-time Updates** - Instant reflection of changes for all active users
- **Drag & Drop Interface** - Intuitive ticket movement

### ✅ **Super-User Controls**
- **Toggle Switch** - Enable/disable super-user mode
- **Password Protection** - Secure password prompt for admin access
- **Enhanced View** - Shows creation/update timestamps when enabled
- **Conditional Rendering** - Hides user info when disabled

### ✅ **Notifications & Updates**
- **Real-time Activity Feed** - Live notifications for active users
- **Email Notifications** - Automatic emails for offline users
- **WebSocket Integration** - Instant updates across all connected clients
- **Notification Center** - Centralized notification management

### ✅ **Backend Architecture**
- **Node.js + TypeScript** - Type-safe backend implementation
- **MongoDB Database** - NoSQL for flexible data structure
- **Design Patterns**:
  - **Strategy Pattern** - Notification delivery strategies (Email, UI, Push)
  - **Factory Pattern** - NotificationStrategyFactory for strategy creation
  - **Repository Pattern** - BaseRepository with specific implementations
- **RESTful API** - Clean API design with proper error handling

### ✅ **Frontend Architecture**
- **React + TypeScript** - Type-safe frontend implementation
- **Redux State Management** - Centralized state with RTK
- **Real-time WebSocket** - Live updates and notifications
- **Responsive Design** - Clean, modern UI with CSS modules

## 🏗️ **Architecture & Design Decisions**

### **Database Choice: MongoDB (NoSQL)**

**Why NoSQL over SQL:**
- **Flexible Schema** - Easy to add new fields to tickets/projects without migrations
- **JSON-like Structure** - Natural fit for JavaScript/TypeScript applications
- **Scalability** - Better horizontal scaling for real-time features
- **Document-based** - Perfect for nested data like ticket metadata
- **Rapid Development** - Faster iteration without complex schema changes

### **Design Patterns Implemented**

#### 1. **Strategy Pattern** - Notification System
```typescript
// Different notification delivery strategies
- EmailNotificationStrategy
- UINotificationStrategy  
- PushNotificationStrategy
```

#### 2. **Factory Pattern** - Strategy Creation
```typescript
// NotificationStrategyFactory creates appropriate strategy
const strategy = factory.getStrategy(DeliveryChannel.EMAIL);
```

#### 3. **Repository Pattern** - Data Access
```typescript
// BaseRepository with specific implementations
- NotificationRepository
- UserRepository
- UserSessionRepository
```

## 🛠️ **Technology Stack**

### **Backend**
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Email Service**: SendGrid (with fallback strategies)
- **Real-time**: Socket.IO
- **Validation**: Custom middleware

### **Frontend**
- **Framework**: React 18
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: CSS Modules
- **Real-time**: Socket.IO Client
- **HTTP Client**: Axios
- **Routing**: React Router

## 📁 **Project Structure**

```
trello/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── strategies/      # Design patterns
│   │   ├── repositories/    # Data access layer
│   │   ├── middlewares/     # Express middlewares
│   │   ├── websocket/       # Real-time functionality
│   │   └── utils/           # Helper functions
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── store/           # Redux store
│   │   ├── services/        # API services
│   │   ├── domain/          # TypeScript types
│   │   └── pages/           # Page components
│   └── package.json
└── README.md
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v16+)
- MongoDB
- SendGrid account (for email)

### **Backend Setup**
```bash
cd backend
npm install
npm run dev
```

### **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

### **Environment Variables**

**Backend (.env)**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/trello
JWT_SECRET=your-jwt-secret
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=your-email@domain.com
SENDGRID_FROM_NAME=Your App Name
SUPER_USER_PASSWORD=admin123
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3001/api/v1
```

## 🎯 **Key Features Implementation**

### **1. Email-based Authentication**
- OTP generation and validation
- Secure token management
- Session persistence

### **2. Real-time Updates**
- WebSocket connection management
- Live ticket movement notifications
- User presence tracking

### **3. Super-User Mode**
- Password-protected toggle
- Conditional UI rendering
- Enhanced metadata display

### **4. Notification System**
- Multi-channel delivery (Email, UI, Push)
- Offline user email notifications
- Real-time UI notifications

## 🔒 **Security Features**

- **JWT Authentication** - Secure token-based auth
- **Password Protection** - Super-user mode security
- **Input Validation** - Server-side validation
- **CORS Configuration** - Secure cross-origin requests
- **Rate Limiting** - API protection

## 📱 **Deployment**

### **Backend (Railway)**
- Automatic deployment from GitHub
- Environment variable configuration
- MongoDB Atlas integration
- SendGrid email service

### **Frontend (Vercel)**
- Automatic deployment from GitHub
- Environment variable configuration
- CDN optimization
- SSL certificate

## 🧪 **Testing**

### **Manual Testing**
1. **Authentication Flow**
   - Email OTP login
   - Session persistence
   - Logout functionality

2. **Project Management**
   - Create new projects
   - View project details
   - Ticket management

3. **Super-User Mode**
   - Toggle with password
   - Enhanced view display
   - Conditional rendering

4. **Real-time Features**
   - Live updates
   - Notification system
   - User presence

## 🎨 **UI/UX Features**

- **Clean Design** - Minimal, professional interface
- **Responsive Layout** - Works on all devices
- **Intuitive Navigation** - Easy-to-use interface
- **Real-time Feedback** - Instant visual updates
- **Accessibility** - Keyboard navigation support

## 🔧 **Code Quality**

- **TypeScript** - Full type safety
- **ESLint** - Code linting
- **Modular Architecture** - Clean separation of concerns
- **Error Handling** - Comprehensive error management
- **Logging** - Detailed application logging

## 📊 **Performance**

- **Optimized Rendering** - React.memo for performance
- **Efficient State Management** - Redux with selectors
- **WebSocket Optimization** - Connection pooling
- **Database Indexing** - Optimized queries
- **CDN Delivery** - Fast static asset delivery

## 🚀 **Future Enhancements**

- [ ] File upload functionality
- [ ] Advanced filtering and search
- [ ] Team collaboration features
- [ ] Mobile app development
- [ ] Advanced analytics
- [ ] Integration with external tools

## 📄 **License**

This project is licensed under the MIT License.

## 👥 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Built with ❤️ using modern web technologies**
