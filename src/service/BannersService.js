import axios from 'axios';
import router from '@/router/index.js';

import {useAuthStore} from "@/stores/authStore";
import {handleRequestError, requestAuthConfig} from "@/utils/HttpHelper";

const apiService = axios.create({
    baseURL: 'http://localhost:8080/api/banners',
});

export const publishBanner = async (banner) => {
    try {
        const response = await apiService.post("",
            banner,
            requestAuthConfig());
        return response.data;
    } catch (error) {
        if(error.response && error.response.status === 400){
            throw error;
        }
        return handleRequestError(error);
    }
};

export const editBanner = async (bannerId, updatedBanner) => {
    try {
        const response = await apiService.put(`/${bannerId}`,
            updatedBanner,
            requestAuthConfig());
        return response.data;
    } catch (error) {
        if(error.response && error.response.status === 400){
            throw error;
        }
        return handleRequestError(error);
    }
};

export const activateBanner = async (bannerId) => {
    try {
        const response = await apiService.put(`/${bannerId}/activate`,{},
            requestAuthConfig());
        return response.data;
    } catch (error) {
        if(error.response && error.response.status === 400){
            throw error;
        }
        return handleRequestError(error);
    }
};

export const deactivateBanner = async (bannerId) => {
    try {
        const response = await apiService.put(`/${bannerId}/deactivate`,{},
            requestAuthConfig());
        return response.data;
    } catch (error) {
        if(error.response && error.response.status === 400){
            throw error;
        }
        return handleRequestError(error);
    }
};


export const fetchActiveBanners = async () => {
    try {
        const response = await apiService.get(``);
        return response.data;
    } catch (error) {
        return handleRequestError(error);
    }
};

export const fetchAllBanners = async () => {
    try {
        const response = await apiService.get(``, {
            params: {
                deactivated: true
            }
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        return handleRequestError(error);
    }
}

export const deleteBannerById = async (bannerId) => {
    try {
        const response = await apiService.delete(`/${bannerId}`,
            requestAuthConfig());
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
        console.log(response.data)
        return response.data[0];
    } catch (error) {
        return handleRequestError(error);
    }
};



