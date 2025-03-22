import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateBookingMutation, useGetHotelByIdQuery } from "@/lib/api";
import { Coffee, MapPin, MenuIcon as Restaurant, Star, Tv, Wifi } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import CreateBookingForm from "@/components/CreateBookingForm";
import { motion } from "framer-motion";

export default function HotelHomePage() {
  const { id } = useParams();
  const { data: hotel, isLoading, isError, error } = useGetHotelByIdQuery(id);
  const [createBooking, { isLoading: isCreateBookingLoading }] = useCreateBookingMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleBook = async () => {
    try {
      await createBooking({
        hotelId: id,
        checkIn: new Date(),
        checkOut: new Date(),
        roomNumber: 200,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Skeleton className="w-96 h-96 rounded-lg shadow-lg" />
      </div>
    );
  }

  if (isError) return <p className="text-red-500 text-center">Error: {error.message}</p>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="container mx-auto px-6 py-10"
    >
      <motion.div 
        initial={{ scale: 0.9 }} 
        animate={{ scale: 1 }} 
        transition={{ duration: 0.5 }}
        className="grid md:grid-cols-2 gap-10 items-start bg-white p-8 rounded-2xl shadow-lg"
      >
        <motion.div 
          className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-md"
          whileHover={{ scale: 1.02 }}
        >
          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
        </motion.div>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-900">{hotel.name}</h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-6 w-6 text-primary mr-2" />
            <span className="text-lg">{hotel.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-yellow-500">
            <Star className="h-6 w-6 fill-current" />
            <span className="text-lg font-semibold">{hotel.rating}</span>
            <span className="text-gray-500">({hotel.reviews.toLocaleString()} reviews)</span>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">{hotel.description}</p>
          
          <Card className="shadow-sm rounded-2xl">
            <CardContent className="p-6 bg-gray-50 rounded-2xl">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-700 font-medium">
                  <Wifi className="h-6 w-6 mr-2 text-primary" /> Free Wi-Fi
                </div>
                <div className="flex items-center text-gray-700 font-medium">
                  <Restaurant className="h-6 w-6 mr-2 text-primary" /> Restaurant
                </div>
                <div className="flex items-center text-gray-700 font-medium">
                  <Tv className="h-6 w-6 mr-2 text-primary" /> Flat-screen TV
                </div>
                <div className="flex items-center text-gray-700 font-medium">
                  <Coffee className="h-6 w-6 mr-2 text-primary" /> Coffee Maker
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl shadow-sm">
            <div>
              <p className="text-3xl font-bold text-primary">${hotel.price}</p>
              <p className="text-md text-gray-500">per night</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              onClick={openModal} 
              className="bg-primary text-white px-6 py-3 rounded-2xl shadow-md hover:bg-primary-dark transition"
            >
              Book Now
            </motion.button>
          </div>
        </div>
      </motion.div>

      {isModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4">Create Booking</h3>
            <CreateBookingForm />
            <Button variant="outline" onClick={closeModal} className="mt-4 w-full rounded-2xl">Close</Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
