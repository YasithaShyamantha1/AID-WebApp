import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const BACKEND_URL = "https://aid-web-backend-new.onrender.com";
const BACKEND_URL="http://localhost:8000";             

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/api/`,
    prepareHeaders: async (headers, { getState }) => {
      const token = await window?.Clerk?.session?.getToken();
      console.log(token);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
  }),
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: () => "hotels",
    }),
    getHotelsForSearchQuery: builder.query({
      query: ({ query, location, sort }) => {
        let url = `hotels/search/retrieve?query=${query}`;
    
        if (location) {
          url += `&location=${location}`;
        }
    
        if (sort) {
          url += `&sort=${sort}`;
        }
    
        return url;
      },
    }),
    
    getHotelById: builder.query({
      query: (id) => `hotels/${id}`,
    }),
    createHotel: builder.mutation({
      query: (hotel) => ({
        url: "hotels",
        method: "POST",
        body: hotel,
      }),
    }),
    createBooking: builder.mutation({
      query: (booking) => ({
        url: "bookings",
        method: "POST",
        body: booking,
      }),
    }),
  }),
});

export const { useGetHotelsQuery, useGetHotelByIdQuery, useCreateHotelMutation, useCreateBookingMutation,useGetHotelsForSearchQueryQuery } =
  api;