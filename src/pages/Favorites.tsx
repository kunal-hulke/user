import React from 'react';
import { Heart, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useMandapStore from '../store/useMandapStore';

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useMandapStore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Favorite Mandaps</h1>
      
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(venue => (
            <div key={venue.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="relative">
                <img src={venue.image} alt={venue.name} className="w-full h-48 object-cover" />
                <button 
                  onClick={() => removeFavorite(venue.id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{venue.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm">{venue.rating}</span>
                    <span className="text-sm text-gray-500">({venue.reviews})</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{venue.location}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {venue.capacity}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-semibold">₹{venue.price.toLocaleString()}</span>
                    <span className="text-gray-600 text-sm"> per day</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/mandaps/${venue.id}`)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h2>
          <p className="text-gray-500">Start adding mandaps to your favorites by clicking the heart icon</p>
        </div>
      )}
    </div>
  );
};

export default Favorites;