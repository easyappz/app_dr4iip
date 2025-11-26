import instance from './axios';

/**
 * Get message history
 * @param {Object} params - Query parameters
 * @param {number} [params.limit=100] - Maximum number of messages to return
 * @param {number} [params.offset=0] - Number of messages to skip
 * @returns {Promise} Response with message list
 */
export const getMessages = async (params = {}) => {
  const response = await instance.get('/api/messages', {
    params: {
      limit: params.limit || 100,
      offset: params.offset || 0
    }
  });
  return response.data;
};

/**
 * Send a new message
 * @param {Object} data - Message data
 * @param {string} data.content - Message content (min 1 character)
 * @returns {Promise} Response with created message data
 */
export const sendMessage = async (data) => {
  const response = await instance.post('/api/messages', data);
  return response.data;
};
