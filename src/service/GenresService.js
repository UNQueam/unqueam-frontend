import axios from "axios";

const apiService = axios.create({
    baseURL: 'http://localhost:8080/api/genres',
});

export const fetchGenres = async () => {
    try {
        return (await apiService.get('')).data;
    } catch (error) {
        console.log(error)
    }
};