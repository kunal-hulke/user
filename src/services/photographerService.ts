// // src/services/photographerService.ts
// import axios from 'axios';

// // const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/user/photographer/:id';

// export const getPhotographerById = async (photographerId: string) => {
//   try {
//     const response = await axios.get(`http://localhost:4000/api/user/photographers/${photographerId}`);
//     return response.data.data.photographer; // adjust if your API returns differently
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || "Failed to fetch photographer");
//   }
// };



import axios from "axios";

const API_URL = "http://localhost:4000/api/user/get-photographer"; // update if needed

export const getPhotographerById = async (photographerId: string) => {
  const res = await axios.get(`${API_URL}/${photographerId}`);
  return res.data.data.photographer;
};
