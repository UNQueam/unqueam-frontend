import axios from "axios";
import {useAuthStore} from "@/stores/authStore";
import {requestAuthConfig} from "@/utils/HttpHelper";

const apiService = axios.create({
    baseURL: 'http://localhost:8080/api/users/',
});

export const updateBiography = async (description) => {
    try {
        const authStore = useAuthStore()
        const response = await apiService.put(
            `${authStore.getUserId}/profile`,
            {
                "description": description
            },
            requestAuthConfig());
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export const updateAvatar = async (avatarKey) => {
    try {
        const authStore = useAuthStore()
        const response = await apiService.put(`${authStore.getUserId}/profile/${avatarKey}`,{}, requestAuthConfig());
        authStore.updateProfileImageKey(avatarKey)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}