import axios from 'axios';
import router from '@/router/index.js';

const apiService = axios.create({
    baseURL: 'http://localhost:8080/api/games',
  });

export const fetchData = async () => {
    try {
      const response = await apiService.get('');
      return response.data;
    } catch (error) {
        if(error.response && error.response.status === 404){
            console.log(error.response.data);
            router.push('/404');
        }
        if(error.response && error.response.status === 400){
            return Promise.reject(error.response.data);
        } else {
            router.push('/500');
        }
    }
  };
