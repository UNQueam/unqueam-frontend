import axios from 'axios';
import {useAuthStore} from "../stores/authStore";
import {formatDate} from "../utils/DateFormatter";
// @ts-ignore
import {handleRequestError, requestAuthConfig} from "@/utils/HttpHelper";
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
        const response = await apiService.get('', requestAuthConfig());
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
        const response = await apiService.put('/' + requestId + "/approve", {},requestAuthConfig());
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
        const response = await apiService.put('/' + requestId + "/reject", {
            reason
            },requestAuthConfig());
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
        }, requestAuthConfig());
    } catch (error) {
        return Promise.reject(error.response.data);
    }
};
