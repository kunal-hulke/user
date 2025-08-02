import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, Check, ArrowLeft, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getRoomsByMandapId } from '../services/mandapServices';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({ ac: 0, nonAc: 0 });

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!id) {
        setError("Invalid room ID");
        setLoading(false);
        return;
      }
      try {
        const result = await getRoomsByMandapId(id);
        setRoomData(result.data.data.rooms);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch room details");
      } finally {
        setLoading(false);
      }
    };
    fetchRoomData();
  }, [id]);

  const nextImage = (type: 'ac' | 'nonAc') => {
    const images = type === 'ac' ? roomData?.AcRoom?.roomImages : roomData?.NonAcRoom?.roomImages;
    if (images && images.length > 0) {
      setCurrentImageIndex(prev => ({
        ...prev,
        [type]: (prev[type] + 1) % images.length
      }));
    }
  };

  const prevImage = (type: 'ac' | 'nonAc') => {
    const images = type === 'ac' ? roomData?.AcRoom?.roomImages : roomData?.NonAcRoom?.roomImages;
    if (images && images.length > 0) {
      setCurrentImageIndex(prev => ({
        ...prev,
        [type]: (prev[type] - 1 + images.length) % images.length
      }));
    }
  };

  if (loading) return <div className="text-center py-10">Loading room details...</div>;
  if (error || !roomData) {
    return <div className="text-center py-10 text-red-500">{error || "Room not found"}</div>;
  }

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

      {/* Room Info Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <div className="flex items-center gap-4 mb-8">
          <Building2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Room Accommodations</h1>
        </div>
        
        {/* AC Rooms */}
        {roomData.AcRoom && roomData.AcRoom.noOfRooms > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">AC Rooms</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                {roomData.AcRoom.roomImages && roomData.AcRoom.roomImages.length > 0 ? (
                  <div className="relative">
                    <div className="aspect-video rounded-xl overflow-hidden mb-4">
                      <img
                        src={roomData.AcRoom.roomImages[currentImageIndex.ac]}
                        alt="AC Room"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {roomData.AcRoom.roomImages.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage('ac')}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => nextImage('ac')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="flex justify-center mt-2 space-x-2">
                          {roomData.AcRoom.roomImages.map((_: any, index: number) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(prev => ({ ...prev, ac: index }))}
                              className={`w-2 h-2 rounded-full ${
                                index === currentImageIndex.ac ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video rounded-xl bg-gray-200 flex items-center justify-center mb-4">
                    <Building2 className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <div className="mb-6">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    ₹{roomData.AcRoom.pricePerNight?.toLocaleString()}/night
                  </div>
                  <div className="text-gray-600">
                    {roomData.AcRoom.noOfRooms} rooms available
                  </div>
                </div>
                <h3 className="font-semibold mb-4">Amenities</h3>
                <ul className="grid grid-cols-2 gap-y-2">
                  {roomData.AcRoom.amenities?.map((amenity: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
};

        {/* Non-AC Rooms */}
        {roomData.NonAcRoom && roomData.NonAcRoom.noOfRooms > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Non-AC Rooms</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                {roomData.NonAcRoom.roomImages && roomData.NonAcRoom.roomImages.length > 0 ? (
                  <div className="relative">
                    <div className="aspect-video rounded-xl overflow-hidden mb-4">
                      <img
                        src={roomData.NonAcRoom.roomImages[currentImageIndex.nonAc]}
                        alt="Non-AC Room"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {roomData.NonAcRoom.roomImages.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage('nonAc')}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => nextImage('nonAc')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="flex justify-center mt-2 space-x-2">
                          {roomData.NonAcRoom.roomImages.map((_: any, index: number) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(prev => ({ ...prev, nonAc: index }))}
                              className={`w-2 h-2 rounded-full ${
                                index === currentImageIndex.nonAc ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video rounded-xl bg-gray-200 flex items-center justify-center mb-4">
                    <Building2 className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <div className="mb-6">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    ₹{roomData.NonAcRoom.pricePerNight?.toLocaleString()}/night
                  </div>
                  <div className="text-gray-600">
                    {roomData.NonAcRoom.noOfRooms} rooms available
                  </div>
                </div>
                <h3 className="font-semibold mb-4">Amenities</h3>
                <ul className="grid grid-cols-2 gap-y-2">
                  {roomData.NonAcRoom.amenities?.map((amenity: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
        {/* No Rooms Available */}
        {(!roomData.AcRoom || roomData.AcRoom.noOfRooms === 0) && 
         (!roomData.NonAcRoom || roomData.NonAcRoom.noOfRooms === 0) && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No rooms available</h3>
            <p className="text-gray-500">This venue doesn't offer accommodation services</p>
          </div>
        )}
      </div>
    </div>
  );
          </div>
        )}
export default RoomDetails;