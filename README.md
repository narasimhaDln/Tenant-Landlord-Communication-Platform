# PropConnect - Tenant-Landlord Communication Platform

## 🏢 Overview##

PropConnect is a comprehensive property management application designed to streamline communication between tenants and landlords. This full-stack React application provides a modern, responsive interface for managing maintenance requests, payments, scheduling, and messaging, all in one centralized platform.


![PropConnect Logo](https://i.imgur.com/q8WJn0t.png)

[![React](https://img.shields.io/badge/React-18.0.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-3.0.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-6.3.0-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Lucide](https://img.shields.io/badge/Lucide-0.94.0-000000?logo=lucide&logoColor=white)](https://lucide.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## ✨ Key Features

- **📱 Responsive Design**: Mobile-first approach ensuring seamless experience across all devices
- **🔒 Role-Based Authentication**: Separate interfaces for tenants, property owners, and admins
- **🔧 Maintenance Request Management**: Create, track, and update maintenance tickets
- **💸 Payment Processing**: View payment history and make secure rent payments
- **📅 Scheduling System**: Book and manage property-related appointments
- **💬 Real-time Messaging**: Direct communication between tenants and property managers
- **🔔 Smart Notifications**: Real-time alerts for maintenance updates, messages, and payments
- **🌓 Dark/Light Mode**: User preference-based theme switching

## 📸 Screenshots

<div align="center">
  <img src="https://i.imgur.com/8jNbEAs.png" alt="Dashboard" width="80%" />
  <p><em>Dashboard - Overview of tenant activities and notifications</em></p>
  <br/>
  
  <div style="display: flex; justify-content: space-between;">
    <div style="flex: 1; margin-right: 10px;">
      <img src="https://i.imgur.com/HzJzAT4.png" alt="Maintenance Requests" width="100%" />
      <p><em>Maintenance Request Management</em></p>
    </div>
    <div style="flex: 1; margin-left: 10px;">
      <img src="https://i.imgur.com/0jzlVfO.png" alt="Payment System" width="100%" />
      <p><em>Payment System Interface</em></p>
    </div>
  </div>
  <br/>
  
  <img src="https://i.imgur.com/ZA5SgWO.png" alt="Messaging" width="80%" />
  <p><em>Real-time Messaging Platform</em></p>
</div>

## 🛠️ Technical Implementation

### Frontend Architecture

- **React 18**: Leveraging the latest React features with functional components and hooks
- **Tailwind CSS**: Utility-first CSS framework for responsive, custom designs
- **React Router**: Client-side routing with protected and public routes
- **Context API**: Global state management for authentication, maintenance, and chat
- **React Hooks**: Custom hooks for reusable logic across components
- **Lucide React**: Lightweight icon library for modern UI elements

### Backend Architecture

- **MVC Pattern**: Clear separation of Model, View, and Controller layers
- **RESTful API Design**: Structured endpoints following REST principles
- **Middleware Pipeline**: Custom middleware for authentication, validation, and error handling
- **Data Validation**: Comprehensive request validation for enhanced security
- **Error Handling**: Global error handling with detailed error responses
- **API Documentation**: Swagger UI for interactive API documentation
- **Environment Configuration**: Separate development, testing, and production environments

### Backend Integration

- **Node.js & Express**: Fast, minimalist web framework for building the API
- **MongoDB**: NoSQL database for flexible data storage and retrieval
- **Mongoose**: Elegant MongoDB object modeling for Node.js
- **JWT Authentication**: Secure token-based authentication system
- **Socket.io**: Real-time bidirectional event-based communication
- **Bcrypt**: Secure password hashing and verification
- **Express Validator**: Server-side data validation
- **Multer**: File upload handling for property images and documents
- **Winston**: Advanced logging for debugging and monitoring
- **Helmet**: Security middleware to protect from common web vulnerabilities

### Performance Optimizations

- **Memoization**: Strategic use of `useMemo` and `useCallback` for performance
- **Lazy Loading**: Component-level code splitting
- **Debouncing**: Enhanced UX for search operations
- **Optimistic UI Updates**: Immediate feedback while processing background operations

## 📊 Project Structure

```
/tenant-landlord-communication-platform
├── /vite-project                    # Frontend Application
│   ├── /public                      # Static assets
│   ├── /src                         # Source code
│   │   ├── /components              # Reusable UI components
│   │   │   ├── /auth                # Authentication-related components
│   │   │   ├── /dashboard           # Dashboard widgets
│   │   │   └── /layout              # Structural components
│   │   ├── /context                 # React Context providers
│   │   ├── /pages                   # Main application views
│   │   ├── /services                # API integration & data handling
│   │   └── /index.css               # Global styles and Tailwind configuration
│   ├── /node_modules                # Frontend dependencies
│   ├── index.html                   # Entry HTML file
│   ├── package.json                 # Frontend project configuration
│   └── tailwind.config.js           # Tailwind CSS configuration
├── /server                          # Backend Application
│   ├── /controllers                 # Request handlers and business logic
│   │   ├── authController.js        # Authentication logic
│   │   ├── userController.js        # User management
│   │   ├── maintenanceController.js # Maintenance request handling
│   │   └── messageController.js     # Chat message handling
│   ├── /models                      # Database models/schemas
│   │   ├── User.js                  # User model definition
│   │   ├── Property.js              # Property model definition
│   │   ├── Maintenance.js           # Maintenance request model
│   │   └── Message.js               # Chat message model
│   ├── /routes                      # API route definitions
│   │   ├── authRoutes.js            # Authentication endpoints
│   │   ├── userRoutes.js            # User management endpoints
│   │   ├── maintenanceRoutes.js     # Maintenance endpoints
│   │   └── messageRoutes.js         # Chat endpoints
│   ├── /middleware                  # Custom middleware functions
│   │   ├── auth.js                  # Authentication middleware
│   │   ├── error.js                 # Error handling middleware
│   │   └── validators.js            # Request validation middleware
│   ├── /config                      # Configuration files
│   │   ├── db.js                    # Database connection
│   │   ├── passport.js              # Authentication strategy
│   │   └── socket.js                # WebSocket configuration
│   ├── /utils                       # Helper functions
│   │   ├── logger.js                # Logging utility
│   │   └── validators.js            # Data validation helpers
│   ├── /node_modules                # Backend dependencies
│   ├── package.json                 # Backend project configuration
│   ├── server.js                    # Main server entry point
│   └── .env                         # Environment variables (not in repo)
├── README.md                        # Project documentation
├── package.json                     # Root project configuration
└── .gitignore                       # Git ignore configuration
```

## 🚀 Getting Started

1. Clone the repository
```bash
git clone https://github.com/narasimhaDln/Tenant-Landlord-Communication-Platform
cd tenant-landlord-communication-platform
```

2. Install dependencies
```bash
cd vite-project
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## 🔑 Authentication

The platform provides three user roles with dedicated access levels:

- **Tenant**: 
  - Email: tenant@example.com 
  - Password: tenant123
  - Features: Maintenance requests, payments, messaging

- **Property Owner**: 
  - Email: owner@example.com 
  - Password: owner123
  - Features: Tenant management, maintenance approval, payments

- **Administrator**: 
  - Email: admin@example.com 
  - Password: admin123
  - Features: Full system access, user management, analytics

## 📱 Responsive Design

The application implements a mobile-first approach with:

- Flexible layouts using Flexbox and CSS Grid
- Responsive breakpoints for all screen sizes
- Touch-friendly UI elements
- Optimized views for different device orientations

## 🔄 State Management

- **AuthContext**: Manages user authentication, login/logout, and user details
- **MaintenanceContext**: Handles maintenance request operations and state
- **ChatContext**: Controls messaging functionality and conversation state

## 💻 Code Sample

Below is a sample of how the application manages maintenance requests through React Context API, showcasing our approach to clean, maintainable code:

```jsx
This code sample demonstrates:

- **Reducer Pattern**: Organized state management with a reducer function
- **Context API**: Clean implementation of React's Context API
- **Custom Hooks**: Abstraction for reusable logic
- **Error Handling**: Proper error handling throughout operations
- **Local Storage**: Data persistence for the demo application
- **Immutable Updates**: Proper state updates maintaining immutability

## 🔌 API Endpoints

The backend provides a comprehensive RESTful API. Below are the key endpoints:

### Authentication Endpoints
```
POST   /api/auth/register         # User registration
POST   /api/auth/login            # User login
POST   /api/auth/logout           # User logout
GET    /api/auth/me               # Get current user
PUT    /api/auth/update-profile   # Update user profile
PUT    /api/auth/change-password  # Change password
```

### Property Management
```
GET    /api/properties            # Get all properties
GET    /api/properties/:id        # Get property by ID
POST   /api/properties            # Create property (admin/owner)
PUT    /api/properties/:id        # Update property
DELETE /api/properties/:id        # Delete property
```

### Maintenance Request Endpoints
```
GET    /api/maintenance           # Get all maintenance requests
GET    /api/maintenance/:id       # Get specific request
POST   /api/maintenance           # Create maintenance request
PUT    /api/maintenance/:id       # Update maintenance request
DELETE /api/maintenance/:id       # Delete maintenance request
```

### Messaging Endpoints
```
GET    /api/messages              # Get all conversations
GET    /api/messages/:id          # Get messages for a conversation
POST   /api/messages              # Send a new message
PUT    /api/messages/:id/read     # Mark message as read
DELETE /api/messages/:id          # Delete a message
```

### Payment Endpoints
```
GET    /api/payments              # Get payment history
GET    /api/payments/upcoming     # Get upcoming payments
POST   /api/payments              # Make a payment
GET    /api/payments/invoices/:id # Download invoice
```

### User Management Endpoints (Admin)
```
GET    /api/users                 # Get all users
GET    /api/users/:id             # Get user by ID
POST   /api/users                 # Create new user
PUT    /api/users/:id             # Update user
DELETE /api/users/:id             # Delete user
```

## 🧪 Testing

- Unit tests for critical components and functions
- Integration tests for complex user flows
- Accessibility testing with ARIA compliance
- Responsive design tests across multiple breakpoints

## 🛡️ Security Considerations

- JWT token validation and expiration
- Protected routes with authentication guards
- Form validation and sanitization
- Secure data handling practices
- Role-based access control

## 🔮 Future Enhancements

- Push notifications with service workers
- Payment gateway integration
- Document management for leases and agreements
- AI-powered chatbot for common inquiries
- Analytics dashboard for property performance

## 📝 Development Approach

This project follows modern React best practices including:

- Component-based architecture
- Custom hook abstractions
- Controlled form components
- Error boundary implementation
- Responsive design principles
- Accessibility-first development

## 🌐 Live Demo

Check out the live demo of PropConnect:

Credentials for testing:
- **Admin:** admin@example.com / admin123
- **Tenant:** tenant@example.com / tenant123
- **Owner:** owner@example.com / owner123

## 👨‍💻 Contributor

This project was developed as part of a constructive week challenge, demonstrating expertise in full-stack development with React and modern web technologies.

---

© 2024 PropConnect. All rights reserved.