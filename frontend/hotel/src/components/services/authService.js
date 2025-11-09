import axios from 'axios';

const API_URL = 'https://hotel-app-xnzj.onrender.com/api';

const TOKEN_KEY = 'auth_token';

const authService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/users/login`, {
                email,
                password
            });

            if (response.data && response.data.token) {
                localStorage.setItem(TOKEN_KEY, response.data.token);
            }

            return response.data;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
    },

    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    isAuthenticated: () => {
        return !!localStorage.getItem(TOKEN_KEY);
    }
};

export default authService;