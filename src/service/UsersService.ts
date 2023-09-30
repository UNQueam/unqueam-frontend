import axios from 'axios';
import {useAuthStore} from "../stores/authStore";

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

const formatDate = (value: string) => {
    if (value) {
        const date = new Date(value);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);

        return `${day}/${month}/${year}`;
    }
};
