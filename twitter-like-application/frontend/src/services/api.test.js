import axios from 'axios';
import { 
  getPosts, 
  createPost, 
  getPostById, 
  deletePost, 
  getCurrentUser, 
  getUserByUsername, 
  getAllUsers, 
  getPublicStream 
} from './api';

// Mock axios
jest.mock('axios');
const mockAxios = axios;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    global.localStorage = localStorageMock;
    
    // Mock window.location
    delete window.location;
    window.location = { href: 'http://localhost:3000' };
  });

  describe('getPosts', () => {
    test('should fetch posts successfully', async () => {
      const mockResponse = {
        data: {
          posts: [
            { id: 1, content: 'Test post 1' },
            { id: 2, content: 'Test post 2' }
          ],
          lastUpdated: '2024-04-17T10:00:00Z'
        }
      };
      
      mockAxios.get.mockResolvedValue(mockResponse);
      
      const result = await getPosts();
      
      expect(mockAxios.get).toHaveBeenCalledWith('/posts');
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle API errors', async () => {
      const mockError = new Error('Network error');
      mockAxios.get.mockRejectedValue(mockError);
      
      await expect(getPosts()).rejects.toThrow('Network error');
      expect(mockAxios.get).toHaveBeenCalledWith('/posts');
    });
  });

  describe('createPost', () => {
    test('should create post successfully', async () => {
      const postData = { content: 'New test post' };
      const token = 'mock-jwt-token';
      const mockResponse = {
        data: { id: 1, content: 'New test post', createdAt: '2024-04-17T10:00:00Z' }
      };
      
      mockAxios.post.mockResolvedValue(mockResponse);
      
      const result = await createPost(postData, token);
      
      expect(mockAxios.post).toHaveBeenCalledWith('/posts', postData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle 401 unauthorized error', async () => {
      const postData = { content: 'New test post' };
      const token = 'invalid-token';
      
      const mockError = {
        response: { status: 401 }
      };
      mockAxios.post.mockRejectedValue(mockError);
      
      await expect(createPost(postData, token)).rejects.toEqual(mockError);
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(window.location.href).toBe('/');
    });
  });

  describe('getPostById', () => {
    test('should fetch post by ID successfully', async () => {
      const postId = 1;
      const mockResponse = {
        data: { id: postId, content: 'Test post' }
      };
      
      mockAxios.get.mockResolvedValue(mockResponse);
      
      const result = await getPostById(postId);
      
      expect(mockAxios.get).toHaveBeenCalledWith(`/posts/${postId}`);
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle not found error', async () => {
      const postId = 999;
      const mockError = {
        response: { status: 404, data: { message: 'Post not found' } }
      };
      mockAxios.get.mockRejectedValue(mockError);
      
      await expect(getPostById(postId)).rejects.toEqual(mockError);
      expect(mockAxios.get).toHaveBeenCalledWith(`/posts/${postId}`);
    });
  });

  describe('deletePost', () => {
    test('should delete post successfully', async () => {
      const postId = 1;
      const token = 'mock-jwt-token';
      const mockResponse = { data: null };
      
      mockAxios.delete.mockResolvedValue(mockResponse);
      
      const result = await deletePost(postId, token);
      
      expect(mockAxios.delete).toHaveBeenCalledWith(`/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle unauthorized deletion', async () => {
      const postId = 1;
      const token = 'invalid-token';
      
      const mockError = {
        response: { status: 401 }
      };
      mockAxios.delete.mockRejectedValue(mockError);
      
      await expect(deletePost(postId, token)).rejects.toEqual(mockError);
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(window.location.href).toBe('/');
    });

    test('should handle forbidden deletion', async () => {
      const postId = 1;
      const token = 'valid-but-no-permission-token';
      
      const mockError = {
        response: { status: 403, data: { message: 'You can only delete your own posts' } }
      };
      mockAxios.delete.mockRejectedValue(mockError);
      
      await expect(deletePost(postId, token)).rejects.toEqual(mockError);
    });
  });

  describe('getCurrentUser', () => {
    test('should fetch current user successfully', async () => {
      const token = 'mock-jwt-token';
      const mockResponse = {
        data: {
          id: 1,
          auth0Id: 'auth0|123456',
          email: 'test@example.com',
          username: 'testuser',
          displayName: 'Test User'
        }
      };
      
      mockAxios.get.mockResolvedValue(mockResponse);
      
      const result = await getCurrentUser(token);
      
      expect(mockAxios.get).toHaveBeenCalledWith('/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle unauthorized access', async () => {
      const token = 'invalid-token';
      
      const mockError = {
        response: { status: 401 }
      };
      mockAxios.get.mockRejectedValue(mockError);
      
      await expect(getCurrentUser(token)).rejects.toEqual(mockError);
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(window.location.href).toBe('/');
    });
  });

  describe('getUserByUsername', () => {
    test('should fetch user by username successfully', async () => {
      const username = 'testuser';
      const mockResponse = {
        data: {
          id: 1,
          username: 'testuser',
          displayName: 'Test User'
        }
      };
      
      mockAxios.get.mockResolvedValue(mockResponse);
      
      const result = await getUserByUsername(username);
      
      expect(mockAxios.get).toHaveBeenCalledWith(`/users/${username}`);
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle user not found', async () => {
      const username = 'nonexistent';
      
      const mockError = {
        response: { status: 404, data: { message: 'User not found' } }
      };
      mockAxios.get.mockRejectedValue(mockError);
      
      await expect(getUserByUsername(username)).rejects.toEqual(mockError);
    });
  });

  describe('getAllUsers', () => {
    test('should fetch all users successfully', async () => {
      const mockResponse = {
        data: [
          { id: 1, username: 'user1', displayName: 'User One' },
          { id: 2, username: 'user2', displayName: 'User Two' }
        ]
      };
      
      mockAxios.get.mockResolvedValue(mockResponse);
      
      const result = await getAllUsers();
      
      expect(mockAxios.get).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle API errors', async () => {
      const mockError = new Error('Network error');
      mockAxios.get.mockRejectedValue(mockError);
      
      await expect(getAllUsers()).rejects.toThrow('Network error');
    });
  });

  describe('getPublicStream', () => {
    test('should fetch public stream successfully', async () => {
      const mockResponse = {
        data: {
          posts: [
            { id: 1, content: 'Public post 1' },
            { id: 2, content: 'Public post 2' }
          ],
          lastUpdated: '2024-04-17T10:00:00Z'
        }
      };
      
      mockAxios.get.mockResolvedValue(mockResponse);
      
      const result = await getPublicStream();
      
      expect(mockAxios.get).toHaveBeenCalledWith('/stream');
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle empty stream', async () => {
      const mockResponse = {
        data: {
          posts: [],
          lastUpdated: '2024-04-17T10:00:00Z'
        }
      };
      
      mockAxios.get.mockResolvedValue(mockResponse);
      
      const result = await getPublicStream();
      
      expect(result).toEqual(mockResponse.data);
      expect(result.posts).toHaveLength(0);
    });
  });

  describe('Request Interceptor', () => {
    test('should add Authorization header when token exists in localStorage', async () => {
      const token = 'stored-jwt-token';
      localStorage.getItem.mockReturnValue(token);
      
      const mockResponse = { data: { posts: [] } };
      mockAxios.get.mockResolvedValue(mockResponse);
      
      await getPosts();
      
      expect(localStorage.getItem).toHaveBeenCalledWith('access_token');
      // The interceptor should add the Authorization header
      expect(mockAxios.get).toHaveBeenCalled();
    });

    test('should not add Authorization header when no token exists', async () => {
      localStorage.getItem.mockReturnValue(null);
      
      const mockResponse = { data: { posts: [] } };
      mockAxios.get.mockResolvedValue(mockResponse);
      
      await getPosts();
      
      expect(localStorage.getItem).toHaveBeenCalledWith('access_token');
      expect(mockAxios.get).toHaveBeenCalled();
    });
  });

  describe('Response Interceptor', () => {
    test('should handle 401 responses', async () => {
      const token = 'invalid-token';
      const mockError = {
        response: { status: 401 }
      };
      
      mockAxios.get.mockRejectedValue(mockError);
      
      await expect(getPosts()).rejects.toEqual(mockError);
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(window.location.href).toBe('/');
    });

    test('should pass through non-401 errors', async () => {
      const mockError = {
        response: { status: 500, data: { message: 'Server error' } }
      };
      
      mockAxios.get.mockRejectedValue(mockError);
      
      await expect(getPosts()).rejects.toEqual(mockError);
      
      expect(localStorage.removeItem).not.toHaveBeenCalled();
      expect(window.location.href).toBe('http://localhost:3000');
    });
  });
});
