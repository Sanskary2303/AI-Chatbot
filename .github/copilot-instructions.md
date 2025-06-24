<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AI Customer Support Chatbot POC

This is an AI-powered customer support chatbot built with:
- **OpenAI GPT** for natural language processing
- **Redis** for session and conversation history management
- **Socket.io** for real-time WebSocket communication
- **TypeScript** for type safety
- **Express.js** for REST API endpoints

## Project Structure

- `src/services/` - Core business logic (ChatService, SessionManager)
- `src/events/` - API endpoint definitions (Godspeed style)
- `src/functions/` - API route handlers
- `public/` - Static HTML client for testing
- `index.ts` - Main application entry point

## Key Features

- Real-time chat via WebSockets
- AI-powered responses using OpenAI GPT
- Automatic escalation detection based on keywords and confidence
- Persistent conversation history in Redis
- RESTful API endpoints for chat management
- Health monitoring and analytics

## Development Guidelines

- Use TypeScript for all new code
- Follow the existing service pattern (ChatService, SessionManager)
- Handle errors gracefully with proper logging
- Use environment variables for configuration
- Maintain backward compatibility with existing API endpoints

## Environment Variables

- `OPENAI_API_KEY` - OpenAI API key for GPT integration
- `REDIS_HOST`, `REDIS_PORT` - Redis connection details
- `PORT` - Server port (default: 3000)
- `MAX_CONVERSATION_HISTORY` - Max messages to store per session
- `ESCALATION_KEYWORDS` - Comma-separated keywords for escalation detection
