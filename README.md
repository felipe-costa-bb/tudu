# TuDu - Collaborative Todo List Application

A modern, collaborative todo list application built with Vue.js, Node.js, Express, MySQL, and Docker.

## Features

- **User Authentication**: Secure login and registration system
- **Collaborative Lists**: Share todo lists with other users
- **Real-time Updates**: Changes are reflected immediately
- **Modern UI**: Built with Vue 3, Vite, and Tailwind CSS
- **Dockerized**: Easy deployment with Docker Compose

## Technology Stack

### Frontend
- Vue.js 3.3.4
- Vite 4.5.14
- Pinia (State Management)
- Tailwind CSS 3.3.0
- Vue Router

### Backend
- Node.js with Express.js
- MySQL 8.0 with Sequelize ORM
- JWT Authentication
- bcryptjs for password hashing

### DevOps
- Docker & Docker Compose
- Hot reload for development

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd tudu
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your actual values:
   ```env
   DB_HOST=mysql
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_secure_password_here
   DB_NAME=todo_app
   SESSION_SECRET=your_super_secret_jwt_key_change_this_in_production
   NODE_ENV=development
   PORT=3001
   VITE_API_URL=http://localhost:3001/api
   ```

3. **Start the application**
   ```bash
   docker compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3001

### Development

#### Running without Docker

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

#### Project Structure

```
tudu/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # Express routes
│   │   ├── middleware/      # Authentication middleware
│   │   └── config/          # Database configuration
│   ├── Dockerfile
│   └── package.json
├── frontend/                # Vue.js frontend
│   ├── src/
│   │   ├── components/      # Vue components
│   │   ├── views/           # Page components
│   │   ├── stores/          # Pinia stores
│   │   ├── services/        # API services
│   │   └── router/          # Vue Router config
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml       # Development configuration
├── docker-compose.prod.yml  # Production configuration
└── .env.example            # Environment variables template
```

## Security Features

- **Environment Variables**: All sensitive data is stored in environment variables
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Todo Lists Endpoints
- `GET /api/todos` - Get user's todo lists
- `POST /api/todos` - Create new todo list
- `DELETE /api/todos/:id` - Delete todo list
- `POST /api/todos/:id/share` - Share todo list

### Todo Items Endpoints
- `POST /api/todos/:listId/items` - Add item to list
- `PUT /api/todos/:listId/items/:itemId` - Update item
- `DELETE /api/todos/:listId/items/:itemId` - Delete item

## Deployment

### Production Deployment

1. **Set production environment variables**
   ```bash
   cp .env.example .env.production
   # Edit with production values
   ```

2. **Deploy with production compose**
   ```bash
   docker compose -f docker-compose.prod.yml up --build -d
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

---

**Note**: This project uses Tailwind CSS for styling. All design components follow the established design system documented in the codebase.