import React, { useState, useMemo, useEffect } from 'react';
import { Heart, MapPin, Star, X, Filter, Calendar, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useMandapStore from '../../store/useMandapStore';
import { getAllMandaps , getReviewsByMandapId } from '../../services/mandapServices';
import { set } from 'date-fns';

interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  availableDates: string[]; // Array of available dates in YYYY-MM-DD format
  venueType: string; // Type of venue (Banquet Hall, Lawn, etc.)
}

interface Review{
  _id: string;
  mandapId: string;
  rating: number;
}

const MandapList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCapacity, setSelectedCapacity] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string[]>([]);
  const [selectedFoodType, setSelectedFoodType] = useState<string>('');
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localSelectedDate, setLocalSelectedDate] = useState('');
  const [localSelectedCity, setLocalSelectedCity] = useState('');

  const [mandaps, setMandaps] = useState([]);
  const [averageRating , setAverageRating] = useState([{
    mandapId: '',
    averageRating: 0
  }])


  const getMandaps = async () => {
    const result = await getAllMandaps();
    // console.log(result.data.data.mandaps);
    setMandaps(result.data.data.mandaps);
    const mandapData = result.data.data.mandaps;
    const rating = mandapData.map(async (venue) =>{
      try{
        const reviewsResult = await getReviewsByMandapId(venue._id);
        
        
       if(reviewsResult && reviewsResult.data && reviewsResult.data.data.reviews.length > 0) {
         const reviews = reviewsResult.data.data.reviews || [];
        let avgRating = 0;
        reviews.map((review)=>{
            avgRating += review.rating;
            
        })
        avgRating = reviews.length > 0 ? avgRating / reviews.length : 0;
        setAverageRating((prev) => [...prev, { mandapId: venue._id, averageRating: avgRating }]);
       }
       
        return { id: venue._id, rating: averageRating };
      }
      catch (error) {
        console.error(`Error fetching reviews for mandap ${venue._id}:`, error);
        return { _id: venue._id, averageRating: 0 }; // Default to 0 on error
      }
    })

  //   const ratings = await Promise.all(rating);
  // const ratingsMap = ratings.reduce((acc, { _id, averageRating }) => {
  //   console.log(averageRating)
  //   acc[_id] = averageRating;
  //   return acc;
  // }, {} as { [key: string]: number });
  // setAverageRating(ratingsMap);
    // console.log(result.data.data.mandaps[7].address.city);
    
  }


  useEffect(() => {
    getMandaps();
  }, []);

  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    searchTerm,
    setSearchTerm,
    selectedCity,
    selectedDate,
    selectedVenueType,
    setSelectedCity,
    setSelectedDate,
    setSelectedVenueType,
    resetFilters
  } = useMandapStore();

  // Reset filters when clicking on navbar mandaps link or directly accessing
  useEffect(() => {
    // Check if user came directly to mandaps page (not from search/filter actions)
    const hasActiveFilters = searchTerm || selectedCity || selectedDate || selectedVenueType;
    
    if (location.pathname === '/mandaps' && !hasActiveFilters) {
      resetFilters();
      setLocalSearchTerm('');
      setLocalSelectedDate('');
      setLocalSelectedCity('');
      setSelectedCapacity([]);
      setSelectedBudget([]);
      setSelectedFoodType('');
    } else {
      // Set local state from store when coming from other pages
      setLocalSearchTerm(searchTerm);
      setLocalSelectedDate(selectedDate);
      setLocalSelectedCity(selectedCity);
    }
  }, [location.pathname, resetFilters, searchTerm, selectedDate]);

  const venues: Venue[] = [
    {
      id: '1',
      name: 'The Grand Pavilion',
      location: 'Whitefield, Bangalore',
      capacity: '500-1000 guests',
      price: 125000,
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80',
      availableDates: ['2024-03-15', '2024-03-20', '2024-04-10', '2024-04-25', '2024-05-05'],
      venueType: 'Banquet Hall'
    },
    {
      id: '2',
      name: 'Royal Gardens',
      location: 'Juhu, Mumbai',
      capacity: '250-500 guests',
      price: 250000,
      rating: 4.9,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80',
      availableDates: ['2024-03-18', '2024-03-25', '2024-04-15', '2024-05-01', '2024-05-12'],
      venueType: 'Lawn'
    },
    {
      id: '3',
      name: 'Emerald Bay Resort',
      location: 'Calangute, Goa',
      capacity: '100-250 guests',
      price: 350000,
      rating: 4.7,
      reviews: 178,
      image: 'https://images.unsplash.com/photo-1544945582-3b466d874c6d?auto=format&fit=crop&q=80',
      availableDates: ['2024-03-22', '2024-04-05', '2024-04-20', '2024-05-08', '2024-05-15'],
      venueType: 'Resort'
    },
    {
      id: '4',
      name: 'Delhi Palace',
      location: 'Connaught Place, Delhi',
      capacity: '300-600 guests',
      price: 200000,
      rating: 4.6,
      reviews: 142,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80',
      availableDates: ['2024-03-12', '2024-03-28', '2024-04-12', '2024-04-30', '2024-05-10'],
      venueType: 'Palace'
    },
    {
      id: '5',
      name: 'Pune Heritage',
      location: 'Koregaon Park, Pune',
      capacity: '200-400 guests',
      price: 150000,
      rating: 4.5,
      reviews: 98,
      image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&q=80',
      availableDates: ['2024-03-16', '2024-03-30', '2024-04-18', '2024-05-03', '2024-05-20'],
      venueType: 'Convention hall'
    },
    {
      id: '6',
      name: 'Beach Paradise',
      location: 'Anjuna, Goa',
      capacity: '150-300 guests',
      price: 180000,
      rating: 4.7,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1544945582-3b466d874c6d?auto=format&fit=crop&q=80',
      availableDates: ['2024-03-14', '2024-03-21', '2024-04-07', '2024-04-28', '2024-05-11'],
      venueType: 'Beach Venue'
    }
  ];

  const filteredVenues = useMemo(() => {
    return venues.filter(venue => {
      // Use global search term from store (only set when search button is clicked)
      const effectiveSearchTerm = searchTerm.trim();
      const effectiveDate = selectedDate;
      const effectiveCity = selectedCity;
      
      // Search by name, location, or venue type
      const matchesSearch = !effectiveSearchTerm || (
        venue.name.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
        venue.location.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
        venue.venueType.toLowerCase().includes(effectiveSearchTerm.toLowerCase())
      );
      
      // Filter by city
      const matchesCity = !effectiveCity || 
        venue.location.toLowerCase().includes(effectiveCity.toLowerCase());
      
      // Filter by available date
      const matchesDate = !effectiveDate || 
        venue.availableDates.includes(effectiveDate);
      
      // Filter by venue type
      const matchesVenueType = !selectedVenueType || 
        venue.venueType.toLowerCase() === selectedVenueType.toLowerCase();
      
      // Filter by capacity if selected
      const matchesCapacity = selectedCapacity.length === 0 || 
        selectedCapacity.some(capacity => {
          const venueCapacityNum = parseInt(venue.capacity.split('-')[1] || venue.capacity.split(' ')[0]);
          switch(capacity) {
            case 'Upto 100': return venueCapacityNum <= 100;
            case '100-250': return venueCapacityNum >= 100 && venueCapacityNum <= 250;
            case '250-500': return venueCapacityNum >= 250 && venueCapacityNum <= 500;
            case '500-1000': return venueCapacityNum >= 500 && venueCapacityNum <= 1000;
            case 'Above 1,000': return venueCapacityNum > 1000;
            default: return true;
          }
        });
      
      // Filter by budget if selected
      const matchesBudget = selectedBudget.length === 0 || 
        selectedBudget.some(budget => {
          const budgetNum = parseInt(budget.replace(/[₹,]/g, ''));
          return venue.price <= budgetNum;
        });
      
      // Filter by food type if selected
      const matchesFoodType = !selectedFoodType || selectedFoodType === 'Both';
      
      return matchesSearch && matchesCity && matchesDate && matchesVenueType && 
             matchesCapacity && matchesBudget && matchesFoodType;
    });
  }, [venues, searchTerm, selectedDate, selectedCity, selectedVenueType, selectedCapacity, selectedBudget, selectedFoodType]);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const toggleCapacity = (capacity: string) => {
    setSelectedCapacity(prev => 
      prev.includes(capacity) 
        ? prev.filter(c => c !== capacity)
        : [...prev, capacity]
    );
  };

  const toggleBudget = (budget: string) => {
    setSelectedBudget(prev =>
      prev.includes(budget)
        ? prev.filter(b => b !== budget)
        : [...prev, budget]
    );
  };

  const toggleFavorite = (venue: Venue) => {
    if (isFavorite(venue._id)) {
      removeFavorite(venue._id);
    } else {
      addFavorite(venue);
    }
  };

  const handleSearch = () => {
    // Reset all filters first
    setSearchTerm('');
    setSelectedCity('');
    setSelectedDate('');
    setSelectedVenueType('');
    
    // Apply new filters from local inputs
    if (localSearchTerm.trim()) {
      setSearchTerm(localSearchTerm.trim());
    }
    if (localSelectedDate) {
      setSelectedDate(localSelectedDate);
    }
    if (localSelectedCity.trim()) {
      setSelectedCity(localSelectedCity.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      {/* Search Section */}
      <div className="mb-6 md:mb-8 bg-white p-4 md:p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Enter city, locality, venue or venue type"
              className="w-full pl-10 pr-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm md:text-base"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          
          <div className="md:col-span-4 relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="date"
              className="w-full pl-10 pr-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm md:text-base"
              value={localSelectedDate}
              onChange={(e) => setLocalSelectedDate(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          
          <div className="md:col-span-3">
            <button 
              onClick={handleSearch}
              className="w-full bg-red-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Search size={20} />
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Wedding Venues Near You</h1>
          <p className="text-gray-600 text-sm md:text-base">Found {filteredVenues.length} venues matching your criteria</p>
          {selectedCity && (
            <p className="text-sm text-blue-600">City: {selectedCity}</p>
          )}
          {selectedVenueType && (
            <p className="text-sm text-purple-600">Venue type: {selectedVenueType}</p>
          )}
          {searchTerm && (
            <p className="text-sm text-orange-600">Search: "{searchTerm}"</p>
          )}
          {selectedDate && (
            <p className="text-sm text-green-600">Date: {new Date(selectedDate).toLocaleDateString()}</p>
          )}
        </div>
        <button
          onClick={toggleFilter}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm md:text-base"
        >
          <Filter size={20} />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* {filteredVenues.map(venue => ( */}
        {mandaps.map(venue => (
          <div key={venue._id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="relative">
              <img src={venue.venueImages[0]} alt={venue.mandapName} className="w-full h-40 md:h-48 object-cover" />
              <button 
                onClick={() => toggleFavorite(venue)}
                className="absolute top-3 md:top-4 right-3 md:right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <Heart 
                  className={`w-4 h-4 md:w-5 md:h-5 ${isFavorite(venue._id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                />
              </button>
            </div>
            <div className="p-3 md:p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base md:text-lg font-semibold truncate pr-2">{venue.mandapName}</h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                  <span className="text-xs md:text-sm">{ averageRating.filter((prev)=>prev.mandapId === venue._id)[0]?.averageRating.toFixed(1) || 0}</span>
                  <span className="text-xs text-gray-500">({venue.reviews})</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-600 mb-2">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                {/* <span className="text-xs md:text-sm truncate">{venue.location}</span> */}
                <span className="text-xs md:text-sm truncate">{venue.address?.city || ''}</span>
              </div>
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <span className="text-xs md:text-sm bg-gray-100 px-2 py-1 rounded">
                  {venue.guestCapacity}
                </span>
                {venue.availableDates.length > 0 && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {venue.availableDates.length} dates available
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-base md:text-lg font-semibold">₹{venue.venuePricing.toLocaleString()}</span>
                  <span className="text-gray-600 text-xs md:text-sm"> per day</span>
                </div>
                <button 
                  onClick={() => navigate(`/mandaps/${venue._id}`)}
                  className="bg-red-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded text-xs md:text-sm hover:bg-red-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVenues.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No venues found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </div>
      )}

      {/* Filter Drawer - Responsive */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-semibold">Filters</h2>
              <button onClick={toggleFilter} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Capacity</h3>
                <div className="grid grid-cols-1 gap-2">
                  {['Upto 100', '100-250', '250-500', '500-1000', 'Above 1,000'].map(capacity => (
                    <button
                      key={capacity}
                      onClick={() => toggleCapacity(capacity)}
                      className={`px-3 py-2 border rounded-lg text-sm transition-colors text-left ${
                        selectedCapacity.includes(capacity)
                          ? 'bg-red-500 text-white border-red-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {capacity}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Budget - Per Day</h3>
                <div className="grid grid-cols-1 gap-2">
                  {['₹25,000', '₹50,000', '₹1,00,000', '₹2,00,000', '₹5,00,000'].map(budget => (
                    <button
                      key={budget}
                      onClick={() => toggleBudget(budget)}
                      className={`px-3 py-2 border rounded-lg text-sm transition-colors text-left ${
                        selectedBudget.includes(budget)
                          ? 'bg-red-500 text-white border-red-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {budget}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Food Type</h3>
                <div className="grid grid-cols-1 gap-2">
                  {['Veg', 'Non-Veg', 'Both'].map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedFoodType(type)}
                      className={`px-3 py-2 border rounded-lg text-sm transition-colors text-left ${
                        selectedFoodType === type
                          ? 'bg-red-500 text-white border-red-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t">
            <button 
              onClick={() => {
                setIsFilterOpen(false);
                handleSearch();
              }}
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Show Results ({filteredVenues.length})
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile filter */}
      {isFilterOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleFilter}
        />
      )}
    </div>
  );
};

export default MandapList;