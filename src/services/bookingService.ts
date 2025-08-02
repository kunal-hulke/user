import axios from "axios";

export const getBookingsByUser = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/user/bookings', {
      withCredentials: true,
    }); 
    return response.data?.data?.bookings || [];
  } catch (error: any) {
    console.error("Failed to fetch bookings", error);
    throw error;
  }
};

export const getBookingById = async (id: string) => {
  try {
    const response = await axios.get(`http://localhost:4000/api/user/bookings/${id}`, {
      withCredentials: true, // if you're using cookies for auth
    });
    return response.data.data.booking;
  } catch (error: any) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};
