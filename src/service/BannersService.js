import axios from 'axios';
import router from '@/router/index.js';

import {useAuthStore} from "@/stores/authStore";

const apiService = axios.create({
    baseURL: 'http://localhost:8080/api/banners',
});

export const publishBanner = async (banner) => {
    try {
        const response = await apiService.post("",
            banner,
            {
                headers: {
                    'Authorization': `Bearer ${useAuthStore().getAuthToken()}`,
                },
            });
        return response.data;
    } catch (error) {
        if(error.response && error.response.status === 404){
            await router.push('/404');
            return Promise.reject(error.response.data);
        }
        if(error.response && error.response.status === 400){
            throw error;
        } else {
            await router.push('/500');
            return Promise.reject(error.response.data);
        }
    }
};

export const editBanner = async (bannerId, updatedBanner) => {
    try {
        const response = await apiService.put(`/${bannerId}`,
            updatedBanner,
            {
                headers: {
                    'Authorization': `Bearer ${useAuthStore().getAuthToken()}`,
                },
            });
        return response.data;
    } catch (error) {
        if(error.response && error.response.status === 404){
            console.log(error.response.data);
            router.push('/404');
        }
        if(error.response && error.response.status === 400){
            throw error;
        } else {
            return Promise.reject(error.response.data);
            router.push('/500');
        }
    }
};

export const fetchActiveBanners = async () => {
    try {
        const response = await apiService.get(``);
        console.log(response.data)
        return response.data;
    } catch (error) {
        return handleRequestError(error);
    }
};

export const fetchBannerById = async (bannerId) => {
    try {
        const response = await apiService.get(`/${bannerId}`);
        return response.data;
    } catch (error) {
        return handleRequestError(error);
    }
};

export const fetchBannerByAlias = async (alias) => {
    try {
        const response = await apiService.get(``, {
            params: { alias: alias }
        });
        return response.data[0];
    } catch (error) {
        return handleRequestError(error);
    }
};


function handleRequestError(error) {
    if (error.response && error.response.status === 404) {
        console.log(error.response.data);
        router.push('/404');
    } else if (error.response && error.response.status === 400) {
        return Promise.reject(error.response.data);
    } else {
        router.push('/500');
    }
}
