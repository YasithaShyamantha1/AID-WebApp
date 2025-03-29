import { Link } from 'react-router-dom';

export default function HotelSuggestionCard({ hotel }) {
  return (
    <Link
      to={`/hotels/${hotel.id}`}
      className="block border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-gray-700"
    >
      <div className="h-40 bg-gray-200 dark:bg-gray-600 relative">
        {hotel.image ? (
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTQgMTloMTZ2Mkg0em0xNi0xM2gtMlY0SDZ2Mkg0VjJoMTZ2NHptLTQgMTBIN2wtMS4wMS0uOTdIM1Y4aDE4djcuMDN6Ii8+PC9zdmc+';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
          ${hotel.pricePerNight}/night
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-medium truncate">{hotel.name}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
          {hotel.location}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {hotel.amenities?.slice(0, 3).map((amenity, i) => (
            <span
              key={i}
              className="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded"
            >
              {amenity}
            </span>
          ))}
          {hotel.amenities?.length > 3 && (
            <span className="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
              +{hotel.amenities.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}