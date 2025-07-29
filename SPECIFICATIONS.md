# Todo Application Specifications

## Overview
This document serves as the technical specification and coding standards reference for the collaborative todo application. All code should adhere to these standards and specifications.

## Database Structure

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

### Todo Lists Table
```sql
CREATE TABLE todo_lists (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  owner_id INT NOT NULL,
  color VARCHAR(7) DEFAULT '#3498db', -- Hex color code
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Todo Items Table
```sql
CREATE TABLE todo_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  list_id INT NOT NULL,
  assigned_to INT, -- User ID of assigned user
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  due_date DATETIME,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  position INT DEFAULT 0, -- For ordering items within a list
  FOREIGN KEY (list_id) REFERENCES todo_lists(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);
```

### List Collaborators Table (Many-to-Many relationship)
```sql
CREATE TABLE list_collaborators (
  id INT PRIMARY KEY AUTO_INCREMENT,
  list_id INT NOT NULL,
  user_id INT NOT NULL,
  permission ENUM('view', 'edit', 'admin') DEFAULT 'edit',
  invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP NULL,
  FOREIGN KEY (list_id) REFERENCES todo_lists(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_list_user (list_id, user_id)
);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## API Specifications

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Todo List Endpoints
- `GET /api/lists` - Get user's todo lists
- `POST /api/lists` - Create new todo list
- `GET /api/lists/:id` - Get specific todo list with items
- `PUT /api/lists/:id` - Update todo list
- `DELETE /api/lists/:id` - Delete todo list
- `POST /api/lists/:id/share` - Share list with user
- `DELETE /api/lists/:id/collaborators/:userId` - Remove collaborator

### Todo Item Endpoints
- `GET /api/lists/:listId/items` - Get items in a list
- `POST /api/lists/:listId/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `PATCH /api/items/:id/status` - Update item status
- `PATCH /api/items/:id/assign` - Assign item to user

### User Management Endpoints
- `GET /api/users/search` - Search users for sharing
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Clean Code Principles

### General Guidelines
1. **Meaningful Names**: Use descriptive and pronounceable names for variables, functions, and classes
2. **Small Functions**: Functions should do one thing and do it well (max 20-30 lines)
3. **Single Responsibility**: Each class/module should have only one reason to change
4. **DRY Principle**: Don't Repeat Yourself - extract common functionality
5. **Error Handling**: Use proper error handling, don't ignore exceptions
6. **Comments**: Code should be self-explanatory, use comments only when necessary

### Naming Conventions

#### Backend (JavaScript/Node.js)
- **Variables/Functions**: camelCase (`getUserById`, `todoItems`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ITEMS_PER_LIST`, `DEFAULT_PAGE_SIZE`)
- **Classes**: PascalCase (`TodoList`, `UserController`)
- **Files**: camelCase (`todoController.js`, `userModel.js`)
- **Database fields**: snake_case (`created_at`, `user_id`)

#### Frontend (Vue.js)
- **Components**: PascalCase (`TodoList.vue`, `UserAuth.vue`)
- **Variables/Functions**: camelCase (`isLoading`, `fetchTodos`)
- **Props**: camelCase (`todoItems`, `isVisible`)
- **Events**: kebab-case (`todo-updated`, `user-logged-in`)

### File Organization
```
src/
├── controllers/     # Business logic controllers
├── models/         # Database models
├── services/       # Business services (reusable logic)
├── middleware/     # Express middleware
├── utils/          # Utility functions
├── validators/     # Input validation schemas
├── config/         # Configuration files
└── tests/          # Test files
```

## JSDoc Documentation Standards

### Function Documentation
```javascript
/**
 * Creates a new todo item in the specified list
 * @param {Object} itemData - The todo item data
 * @param {string} itemData.title - The title of the todo item
 * @param {string} [itemData.description] - The optional description
 * @param {number} itemData.listId - The ID of the parent todo list
 * @param {number} [itemData.assignedTo] - The ID of the assigned user
 * @param {string} [itemData.priority='medium'] - The priority level
 * @param {Date} [itemData.dueDate] - The due date
 * @returns {Promise<Object>} The created todo item
 * @throws {ValidationError} When required fields are missing
 * @throws {NotFoundError} When the list doesn't exist
 * @example
 * const item = await createTodoItem({
 *   title: 'Buy groceries',
 *   description: 'Milk, bread, eggs',
 *   listId: 123,
 *   priority: 'high'
 * });
 */
async function createTodoItem(itemData) {
  // Implementation
}
```

