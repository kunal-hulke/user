import axios from 'axios';

export const getVenueTypeCountsFromMandaps = async (): Promise<Record<string, number>> => {
  const response = await axios.get('http://localhost:4000/api/user/mandaps');
  const mandaps = response.data?.data?.mandaps || []; // adjust if response shape differs

  const typeCounts: Record<string, number> = {};

  mandaps.forEach((mandap: any) => {
    if (Array.isArray(mandap.venueType)) {
      mandap.venueType.forEach((type: string) => {
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
    }
  });

  return typeCounts;
};
