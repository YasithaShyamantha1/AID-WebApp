import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BookingForm = ({ hotelId, perNightRate }) => {
  const { userId, getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [open, setOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/auth/sign-in");
    }
  }, [isSignedIn, navigate]);

  const calculateTotalAmount = (checkInDate, checkOutDate, perNightRate) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const differenceInTime = checkOut.getTime() - checkIn.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    
    if (differenceInDays > 0) {
      return differenceInDays * perNightRate;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    if (checkIn && checkOut) {
      setTotalAmount(calculateTotalAmount(checkIn, checkOut, perNightRate));
    }
  }, [checkIn, checkOut, perNightRate]);

  const onSubmit = async (data) => {
    const token = await getToken();

    if (!userId) {
      toast.error("User not authenticated");
      return;
    }
    if (!hotelId) {
      toast.error("Hotel ID is missing!");
      return;
    }

    const payload = {
      hotelId,
      userId,
      checkIn: new Date(data.checkIn),
      checkOut: new Date(data.checkOut),
      roomNumber: Number(data.roomNumber),
    };

    try {
      const response = await fetch(`http://localhost:8000/api/booking`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || "Failed to create booking");
        return;
      }
      toast.success("Booking created successfully");
      reset();
      setOpen(false);
    } catch (error) {
      toast.error("Booking creation failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-2xl bg-black text-white text-base hover:bg-gray-800 transition duration-300"
        >
          {loading ? "Creating booking..." : "Book Now"}
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby="dialog-description">
        <DialogTitle>Book Your Stay</DialogTitle>
        <p className="text-sm text-gray-500 text-center mb-4">
          Complete the form below to request a reservation
        </p>
        
        {/* Hotel Price Display */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl shadow-sm">
          <div>
            <p className="text-3xl font-bold text-primary">${perNightRate}</p>
            <p className="text-md text-gray-500">per night</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Check-in Date</Label>
              <Input
                type="date"
                {...register("checkIn")}
                required
                onChange={(e) => setValue("checkIn", e.target.value)}
              />
            </div>
            <div>
              <Label>Check-out Date</Label>
              <Input
                type="date"
                {...register("checkOut")}
                required
                onChange={(e) => setValue("checkOut", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Room Number</Label>
            <Input
              type="number"
              {...register("roomNumber")}
              required
              min="1"
              placeholder="Room Number"
            />
          </div>

          
          <div className="mt-4">
            <p className="text-lg font-semibold">Total Amount: ${totalAmount.toFixed(2)}</p>
          </div>

          <div className="flex justify-between mt-4">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Close
            </Button>
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
