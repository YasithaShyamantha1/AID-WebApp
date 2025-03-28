import Hero from "@/components/Hero";
import HotelListings from "@/components/HotelListing";

const HomePage = () => {
  return (
    <main>
      <div className="relative min-h-screen">
        <Hero />
        <img
          src="/Assets/hero_1.jpg"
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        />
      </div>
      <HotelListings />
    </main>
  )
}

export default HomePage