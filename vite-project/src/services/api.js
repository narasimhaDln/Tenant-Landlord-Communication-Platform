import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Check if we should use mock data (when backend is not available)
const USE_MOCK_DATA = true;

// Mock data for maintenance requests
const MOCK_MAINTENANCE_REQUESTS = [
  {
    _id: '1',
    title: 'Leaking Faucet',
    description: 'The kitchen faucet is leaking and needs repair',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    location: 'Kitchen',
    category: 'plumbing'
  },
  {
    _id: '2',
    title: 'Broken Window',
    description: 'The window in the living room is cracked and needs to be replaced',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    location: 'Living Room',
    category: 'structural'
  },
  {
    _id: '3',
    title: 'AC Not Working',
    description: 'The air conditioner is not cooling properly',
    status: 'completed',
    priority: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    location: 'Entire Unit',
    category: 'hvac'
  }
];

// Mock user credentials for login
const MOCK_USERS = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    id: 'admin-1',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    email: 'tenant@example.com',
    password: 'tenant123',
    id: 'tenant-1',
    name: 'Tenant User',
    role: 'tenant',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    email: 'owner@example.com',
    password: 'owner123',
    id: 'owner-1',
    name: 'Property Owner',
    role: 'owner',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
  }
];

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

// Auth services
export const auth = {
  login: async (credentials) => {
    if (USE_MOCK_DATA) {
      // Check if the credentials match any of our mock users
      const matchedUser = MOCK_USERS.find(
        user => user.email === credentials.email && user.password === credentials.password
      );
      
      if (matchedUser) {
        // Return the matched user (without the password)
        const { password, ...userWithoutPassword } = matchedUser;
        
        return mockResponse({
          token: `mock-jwt-token-${matchedUser.role}-${Date.now()}`,
          user: userWithoutPassword
        });
      }
      
      // For demo purposes, allow any login but default to tenant role if no match
      // This makes testing easier while still allowing specific role testing with known credentials
      const mockUser = {
        id: Date.now().toString(),
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: 'tenant',
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50) + 1}.jpg`
      };
      
      // Simulate API delay
      return mockResponse({
        token: 'mock-jwt-token-tenant-' + Date.now(),
        user: mockUser
      });
    }
    
    return api.post('/auth/login', credentials);
  },
  register: async (userData) => {
    if (USE_MOCK_DATA) {
      // Create mock user from registration data
      const mockUser = {
        id: Date.now().toString(),
        name: userData.name || userData.email.split('@')[0],
        email: userData.email,
        role: userData.role || 'tenant', // Default to tenant if no role provided
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50) + 1}.jpg`
      };
      
      // Simulate API delay
      return mockResponse({
        token: `mock-jwt-token-${mockUser.role}-${Date.now()}`,
        user: mockUser
      });
    }
    return api.post('/auth/register', userData);
  }
};

// Helper function to simulate API response
const mockResponse = (data, delay = 500) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });
};

// Maintenance services with mock data fallback
export const maintenance = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      // Try to get data from localStorage first
      const savedRequests = localStorage.getItem('maintenanceRequests');
      if (savedRequests) {
        try {
          const parsedRequests = JSON.parse(savedRequests);
          // If we have saved requests, use those instead of mock data
          if (parsedRequests && parsedRequests.length > 0) {
            return mockResponse(parsedRequests);
          }
        } catch (err) {
          console.error('Error parsing saved maintenance requests:', err);
        }
      }
      
      // If no saved requests, return mock data
      return mockResponse(MOCK_MAINTENANCE_REQUESTS);
    }
    try {
      return await api.get('/maintenance');
    } catch (error) {
      console.warn('API call failed, using mock data instead');
      return mockResponse(MOCK_MAINTENANCE_REQUESTS);
    }
  },
  create: async (data) => {
    if (USE_MOCK_DATA) {
      const newRequest = {
        ...data,
        _id: `maintenance-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to the beginning of the mock data array
      MOCK_MAINTENANCE_REQUESTS.unshift(newRequest);
      
      // Also update localStorage for persistence
      try {
        const savedRequests = localStorage.getItem('maintenanceRequests');
        let requestsArray = savedRequests ? JSON.parse(savedRequests) : [];
        requestsArray.unshift(newRequest);
        localStorage.setItem('maintenanceRequests', JSON.stringify(requestsArray));
      } catch (err) {
        console.error('Error updating localStorage with new request:', err);
      }
      
      return mockResponse(newRequest);
    }
    return api.post('/maintenance', data);
  },
  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      const index = MOCK_MAINTENANCE_REQUESTS.findIndex(req => req._id === id);
      if (index >= 0) {
        MOCK_MAINTENANCE_REQUESTS[index] = { 
          ...MOCK_MAINTENANCE_REQUESTS[index], 
          ...data,
          updatedAt: new Date().toISOString()
        };
        
        // Also update localStorage for persistence
        try {
          const savedRequests = localStorage.getItem('maintenanceRequests');
          if (savedRequests) {
            let requestsArray = JSON.parse(savedRequests);
            const localIndex = requestsArray.findIndex(req => req._id === id);
            if (localIndex >= 0) {
              requestsArray[localIndex] = { 
                ...requestsArray[localIndex], 
                ...data,
                updatedAt: new Date().toISOString()
              };
              localStorage.setItem('maintenanceRequests', JSON.stringify(requestsArray));
            }
          }
        } catch (err) {
          console.error('Error updating localStorage with updated request:', err);
        }
        
        return mockResponse(MOCK_MAINTENANCE_REQUESTS[index]);
      }
      return Promise.reject({ message: 'Request not found' });
    }
    return api.put(`/maintenance/${id}`, data);
  },
  deleteOne: async (id) => {
    if (USE_MOCK_DATA) {
      const index = MOCK_MAINTENANCE_REQUESTS.findIndex(req => req._id === id);
      if (index >= 0) {
        MOCK_MAINTENANCE_REQUESTS.splice(index, 1);
        
        // Also update localStorage for persistence
        try {
          const savedRequests = localStorage.getItem('maintenanceRequests');
          if (savedRequests) {
            let requestsArray = JSON.parse(savedRequests);
            requestsArray = requestsArray.filter(req => req._id !== id);
            localStorage.setItem('maintenanceRequests', JSON.stringify(requestsArray));
          }
        } catch (err) {
          console.error('Error updating localStorage after deleting request:', err);
        }
        
        return mockResponse({ success: true, message: 'Request deleted successfully' });
      }
      return Promise.reject({ message: 'Request not found' });
    }
    try {
      const response = await api.delete(`/maintenance/${id}`);
      return response;
    } catch (error) {
      console.error('Delete request failed:', error);
      throw error;
    }
  }
};

export default api; 