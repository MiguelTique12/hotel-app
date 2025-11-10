import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    MapPin,
    Bed,
    Eye,
    Star
} from 'lucide-react';
import http from '../../services/httpInterceptor';
import {ENDPOINTS} from "../../../config/api";

const HotelesGestion = () => {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [hotelRooms, setHotelRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const hotelsResponse = await http.get(ENDPOINTS.HOTELS);
            const hotelRoomsResponse = await http.get(ENDPOINTS.HOTEL_ROOMS);

            setHotels(hotelsResponse.data);
            setHotelRooms(hotelRoomsResponse.data);
            setError(null);
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError('Error al cargar los datos de hoteles.');
        } finally {
            setLoading(false);
        }
    };

    const getHotelOccupancy = (hotelId) => {
        const hotelRoomsFiltered = hotelRooms.filter(hr => hr.hotel.id === hotelId);
        return hotelRoomsFiltered.reduce((total, hr) => total + hr.quantity, 0);
    };

    const getRoomTypeCount = (hotelId) => {
        const hotelRoomsFiltered = hotelRooms.filter(hr => hr.hotel.id === hotelId);
        return hotelRoomsFiltered.length;
    };

    const handleViewDetails = (hotelId) => {
        navigate(`/hoteles/${hotelId}`);
    };

    const filteredHotels = hotels.filter(hotel =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="content-section">
            <div className="section-header">
                <div>
                    <h2 className="section-title">Gestión de Hoteles</h2>
                    <p className="section-description">
                        Administre y visualice los detalles de todos los hoteles registrados
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando hoteles...</p>
                </div>
            ) : error ? (
                <div className="message error">{error}</div>
            ) : (
                <div className="hotels-management-grid">
                    {filteredHotels.length > 0 ? (
                        filteredHotels.map((hotel) => {
                            const occupancy = getHotelOccupancy(hotel.id);
                            const roomTypes = getRoomTypeCount(hotel.id);

                            return (
                                <div key={hotel.id} className="hotel-management-card">
                                    <div className="hotel-card-header">
                                        <div className="hotel-card-title">
                                            <Building2 size={24} className="hotel-card-icon" />
                                            <h3>{hotel.name}</h3>
                                        </div>
                                        <div className="hotel-card-rating">
                                            <Star size={16} fill="currentColor" />
                                            <span>4.{Math.floor(Math.random() * 10)}</span>
                                        </div>
                                    </div>

                                    <div className="hotel-card-body">
                                        <div className="hotel-info-row">
                                            <MapPin size={16} />
                                            <span>{hotel.city}, {hotel.address}</span>
                                        </div>
                                        <div className="hotel-info-row">
                                            <Bed size={16} />
                                            <span>{roomTypes} tipos de habitación</span>
                                        </div>
                                        <div className="hotel-stats">
                                            <div className="hotel-stat">
                                                <span className="stat-value">{occupancy}</span>
                                                <span className="stat-label">Habitaciones</span>
                                            </div>
                                            <div className="hotel-stat">
                                                <span className="stat-value">{hotel.maxRooms}</span>
                                                <span className="stat-label">Capacidad</span>
                                            </div>
                                            <div className="hotel-stat">
                        <span className="stat-value">
                          {Math.round((occupancy / hotel.maxRooms) * 100)}%
                        </span>
                                                <span className="stat-label">Ocupación</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hotel-card-actions">
                                        <button
                                            className="btn-action btn-view"
                                            onClick={() => handleViewDetails(hotel.id)}
                                        >
                                            <Eye size={18} />
                                            <span>Ver Detalles</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-results">
                            <Building2 size={48} />
                            <p>No se encontraron hoteles</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HotelesGestion;