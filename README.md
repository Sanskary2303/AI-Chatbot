# AI-Powered Customer Support Chatbot POC

An intelligent chatbot backend powered by conversational AI that efficiently handles routine customer queries and automatically escalates complex issues to human support. Built with OpenAI GPT, Redis, and Socket.io for real-time communication.

## 🚀 Features

- **AI-Powered Responses**: Utilizes OpenAI GPT for natural language understanding and generation
- **Real-Time Communication**: WebSocket support via Socket.io for instant messaging
- **Smart Escalation**: Automatic detection of complex issues requiring human intervention
- **Session Management**: Persistent conversation state using Redis
- **RESTful API**: Clean API endpoints for easy frontend integration
- **Analytics Ready**: Built-in logging and session tracking capabilities

## 📋 Requirements

- Node.js (v16 or higher)
- Redis server
- OpenAI API key

## 🛠️ Installation

1. **Clone and setup the project:**
   ```bash
   cd /path/to/your/project
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key and Redis configuration
   ```

3. **Start Redis server:**
   ```bash
   # Using Docker
   docker run -d -p 6379:6379 redis:alpine
   
   # Or install locally and start
   redis-server
   ```

4. **Run the application:**
   ```bash
   # Development mode with auto-reload
   npm run dev:watch
   
   # Or standard development mode
   npm run dev
   
   # Production mode
   npm run build && npm start
   ```

## 🌐 Usage

### Web Interface
Open your browser and navigate to `http://localhost:3000` to access the test chat interface.

### API Endpoints

#### Create Chat Session
```bash
POST /api/v1/chat/session
Content-Type: application/json

{
  "userId": "user123",
  "metadata": {}
}
```

#### Send Message
```bash
POST /api/v1/chat/message
Content-Type: application/json

{
  "sessionId": "session_id_here",
  "message": "Hello, I need help with my order",
  "userId": "user123"
}
```

#### Get Chat History
```bash
GET /api/v1/chat/history/{sessionId}
```

#### Health Check
```bash
GET /api/v1/health
```

### WebSocket Events

#### Client to Server
- `join-chat`: Join a chat session
- `send-message`: Send a message

#### Server to Client
- `chat-joined`: Confirmation of joining chat
- `message-received`: AI response received
- `escalation-needed`: Escalation triggered

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│                 │    │                 │    │   Services      │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ HTML Client │ │◄──►│ │Express+WS   │ │    │ │   OpenAI    │ │
│ │             │ │    │ │   Server    │ │◄──►│ │     API     │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│                 │    │ │ ChatService │ │    │ │    Redis    │ │
│                 │    │ │             │ │◄──►│ │   Server    │ │
│                 │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │ ┌─────────────┐ │    │                 │
│                 │    │ │SessionMgr   │ │    │                 │
│                 │    │ │             │ │    │                 │
│                 │    │ └─────────────┘ │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `OPENAI_API_KEY` | OpenAI API key | Required |
| `OPENAI_MODEL` | GPT model to use | `gpt-3.5-turbo` |
| `REDIS_HOST` | Redis server host | `localhost` |
| `REDIS_PORT` | Redis server port | `6379` |
| `REDIS_PASSWORD` | Redis password | `` |
| `MAX_CONVERSATION_HISTORY` | Max messages per session | `10` |
| `ESCALATION_KEYWORDS` | Keywords triggering escalation | See .env.example |
| `SESSION_TIMEOUT` | Session timeout in ms | `1800000` (30 min) |

### Escalation Logic

The system automatically escalates conversations when:
1. User message contains escalation keywords (urgent, emergency, complaint, etc.)
2. AI confidence score falls below threshold (< 0.5)
3. Technical errors occur during processing

## 📊 Monitoring

- **Health Check**: `GET /health` - Service status and metrics
- **Active Sessions**: Tracked in Redis with automatic cleanup
- **Console Logging**: Structured logs for debugging and monitoring

## 🔒 Security Considerations

- API keys stored in environment variables
- Session data encrypted in Redis
- CORS configured for WebSocket connections
- Input validation on all endpoints

## 🚧 Development

### Project Structure
```
├── src/
│   ├── services/          # Business logic
│   │   ├── chatService.ts     # AI integration
│   │   └── sessionManager.ts  # Session handling
│   ├── events/            # API definitions
│   └── functions/         # Route handlers
├── public/               # Static files
├── config/              # Configuration files
└── index.ts            # Application entry point
```

### Adding New Features

1. **New API Endpoint**: Add YAML definition in `src/events/` and handler in `src/functions/`
2. **Enhanced AI Logic**: Modify `ChatService` class
3. **Session Features**: Extend `SessionManager` class
4. **Frontend Changes**: Update `public/index.html`

## 🐛 Troubleshooting

### Common Issues

1. **Redis Connection Failed**
   - Ensure Redis server is running
   - Check REDIS_HOST and REDIS_PORT in .env

2. **OpenAI API Errors**
   - Verify OPENAI_API_KEY is valid
   - Check API quota and billing

3. **WebSocket Connection Issues**
   - Verify port 3000 is available
   - Check CORS configuration

## 📝 License

ISC License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**POC Status**: This is a proof of concept implementation. For production use, consider adding authentication, rate limiting, comprehensive error handling, and monitoring.
