import { SignedIn, useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import { useState, useEffect } from "react";

const AccountPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
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
          console.log("API Response:", data); // Debugging API response

          // Ensure the response is an array
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
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold">My Account</h1>

      {/* Personal Information Section */}
      <div className="mt-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Personal Information</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-muted-foreground">Name: {user?.fullName}</p>
          </div>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Email: {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Booking History Section */}
      <div className="mt-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">My Bookings</h2>

        {loading ? (
          <p>Loading bookings...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="border rounded-xl p-4 shadow-md">
                <p className="font-semibold">Hotel: {booking.hotelName}</p>
                <p>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                <p>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                <p>Room Number: {booking.roomNumber}</p>
                <p>Total Price: ${booking.totalPrice}</p>
                <div className="flex space-x-4 mt-2">
                  <button className="text-blue-600">Edit</button>
                  <button className="text-red-600">Cancel</button>
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
