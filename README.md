# Constitutional Learning Platform

An interactive, gamified web application for learning constitutional laws in a fun and engaging way.

## Features

- **Authentication**: Secure user login/signup system
- **Dashboard**: Track progress and achievements
- **Learning Modules**: Gamified learning activities and quizzes
- **Country Selector**: Learn about constitutions from different countries
- **Interactive UI**: Dark theme with animations and responsive design

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Setup environment variables:
   Create `.env` files in both client and server directories based on the provided examples.

4. Run the development servers:
   ```
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd ../client
   npm start
   ```

## Project Structure

- `/client` - React frontend application
- `/server` - Node.js/Express backend API 