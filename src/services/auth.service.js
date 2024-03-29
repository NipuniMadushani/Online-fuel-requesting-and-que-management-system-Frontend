import axios from 'axios';

const API_URL = 'http://localhost:8090/api/auth/';

const register = (username, email, password) => {
    return axios.post(API_URL + 'signup', {
        username,
        email,
        password
    });
};

const login = (username, password) => {
    return axios
        .post(API_URL + 'signin', {
            username,
            password
        })
        .then((response) => {
            if (response.data.accessToken) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }

            return response.data;
        });
};

const sendOTP = (email) => {
    return axios.post(API_URL + 'sendOTPMail/' + `${email}`, {}).then((response) => {
        // if (response.data.accessToken) {
        //     localStorage.setItem('user', JSON.stringify(response.data));
        // }

        return response.data;
    });
};

const fetchNewRequstByUserId = (userId) => {
    return axios.get('http://localhost:8090/api/auth/v1/new-schedule/newSchedule/' + `${userId}`);
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    console.log(JSON.parse(localStorage.getItem('user')));
    return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
    sendOTP,
    fetchNewRequstByUserId
};

export default AuthService;
