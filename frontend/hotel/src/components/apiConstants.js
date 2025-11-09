export const API_BASE_URL = 'http://localhost:9000/api';

export const ENDPOINTS = {
    PUBLIC: {
        HOTELS: `${API_BASE_URL}/hotels`,
        HOTEL_ROOMS: `${API_BASE_URL}/hotel-rooms`,
        LOGIN: `${API_BASE_URL}/users/login`
    },

    PROTECTED: {
        USERS: `${API_BASE_URL}/users`,
        ROOMS: `${API_BASE_URL}/rooms`,
        SALES: `${API_BASE_URL}/sales`,
    }
};

export const PUBLIC_ENDPOINTS = Object.values(ENDPOINTS.PUBLIC);

export const ROOM_TYPES = {
    ESTANDAR: {
        value: 'ESTANDAR',
        label: 'Habitación estándar',
        allowedAccommodations: ['SENCILLA', 'DOBLE']
    },
    JUNIOR: {
        value: 'JUNIOR',
        label: 'Habitación Junior',
        allowedAccommodations: ['TRIPLE', 'CUADRUPLE']
    },
    SUITE: {
        value: 'SUITE',
        label: 'Habitación Suite',
        allowedAccommodations: ['SENCILLA', 'DOBLE', 'TRIPLE']
    }
};

export const ACCOMMODATION_TYPES = {
    SENCILLA: {
        value: 'SENCILLA',
        label: 'Acomodación sencilla'
    },
    DOBLE: {
        value: 'DOBLE',
        label: 'Acomodación doble'
    },
    TRIPLE: {
        value: 'TRIPLE',
        label: 'Acomodación triple'
    },
    CUADRUPLE: {
        value: 'CUADRUPLE',
        label: 'Acomodación cuádruple'
    }
};

export const isValidRoomCombination = (roomType, accommodation) => {
    if (!ROOM_TYPES[roomType]) return false;
    return ROOM_TYPES[roomType].allowedAccommodations.includes(accommodation);
};

export const ERROR_MESSAGES = {
    REQUIRED_FIELD: 'Este campo es requerido',
    INVALID_NUMBER: 'Debe ser un número válido mayor a 0',
    INVALID_COMBINATION: 'La combinación de tipo y acomodación no es válida',
    NUMERIC_ONLY: 'Este campo debe contener solo números',
    NETWORK_ERROR: 'Error de conexión. Verifique su conexión a internet',
    SERVER_ERROR: 'Error del servidor. Intente nuevamente más tarde',
    UNAUTHORIZED: 'No está autorizado para acceder a este recurso',
    CONFLICT: 'Ya existe un registro con estos datos',
    NOT_FOUND: 'El recurso solicitado no fue encontrado'
};

export const SUCCESS_MESSAGES = {
    HOTEL_CREATED: 'Hotel registrado exitosamente',
    ROOM_CREATED: 'Habitación registrada exitosamente',
    ROOM_ASSIGNED: 'Habitaciones asignadas correctamente al hotel',
    USER_CREATED: 'Usuario registrado exitosamente',
    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    DATA_SAVED: 'Datos guardados correctamente'
};

export const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'user_data',
    THEME: 'app_theme'
};

export const LOADING_STATES = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
};

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    HOTELS: '/dashboard/hotels',
    ROOMS: '/dashboard/rooms',
    SALES: '/dashboard/sales',
    USERS: '/dashboard/users',
    PROFILE: '/profile'
};