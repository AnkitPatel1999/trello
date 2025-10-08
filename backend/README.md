# Notification Service

A scalable, real-time notification service built with Node.js, TypeScript, and MongoDB. Supports multiple delivery channels (Email, UI, Push, SMS) with intelligent routing based on user activity and preferences.

## 🚀 Features

- **Multiple Delivery Channels**: Email, In-App UI, Push Notifications, SMS
- **Real-time Notifications**: WebSocket-based instant delivery
- **User Activity Tracking**: Online/offline status with intelligent routing
- **Batch Processing**: Efficient bulk notification delivery
- **User Preferences**: Granular control over notification types and channels
- **Queue Management**: Background job processing with retry logic
- **Caching**: Redis-based caching for performance
- **Rate Limiting**: API protection and abuse prevention
- **Comprehensive Logging**: Structured logging with Winston
- **Health Monitoring**: Built-in health checks and monitoring

## 🏗️ Architecture

### Design Patterns
- **Strategy Pattern**: Different notification delivery methods
- **Repository Pattern**: Data access abstraction
- **Factory Pattern**: Strategy selection and creation
- **Observer Pattern**: Event-driven architecture
- **Queue Pattern**: Background job processing

### Core Components
- **NotificationService**: Main orchestrator
- **UserActivityService**: Tracks user online/offline status
- **EmailService**: Handles email delivery
- **CacheService**: Redis operations
- **WebSocketServer**: Real-time communication
- **QueueManager**: Background job processing

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd notification-service

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Update environment variables
nano .env
```

## ⚙️ Configuration

Update the `.env` file with your configuration:

```env
# Server
NODE_ENV=development
PORT=3001

# Database
MONGODB_URI=mongodb://localhost:27017/notification_service

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email (SendGrid or AWS SES)
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourapp.com

# JWT
JWT_SECRET=your-super-secret-jwt-key
```

## 🚀 Running the Service

```bash
# Development
npm run dev

# Production
npm run build
npm start

# With Docker
docker-compose up -d
```

## 📚 API Documentation

### Authentication
All API endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

### Core Endpoints

#### Create Notification
```http
POST /api/v1/notifications
Content-Type: application/json

{
  "userId": "user123",
  "type": "TASK_ASSIGNED",
  "title": "New Task Assigned",
  "message": "You have been assigned a new task",
  "data": {
    "taskId": "task456",
    "projectId": "project789"
  },
  "channels": ["UI", "EMAIL"],
  "metadata": {
    "priority": "high",
    "sourceId": "task456",
    "sourceType": "task"
  }
}
```

#### Get User Notifications
```http
GET /api/v1/notifications?status=unread&limit=20&offset=0
```

#### Mark as Read
```http
PATCH /api/v1/notifications/:id/read
```

#### Update User Activity
```http
POST /api/v1/users/activity
Content-Type: application/json

{
  "userId": "user123",
  "isOnline": true,
  "lastSeen": "2024-01-15T10:30:00Z"
}
```

## 🔌 WebSocket Events

### Client Events
- `join`: Join user's notification room
- `leave`: Leave user's notification room
- `mark_read`: Mark notification as read

### Server Events
- `notification`: New notification received
- `notification_read`: Notification marked as read
- `user_online`: User came online
- `user_offline`: User went offline

## 🎯 Notification Flow

### User Online
1. Event triggered → NotificationService
2. Check UserActivityService → User is online
3. Use UINotificationStrategy → Send via WebSocket
4. Store in DB with status "SENT"

### User Offline
1. Event triggered → NotificationService
2. Check UserActivityService → User is offline
3. Use EmailNotificationStrategy → Add to email queue
4. EmailQueueProcessor sends email
5. Store in DB with status "SENT"

### Batch Digest
1. Cron job runs (hourly/daily)
2. NotificationAggregator finds pending notifications
3. Groups by user and renders digest template
4. Sends one email per user with all updates

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- --testNamePattern="NotificationService"
```

## 📊 Monitoring

### Health Checks
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed service status

### Metrics
- Queue processing times
- Email delivery rates
- WebSocket connection counts
- Database query performance
- Error rates and types

## 🔧 Development

### Project Structure
```
src/
├── config/          # Configuration files
├── models/          # Database models
├── interfaces/      # TypeScript interfaces
├── enums/           # Enumerations
├── strategies/      # Notification delivery strategies
├── services/        # Business logic services
├── repositories/    # Data access layer
├── controllers/     # HTTP controllers
├── middlewares/     # Express middlewares
├── routes/          # API routes
├── websocket/       # WebSocket server
├── queue/           # Background job processing
├── utils/           # Utility functions
└── templates/       # Email templates
```

### Adding New Notification Types
1. Add to `NotificationType` enum
2. Create email template if needed
3. Update strategy logic if required
4. Add validation rules

### Adding New Delivery Channels
1. Create new strategy class
2. Implement `INotificationStrategy` interface
3. Register in `NotificationStrategyFactory`
4. Update user preferences model

## 🚀 Deployment

### Docker
```bash
docker build -t notification-service .
docker run -p 3001:3001 notification-service
```

### Environment Variables
Ensure all required environment variables are set in production:
- Database connection strings
- Redis configuration
- Email service credentials
- JWT secrets
- API keys

## 📈 Scaling

### Horizontal Scaling
- Multiple API server instances
- Redis for shared cache
- Independent queue workers
- WebSocket sticky sessions

### Database Optimization
- Indexes on frequently queried fields
- Read replicas for high read load
- TTL indexes for auto-cleanup
- Connection pooling

### Queue Management
- Separate queues per channel
- Priority queues for urgent notifications
- Dead letter queues for failed jobs
- Rate limiting per user/channel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
