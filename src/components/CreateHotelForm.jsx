import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCreateHotelMutation } from "@/lib/api";

const formSchema = z.object({
  name: z.string().min(1, { message: "Hotel name is required" }).max(50, {
    message: "Hotel name must be less than 50 characters",
  }),
  location: z.string().min(1, { message: "Location is required" }).max(100, {
    message: "Location must be less than 100 characters",
  }),
  image: z.string().url({ message: "Please enter a valid URL" }).min(1, {
    message: "Image URL is required",
  }),
  price: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().positive({ message: "Price must be a positive number" })
  ),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }).max(500, {
    message: "Description must be less than 500 characters",
  }),
});

const CreateHotelForm = () => {
  const [createHotel, { isLoading }] = useCreateHotelMutation();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      image: "",
      price: 0,
      description: "",
    },
  });

  const handleSubmit = async (values) => {
    try {
      toast.loading("Creating hotel...");
      await createHotel(values).unwrap();
      toast.success("Hotel created successfully");
      form.reset();
    } catch (error) {
      console.error("Hotel creation failed:", error);
      toast.error(
        error.data?.message || 
        "Hotel creation failed. Please check your inputs."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8"> {/* Increased max-width */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Create a New Hotel
          </h2>
          <p className="mt-2 text-lg text-gray-600"> {/* Larger text */}
            Fill in the details below to add a new hotel to our system
          </p>
        </div>
        
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" /* More rounded and stronger shadow */
          >
            <div className="space-y-6"> {/* Increased spacing */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-lg font-medium text-gray-700"> {/* Larger text */}
                      Hotel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter hotel name"
                        className="rounded-lg h-12 text-lg" /* More rounded and taller */
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" /> {/* Slightly larger error text */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-lg font-medium text-gray-700">
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter location"
                        className="rounded-lg h-12 text-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-lg font-medium text-gray-700">
                      Image URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        className="rounded-lg h-12 text-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-lg font-medium text-gray-700">
                      Price (per night)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter price"
                        className="rounded-lg h-12 text-lg"
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          field.onChange(value === "" ? "" : parseFloat(value));
                        }}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-lg font-medium text-gray-700">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter detailed description"
                        className="rounded-lg min-h-[150px] text-lg" /* Taller textarea */
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-lg font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" /* Black button */
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : "Create Hotel"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateHotelForm;