//import axios from 'axios';

/*
const apiService = axios.create({
    baseURL: 'http://localhost:8080/api/games',
});
*/

const usersData = [{
    "user_id": 1141,
    "username": "Sheridan Zane",
    "email": "Sheridan Zane@mail",
    "date": "2016-02-15",
    "role": "Developer"
},
    {
        "user_id": 1142,
        "username": "Sheridan Zane",
        "email": "Sheridan Zane@mail",
        "date": "2016-02-15",
        "role": "User"
    }
]

interface PlatformUser {
    user_id: bigint,
    email: string;
    username: string;
    date: Date;
    role: string;
}

export const fetchUsers = () => {
    try {
        //const response = await apiService.get('');
        //return response.data;

        const users = usersData;
        // @ts-ignore
        users.forEach((user) => (user.date = new Date(user.date)));
        return users;
    } catch (error) {
        if(error.response && error.response.status === 404){
            console.log(error.response.data);
        }
        if(error.response && error.response.status === 400){
            return Promise.reject(error.response.data);
        } else {
        }
    }
};
