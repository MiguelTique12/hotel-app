const API_URL = process.env.REACT_APP_API_URL || 'https://hotel-app-xnzj.onrender.com/api';

export const ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_URL}/auth/login`,
        REGISTER: `${API_URL}/auth/register`,
        LOGOUT: `${API_URL}/auth/logout`
    },

    USERS: `${API_URL}/users`,

    HOTELS: `${API_URL}/hotels`,
    HOTEL_SEARCH: `${API_URL}/hotels/search`,

    ROOMS: `${API_URL}/rooms`,
    HOTEL_ROOMS: `${API_URL}/hotel-rooms`,
    HOTEL_ROOMS_ASIGNAR: `${API_URL}/hotel-rooms/asignar`,

    SALES: `${API_URL}/sales`,

};

export { API_URL };