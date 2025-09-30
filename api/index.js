const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Configure CORS for Express
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || "*"]
    : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));

app.use(express.json());

// In-memory storage (in production, use a database)
let polls = [];
let pollResults = {};
let connectedUsers = {};
let currentPoll = null;

// REST API endpoints
app.get('/', (req, res) => {
  res.json({ message: 'Intervue Quiz Backend Server is running on Vercel!' });
});

// Teacher login endpoint
app.post('/teacher-login', (req, res) => {
  const teacherId = uuidv4();
  const username = `teacher_${teacherId.slice(0, 8)}`;
  
  res.json({
    success: true,
    username: username,
    role: 'teacher',
    message: 'Teacher logged in successfully'
  });
});

// Get poll history
app.get('/poll-history', (req, res) => {
  res.json({
    success: true,
    polls: polls
  });
});

// For Vercel, we need to handle Socket.IO differently
if (process.env.NODE_ENV !== 'production') {
  // Development mode - full Socket.IO
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user joining
    socket.on('joinRoom', (userData) => {
      connectedUsers[socket.id] = userData;
      console.log(`${userData.username} joined as ${userData.role}`);
      
      // Send current poll to newly joined student
      if (userData.role === 'student' && currentPoll) {
        socket.emit('pollCreated', currentPoll);
        socket.emit('pollResults', pollResults[currentPoll._id] || {});
      }

      // Emit updated participants list to all clients with display names
      const participants = Object.values(connectedUsers).map(user => ({
        ...user,
        displayName: user.role === 'teacher' ? 'Teacher' : user.username
      }));
      io.emit('participantsUpdate', participants);
    });

    // Handle poll creation (from teacher)
    socket.on('createPoll', (pollData) => {
      console.log('Creating poll:', pollData);
      
      const poll = {
        _id: uuidv4(),
        question: pollData.question,
        options: pollData.options,
        timer: parseInt(pollData.timer),
        teacherUsername: pollData.teacherUsername,
        createdAt: new Date(),
        isActive: true,
        results: {}
      };

      // Initialize poll results
      pollResults[poll._id] = {};
      poll.options.forEach(option => {
        pollResults[poll._id][option.text] = 0;
        poll.results[option.text] = 0;
      });

      // Store poll
      polls.push(poll);
      currentPoll = poll;

      // Broadcast poll to all connected clients
      io.emit('pollCreated', poll);
      io.emit('pollResults', pollResults[poll._id]);
      
      console.log('Poll created and broadcasted:', poll._id);
    });

    // Handle answer submission (from student)
    socket.on('submitAnswer', (answerData) => {
      console.log('Answer submitted:', answerData);
      
      if (currentPoll && pollResults[answerData.pollId]) {
        // Increment vote count
        if (pollResults[answerData.pollId][answerData.option] !== undefined) {
          pollResults[answerData.pollId][answerData.option]++;
          
          // Update the stored poll results
          const pollIndex = polls.findIndex(p => p._id === answerData.pollId);
          if (pollIndex !== -1) {
            polls[pollIndex].results[answerData.option]++;
          }
          
          // Broadcast updated results to all clients
          io.emit('pollResults', pollResults[answerData.pollId]);
          
          console.log('Updated poll results:', pollResults[answerData.pollId]);
        }
      }
    });

    // Handle student kick (from teacher)
    socket.on('kickStudent', (studentData) => {
      console.log('Kicking student:', studentData);
      
      // Find the student's socket and kick them
      Object.keys(connectedUsers).forEach(socketId => {
        if (connectedUsers[socketId].username === studentData.username) {
          io.to(socketId).emit('kickedOut');
          console.log(`Student ${studentData.username} kicked out`);
          
          // Remove the student from connectedUsers immediately
          delete connectedUsers[socketId];
        }
      });

      // Emit updated participants list after removing the kicked student
      const participants = Object.values(connectedUsers).map(user => ({
        ...user,
        displayName: user.role === 'teacher' ? 'Teacher' : user.username
      }));
      io.emit('participantsUpdate', participants);
    });

    // Handle poll end (from teacher)
    socket.on('endPoll', () => {
      if (currentPoll) {
        currentPoll.isActive = false;
        io.emit('pollEnded');
        console.log('Poll ended:', currentPoll._id);
      }
    });

    // Handle chat messages
    socket.on('chatMessage', (messageData) => {
      console.log('Chat message:', messageData);
      
      // Get user data to determine display name
      const userData = connectedUsers[socket.id];
      const displayName = userData && userData.role === 'teacher' ? 'Teacher' : messageData.user;
      
      io.emit('chatMessage', {
        ...messageData,
        originalUser: messageData.user, // Keep original username for "You" identification
        user: displayName,
        timestamp: new Date()
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      delete connectedUsers[socket.id];
      
      // Emit updated participants list to all clients with display names
      const participants = Object.values(connectedUsers).map(user => ({
        ...user,
        displayName: user.role === 'teacher' ? 'Teacher' : user.username
      }));
      io.emit('participantsUpdate', participants);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.IO server ready for connections`);
  });
}

module.exports = app;