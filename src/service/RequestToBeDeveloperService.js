import axios from 'axios';
import {useAuthStore} from "@/stores/authStore";

const apiService = axios.create({
    baseURL: 'http://localhost:8080/api/developers',
});

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
