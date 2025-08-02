import axios from 'axios'

export async function getMandapDetails(mandapId: string){
    const result = await axios.get(`http://localhost:4000/api/user/mandap/${mandapId}`);
    return result;
}

export async function getMandapDetailsById(mandapId: string){
    const result = await axios.get(`http://localhost:4000/api/user/mandap/${mandapId}`);
    return result;
}

export async function getPhotographersByMandapId(mandapId : string){
    const result = await axios.get(`http://localhost:4000/api/user/photographers/${mandapId}`);
    return result;
}

export async function getCaterersByMandapId(mandapId: string) {
    const result = await axios.get(`http://localhost:4000/api/user/caterers/${mandapId}`);
    return result;
}

export async function getReviewsByMandapId(mandapId: string) {
    const result = await axios.get(`http://localhost:4000/api/user/reviews/${mandapId}`);
    return result;
}
export async function getAllMandaps(){
    const result = await axios.get('http://localhost:4000/api/user/mandaps');
    return result;
}

export async function getRoomsByMandapId(mandapId: string){
    const result = await axios.get(`http://localhost:4000/api/user/rooms/${mandapId}`);
    return result;
}