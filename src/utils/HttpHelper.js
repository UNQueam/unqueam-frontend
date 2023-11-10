import {useAuthStore} from "@/stores/authStore";
import router from "@/router";

export const requestAuthConfig = () => {
    return {
        headers: {
            'Authorization': `Bearer ${useAuthStore().getAuthToken()}`
        }
    }
}

export function handleRequestError(error) {
    if (error.response && error.response.status === 404) {
        console.log(error.response.data);
        router.push('/404');
    } else if (error.response && error.response.status === 400) {
        return Promise.reject(error.response.data);
    } else if (error.response && error.response.status === 403) {
        router.push("/access-denied");
    } else {
        router.push('/500');
    }
}