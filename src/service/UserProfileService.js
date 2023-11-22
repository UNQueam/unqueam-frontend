import axios from "axios";

const apiService = axios.create({
    baseURL: 'http://localhost:8080/api/users/',
});

export const fetchProfile = async (userId) => {
    try {
        console.log(userId)
        const response = await apiService.get(`${userId}/profile`);
        return response.data;
    } catch (error) {
        console.log(error)
    }
};