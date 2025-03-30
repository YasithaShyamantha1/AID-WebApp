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
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BookingForm = ({ hotelId, perNightRate, hotelName }) => {
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

  const calculateTotalAmount = (checkInDate, checkOutDate, rate) => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const differenceInTime = checkOut.getTime() - checkIn.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays * rate;
  };

  useEffect(() => {
    if (checkIn && checkOut) {
      const calculated = calculateTotalAmount(checkIn, checkOut, perNightRate);
      setTotalAmount(calculated);
    }
  }, [checkIn, checkOut, perNightRate]);

  const onSubmit = async (data) => {
    setLoading(true);
    const token = await getToken();

    try {
      const payload = {
        hotelId,
        hotelName,
        userId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        roomNumber: Number(data.roomNumber),
        totalAmount: calculateTotalAmount(data.checkIn, data.checkOut, perNightRate),
        perNightRate
      };

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
        throw new Error(result.error || "Failed to create booking");
      }

      toast.success("Booking created successfully");
      reset();
      setOpen(false);
    } catch (error) {
      toast.error(error.message || "Booking creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full py-2 rounded-2xl bg-black text-white text-base hover:bg-gray-800 transition duration-300">
          Book Now
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Book Your Stay at {hotelName}</DialogTitle>
        
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl mb-4">
          <div>
            <p className="text-3xl font-bold">${perNightRate}</p>
            <p className="text-md text-gray-500">per night</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Check-in</Label>
              <Input
                type="date"
                {...register("checkIn", { required: true })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label>Check-out</Label>
              <Input
                type="date"
                {...register("checkOut", { required: true })}
                min={checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <div>
            <Label>Room Number</Label>
            <Input
              type="number"
              {...register("roomNumber", { required: true, min: 1 })}
              placeholder="101"
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-semibold">Total: ${totalAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-500">
              {checkIn && checkOut ? 
                `${Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))} nights` : 
                'Select dates to see total'}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;