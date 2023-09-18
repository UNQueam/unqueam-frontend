import axios, {AxiosResponse} from 'axios';

class AuthenticationService {

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
}

export default AuthenticationService;