### Class Documentation
```javascript
/**
 * Represents a Todo List with items and collaborators
 * @class
 */
class TodoList {
  /**
   * Creates a TodoList instance
   * @param {Object} data - The list data
   * @param {string} data.title - The list title
   * @param {number} data.ownerId - The owner's user ID
   * @param {string} [data.description] - Optional description
   */
  constructor(data) {
    // Implementation
  }

  /**
   * Adds a collaborator to the list
   * @param {number} userId - The user ID to add
   * @param {string} [permission='edit'] - The permission level
   * @returns {Promise<boolean>} Success status
   */
  async addCollaborator(userId, permission = 'edit') {
    // Implementation
  }
}
```

### Vue Component Documentation
```javascript
/**
 * TodoItem Component - Displays and manages a single todo item
 * @vue-component
 * @example
 * <TodoItem
 *   :item="todoItem"
 *   :editable="true"
 *   @update="handleUpdate"
 *   @delete="handleDelete"
 * />
 */
export default {
  name: 'TodoItem',
  props: {
    /**
     * The todo item object
     * @type {Object}
     * @required
     */
    item: {
      type: Object,
      required: true
    },
    /**
     * Whether the item can be edited
     * @type {boolean}
     * @default false
     */
    editable: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    /**
     * Emitted when item is updated
     * @param {Object} item - The updated item
     */
    update: (item) => true,
    /**
     * Emitted when item is deleted
     * @param {number} itemId - The deleted item ID
     */
    delete: (itemId) => typeof itemId === 'number'
  }
}
```

## Error Handling Standards

### Backend Error Classes
```javascript
/**
 * Base application error class
 * @extends Error
 */
class AppError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {boolean} isOperational - Whether error is operational
   */
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error for invalid input
 * @extends AppError
 */
class ValidationError extends AppError {
  constructor(message, details = {}) {
    super(message, 400);
    this.details = details;
  }
}
```

### Error Response Format
```javascript
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "title": "Title is required",
      "dueDate": "Due date must be in the future"
    }
  }
}
```

## Testing Standards

### Test File Naming
- Unit tests: `*.test.js`
- Integration tests: `*.integration.test.js`
- E2E tests: `*.e2e.test.js`

### Test Structure
```javascript
/**
 * @fileoverview Tests for TodoController
 */
describe('TodoController', () => {
  describe('createTodoItem', () => {
    it('should create a todo item with valid data', async () => {
      // Arrange
      const itemData = { title: 'Test item', listId: 1 };
      
      // Act
      const result = await todoController.createTodoItem(itemData);
      
      // Assert
      expect(result).toHaveProperty('id');
      expect(result.title).toBe('Test item');
    });

    it('should throw ValidationError for missing title', async () => {
      // Arrange
      const itemData = { listId: 1 };
      
      // Act & Assert
      await expect(todoController.createTodoItem(itemData))
        .rejects
        .toThrow(ValidationError);
    });
  });
});
```

## Security Guidelines

### Authentication
- Use bcrypt for password hashing (min 12 rounds)
- Implement session-based authentication
- Session expiration: 24 hours for regular users
- Use secure, httpOnly cookies for session storage

### Input Validation
- Validate all input on both client and server side
- Use parameterized queries to prevent SQL injection
- Sanitize HTML input to prevent XSS
- Implement rate limiting on API endpoints

### Authorization
- Check user permissions for every operation
- List owners can: edit, delete, share lists
- Collaborators can: view/edit based on permission level
- Users can only access their own data or shared lists

## Performance Guidelines

### Database
- Use indexes on frequently queried columns
- Implement pagination for list queries (default: 20 items per page)
- Use database transactions for multi-table operations
- Implement soft deletes for important data

### API
- Implement response caching where appropriate
- Use compression middleware
- Limit payload sizes (max 10MB for file uploads)
- Implement request/response logging

### Frontend
- Implement lazy loading for components
- Use Vue's built-in performance optimizations
- Minimize bundle size with tree shaking
- Implement proper loading states

## Environment Configuration

### Required Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todoapp
DB_USER=todouser
DB_PASSWORD=secure_password

# Application
NODE_ENV=development
PORT=3000
SESSION_SECRET=your_session_secret
CORS_ORIGIN=http://localhost:8080

# Security
BCRYPT_ROUNDS=12
SESSION_EXPIRES=86400000
```

This specification document should be referenced for all development work to ensure consistency and quality across the application.
