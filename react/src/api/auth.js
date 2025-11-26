import instance from './axios';

/**
 * Register a new user
 * @param {Object} data - Registration data
 * @param {string} data.username - Username (3-150 characters)
 * @param {string} data.password - Password (min 6 characters)
 * @returns {Promise} Response with user data
 */
export const register = async (data) => {
  const response = await instance.post('/api/auth/register', data);
  return response.data;
};

/**
 * Login user
 * @param {Object} data - Login credentials
 * @param {string} data.username - Username
 * @param {string} data.password - Password
 * @returns {Promise} Response with token and user data
 */
export const login = async (data) => {
  const response = await instance.post('/api/auth/login', data);
  return response.data;
};

/**
 * Get current authenticated user
 * @returns {Promise} Response with current user data
 */
export const getMe = async () => {
  const response = await instance.get('/api/auth/me');
  return response.data;
};

/**
 * Update user profile
 * @param {Object} data - Profile update data
 * @param {string} [data.username] - New username (3-150 characters)
 * @param {string} [data.password] - New password (min 6 characters)
 * @returns {Promise} Response with updated user data
 */
export const updateProfile = async (data) => {
  const response = await instance.put('/api/auth/profile', data);
  return response.data;
};
