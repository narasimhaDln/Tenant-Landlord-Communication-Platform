// API Service Implementation
const API_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseUrl = API_URL;
  }

  // Helper method to get auth headers
  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  // Generic request method
  async request(endpoint, method = 'GET', data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: this.getHeaders(),
      credentials: 'include'
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      // For development, simulate API responses
      if (endpoint.includes('/chat/contacts')) {
        return await this.mockGetContacts();
      }
      
      if (endpoint.includes('/chat/messages')) {
        const contactId = endpoint.split('/').pop();
        return await this.mockGetMessages(contactId);
      }
      
      console.log(`Making API request to ${url}`);
      return { status: 'success', message: 'API request simulated' };
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Mock API methods
  async mockGetContacts() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 'contact-1',
        name: 'John Smith',
        role: 'Tenant',
        isOnline: true,
        lastMessage: 'When will the maintenance be finished?',
        time: '10:24 AM',
        unread: 1
      },
      {
        id: 'contact-2',
        name: 'Sarah Johnson',
        role: 'Property Owner',
        isOnline: false,
        lastMessage: 'Please send me the latest reports',
        time: 'Yesterday',
        unread: 0
      },
      {
        id: 'ai-assistant',
        name: 'Property Assistant',
        isAI: true,
        lastMessage: 'How can I help you today?',
        time: '2:15 PM',
        unread: 0
      }
    ];
  }

  async mockGetMessages(contactId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const mockMessages = {
      'contact-1': [
        {
          id: 'msg-1-1',
          senderId: 'contact-1',
          text: 'Hello, I have a question about my apartment',
          timestamp: Date.now() - 3600000
        },
        {
          id: 'msg-1-2',
          senderId: 'currentUser',
          text: 'Of course, how can I help you?',
          timestamp: Date.now() - 3000000
        }
      ],
      'contact-2': [
        {
          id: 'msg-2-1',
          senderId: 'currentUser',
          text: 'Hi Sarah, I\'ve prepared the monthly reports',
          timestamp: Date.now() - 86400000,
          status: 'read'
        }
      ],
      'ai-assistant': [
        {
          id: 'msg-3-1',
          senderId: 'ai-assistant',
          text: 'Hello! I\'m your property management assistant. How can I help you today?',
          timestamp: Date.now() - 7200000
        }
      ]
    };
    
    return mockMessages[contactId] || [];
  }

  // Chat related methods
  async getContacts() {
    return this.request('/chat/contacts');
  }

  async getMessages(contactId) {
    return this.request(`/chat/messages/${contactId}`);
  }

  async sendMessage(contactId, content, attachment = null) {
    const data = { contactId, content, attachment };
    return this.request('/chat/messages', 'POST', data);
  }

  async markMessagesAsRead(contactId) {
    return this.request(`/chat/messages/${contactId}/read`, 'POST');
  }

  async uploadAttachment(file) {
    console.log('Simulating file upload for', file.name);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: `file-${Date.now()}`,
      url: 'https://example.com/mock-file-url',
      name: file.name
    };
  }
}

// Create a singleton instance
const apiService = new ApiService();
export default apiService;
