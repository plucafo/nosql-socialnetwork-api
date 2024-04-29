# NoSQL Social Network API

This is a simple CRUD (Create, Read, Update, Delete) API for a social network backend. The API is built with Node.js, Express.js, and Mongoose, and it allows you to manage users, thoughts, reactions, and a friends list.

- [Github Repo](https://github.com/plucafo/nosql-socialnetwork-api)

- [Demo Video](https://www.google.com)

## Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/plucafo/nosql-socialnetwork-api.git
   cd nosql-socialnetwork-api
2. **Install Dependencies**
   ```bash
   npm install
3. **Set Environment Variables**
   - Create a '.env' file in the root directory.
   - Define environment variables
4. **Start the Server**
   ```bash
   npm start

## API Endpoints

### Users

- **GET /api/users**: Get all users.
- **GET /api/users/:id**: Get a single user by ID.
- **POST /api/users**: Create a new user.
- **POST /api/users/:userId/friends/:friendId**: Add a friend to a user.
- **DELETE /api/users/:id**: Delete a user by ID.
- **DELETE /api/users/:userId/friends/:friendId**: Delete a single friend from a user.
- **DELETE /api/users/:userId/friends**: Delete all friends from a user.

### Thoughts

- **GET /api/thoughts**: Get all thoughts.
- **GET /api/thoughts/:id**: Get a single thought by ID.
- **POST /api/thoughts**: Create a new thought.
- **PUT /api/thoughts/:id**: Update a thought by ID.
- **DELETE /api/thoughts/:id**: Delete a thought by ID.
- **POST /api/thoughts/:thoughtId/reactions**: Add a reaction to a thought.
- **DELETE /api/thoughts/:thoughtId/reactions/:reactionId**: Delete a reaction from a thought.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose

## Contributors

- [plucafo](https://github.com/plucafo)