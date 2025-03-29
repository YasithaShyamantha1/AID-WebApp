import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import { useState, useEffect } from "react";

const AccountPage = () => {
  const { isSignedIn, user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isSignedIn && user) {
      const fetchBookings = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/booking/${user.id}`, {
            method: "GET",
            credentials: "include",
          });

          console.log("Fetching bookings for user ID:", user.id);

          if (!response.ok) {
            throw new Error("Failed to fetch bookings");
          }

          const data = await response.json();
          console.log("API Response:", data);

          if (Array.isArray(data)) {
            setBookings(data);
          } else if (data && Array.isArray(data.data)) {
            setBookings(data.data);
          } else {
            throw new Error("Invalid response format");
          }
        } catch (err) {
          console.error("Error fetching bookings:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchBookings();
    }
  }, [isSignedIn, user]);

  if (!isSignedIn) {
    return <Navigate to="/signin" />;
  }

  return (
    <main className="container mx-auto px-6 py-10 min-h-screen bg-gray-100">
      {/* User Info Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-800">My Account</h1>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-gray-700">Name</p>
            <p className="text-gray-600">{user?.fullName}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-gray-700">Email</p>
            <p className="text-gray-600">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>
      </div>

      {/* Booking History Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Bookings</h2>

        {loading ? (
          <p className="text-gray-600">Loading bookings...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-600">No bookings found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="border bg-gray-50 rounded-lg p-6 shadow-md transition-transform transform hover:scale-105">
                <h3 className="text-lg font-semibold text-gray-800">{booking.hotelName}</h3>
                <p className="text-gray-600">Check-in: <span className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</span></p>
                <p className="text-gray-600">Check-out: <span className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</span></p>
                <p className="text-gray-600">Room Number: <span className="font-medium">{booking.roomNumber}</span></p>
                <p className="text-gray-600">Total Price: <span className="font-semibold text-green-600">${booking.totalPrice}</span></p>
                <div className="flex space-x-4 mt-4">
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition">Edit</button>
                  <button className="px-4 py-2 bg-blue-900 text-white rounded-xl shadow-md hover:bg-red-700 transition">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AccountPage;
