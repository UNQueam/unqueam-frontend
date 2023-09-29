import axios from 'axios';
import {useAuthStore} from "../stores/authStore";

const apiService = axios.create({
    baseURL: 'http://localhost:8080/api/users',
});


interface PlatformUser {
    user_id: bigint,
    email: string;
    username: string;
    date: Date;
    role: string;
}

export const fetchUsers = async () => {
    try {
        let authStore = useAuthStore();
        const response = await apiService.get('', {
            headers: {
                'Authorization': `Bearer ${authStore.getAuthToken()}`
            }
        });
        return response.data;

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
