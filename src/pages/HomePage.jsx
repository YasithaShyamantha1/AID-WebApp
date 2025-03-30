import Hero from "@/components/Hero";
import HotelListings from "@/components/HotelListing";
import { ChatPopup } from "@/components/chatWindow";

const HomePage = () => {
  return (
    <main>
      <div className="relative min-h-screen">
        <Hero />
        <ChatPopup/>
        <img
          src="/Assets/new3.jpeg"
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        />
      </div>
      <HotelListings />
    </main>
  )
}

export default HomePage