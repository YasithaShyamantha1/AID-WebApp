import { useDispatch } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import {
  sendMessage,
  receiveMessage,
  startHotelSearch,
  setError,
} from '../lib/features/chatSlice';

export const useChat = () => {  // ✅ Ensure this export matches the import
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const sendChatMessage = async (message) => {
    dispatch(sendMessage(message));
    
    try {
      const token = await getToken();
      
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: message }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();
      dispatch(receiveMessage(data));

      if (data.isHotelQuery) {
        dispatch(startHotelSearch());
        const hotelsResponse = await fetch(`http://localhost:8000/api/hotels/suggestions?query=${encodeURIComponent(message)}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!hotelsResponse.ok) throw new Error('Failed to get hotel suggestions');

        const hotelsData = await hotelsResponse.json();
        dispatch(receiveMessage({
          message: { role: 'assistant', content: 'Here are some hotels that match your criteria:' },
          suggestedHotels: hotelsData,
        }));
      }
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  return { sendChatMessage };
};
