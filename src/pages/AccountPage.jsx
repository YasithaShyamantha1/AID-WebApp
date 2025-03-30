import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import { useState, useEffect } from "react";

const AccountPage = () => {
  const { isSignedIn, user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    checkIn: "",
    checkOut: "",
    roomNumber: ""
  });

  useEffect(() => {
    if (isSignedIn && user) {
      const fetchBookings = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/booking/${user.id}`, {
            method: "GET",
            credentials: "include",
          });

          if (!response.ok) throw new Error("Failed to fetch bookings");

          const data = await response.json();
          console.log("Bookings data:", data); // Debug log

          // Process bookings to ensure they have all required fields
          const processedBookings = (Array.isArray(data) ? data : data?.data || []).map(booking => ({
            ...booking,
            totalAmount: booking.totalAmount || 0,
            perNightRate: booking.perNightRate || 0,
            hotelName: booking.hotelName || "Unknown Hotel"
          }));

          setBookings(processedBookings);
        } catch (err) {
          console.error("Error:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchBookings();
    }
  }, [isSignedIn, user]);

  const calculateTotal = (checkIn, checkOut, rate) => {
    const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    return (days * rate).toFixed(2);
  };

  const handleEditClick = (booking) => {
    setEditingBookingId(booking._id);
    setEditFormData({
      checkIn: booking.checkIn.split('T')[0],
      checkOut: booking.checkOut.split('T')[0],
      roomNumber: booking.roomNumber
    });
  };

  const handleCancelEdit = () => {
    setEditingBookingId(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateBooking = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) throw new Error("Failed to update booking");

      const updatedBooking = await response.json();
      setBookings(bookings.map(b => b._id === bookingId ? updatedBooking : b));
      setEditingBookingId(null);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    }
  };

  const handleCancelBooking = async (bookingId, e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to cancel booking");
      
      setBookings(bookings.filter(b => b._id !== bookingId));
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    }
  };

  if (!isSignedIn) return <Navigate to="/signin" />;

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
          <div className="grid md:grid-cols-2 gap-8">
            {bookings.map((booking) => (
              <div key={booking._id} className="border border-gray-200 bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{booking.hotelName}</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Confirmed</span>
                </div>
                
                {editingBookingId === booking._id ? (
                  <div className="space-y-3 mb-5">
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">Check-in:</label>
                      <input
                        type="date"
                        name="checkIn"
                        value={editFormData.checkIn}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">Check-out:</label>
                      <input
                        type="date"
                        name="checkOut"
                        value={editFormData.checkOut}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">Room Number:</label>
                      <input
                        type="text"
                        name="roomNumber"
                        value={editFormData.roomNumber}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-700">
                        <span className="font-medium text-gray-600">Check-in:</span> 
                        <span className="ml-2 font-semibold text-gray-900">
                          {new Date(booking.checkIn).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-700">
                        <span className="font-medium text-gray-600">Check-out:</span> 
                        <span className="ml-2 font-semibold text-gray-900">
                          {new Date(booking.checkOut).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <p className="text-gray-700">
                        <span className="font-medium text-gray-600">Room:</span> 
                        <span className="ml-2 font-semibold text-gray-900">{booking.roomNumber}</span>
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${booking.totalAmount > 0 ? 
                        booking.totalAmount.toFixed(2) : 
                        calculateTotal(booking.checkIn, booking.checkOut, booking.perNightRate)}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    {editingBookingId === booking._id ? (
                      <>
                        <button 
                          onClick={() => handleUpdateBooking(booking._id)}
                          className="px-4 py-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-black transition-all duration-300 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full shadow-md hover:bg-gray-300 transition-all duration-300 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleEditClick(booking)}
                          className="px-4 py-2 bg-gray-700 text-white rounded-full shadow-md hover:bg-gray-800 transition-all duration-300 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button 
                          onClick={(e) => handleCancelBooking(booking._id, e)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full shadow-md hover:bg-gray-300 transition-all duration-300 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
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