import axios from 'axios';

const API_URL = 'https://devalaya-backend.onrender.com';  // Replace with the actual base URL of your API

// const API_URL = 'http://localhost:9000'

// Function to save share data
export const saveShareData = async (latitude_exact, longitude_exact, viewportSize, screenResolution, networkInfo, connection) => {
  try {
    const response = await axios.post(`${API_URL}/share/share`, {
      latitude_exact,
      longitude_exact,
      viewportSize,
      screenResolution, networkInfo, connection
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to save share data');
    }
  } catch (error) {
    console.error('Error saving share data:', error.message);
    throw error;
  }
};
