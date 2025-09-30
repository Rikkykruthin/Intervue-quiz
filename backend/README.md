# Intervue Poll Backend

Backend server for the live polling system built with Node.js, Express, and Socket.IO.

## Features

- **Real-time Communication**: Socket.IO for live polling and chat
- **Teacher Authentication**: Simple teacher login system
- **Poll Management**: Create, manage, and track polls
- **Live Results**: Real-time vote counting and result broadcasting
- **Student Management**: Kick students from polls
- **Chat System**: Real-time chat during polls
- **Poll History**: Store and retrieve past polls

## API Endpoints

### REST API
- `GET /` - Health check
- `POST /teacher-login` - Teacher authentication
- `GET /poll-history` - Get all past polls

### Socket.IO Events

#### Client to Server
- `joinRoom` - User joins the polling room
- `createPoll` - Teacher creates a new poll
- `submitAnswer` - Student submits an answer
- `kickStudent` - Teacher kicks a student
- `endPoll` - Teacher ends current poll
- `chatMessage` - Send chat message

#### Server to Client
- `pollCreated` - New poll created
- `pollResults` - Updated poll results
- `kickedOut` - Student kicked notification
- `pollEnded` - Poll ended notification
- `chatMessage` - Chat message broadcast

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   Or start the production server:
   ```bash
   npm start
   ```

4. The server will run on `http://localhost:3000`

## Usage

1. Start the backend server
2. Start the frontend application
3. The frontend will automatically connect to the backend
4. Teachers can create polls and students can join and vote

## Environment Variables

Create a `.env` file for custom configuration:

```
PORT=3000
NODE_ENV=development
```

## Data Storage

Currently uses in-memory storage. For production, consider integrating with:
- MongoDB
- PostgreSQL
- Redis for session management