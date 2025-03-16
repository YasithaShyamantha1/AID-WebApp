import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCreateBookingMutation } from "@/lib/api";

const formSchema = z.object({
  hotelId: z.string().min(1, { message: "Hotel ID is required" }),
  checkIn: z.string().min(1, { message: "Check-in date is required" }),
  checkOut: z.string().min(1, { message: "Check-out date is required" }),
  roomNumber: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number().positive({ message: "Room number must be a positive number" })
  ),
});

const CreateBookingForm = () => {
  const [createBooking, { isLoading }] = useCreateBookingMutation();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hotelId: "",
      checkIn: "",
      checkOut: "",
      roomNumber: "",
    },
  });

  const handleSubmit = async (values) => {
    try {
      toast.loading("Creating booking...");
      await createBooking(values).unwrap();
      toast.success("Booking created successfully");
    } catch (error) {
      console.error("Booking creation failed:", error);
      toast.error("Booking creation failed");
    }
  };

  return (
    <Form {...form}>
      <form className="w-1/2" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="hotelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hotel ID</FormLabel>
                <FormControl>
                  <Input placeholder="Hotel ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="checkIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-In Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="checkOut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-Out Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roomNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Room Number"
                    onChange={(e) => {
                      const value = e.target.value.trim();
                      field.onChange(value === "" ? "" : parseInt(value, 10));
                    }}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-4">
          <Button type="submit">Create Booking</Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateBookingForm;
