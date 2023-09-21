import axios, {AxiosResponse} from 'axios';
import {useAuthStore} from "../stores/authStore";

interface UserSignUp {
    email: string;
    username: string;
    password: string;
    confirmedPassword: string;
}

class AuthenticationService {

    private authStore = useAuthStore();

    async login(username: string, password: string): Promise<AxiosResponse> {
        try {
            return await axios.post(`http://localhost:8080/api/auth/signIn`, {
                username,
                password,
            });
        } catch (error) {
            throw error;
        }
    }

    async register(user: UserSignUp): Promise<AxiosResponse> {
        try {
            let username = user.username
            let email = user.email
            let password = user.password
            return await axios.post(`http://localhost:8080/api/auth/signUp`, {
                username,
                email,
                password
            });
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        try {
            // @ts-ignore
            const authToken = this.authStore.getAuthToken();
            console.log(authToken)
            const headers = {
                'Authorization': `Bearer ${authToken}`
            };
            await axios.get('http://localhost:8080/api/auth/logout', {headers});
            // @ts-ignore
            this.authStore.clearAuthData();
        } catch (error) {
            throw error
        }
    }
}

export default AuthenticationService;