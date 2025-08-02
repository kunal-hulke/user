import axios from 'axios';

export const getVenueCountsFromMandaps = async (): Promise<Record<string, number>> => {
  const response = await axios.get('http://localhost:4000/api/user/mandaps'); 
  const mandaps = response.data.data.mandaps || [];

  const cityCounts: Record<string, number> = {};

  mandaps.forEach((mandap: any) => {
    const city = mandap?.address?.city?.trim();
    if (city) {
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    }
  });

  return cityCounts;
};


