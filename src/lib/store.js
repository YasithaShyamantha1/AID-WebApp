// frontend/src/store.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import userReducer from "./features/userSlice";
import searchReducer from "./features/searchSlice";
import chatReducer from "./features/chatSlice"; // Add the chat reducer
import { api } from "./api";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer, // Keep your RTK Query API reducer
    user: userReducer,              // Make sure user reducer is included
    search: searchReducer,          // Your existing search reducer
    chat: chatReducer,              // Add the new chat reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // Keep your API middleware
});

setupListeners(store.dispatch);