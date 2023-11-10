import axios from 'axios';
import {handleRequestError, requestAuthConfig} from "@/utils/HttpHelper";

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

export const fetchGame = async (gameAlias) => {
    try {
      const response = await apiService.get(`/${gameAlias}`);
      return response.data;
    } catch (error) {
        return handleRequestError(error);
    }
};

export const createGame = async (game) => {
    try {
        const response = await apiService.post("",
            game,
            requestAuthConfig());
        return response.data;
    } catch (error) {
        if(error.response && error.response.status === 400){
            throw error;
        }
        return handleRequestError(error);
    }
};

export const editGame = async (gameId, game) => {
    try {
        const response = await apiService.put(`/${gameId}`,
            game,
            requestAuthConfig());
        return response.data;
    } catch (error) {
        if(error.response && error.response.status === 400){
            throw error;
        }
        return handleRequestError(error);
    }
};

export const hideGame = async (gameId) => {
    try {
        return await apiService.put(`/${gameId}` + '/hide',{}, requestAuthConfig());
    } catch (error) {
        return handleRequestError(error);
    }
};

export const exposeGame = async (gameId) => {
    try {
        return await apiService.put(`/${gameId}` + '/expose',{}, requestAuthConfig());
    } catch (error) {
        return handleRequestError(error);
    }
};

export const publishComment = async ({gameId, content, rating}) => {
    try {
        const response = await apiService.post(`/${gameId}/comments`,
            {
                content: content,
                rating: rating
            },
            requestAuthConfig());
        return response.data;
    } catch (error) {
        return handleRequestError(error);
    }
};

export const editComment = async ({gameId, commentId, content, rating}) => {
    try {
        const response = await apiService.put(`/${gameId}/comments/${commentId}`,
            {
                content: content,
                rating: rating
            },
            requestAuthConfig());
        return response.data;
    } catch (error) {
        return handleRequestError(error);
    }
};

export const deleteComment = async ({gameId, commentId}) => {
    try {
        const response = await apiService.delete(`/${gameId}/comments/${commentId}`,
            requestAuthConfig());
        return response.data;
    } catch (error) {
        return handleRequestError(error);
    }
};


