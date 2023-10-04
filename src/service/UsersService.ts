import axios from 'axios';
import {useAuthStore} from "../stores/authStore";
import {formatDate} from "../utils/DateFormatter";

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
        let authStore = useAuthStore();
        const response = await apiService.get('', {
            headers: {
                'Authorization': `Bearer ${authStore.getAuthToken()}`
            }
        });
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
