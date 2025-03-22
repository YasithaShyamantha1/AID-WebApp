import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useAuth } from "@clerk/clerk-react"; // Import useAuth

const BookingForm = ({ hotelId }) => {
  
  console.log("Hotel ID:", hotelId);
  const { userId } = useAuth(); // Retrieve userId
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    // Add hotelId and userId to the payload
    data.hotelId = hotelId;
    data.userId = userId;

    // Convert dates to ISO strings
    data.checkIn = new Date(data.checkIn);
data.checkOut = new Date(data.checkOut);


    // Ensure all required fields are present
    const payload = {
      hotelId: data.hotelId,
      userId: data.userId,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      roomType: data.roomType,
      adults: Number(data.adults),
      children: Number(data.children) || 0,
      specialRequests: data.specialRequests || "",
    };

    try {
      const response = await fetch(`http://localhost:8000/api/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("API Response:", result); // Debugging

      if (!response.ok) {
        toast.error(result.error || "Failed to create booking");
        return;
      }

      toast.success("Booking created successfully");
      reset();
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Booking creation failed");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Book Now</Button>
      </DialogTrigger>
      <DialogContent aria-describedby="dialog-description">
  <p id="dialog-description">Your booking details go here...</p>
        <DialogTitle>Book Your Stay</DialogTitle>
        <p className="text-sm text-gray-500 text-center mb-4">
          Complete the form below to request a reservation
        </p>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input {...register("firstName")} required placeholder="First Name" />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input {...register("lastName")} required placeholder="Last Name" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input type="email" {...register("email")} required placeholder="Email" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input type="tel" {...register("phone")} required placeholder="Phone" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Arrival Date</Label>
              <Input type="date" {...register("checkIn")} required />
            </div>
            <div>
              <Label>Departure Date</Label>
              <Input type="date" {...register("checkOut")} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Room Type</Label>
              <Input {...register("roomType")} required placeholder="Room Type" />
            </div>
            <div>
              <Label>Adults</Label>
              <Input type="number" {...register("adults")} required min="1" />
            </div>
            <div>
              <Label>Children</Label>
              <Input type="number" {...register("children")} min="0" />
            </div>
          </div>
          <div>
            <Label>Special Requests</Label>
            <Input {...register("specialRequests")} placeholder="Any special requests..." />
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => reset()}>Close</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating booking..." : "Submit Booking Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;