import { useCreateHotelMutation } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input"; // Ensure Input is used

export default function CreateHotelPage() {
  const [createHotel, { isLoading }] = useCreateHotelMutation();
  const [name, setName] = useState("");

  const handleClick = async () => {
    try {
      toast.loading("Creating hotel...");
      await createHotel({
        name,
        location: "Kotte, Sri Lanka",
        reviews: 100,
        rating: 4,
        image:
          "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308797093.jpg?k=3a35a30f15d40ced28afacf4b6ae81ea597a43c90c274194a08738f6e760b596&o=&hp=1",
        price: 100,
        description:
          "The Opulent River Face Hotel is a luxurious hotel located in the heart of Colombo, Sri Lanka. It offers a range of amenities including a swimming pool, a gym, and a spa.",
      }).unwrap();
      toast.success("Hotel created successfully");
    } catch (error) {
      toast.error("Hotel creation failed");
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-2xl font-bold">Create a Hotel</h1>
      <form>
        <div>
          <label htmlFor="name">Name</label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </form>

      <div className="mt-4">
        <Button onClick={handleClick} disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Hotel"}
        </Button>
      </div>
    </main>
  );
}
