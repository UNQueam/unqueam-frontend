import axios from 'axios';
import {useAuthStore} from "../stores/authStore";
import {formatDate} from "../utils/DateFormatter";
// @ts-ignore
import {requestAuthConfig} from "@/utils/HttpHelper";
const apiService = axios.create({
    baseURL: 'http://localhost:8080/api/users',
});


interface PlatformUser {
    user_id: bigint,
    email: string;
    username: string;
    created_at: Date;
    role: string;
}

export const fetchUsers = async () => {
    try {
        const response = await apiService.get('', requestAuthConfig());
        let users = response.data;
        users.forEach(user => user.created_at = formatDate(user.created_at))
        return users
    } catch (error) {
        if(error.response && error.response.status === 404){
            console.log(error.response.data);
        }
        if(error.response && error.response.status === 400){
            return Promise.reject(error.response.data);
        } else {
        }
    }
};

export const fetchUserById = async (userId: number) => {
    try {
        const response = await apiService.get(`${userId}`);
        return response.data
    } catch (error) {
        if(error.response && error.response.status === 404){
            console.log(error.response.data);
        }
        if(error.response && error.response.status === 400){
            return Promise.reject(error.response.data);
        } else {
        }
    }
};
