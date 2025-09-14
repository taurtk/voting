const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/users');
const pollRoutes = require('./routes/polls');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/polls', pollRoutes);

// Socket.io handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_poll', (pollId) => {
    socket.join(pollId);
    console.log(`User ${socket.id} joined poll ${pollId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Function to emit vote updates
const emitVoteUpdate = (pollId, voteCounts) => {
  io.to(pollId).emit('vote_cast', { pollId, voteCounts });
};

module.exports = { server, emitVoteUpdate };

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});