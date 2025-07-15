// test/utils.test.js
const { log, setAuthToken } = require('../src/utils/logger');
const { generateShortCode } = require('../src/utils/shortcode');
const axios = require('axios');

jest.mock('axios');

describe('Utility Functions', () => {
  describe('Logger Module', () => {
    const mockToken = 'mock-token-123';
    
    beforeAll(() => {
      setAuthToken(mockToken);
    });

    test('should send valid log to API', async () => {
      axios.post.mockResolvedValue({
        data: {
          logID: 'log-123',
          message: 'log created successfully'
        }
      });

      await log('backend', 'info', 'auth', 'Test log message');
      
      expect(axios.post).toHaveBeenCalledWith(
        'http://20.244.56.144/evaluation-service/logs',
        {
          stack: 'backend',
          level: 'info',
          package: 'auth',
          message: 'Test log message'
        },
        {
          headers: {
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
    });

    test('should reject invalid log parameters', async () => {
      // Invalid package name
      await log('backend', 'info', 'invalid_package', 'Message');
      expect(axios.post).not.toHaveBeenCalled();

      // Invalid level
      await log('backend', 'invalid_level', 'auth', 'Message');
      expect(axios.post).not.toHaveBeenCalled();

      // Invalid stack
      await log('invalid_stack', 'info', 'auth', 'Message');
      expect(axios.post).not.toHaveBeenCalled();
    });

    test('should handle log API failures', async () => {
      axios.post.mockRejectedValue(new Error('Network error'));
      
      await log('backend', 'error', 'auth', 'Failed log');
      // Should not throw, just console.error
    });
  });

  describe('Shortcode Generator', () => {
    test('should generate 6-character code by default', () => {
      const code = generateShortCode();
      expect(code).toHaveLength(6);
      expect(code).toMatch(/^[a-zA-Z0-9]+$/);
    });

    test('should generate custom length codes', () => {
      const lengths = [4, 8, 10];
      lengths.forEach(len => {
        const code = generateShortCode(len);
        expect(code).toHaveLength(len);
        expect(code).toMatch(/^[a-zA-Z0-9]+$/);
      });
    });

    test('should only contain alphanumeric chars', () => {
      const code = generateShortCode();
      expect(code).toMatch(/^[a-zA-Z0-9]+$/);
    });

    test('should produce different codes on subsequent calls', () => {
      const code1 = generateShortCode();
      const code2 = generateShortCode();
      expect(code1).not.toBe(code2);
    });
  });
});