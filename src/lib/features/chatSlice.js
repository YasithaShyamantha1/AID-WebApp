// src/features/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [
    {
      role: 'assistant',
      content: 'Hello! I can help you find the perfect hotels for your staycation. What are you looking for?',
    },
  ],
  isLoading: false,
  error: null,
  suggestedHotels: [],
  isSuggestionsLoading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    sendMessage: (state, action) => {
      state.messages.push({
        role: 'user',
        content: action.payload,
      });
      state.isLoading = true;
      state.error = null;
    },
    receiveMessage: (state, action) => {
      state.messages.push(action.payload.message);
      state.isLoading = false;
      if (action.payload.suggestedHotels) {
        state.suggestedHotels = action.payload.suggestedHotels;
      }
    },
    startHotelSearch: (state) => {
      state.isSuggestionsLoading = true;
    },
    setSuggestedHotels: (state, action) => {
      state.suggestedHotels = action.payload;
      state.isSuggestionsLoading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isSuggestionsLoading = false;
    },
    clearSuggestions: (state) => {
      state.suggestedHotels = [];
    },
  },
});

export const {
  sendMessage,
  receiveMessage,
  startHotelSearch,
  setSuggestedHotels,
  setError,
  clearSuggestions,
} = chatSlice.actions;

export const selectChatMessages = (state) => state.chat.messages;
export const selectChatLoading = (state) => state.chat.isLoading;
export const selectChatError = (state) => state.chat.error;
export const selectSuggestedHotels = (state) => state.chat.suggestedHotels;
export const selectSuggestionsLoading = (state) => state.chat.isSuggestionsLoading;

export default chatSlice.reducer;