# Real-Time Polling Application Backend

A Node.js backend service for a real-time polling application using Express.js, PostgreSQL, Prisma ORM, and WebSockets with Socket.io.

## Features

- User Management: Create users, retrieve user details
- Poll Management: Create polls with multiple options, retrieve polls
- Voting System: Vote on poll options with duplicate prevention
- Real-time Updates: WebSocket events for live poll results
- Authentication: JWT-based authentication

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Socket.io
- JWT for authentication
- bcrypt for password hashing

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose (for PostgreSQL)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd voting
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   docker-compose up -d
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

6. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:3000`.

## API Endpoints

### Users

- `POST /users` - Create a new user
- `GET /users/:id` - Get user by ID
- `POST /users/login` - Login user

### Polls

- `POST /polls` - Create a new poll (requires auth)
- `GET /polls` - Get all polls
- `GET /polls/:id` - Get poll by ID
- `PUT /polls/:id/publish` - Publish a poll (requires auth)
- `POST /polls/:id/vote` - Vote on a poll option (requires auth)

## WebSocket Events

### Client Events

- `join_poll` - Join a poll room
  ```javascript
  socket.emit('join_poll', pollId);
  ```

### Server Events

- `vote_cast` - Broadcast updated vote counts
  ```javascript
  socket.on('vote_cast', (data) => {
    console.log(data.pollId, data.voteCounts);
  });
  ```

## Environment Variables

Create a `.env` file in the root directory:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/voting?schema=public"
JWT_SECRET=your_super_secret_jwt_key_here
PORT=3000
```

## Database Schema

The application uses Prisma ORM with the following models:

- **User**: id, name, email, passwordHash, createdAt, updatedAt
- **Poll**: id, question, isPublished, createdAt, updatedAt, userId
- **PollOption**: id, text, pollId
- **Vote**: id, userId, pollOptionId, createdAt

Relationships:
- User → Poll (1:many)
- Poll → PollOption (1:many)
- User ↔ PollOption (many:many via Vote)

## Testing the API

You can use tools like Postman or curl to test the endpoints.

Example: Create a user
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'
```

## Running with Docker

To run the entire application with Docker:

1. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

This will start both the PostgreSQL database and the Node.js application.

## License

ISC