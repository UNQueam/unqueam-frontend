import axios from 'axios';
import router from '@/router/index.js';
import {useAuthStore} from "../stores/authStore";
const apiService = axios.create({
    baseURL: 'http://localhost:8080/api/games',
  });

export const fetchData = async () => {
    try {
      const response = await apiService.get('');
      return response.data;
    } catch (error) {
        return handleRequestError(error);
    }
  };

export const fetchDeveloperGames = async (devUsername) => {
    try {
        const response = await apiService.get('', {
            params: { username: devUsername, hidden: true }
        });
        return response.data;
    } catch (error) {
        return handleRequestError(error);
    }
};

export const fetchGame = async (gameId) => {
    try {
      const response = await apiService.get(`/${gameId}`);
      return response.data;
    } catch (error) {
        return handleRequestError(error);
    }
};

export const hideGame = async (gameId) => {
    try {
        let authStore = useAuthStore();
        return await apiService.put(`/${gameId}` + '/hide',{}, {
            headers: {
                'Authorization': `Bearer ${authStore.getAuthToken()}`
            }});
    } catch (error) {
        return handleRequestError(error);
    }
};

export const exposeGame = async (gameId) => {
    try {
        let authStore = useAuthStore();
        return await apiService.put(`/${gameId}` + '/expose',{}, {
            headers: {
                'Authorization': `Bearer ${authStore.getAuthToken()}`
            }});
    } catch (error) {
        return handleRequestError(error);
    }
};

function handleRequestError(error) {
    if (error.response && error.response.status === 404) {
        console.log(error.response.data);
        router.push('/404');
    }
    if (error.response && error.response.status === 400) {
        return Promise.reject(error.response.data);
    } else {
        router.push('/500');
    }
}
