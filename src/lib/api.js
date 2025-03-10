import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BACKEND_URL = "http://localhost:8000";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${BACKEND_URL}/api/` }),
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: () => "hotels",
    }),
    createHotel: builder.mutation({
      query: (hotel) => ({
        url: "hotels",
        method: "POST",
        headers: {
          "Content-Type": "application/json",  // Ensure JSON format
        },
        body: JSON.stringify(hotel), // Convert body to JSON string
      }),
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
  }),
});

export const { useGetHotelsQuery, useGetHotelByIdQuery, useCreateHotelMutation } =api;