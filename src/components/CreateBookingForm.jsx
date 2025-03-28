// // import { useState } from "react";
// // import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { toast } from "sonner";
// // import { useForm } from "react-hook-form";
// // import { useAuth,useUser } from "@clerk/clerk-react";
// // // import {  useAuth } from "@clerk/react";

// // const BookingForm = ({ hotelId }) => {
// //   const { userId } = useAuth();
// //   const [loading, setLoading] = useState(false);
// //   const { register, handleSubmit, reset } = useForm();

// //   const onSubmit = async (data) => {
// //     if (!userId) {
// //       toast.error("User not authenticated");
// //       return;
// //     }

// //     console.log("hotelId:", hotelId);
// //     console.log("data",data);
// //     console.log("userID",userId);  // Debugging line

// //     if (hotelId) {
// //       // toast.error("Hotel ID is missing!");
// //       console.log(hotelId);
// //     }
// //     if (!hotelId) {
// //       toast.error("Hotel ID is missing!");
// //       return;
// //     }
// //     // Prepare the payload matching the Booking model
// //     const payload = {
// //       hotelId,
// //       userId,
// //       checkIn: new Date(data.checkIn),
// //       checkOut: new Date(data.checkOut),
// //       roomNumber: Number(data.roomNumber),
// //     };

// //     try {
// //       const response = await fetch(`http://localhost:8000/api/booking`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(payload),
// //       });

// //       const result = await response.json();

// //       if (!response.ok) {
// //         toast.error(result.error || "Failed to create booking");
// //         return;
// //       }

// //       toast.success("Booking created successfully");
// //       reset();
// //     } catch (error) {
// //       console.error("Error creating booking:", error);
// //       toast.error("Booking creation failed");
// //     }
// //   };

// //   return (
// //     <Dialog>
// //       <DialogTrigger asChild>
// //         <Button>Book Now</Button>
// //       </DialogTrigger>
// //       <DialogContent aria-describedby="dialog-description">
// //         <DialogTitle>Book Your Stay</DialogTitle>
// //         <p className="text-sm text-gray-500 text-center mb-4">Complete the form below to request a reservation</p>
// //         <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
// //           <div className="grid grid-cols-2 gap-4">
// //             <div>
// //               <Label>Check-in Date</Label>
// //               <Input type="date" {...register("checkIn")} required />
// //             </div>
// //             <div>
// //               <Label>Check-out Date</Label>
// //               <Input type="date" {...register("checkOut")} required />
// //             </div>
// //           </div>
// //           <div>
// //             <Label>Room Number</Label>
// //             <Input type="number" {...register("roomNumber")} required min="1" placeholder="Room Number" />
// //           </div>
// //           <div className="flex justify-between">
// //             <Button type="button" variant="outline" onClick={() => reset()}>Close</Button>
// //             <Button type="submit" disabled={loading}>
// //               {loading ? "Creating booking..." : "Submit Booking Request"}
// //             </Button>
// //           </div>
// //         </form>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // };

// // export default BookingForm;


// import {
//   Dialog,
//   DialogContent,
//   DialogTrigger,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { useForm } from "react-hook-form";
// import { useAuth,useUser } from "@clerk/clerk-react";
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const BookingForm = ({ hotelId }) => {
//   const { userId, getToken } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const { register, handleSubmit, reset } = useForm();

//   const { isSignedIn } = useUser();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isSignedIn) {
//       // Redirect to sign-in page if not authenticated
//       navigate("/auth/sign-in");
//     }
//   }, [isSignedIn, navigate]);

//   const onSubmit = async (data) => {
//     const token = await getToken();

//     if (!userId) {
//       toast.error("User not authenticated");
//       return;
//     }
//     console.log("hotelId:", hotelId);
//     console.log("data", data); // Debugging line
//     if (!hotelId) {
//       toast.error("Hotel ID is missing!");
//       return;
//     }
//     // Prepare the payload matching the Booking model
//     const payload = {
//       hotelId,
//       userId,
//       checkIn: new Date(data.checkIn),
//       checkOut: new Date(data.checkOut),
//       roomNumber: Number(data.roomNumber),
//     };
   
//     try {
//       const response = await fetch(`http://localhost:8000/api/booking`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });
//       const result = await response.json();
//       console.log("result",result);
//       if (!response.ok) {
//         console.log("kk");
//         toast.error(result.error || "Failed to create booking");
//         return;
//       }
//       toast.success("Booking created successfully");
//       reset();
//     } catch (error) {
//       console.error("Error creating booking:", error);
//       toast.error("Booking creation failed");
//     }
//   };
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button>Book Now</Button>
//       </DialogTrigger>
//       <DialogContent aria-describedby="dialog-description">
//         <DialogTitle>Book Your Stay</DialogTitle>
//         <p className="text-sm text-gray-500 text-center mb-4">
//           Complete the form below to request a reservation
//         </p>
//         <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label>Check-in Date</Label>
//               <Input type="date" {...register("checkIn")} required />
//             </div>
//             <div>
//               <Label>Check-out Date</Label>
//               <Input type="date" {...register("checkOut")} required />
//             </div>
//           </div>
//           <div>
//             <Label>Room Number</Label>
//             <Input
//               type="number"
//               {...register("roomNumber")}
//               required
//               min="1"
//               placeholder="Room Number"
//             />
//           </div>
//           <div className="flex justify-between">
//             <Button type="button" variant="outline" onClick={() => reset()}>
//               Close
//             </Button>
//             <Button type="submit" disabled={loading}>
//               {loading ? "Creating booking..." : "Submit Booking Request"}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };
// export default BookingForm;



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

const BookingForm = ({ hotelId }) => {
  const { userId, getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [open, setOpen] = useState(false);

  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      // Redirect to sign-in page if not authenticated
      navigate("/auth/sign-in");
    }
  }, [isSignedIn, navigate]);

  const onSubmit = async (data) => {
    const token = await getToken();

    if (!userId) {
      toast.error("User not authenticated");
      return;
    }
    console.log("hotelId:", hotelId);
    console.log("data", data); // Debugging line
    if (!hotelId) {
      toast.error("Hotel ID is missing!");
      return;
    }
    // Prepare the payload matching the Booking model
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
      console.log("result", result);
      if (!response.ok) {
        console.log("kk");
        toast.error(result.error || "Failed to create booking");
        return;
      }
      toast.success("Booking created successfully");
      reset();
      setOpen(false); // Close the modal after successful booking
    } catch (error) {
      console.error("Error creating booking:", error);
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
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Check-in Date</Label>
              <Input type="date" {...register("checkIn")} required />
            </div>
            <div>
              <Label>Check-out Date</Label>
              <Input type="date" {...register("checkOut")} required />
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
          <div className="flex justify-between">
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