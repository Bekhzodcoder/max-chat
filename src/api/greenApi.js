const BASE_URL = 'https://api.green-api.com';

export const greenApi = {
  /**
   * Send a text message
   */
  async sendMessage(idInstance, apiToken, chatId, message) {
    const url = `${BASE_URL}/waInstance${idInstance}/sendMessage/${apiToken}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: `${chatId}@c.us`,
        message,
      }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },

  /**
   * Receive one notification (polling)
   * Returns null if no notification available (empty body from server)
   */
  async receiveNotification(idInstance, apiToken) {
    const url = `${BASE_URL}/waInstance${idInstance}/receiveNotification/${apiToken}`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const text = await response.text();
    if (!text || text.trim() === '') return null;

    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  },

  /**
   * Delete notification after processing
   */
  async deleteNotification(idInstance, apiToken, receiptId) {
    const url = `${BASE_URL}/waInstance${idInstance}/deleteNotification/${apiToken}/${receiptId}`;
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete notification');
    return response.json();
  },

  /**
   * Get account state (to validate credentials)
   */
  async getStateInstance(idInstance, apiToken) {
    const url = `${BASE_URL}/waInstance${idInstance}/getStateInstance/${apiToken}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Invalid credentials');
    return response.json();
  },
};
