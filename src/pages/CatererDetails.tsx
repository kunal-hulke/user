import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Utensils, Star, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const caterers = {
  '1': {
    id: '1',
    name: "Royal Caterers",
    experience: "15+ years",
    rating: 4.9,
    reviews: 203,
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80",
    plans: [
      {
        name: 'Basic',
        price: 800,
        items: {
          starters: ['Paneer Tikka', 'Veg Spring Roll', 'Mushroom 65'],
          mains: ['Dal Makhani', 'Mixed Veg', 'Jeera Rice', 'Butter Naan'],
          desserts: ['Gulab Jamun', 'Ice Cream']
        },
        images: [
          'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80'
        ]
      },
      {
        name: 'Premium',
        price: 1200,
        items: {
          starters: ['Malai Tikka', 'Hara Bhara Kebab', 'Chilli Paneer', 'Corn Seekh'],
          mains: ['Paneer Butter Masala', 'Dal Makhani', 'Veg Biryani', 'Assorted Breads'],
          desserts: ['Rasmalai', 'Ice Cream', 'Gajar Ka Halwa']
        },
        images: [
          'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80'
        ]
      }
    ],
    customItems: {
      starters: [
        { name: 'Paneer Tikka', price: 120 },
        { name: 'Veg Spring Roll', price: 100 },
        { name: 'Mushroom 65', price: 150 }
      ],
      mains: [
        { name: 'Dal Makhani', price: 200 },
        { name: 'Paneer Butter Masala', price: 250 },
        { name: 'Mixed Veg', price: 180 }
      ],
      desserts: [
        { name: 'Gulab Jamun', price: 80 },
        { name: 'Rasmalai', price: 100 },
        { name: 'Ice Cream', price: 60 }
      ]
    },
    reviewsList: [
      {
        id: 1,
        name: "Amit Patel",
        rating: 5,
        comment: "Excellent food quality and service. Highly recommended!",
        date: "2024-02-20"
      },
      {
        id: 2,
        name: "Priya Sharma",
        rating: 4,
        comment: "Great variety of dishes and professional service.",
        date: "2024-02-18"
      },
      {
        id: 3,
        name: "Rajesh Kumar",
        rating: 5,
        comment: "Amazing taste and presentation. Will book again!",
        date: "2024-02-15"
      }
    ]
  }
};

const CatererDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const caterer = caterers[id as keyof typeof caterers];
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [plates, setPlates] = useState(100);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  if (!caterer) {
    return <div>Caterer not found</div>;
  }

  const customMenuTotal = selectedItems.reduce((total, item) => {
    const itemPrice = [...caterer.customItems.starters, ...caterer.customItems.mains, ...caterer.customItems.desserts]
      .find(i => i.name === item)?.price || 0;
    return total + (itemPrice * plates);
  }, 0);

  const planTotal = selectedPlan ? 
    (caterer.plans.find(p => p.name === selectedPlan)?.price || 0) * plates : 0;

  const totalPrice = planTotal + customMenuTotal;

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % caterer.reviewsList.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + caterer.reviewsList.length) % caterer.reviewsList.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Booking
      </button>

      {/* Caterer Info */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img
              src={caterer.avatar}
              alt={caterer.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{caterer.name}</h1>
            <div className="flex items-center mb-4">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium">{caterer.rating}</span>
              <span className="text-gray-500 ml-1">({caterer.reviews} reviews)</span>
            </div>
            <p className="text-gray-600">
              Professional catering service with {caterer.experience} of experience specializing in authentic Indian cuisine.
            </p>
          </div>
        </div>
      </div>

      {/* Pre-defined Plans */}
      <h2 className="text-2xl font-bold mb-8">Our Plans</h2>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {caterer.plans.map((plan) => (
          <div key={plan.name} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <input
                  type="radio"
                  name="selectedPlan"
                  checked={selectedPlan === plan.name}
                  onChange={() => setSelectedPlan(selectedPlan === plan.name ? '' : plan.name)}
                  className="w-5 h-5"
                />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-4">
                ₹{plan.price}/plate
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {plan.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${plan.name} sample ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Starters</h4>
                  <ul className="space-y-1">
                    {plan.items.starters.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Main Course</h4>
                  <ul className="space-y-1">
                    {plan.items.mains.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Desserts</h4>
                  <ul className="space-y-1">
                    {plan.items.desserts.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Menu Builder */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold mb-8">Build Your Custom Menu</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Starters</h3>
            {caterer.customItems.starters.map((item) => (
              <div key={item.name} className="flex items-center justify-between py-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems([...selectedItems, item.name]);
                      } else {
                        setSelectedItems(selectedItems.filter(i => i !== item.name));
                      }
                    }}
                    className="mr-2"
                  />
                  {item.name}
                </label>
                <span>₹{item.price}</span>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-4">Main Course</h3>
            {caterer.customItems.mains.map((item) => (
              <div key={item.name} className="flex items-center justify-between py-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems([...selectedItems, item.name]);
                      } else {
                        setSelectedItems(selectedItems.filter(i => i !== item.name));
                      }
                    }}
                    className="mr-2"
                  />
                  {item.name}
                </label>
                <span>₹{item.price}</span>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-4">Desserts</h3>
            {caterer.customItems.desserts.map((item) => (
              <div key={item.name} className="flex items-center justify-between py-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems([...selectedItems, item.name]);
                      } else {
                        setSelectedItems(selectedItems.filter(i => i !== item.name));
                      }
                    }}
                    className="mr-2"
                  />
                  {item.name}
                </label>
                <span>₹{item.price}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <label className="block font-medium mb-2">Number of Plates</label>
          <input
            type="number"
            min="50"
            value={plates}
            onChange={(e) => setPlates(parseInt(e.target.value))}
            className="w-32 px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mt-8 text-right">
          {selectedPlan && (
            <div className="mb-4">
              <div className="text-lg font-semibold">
                Selected Plan: {selectedPlan}
              </div>
              <div className="text-xl font-bold text-blue-600">
                Plan Total: ₹{planTotal.toLocaleString()}
              </div>
            </div>
          )}
          {customMenuTotal > 0 && (
            <div className="mb-4">
              <div className="text-lg font-semibold">
                Custom Menu Total: ₹{customMenuTotal.toLocaleString()}
              </div>
            </div>
          )}
          <div className="text-2xl font-bold">
            Grand Total: ₹{totalPrice.toLocaleString()}
          </div>
          <div className="text-gray-600">
            {plates} plates
          </div>
        </div>
      </div>

      {/* Reviews */}
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
          >
            {caterer.reviewsList.map((review) => (
              <div key={review.id} className="w-full flex-shrink-0 px-2">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{review.name}</h3>
                    <span className="text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {caterer.reviewsList.length > 1 && (
          <>
            <button
              onClick={prevReview}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextReview}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Review indicators */}
            <div className="flex justify-center mt-6">
              {caterer.reviewsList.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === currentReviewIndex ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentReviewIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CatererDetails;