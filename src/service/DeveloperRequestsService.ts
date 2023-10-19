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

export const approveRequest = async (requestId: bigint) => {
    try {
        let authStore = useAuthStore();

        const response = await apiService.put('/' + requestId + "/approve", {},{
            headers: {
                'Authorization': `Bearer ${authStore.getAuthToken()}`
            }
        });
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

export const rejectRequest = async (requestId: bigint , reason: string) => {
    try {
        let authStore = useAuthStore();

        const response = await apiService.put('/' + requestId + "/reject", {
            reason
            },{
                headers: {
                    'Authorization': `Bearer ${authStore.getAuthToken()}`
                }
        });
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

export const processRequestToBeDeveloper = async (reason) => {
    try {
        let authStore = useAuthStore();
        await apiService.post('', {
            "reason_to_be_developer": reason
        }, {
            headers: {
                'Authorization': `Bearer ${authStore.getAuthToken()}`,
            },
        });
    } catch (error) {
        return Promise.reject(error.response.data);
    }
};
