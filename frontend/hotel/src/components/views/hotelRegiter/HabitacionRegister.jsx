import React, { useState, useEffect } from 'react';
import {
    Hotel,
    Bed,
    Plus,
    Trash2,
    Search,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import axios from 'axios';
import authService from '../../services/authService';

const API_URL = 'http://localhost:9000/api';
const ENDPOINTS = {
    HOTELS: `${API_URL}/hotels`,
    HOTEL_ROOMS: `${API_URL}/hotel-rooms`,
    ROOMS: `${API_URL}/rooms`,
    HOTEL_ROOMS_ASIGNAR: `${API_URL}/hotel-rooms/asignar`
};

const getAuthConfig = () => {
    const token = authService.getToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const HabitacionRegister = () => {
    const [hotels, setHotels] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [hotelRooms, setHotelRooms] = useState([]);
    const [selectedHotelId, setSelectedHotelId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [errors, setErrors] = useState({});

    const [roomAssignment, setRoomAssignment] = useState({
        roomType: '',
        accommodation: '',
        quantity: ''
    });

    const [selectedRooms, setSelectedRooms] = useState([]);

    const roomTypes = [
        { value: 'ESTANDAR', label: 'Habitación Estándar' },
        { value: 'JUNIOR', label: 'Habitación Junior' },
        { value: 'SUITE', label: 'Habitación Suite' }
    ];

    const accommodationTypes = [
        { value: 'SENCILLA', label: 'Acomodación Sencilla' },
        { value: 'DOBLE', label: 'Acomodación Doble' },
        { value: 'TRIPLE', label: 'Acomodación Triple' },
        { value: 'CUADRUPLE', label: 'Acomodación Cuádruple' }
    ];

    useEffect(() => {
        fetchHotels();
        fetchRooms();
        fetchHotelRooms();
    }, []);

    const fetchHotels = async () => {
        try {
            const response = await axios.get(ENDPOINTS.HOTELS);
            setHotels(response.data);
        } catch (error) {
            console.error('Error al obtener hoteles:', error);
        }
    };

    const fetchRooms = async () => {
        try {
            const response = await axios.get(ENDPOINTS.ROOMS, getAuthConfig());
            setAvailableRooms(response.data);
        } catch (error) {
            console.error('Error al obtener habitaciones:', error);
        }
    };

    const fetchHotelRooms = async () => {
        try {
            const response = await axios.get(ENDPOINTS.HOTEL_ROOMS);
            setHotelRooms(response.data);
        } catch (error) {
            console.error('Error al obtener asignaciones:', error);
        }
    };

    const getCompatibleAccommodations = (roomType) => {
        if (!roomType) return accommodationTypes;

        switch(roomType) {
            case 'ESTANDAR':
                return accommodationTypes.filter(acc =>
                    ['SENCILLA', 'DOBLE'].includes(acc.value)
                );
            case 'JUNIOR':
                return accommodationTypes.filter(acc =>
                    ['TRIPLE', 'CUADRUPLE'].includes(acc.value)
                );
            case 'SUITE':
                return accommodationTypes.filter(acc =>
                    ['SENCILLA', 'DOBLE', 'TRIPLE'].includes(acc.value)
                );
            default:
                return accommodationTypes;
        }
    };

    const handleRoomAssignmentChange = (e) => {
        const { id, value } = e.target;
        const updatedAssignment = { ...roomAssignment };

        if (id === 'quantity') {
            updatedAssignment[id] = value === '' ? '' : Number(value);
        } else {
            updatedAssignment[id] = value;
        }

        if (id === 'roomType') {
            updatedAssignment.accommodation = '';
        }

        setRoomAssignment(updatedAssignment);

        if (errors[id]) {
            setErrors({ ...errors, [id]: null });
        }
    };

    const validateRoomAssignmentForm = () => {
        const newErrors = {};

        if (!selectedHotelId) {
            newErrors.hotel = 'Debe seleccionar un hotel';
        }

        if (!roomAssignment.roomType) {
            newErrors.roomType = 'Seleccione un tipo de habitación';
        }

        if (!roomAssignment.accommodation) {
            newErrors.accommodation = 'Seleccione un tipo de acomodación';
        }

        if (roomAssignment.quantity === '' || roomAssignment.quantity <= 0) {
            newErrors.quantity = 'La cantidad debe ser mayor que 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddRoom = async () => {
        if (!validateRoomAssignmentForm()) {
            return;
        }

        try {
            let roomId;
            const existingRoom = availableRooms.find(
                room => room.type === roomAssignment.roomType &&
                    room.accommodation === roomAssignment.accommodation
            );

            if (existingRoom) {
                roomId = existingRoom.id;
            } else {
                const response = await axios.post(ENDPOINTS.ROOMS, {
                    type: roomAssignment.roomType,
                    accommodation: roomAssignment.accommodation
                }, getAuthConfig());

                roomId = response.data.id;
                fetchRooms();
            }

            const existingSelection = selectedRooms.findIndex(
                item => item.roomType === roomAssignment.roomType &&
                    item.accommodation === roomAssignment.accommodation
            );

            if (existingSelection >= 0) {
                const updatedRooms = [...selectedRooms];
                updatedRooms[existingSelection].quantity += Number(roomAssignment.quantity);
                setSelectedRooms(updatedRooms);
            } else {
                setSelectedRooms([...selectedRooms, {
                    id: roomId,
                    roomType: roomAssignment.roomType,
                    accommodation: roomAssignment.accommodation,
                    quantity: Number(roomAssignment.quantity)
                }]);
            }

            setRoomAssignment({
                roomType: '',
                accommodation: '',
                quantity: ''
            });

            setMessage({
                text: 'Habitación añadida a la lista',
                type: 'success'
            });

            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            console.error('Error al añadir habitación:', error);
            setMessage({
                text: 'Error al añadir habitación',
                type: 'error'
            });
        }
    };

    const handleFinishAssignment = async () => {
        if (selectedRooms.length === 0) {
            setMessage({
                text: 'Debe añadir al menos una habitación',
                type: 'error'
            });
            return;
        }

        setLoading(true);

        try {
            const requestData = {
                hotelId: selectedHotelId,
                rooms: selectedRooms.map(room => ({
                    id: room.id,
                    quantity: room.quantity
                }))
            };

            await axios.post(ENDPOINTS.HOTEL_ROOMS_ASIGNAR, requestData, getAuthConfig());

            setMessage({
                text: 'Habitaciones asignadas correctamente al hotel',
                type: 'success'
            });

            fetchHotelRooms();
            resetForm();
        } catch (error) {
            console.error('Error al asignar habitaciones:', error);
            setMessage({
                text: 'Error al asignar habitaciones al hotel',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveRoom = (index) => {
        const updatedRooms = [...selectedRooms];
        updatedRooms.splice(index, 1);
        setSelectedRooms(updatedRooms);
    };

    const resetForm = () => {
        setSelectedHotelId('');
        setRoomAssignment({
            roomType: '',
            accommodation: '',
            quantity: ''
        });
        setSelectedRooms([]);
        setErrors({});
    };

    const getRoomTypeName = (typeCode) => {
        const roomType = roomTypes.find(type => type.value === typeCode);
        return roomType ? roomType.label : typeCode;
    };

    const getAccommodationName = (accommodationCode) => {
        const accommodation = accommodationTypes.find(acc => acc.value === accommodationCode);
        return accommodation ? accommodation.label : accommodationCode;
    };

    const getSelectedHotel = () => {
        return hotels.find(h => h.id === Number(selectedHotelId));
    };

    const getHotelRoomsByHotel = (hotelId) => {
        return hotelRooms.filter(hr => hr.hotel.id === hotelId);
    };

    const filteredHotels = hotels.filter(hotel =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="content-section">
            <div className="section-header">
                <div>
                    <h2 className="section-title">Asignar Habitaciones a Hoteles</h2>
                    <p className="section-description">
                        Seleccione un hotel existente y asigne habitaciones adicionales
                    </p>
                </div>
            </div>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.type === 'success' ? (
                        <CheckCircle size={20} />
                    ) : (
                        <AlertCircle size={20} />
                    )}
                    <span>{message.text}</span>
                </div>
            )}

            <div className="hotel-selection-section">
                <div className="form-container">
                    <div className="form-group">
                        <label htmlFor="hotelSearch">
                            <Search size={18} />
                            <span>Buscar Hotel</span>
                        </label>
                        <input
                            type="text"
                            id="hotelSearch"
                            placeholder="Buscar por nombre o ciudad..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-bar-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="selectedHotel">
                            <Hotel size={18} />
                            <span>Seleccionar Hotel</span>
                        </label>
                        <select
                            id="selectedHotel"
                            value={selectedHotelId}
                            onChange={(e) => {
                                setSelectedHotelId(e.target.value);
                                if (errors.hotel) {
                                    setErrors({ ...errors, hotel: null });
                                }
                            }}
                            className={errors.hotel ? 'input-error' : ''}
                        >
                            <option value="">-- Seleccione un hotel --</option>
                            {filteredHotels.map(hotel => (
                                <option key={hotel.id} value={hotel.id}>
                                    {hotel.name} - {hotel.city}
                                </option>
                            ))}
                        </select>
                        {errors.hotel && <span className="error-message">{errors.hotel}</span>}
                    </div>

                    {selectedHotelId && (
                        <div className="hotel-info-card">
                            <Hotel size={24} />
                            <div>
                                <h4>{getSelectedHotel()?.name}</h4>
                                <p>{getSelectedHotel()?.city} - {getSelectedHotel()?.address}</p>
                                <p>Capacidad: {getSelectedHotel()?.maxRooms} habitaciones</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {selectedHotelId && (
                <>
                    <div className="form-container">
                        <h3 className="subsection-title">
                            <Bed size={20} />
                            <span>Agregar Habitaciones</span>
                        </h3>

                        <form className="register-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="roomType">Tipo de habitación</label>
                                    <select
                                        id="roomType"
                                        value={roomAssignment.roomType}
                                        onChange={handleRoomAssignmentChange}
                                        className={errors.roomType ? 'input-error' : ''}
                                    >
                                        <option value="">Seleccionar tipo</option>
                                        {roomTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.roomType && <span className="error-message">{errors.roomType}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="accommodation">Tipo de acomodación</label>
                                    <select
                                        id="accommodation"
                                        value={roomAssignment.accommodation}
                                        onChange={handleRoomAssignmentChange}
                                        className={errors.accommodation ? 'input-error' : ''}
                                        disabled={!roomAssignment.roomType}
                                    >
                                        <option value="">Seleccionar acomodación</option>
                                        {getCompatibleAccommodations(roomAssignment.roomType).map(acc => (
                                            <option key={acc.value} value={acc.value}>
                                                {acc.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.accommodation && <span className="error-message">{errors.accommodation}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="quantity">Cantidad</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        placeholder="Cantidad"
                                        value={roomAssignment.quantity}
                                        onChange={handleRoomAssignmentChange}
                                        className={errors.quantity ? 'input-error' : ''}
                                        min="1"
                                    />
                                    {errors.quantity && <span className="error-message">{errors.quantity}</span>}
                                </div>
                            </div>

                            <div className="form-info">
                                <AlertCircle size={16} />
                                <div>
                                    <strong>Restricciones:</strong>
                                    <ul>
                                        <li>Habitación Estándar: Solo Sencilla o Doble</li>
                                        <li>Habitación Junior: Solo Triple o Cuádruple</li>
                                        <li>Habitación Suite: Solo Sencilla, Doble o Triple</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={handleAddRoom}
                                >
                                    <Plus size={18} />
                                    <span>Añadir a la lista</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {selectedRooms.length > 0 && (
                        <div className="selected-rooms-container">
                            <h3 className="table-title">Habitaciones para asignar</h3>
                            <table className="users-table">
                                <thead>
                                <tr>
                                    <th>Tipo de habitación</th>
                                    <th>Acomodación</th>
                                    <th>Cantidad</th>
                                    <th>Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedRooms.map((room, index) => (
                                    <tr key={index}>
                                        <td>{getRoomTypeName(room.roomType)}</td>
                                        <td>{getAccommodationName(room.accommodation)}</td>
                                        <td>{room.quantity}</td>
                                        <td>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleRemoveRoom(index)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <div className="form-actions">
                                <button
                                    className="btn-primary"
                                    onClick={handleFinishAssignment}
                                    disabled={loading}
                                >
                                    {loading ? 'Guardando...' : 'Asignar Habitaciones'}
                                </button>
                                <button
                                    className="btn-secondary"
                                    onClick={resetForm}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    {selectedHotelId && (
                        <div className="users-table-container">
                            <h3 className="table-title">
                                Habitaciones actuales de {getSelectedHotel()?.name}
                            </h3>
                            <table className="users-table">
                                <thead>
                                <tr>
                                    <th>Tipo de habitación</th>
                                    <th>Acomodación</th>
                                    <th>Cantidad</th>
                                </tr>
                                </thead>
                                <tbody>
                                {getHotelRoomsByHotel(Number(selectedHotelId)).length > 0 ? (
                                    getHotelRoomsByHotel(Number(selectedHotelId)).map(hr => (
                                        <tr key={hr.id}>
                                            <td>{getRoomTypeName(hr.room.type)}</td>
                                            <td>{getAccommodationName(hr.room.accommodation)}</td>
                                            <td>{hr.quantity}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center' }}>
                                            Este hotel no tiene habitaciones asignadas
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HabitacionRegister;