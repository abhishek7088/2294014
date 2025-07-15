// test/auth.test.js
const { authenticate } = require('../src/utils/auth');
const axios = require('axios');
process.env.NODE_ENV = 'test';

jest.mock('axios');

describe('Authentication Module', () => {
  const mockToken = 'mock-token-123';
  
  beforeEach(() => {
    // Clear all mocks between tests
    jest.clearAllMocks();
    
    // Mock logger to prevent real API calls
    jest.mock('../src/utils/logger', () => ({
      log: jest.fn(),
      setAuthToken: jest.fn()
    }));
  });

  test('should successfully authenticate with valid credentials', async () => {
    // Mock successful response
    axios.post.mockResolvedValueOnce({
      data: {
        access_token: mockToken,
        token_type: "Bearer",
        expires_in: 3600
      }
    });

    const token = await authenticate();
    expect(token).toBe(mockToken);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  test('should reject with 400 for invalid credentials', async () => {
    // Mock failed response
    axios.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          message: "Invalid credentials"
        }
      }
    });

    await expect(authenticate()).rejects.toThrow("Invalid credentials");
  });

  test('should handle network errors', async () => {
    axios.post.mockRejectedValueOnce(new Error("Network Error"));
    await expect(authenticate()).rejects.toThrow("Network Error");
  });
});