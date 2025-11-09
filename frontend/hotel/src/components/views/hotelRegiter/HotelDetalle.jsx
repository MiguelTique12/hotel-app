import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Building2,
    MapPin,
    Bed,
    Users,
    Star,
    DollarSign
} from 'lucide-react';
import http from '../../services/httpInterceptor';

const HotelDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [hotelRooms, setHotelRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHotelDetails();
    }, [id]);

    const fetchHotelDetails = async () => {
        setLoading(true);
        try {
            const hotelResponse = await http.get(`https://hotel-app-xnzj.onrender.com/api/hotels/${id}`);
            const hotelRoomsResponse = await http.get('https://hotel-app-xnzj.onrender.com/api/hotel-rooms');

            setHotel(hotelResponse.data);

            const roomPrices = {
                "ESTANDAR": { "SENCILLA": 120000, "DOBLE": 180000 },
                "JUNIOR": { "TRIPLE": 250000, "CUADRUPLE": 300000 },
                "SUITE": { "SENCILLA": 300000, "DOBLE": 350000, "TRIPLE": 400000 }
            };

            const filteredRooms = hotelRoomsResponse.data
                .filter(hr => hr.hotel.id === id)
                .map(hr => {
                    const type = hr.room?.type?.toUpperCase?.() || '';
                    const acc = hr.room?.accommodation?.toUpperCase?.() || '';

                    const price = hr.price ?? roomPrices[type]?.[acc] ?? 0;

                    return { ...hr, price };
                });

            setHotelRooms(filteredRooms);
            setError(null);
        } catch (err) {
            console.error('Error al cargar detalles:', err);
            setError('Error al cargar los detalles del hotel.');
        } finally {
            setLoading(false);
        }
    };

    const getRoomTypeLabel = (type) => {
        const types = {
            ESTANDAR: 'Estándar',
            JUNIOR: 'Junior Suite',
            SUITE: 'Suite'
        };
        return types[type] || type;
    };

    if (loading) {
        return (
            <div className="content-section">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando detalles...</p>
                </div>
            </div>
        );
    }

    if (error || !hotel) {
        return (
            <div className="content-section">
                <div className="message error">{error || 'Hotel no encontrado'}</div>
                <button className="btn-secondary" onClick={() => navigate('/hoteles')}>
                    <ArrowLeft size={18} />
                    Volver
                </button>
            </div>
        );
    }

    const totalRooms = hotelRooms.reduce((sum, hr) => sum + hr.quantity, 0);

    return (
        <div className="content-section">
            <button className="btn-back" onClick={() => navigate('/hoteles')}>
                <ArrowLeft size={18} />
                <span>Volver a la lista</span>
            </button>

            <div className="hotel-detail-header">
                <div className="hotel-detail-title">
                    <Building2 size={32} />
                    <div>
                        <h2>{hotel.name}</h2>
                        <div className="hotel-detail-location">
                            <MapPin size={16} />
                            <span>{hotel.city}, {hotel.address}</span>
                        </div>
                    </div>
                </div>
                <div className="hotel-detail-rating">
                    <Star size={24} fill="currentColor" />
                    <span>4.{Math.floor(Math.random() * 10)}</span>
                </div>
            </div>

            <div className="hotel-detail-stats">
                <div className="detail-stat-card">
                    <Bed size={32} />
                    <div>
                        <span className="detail-stat-value">{totalRooms}</span>
                        <span className="detail-stat-label">Habitaciones Totales</span>
                    </div>
                </div>
                <div className="detail-stat-card">
                    <Building2 size={32} />
                    <div>
                        <span className="detail-stat-value">{hotel.maxRooms}</span>
                        <span className="detail-stat-label">Capacidad Máxima</span>
                    </div>
                </div>
                <div className="detail-stat-card">
                    <Users size={32} />
                    <div>
            <span className="detail-stat-value">
              {Math.round((totalRooms / hotel.maxRooms) * 100)}%
            </span>
                        <span className="detail-stat-label">Ocupación</span>
                    </div>
                </div>
                <div className="detail-stat-card">
                    <Star size={32} />
                    <div>
                        <span className="detail-stat-value">{hotelRooms.length}</span>
                        <span className="detail-stat-label">Tipos de Habitación</span>
                    </div>
                </div>
            </div>

            <div className="hotel-rooms-section">
                <h3 className="section-subtitle">Habitaciones Disponibles</h3>
                {hotelRooms.length > 0 ? (
                    <div className="rooms-grid">
                        {hotelRooms.map((hotelRoom) => (
                            <div key={hotelRoom.id} className="room-detail-card">
                                <div className="room-card-header">
                                    <Bed size={24} />
                                    <h4>{getRoomTypeLabel(hotelRoom.room.type)}</h4>
                                </div>
                                <div className="room-card-body">
                                    <div className="room-info-item">
                                        <span className="room-info-label">Cantidad:</span>
                                        <span className="room-info-value">{hotelRoom.quantity}</span>
                                    </div>
                                    <div className="room-info-item">
                                        <span className="room-info-label">Precio por noche:</span>
                                        <span className="room-info-value">
                      <DollarSign size={16} />
                                            {hotelRoom.price?.toLocaleString() || 'N/A'}
                    </span>
                                    </div>
                                    <div className="room-info-item">
                                        <span className="room-info-label">Capacidad:</span>
                                        <span className="room-info-value">
                      <Users size={16} />
                                            {hotelRoom.room.capacity} personas
                    </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <Bed size={48} />
                        <p>No hay habitaciones registradas para este hotel</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HotelDetalle;