import axios from 'axios';
import {useAuthStore} from "../stores/authStore";
import {formatDate} from "../utils/DateFormatter";

const apiService = axios.create({
    baseURL: 'http://localhost:8080/api/requests',
});


interface Request {
    request_id: bigint,
    issuer_username: string;
    reason: string;
    timestamp: Date;
    status: string;
}

export const fetchRequests = async () => {
    try {
        let authStore = useAuthStore();
        const response = await apiService.get('', {
            headers: {
                'Authorization': `Bearer ${authStore.getAuthToken()}`
            }
        });
        let requests = response.data;
        requests.forEach(user => user.timestamp = formatDate(user.timestamp))
        console.log(requests)
        return requests
    } catch (error) {
        if(error.response && error.response.status === 404){
            console.log(error.response.data);
        }
        if(error.response && error.response.status === 400){
            return Promise.reject(error.response.data);
        } else {
            //do nothing
        }
    }
};
