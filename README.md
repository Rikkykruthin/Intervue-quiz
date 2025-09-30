# Intervue Quiz

A real-time interactive quiz application built with React and Node.js, featuring live polling, chat functionality, and teacher-student interaction capabilities.

## 🚀 Features

### Teacher Features
- **Quiz Management**: Create and manage interactive quizzes with multiple choice questions
- **Real-time Results**: View live voting results as students participate
- **Student Management**: Monitor participants and remove disruptive students
- **Quiz History**: Access and review past quiz sessions and results
- **Live Chat**: Communicate with students during quiz sessions

### Student Features
- **Easy Join**: Simple username-based entry to quiz rooms
- **Real-time Voting**: Submit answers and see live participation
- **Interactive Chat**: Engage with teachers and peers during quizzes
- **Instant Feedback**: View results immediately after voting
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Bootstrap 5** - Responsive CSS framework
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd intervue-quiz
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_NODE_ENV=development
   VITE_API_BASE_URL=http://localhost:3000
   ```

   Create a `.env` file in the backend directory:
   ```env
   PORT=3000
   NODE_ENV=development
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:3000`

2. **Start the Frontend Application**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Production Build

1. **Build the Frontend**
   ```bash
   npm run build
   ```

2. **Preview the Build**
   ```bash
   npm run preview
   ```

## 📱 Usage Guide

### For Teachers

1. **Login**: Access the teacher dashboard with authentication
2. **Create Quiz**: Set up questions with multiple choice options
3. **Start Session**: Launch the quiz and share the room with students
4. **Monitor Progress**: Watch real-time results and manage participants
5. **End Session**: Close the quiz and review final results
6. **View History**: Access past quiz sessions and analytics

### For Students

1. **Join Room**: Enter your username to join an active quiz
2. **Participate**: Answer questions as they appear
3. **Chat**: Use the chat feature to communicate during the session
4. **View Results**: See live results after submitting answers

## 🏗️ Project Structure

```
intervue-quiz/
├── src/
│   ├── components/
│   │   ├── chat/           # Chat functionality
│   │   └── route-protect/  # Route protection
│   ├── Pages/
│   │   ├── student-poll/   # Student quiz interface
│   │   ├── teacher-poll/   # Teacher quiz management
│   │   ├── poll-history/   # Quiz history view
│   │   ├── kicked-out/     # Removed student page
│   │   └── student-landing/ # Student entry page
│   ├── assets/             # Images and static files
│   └── utils/              # Utility functions
├── backend/
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── public/                 # Static assets
└── package.json            # Frontend dependencies
```

## 🔧 API Documentation

### REST Endpoints
- `GET /` - Health check
- `POST /teacher-login` - Teacher authentication
- `GET /poll-history` - Retrieve quiz history

### Socket.IO Events

#### Client → Server
- `joinRoom` - Join quiz room
- `createPoll` - Create new quiz
- `submitAnswer` - Submit quiz answer
- `kickStudent` - Remove student (teacher only)
- `endPoll` - End quiz session
- `chatMessage` - Send chat message

#### Server → Client
- `pollCreated` - New quiz created
- `pollResults` - Updated results
- `kickedOut` - Student removal notification
- `pollEnded` - Quiz ended
- `chatMessage` - Chat message broadcast

## 🎨 Customization

The application uses Times New Roman font family and a purple color scheme (#5767D0). You can customize the appearance by modifying:

- `src/App.css` - Global styles
- Component-specific CSS files
- Bootstrap theme variables

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for production

### Backend Deployment (Heroku/Railway)
1. Deploy the `backend` folder
2. Set environment variables
3. Update CORS settings for your frontend domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Socket connection failed**: Ensure backend server is running on port 3000
2. **CORS errors**: Check CORS configuration in backend server
3. **Build errors**: Clear node_modules and reinstall dependencies
4. **Real-time features not working**: Verify Socket.IO client/server versions match

### Support

For issues and questions, please create an issue in the GitHub repository.

---

Built with ❤️ for interactive learning experiences