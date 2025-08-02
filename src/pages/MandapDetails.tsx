import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Play, Heart, MoreVertical, Star, Check, Calendar } from 'lucide-react';
import BookingModal from '../components/BookingModal/BookingModal';
import AvailabilityModal from '../components/AvailabilityModal/AvailabilityModal';
import { getMandapDetails , getReviewsByMandapId , getPhotographersByMandapId } from '../services/mandapServices'
import { se } from 'date-fns/locale';

const venue = {
  id: 1,
  name: "The Royal Mahal",
  location: "Vayalur, Tiruchirappalli",
  fullAddress: "Vayalur Road, Kumaravayalur Tiruchirappalli",
  price: 125000,
  priceDisplay: "₹1,25,000",
  rating: 4.5,
  reviews: [
    {
      id: 1,
      userName: "Rajesh Kumar",
      rating: 5,
      comment: "Amazing venue with great amenities. The staff was very helpful.",
      date: "2024-02-15",
      isVerifiedBooking: true
    }
  ],
  capacity: 900,
  capacityDisplay: "500-1000",
  mainImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80",
  images: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80",
      type: "image"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80",
      type: "image"
    },
    {
      id: 3,
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      type: "video"
    }
  ],
  isShortlisted: false,
  foodType: "Both",
  description: "We The Royal Mahal are from Tiruchirappalli and are here to talk about our venue. Our venue is a beautiful place that is very easy to commute to so that guests will not miss your event and all will be reaching the venue on time. Our venue is spacious enough to accommodate more guests. Our venue has excellent parking space so guests won't feel tumbled while parking their vehicles.",
  amenities: [
    "10 Rooms available",
    "10 AC Rooms",
    "10000 Square Feet Capacity",
    "200 Parking",
    "Electricity Back-up",
    "Bridal Room",
    "Parking"
  ],
  policies: [
    "75% Payment On Date",
    "25% Payment On Booking",
    "Cancellation Policy - No Refund If Cancelled Before Three Months"
  ],
  eventAreas: [
    {
      name: "The Royal Mahal Banquet Hall",
      type: "Indoor",
      seatingCapacity: 900,
      floatingCapacity: 1500,
      pricePerDay: 125000
    },
    {
      name: "Royal Galaxy Mahal Banquet Hall",
      type: "Indoor",
      seatingCapacity: 300,
      floatingCapacity: 450,
      pricePerDay: 40000
    }
  ],
  otherInfo: {
    propertyType: ["Kalyana Mandapam", "Mini Hall", "Convention Hall", "Wedding Venue", "Banquet Hall", "Fort And Palace"],
    priceType: "Time Based Rent",
    decoration: "Outside Decorators Allowed",
    dj: "Outside DJ Allowed",
    food: "Outside Food Allowed",
    valetParking: "Yes",
    allowedCuisine: "Both"
  }
};

// Generate sample available dates
const generateAvailableDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    // Skip some dates to simulate unavailability
    if (i % 3 !== 0) {
      dates.push(date);
    }
  }
  return dates;
};

const MandapDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const [selectedImage, setSelectedImage] = useState(venue.mainImage);
  const [selectedImage, setSelectedImage] = useState({});
  const [selectedTab, setSelectedTab] = useState('about');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);
  const [preSelectedDate, setPreSelectedDate] = useState<Date | null>(null);
  const isLoggedIn = true; // This should come from your auth context or state management
  // const availableDates = generateAvailableDates();
  const [isLoading, setIsLoading] = useState(true);
  
  const [mandap , setMandap] = useState({});
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [photographers, setPhotographers] = useState([]);
  
  const getVenue = async() => {
    try{
      setIsLoading(true)
      const result = await getMandapDetails(id);
      console.log(result.data.data.mandap);

      //setting mandap details
      setMandap(result.data.data.mandap);

      //converting string dates to Date objects
      setAvailableDates(result.data.data.mandap.availableDates.map((date: string) => new Date(date)));

      //setting the first image as selected image
      setSelectedImage(result.data.data.mandap.venueImages[0])
    }catch(error) {
      console.error("Error fetching mandap details:", error);
    }finally{
      setIsLoading(false)
    }
  }

  const [reviews , setReviews] = useState([])
  const [averageRating , setAverageRating] = useState(0);

  const getReview = async() => {
    const result = await getReviewsByMandapId(id);
    // console.log(result);
    setReviews(result.data.data.reviews);
    // console.log(result.data.data.reviews.length);
    let avgRating = 0;
    reviews.map((review) => {
      avgRating += review.rating;
    })
    // console.log(avgRating, " ==== averageRating before ====");
    avgRating = reviews.length > 0 ? avgRating / reviews.length : 0;
    // console.log(avgRating, " ==== averageRating ====");
    avgRating = Number(avgRating.toFixed(1));
    setAverageRating(avgRating);
    console.log(await getPhotographersByMandapId(id));
    
  }
  useEffect(() => {
    getVenue() , getReview();
  }, []);

  const handleDateSelect = (date: Date) => {
    setPreSelectedDate(date);
    setShowBookingForm(true);
  };

  return (
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <a href="/mandaps" className="text-rose-500">Home</a>
        <span className="mx-2">/</span>
        <span className="truncate">{mandap.mandapName}</span>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6 md:mb-8">
        {/* Main Image */}
        <div className="lg:col-span-4 relative rounded-lg overflow-hidden">
          <img src={selectedImage} alt={mandap.mandapName} className="w-full h-64 md:h-[500px] object-cover" />
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button className="bg-white/90 text-gray-900 px-3 md:px-4 py-2 rounded-lg flex items-center text-sm">
              <Play className="h-4 md:h-5 w-4 md:w-5 mr-1 md:mr-2" />
              1/85+
            </button>
            <button className="bg-white/90 text-gray-900 px-3 md:px-4 py-2 rounded-lg text-sm">
              1
            </button>
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="lg:col-span-1 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
          {/* {venue.images.slice(0, 4).map((image) => ( */}
          {mandap.venueImages?.map((image: string, index: number) => (
            <div
              key={index}
              className="flex-shrink-0 w-24 h-24 lg:w-full lg:h-[120px] rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              {/* {image.type === 'image' ? ( */}
                <img src={image} alt="Error loading image" className="w-full h-full object-cover" />
              {/* ) : ( */}
                {/* <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Play className="h-6 md:h-8 w-6 md:w-8 text-gray-400" />
                </div> */}
              {/* ) */}
              {/* } */}
            </div>
          ))}
        </div>
      </div>

      {/* Venue Info */}
      <div className="flex flex-col lg:flex-row justify-between items-start mb-6 md:mb-8 gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center mb-2 gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs md:text-sm px-2 md:px-3 py-1 rounded-full">Most Preferred</span>
            <button className="flex items-center text-rose-500 text-sm">
              <Heart className="h-4 md:h-5 w-4 md:w-5 mr-1" />
              Shortlist
            </button>
            <button className="lg:hidden">
              <MoreVertical className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">{mandap.mandapName}</h1>
          <p className="text-gray-600 mb-2 text-sm md:text-base">{mandap.address?.city || "City"}</p>
          <div className="flex items-center">
            <Star className="h-4 md:h-5 w-4 md:w-5 text-yellow-400" fill="currentColor" />
            <span className="ml-1 font-medium text-sm md:text-base">{averageRating}</span>
            <span className="ml-1 text-gray-500 text-sm">({reviews.length} Reviews)</span>
          </div>
        </div>
        <div className="text-left lg:text-right w-full lg:w-auto">
          <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{mandap.venuePricing}</div>
          <div className="text-gray-500 text-sm md:text-base">Per Day</div>
          <div className="mt-4 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2">
            <button 
              onClick={() => setShowAvailability(true)}
              className="flex items-center justify-center px-4 md:px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 text-sm md:text-base"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Check Availability
            </button>
            <button 
              onClick={() => {
                if (isLoggedIn) {
                  setShowBookingForm(true);
                } else {
                  navigate('/login');
                }
              }}
              className="px-4 md:px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 text-sm md:text-base"
            >
              Book Mandap
            </button>
          </div>
        </div>
      </div>

      {showBookingForm && (
        <BookingModal 
          mandapId={mandap._id} 
          onClose={() => setShowBookingForm(false)} 
          availableDates={availableDates}
          preSelectedDate={preSelectedDate}
        />
      )}

      {showAvailability && (
        <AvailabilityModal
          venueName={mandap.mandapName}
          availableDates={availableDates}
          onClose={() => setShowAvailability(false)}
          onDateSelect={handleDateSelect}
        />
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 md:mb-8">
        <nav className="flex space-x-4 md:space-x-8 overflow-x-auto">
          {['about', 'amenities', 'photos', 'reviews'].map((tab) => (
            <button
              key={tab}
              className={`py-4 px-1 border-b-2 font-medium whitespace-nowrap text-sm md:text-base ${
                selectedTab === tab
                  ? 'border-rose-500 text-rose-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === 'about' && (
        <div className="space-y-6 md:space-y-8">
          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-4">About Venue</h2>
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <img
                src={venue.mainImage}
                alt={venue.name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div>
                <h3 className="font-medium">Owned By {mandap.mandapName}</h3>
                <p className="text-gray-500 text-sm">On BookMyMandap since 2024</p>
                <p className="mt-4 text-gray-600 text-sm md:text-base">{venue.description}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-4">Event Areas Available</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {venue.eventAreas.map((area) => (
                <div key={area.name} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-2 text-sm md:text-base">{area.name}</h3>
                  <div className="flex flex-wrap items-center space-x-2 md:space-x-4 text-xs md:text-sm text-gray-500">
                    <span>{area.type}</span>
                    <span>{area.seatingCapacity} Seats</span>
                    <span>{area.floatingCapacity} Floating</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-4">Services offered</h2>
            <div className="border border-gray-200 rounded-lg divide-y">
              {venue.eventAreas.map((area) => (
                <div key={area.name} className="p-4 flex justify-between items-center">
                  <span className="text-sm md:text-base">Rental Price Per Day</span>
                  <span className="font-medium text-sm md:text-base">₹{area.pricePerDay.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {selectedTab === 'amenities' && (
        <div className="space-y-6 md:space-y-8">
          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mandap.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Check className="h-4 md:h-5 w-4 md:w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm md:text-base">{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-4">Policies</h2>
            <div className="grid grid-cols-1 gap-4">
              {/* {mandap.cancellationPolicy.map((policy) => (
                <div key={policy} className="flex items-start space-x-2">
                  <Check className="h-4 md:h-5 w-4 md:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base">{policy}</span>
                </div>
              ))} */}
                <div className="flex items-start space-x-2">
                <Check className="h-4 md:h-5 w-4 md:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base">{mandap.cancellationPolicy}</span>
                  </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-4">Other Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start space-x-2">
                <Check className="h-4 md:h-5 w-4 md:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm md:text-base">Property Type - {mandap.venueType.join(', ')}</span>
              </div>
              {Object.entries(mandap.outdoorFacilities)
                .filter(([key]) => key !== 'propertyType')
                .map(([key, value] , index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Check className="h-4 md:h-5 w-4 md:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">{value}</span>
                  </div>
                ))}
            </div>
          </section>
        </div>
      )}

      {selectedTab === 'photos' && (
        <div className="space-y-6 md:space-y-8">
          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-4">Photo Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* {venue.images.map((image) => ( */}
                {mandap.venueImages.map((image: string , index: number) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  {/* {image.type === 'image' ? ( */}
                    <img src={image} alt="Error loading image" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  {/* ) : ( */}
                    {/* <div className="w-full h-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <Play className="h-6 md:h-8 w-6 md:w-8 text-gray-400" />
                    </div> */}
                  {/* )} */}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {selectedTab === 'reviews' && (
        <div className="space-y-6 md:space-y-8">
          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-4">Reviews</h2>
            {/* {venue.reviews.length > 0 ? ( */}
              {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review , index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <div>
                        <h3 className="font-medium text-sm md:text-base">{review.userId.fullName}</h3>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 md:h-4 w-3 md:w-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">{review.createdAt}</div>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">{review.comment}</p>
                    {review.isVerifiedBooking && (
                      <div className="mt-2 flex items-center text-emerald-600 text-xs md:text-sm">
                        <Check className="h-3 md:h-4 w-3 md:w-4 mr-1" />
                        Verified Booking
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet</p>
                <p className="text-sm text-gray-400 mt-1">Book this venue to add a review</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default MandapDetails;