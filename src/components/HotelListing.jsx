import { useGetHotelsForSearchQueryQuery } from "@/lib/api";
import { useState } from "react";
import HotelCard from "./HotelCard";
import LocationTab from "./LocationTab";
import { useSelector } from "react-redux";

export default function HotelListings() {
  const searchValue = useSelector((state) => state.search.value);
  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const [priceSort, setPriceSort] = useState("none"); // 'none', 'lowToHigh', 'highToLow'

  const {
    data: hotels,
    isLoading,
    isError,
    error,
  } = useGetHotelsForSearchQueryQuery({
    query: searchValue,
  });

  const locations = ["ALL", "France", "Italy", "Australia", "Japan"];

  const handleSelectedLocation = (location) => {
    setSelectedLocation(location);
  };

  const handlePriceSort = (sortType) => {
    setPriceSort(sortType);
  };

  if (isLoading) {
    return <LoadingView locations={locations} selectedLocation={selectedLocation} handleSelectedLocation={handleSelectedLocation} />;
  }

  if (isError) {
    return <ErrorView locations={locations} selectedLocation={selectedLocation} handleSelectedLocation={handleSelectedLocation} error={error} />;
  }

  // Filter by location first
  let filteredHotels =
    selectedLocation === "ALL"
      ? hotels
      : hotels.filter(({ hotel }) => {
          return hotel.location
            .toLowerCase()
            .includes(selectedLocation.toLowerCase());
        });

  // Then sort by price if a sort option is selected
  if (priceSort === "lowToHigh") {
    filteredHotels = [...filteredHotels].sort((a, b) => a.hotel.price - b.hotel.price);
  } else if (priceSort === "highToLow") {
    filteredHotels = [...filteredHotels].sort((a, b) => b.hotel.price - a.hotel.price);
  }

  // Log sorted hotel prices
  console.log("Sorted hotel prices:", filteredHotels.map(({ hotel }) => ({
    id: hotel._id,
    name: hotel.name,
    price: hotel.price,
    location: hotel.location
  })));

  return (
    <section className="px-8 py-8 lg:py-16">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Top trending hotels worldwide
        </h2>
        <p className="text-lg text-muted-foreground">
          Discover the most trending hotels worldwide for an unforgettable
          experience.
        </p>
      </div>
      
      <div className="flex items-center gap-x-4 mb-4">
        {locations.map((location, i) => (
          <LocationTab
            key={i}
            selectedLocation={selectedLocation}
            name={location}
            onClick={handleSelectedLocation}
          />
        ))}
      </div>

      <div className="flex items-center gap-x-4 mb-8">
        <span className="font-medium">Sort by price:</span>
        <button
          onClick={() => handlePriceSort("lowToHigh")}
          className={`px-4 py-2 rounded-md ${priceSort === "lowToHigh" ? 'bg-black text-white' : 'bg-white text-gray-700'}`}
        >
          Low to High
        </button>
        <button
          onClick={() => handlePriceSort("highToLow")}
          className={`px-4 py-2 rounded-md ${priceSort === "highToLow" ? 'bg-black text-white' : 'bg-white text-gray-700'}`}
        >
          High to Low
        </button>
        <button
          onClick={() => handlePriceSort("none")}
          className={`px-4 py-2 rounded-md ${priceSort === "none" ? 'bg-black text-white' : 'bg-white text-gray-700'}`}
        >
          None
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
        {filteredHotels.map(({ hotel, confidence }) => (
          <HotelCard key={hotel._id} hotel={hotel} confidence={confidence} />
        ))}
      </div>
    </section>
  );
}

// Extracted loading view for cleaner code
function LoadingView({ locations, selectedLocation, handleSelectedLocation }) {
  return (
    <section className="px-8 py-8 lg:py-16">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Top trending hotels worldwide
        </h2>
        <p className="text-lg text-muted-foreground">
          Discover the most trending hotels worldwide for an unforgettable
          experience.
        </p>
      </div>
      <div className="flex items-center gap-x-4">
        {locations.map((location, i) => (
          <LocationTab
            key={i}
            selectedLocation={selectedLocation}
            name={location}
            onClick={handleSelectedLocation}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
        <p>Loading...</p>
      </div>
    </section>
  );
}

// Extracted error view for cleaner code
function ErrorView({ locations, selectedLocation, handleSelectedLocation, error }) {
  return (
    <section className="px-8 py-8 lg:py-16">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Top trending hotels worldwide
        </h2>
        <p className="text-lg text-muted-foreground">
          Discover the most trending hotels worldwide for an unforgettable
          experience.
        </p>
      </div>
      <div className="flex items-center gap-x-4">
        {locations.map((location, i) => (
          <LocationTab
            key={i}
            selectedLocation={selectedLocation}
            name={location}
            onClick={handleSelectedLocation}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
        <p className="text-red-500">{error?.message || "Error fetching hotels."}</p>
      </div>
    </section>
  );
}