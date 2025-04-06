const API_BASE_URL = 'http://localhost:8000/api';

export const fetchGameHistories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`);
      if (!response.ok) throw new Error('Failed to fetch game histories');
      return await response.json();
    } catch (error) {
      console.error('Error fetching game histories:', error);
      throw error;
    }
  };
  
  export const saveHistory = async (history) => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(history),
      });
      if (!response.ok) throw new Error('Failed to save game history');
      return await response.json();
    } catch (error) {
      console.error('Error saving game history:', error);
      throw error;
    }
  };