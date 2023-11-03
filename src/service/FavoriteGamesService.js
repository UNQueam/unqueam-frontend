import axios from 'axios';
import router from '@/router/index.js';

import {useAuthStore} from "@/stores/authStore";

const apiService = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export const fetchFavoriteGamesOfAuthUser = async () => {
  let authStore = useAuthStore()
  try {
    const response = await apiService.get(`/users/${authStore.getUserId}/games/favorites`,
        {
          headers: {
            'Authorization': `Bearer ${authStore.getAuthToken()}`,
          },
        });
    return response.data;
  } catch (error) {
    handleRequestError(error)
  }
};

export const postAddGameToFavorite = async (gameId) => {
  try {
    const response = await apiService.post(`/games/favorites/${gameId}`, {},
        {
          headers: {
            'Authorization': `Bearer ${useAuthStore().getAuthToken()}`,
          },
        });
    return response.data;
  } catch (error) {
    handleRequestError(error)
  }
};

export const doRemoveGameFromFavorites = async (gameId) => {
  try {
    const response = await apiService.delete(`/games/favorites/${gameId}`,
        {
          headers: {
            'Authorization': `Bearer ${useAuthStore().getAuthToken()}`,
          },
        });
    return response.data;
  } catch (error) {
    handleRequestError(error)
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