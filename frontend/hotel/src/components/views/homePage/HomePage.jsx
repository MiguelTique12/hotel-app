import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  Users,
  LogIn,
  Bed,
  Building2,
  Calendar
} from 'lucide-react';
import http from '../../services/httpInterceptor';
import { ENDPOINTS } from '../../../config/api'

function HomePage() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [hotelRooms, setHotelRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLoginClick = () => {
    navigate('/login');
  };

  useEffect(() => {
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
        setError('Error al cargar los datos de hoteles. Por favor, intente nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRoomCountsByType = (hotelId) => {
    const hotelRoomsFiltered = hotelRooms.filter(hotelRoom => hotelRoom.hotel.id === hotelId);

    const counts = {
      ESTANDAR: 0,
      JUNIOR: 0,
      SUITE: 0
    };

    hotelRoomsFiltered.forEach(hotelRoom => {
      const roomType = hotelRoom.room.type;
      if (counts[roomType] !== undefined) {
        counts[roomType] += hotelRoom.quantity;
      }
    });

    return {
      estandar: counts.ESTANDAR,
      junior: counts.JUNIOR,
      suite: counts.SUITE
    };
  };

  const getDefaultHotelImage = (index) => {
    const defaultImages = [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ];

    return defaultImages[index % defaultImages.length];
  };

  const getSimulatedRating = () => {
    return (4 + Math.random()).toFixed(1);
  };

  const getHotelOccupancy = (hotelId) => {
    const hotelRoomsFiltered = hotelRooms.filter(hotelRoom => hotelRoom.hotel.id === hotelId);
    return hotelRoomsFiltered.reduce((total, hotelRoom) => total + hotelRoom.quantity, 0);
  };

  return (
      <div className="home-container">
        <header className="home-header">
          <div className="header-logo">
            <Star className="star-icon-header" size={32} fill="currentColor" />
            <h1>Hoteles de Lujo</h1>
          </div>
          <button className="home-login-button" onClick={handleLoginClick}>
            <LogIn size={20} />
            <span>Inicio de sesión</span>
          </button>
        </header>

        <div className="hotels-grid-container">
          {loading ? (
              <div className="loading-message">
                <div className="loading-spinner"></div>
                <p>Cargando hoteles...</p>
              </div>
          ) : error ? (
              <div className="error-message">{error}</div>
          ) : (
              <div className="hotels-grid">
                {hotels.length > 0 ? (
                    hotels.map((hotel, index) => {
                      const roomCounts = getRoomCountsByType(hotel.id);
                      const rating = getSimulatedRating();
                      const occupancy = getHotelOccupancy(hotel.id);

                      return (
                          <div key={hotel.id} className="hotel-card">
                            <div
                                className="hotel-banner"
                                style={{ backgroundImage: `url(${getDefaultHotelImage(index)})` }}
                            >
                              <div className="hotel-banner-overlay">
                                <h2 className="hotel-name">{hotel.name}</h2>
                              </div>
                            </div>

                            <div className="hotel-content">
                              <div className="hotel-rating">
                                <Star className="star-icon-rating" size={18} fill="currentColor" />
                                <span className="rating-value">{rating}</span>
                                <span className="divider">•</span>
                                <MapPin className="location-icon" size={16} />
                                <span className="location-value">{hotel.city}</span>
                              </div>

                              <div className="hotel-rooms-container">
                                <div className="room-types-title">
                                  <Bed size={20} />
                                  <span className="room-title">Tipos de habitaciones:</span>
                                </div>
                                <div className="room-types">
                                  <div className="room-type">
                                    <span className="room-type-count">{roomCounts.estandar}</span>
                                    <span className="room-type-name">Estándar</span>
                                  </div>
                                  <div className="room-type">
                                    <span className="room-type-count">{roomCounts.junior}</span>
                                    <span className="room-type-name">Junior</span>
                                  </div>
                                  <div className="room-type">
                                    <span className="room-type-count">{roomCounts.suite}</span>
                                    <span className="room-type-name">Suite</span>
                                  </div>
                                </div>
                              </div>

                              <div className="hotel-details">
                                <p className="hotel-address">
                                  <MapPin size={16} className="detail-icon" />
                                  <span><strong>Dirección:</strong> {hotel.address}</span>
                                </p>
                                <p className="hotel-capacity">
                                  <Building2 size={16} className="detail-icon" />
                                  <span><strong>Ocupación:</strong> {occupancy} de {hotel.maxRooms} habitaciones</span>
                                </p>
                              </div>

                            </div>
                          </div>
                      );
                    })
                ) : (
                    <div className="no-hotels-message">
                      <Building2 size={48} />
                      <p>No hay hoteles disponibles en este momento.</p>
                    </div>
                )}
              </div>
          )}
        </div>

        <footer className="home-footer">
          <Star size={16} fill="currentColor" />
          <span>© 2025 Hoteles de Lujo | Experiencias Inolvidables</span>
        </footer>
      </div>
  );
}

export default HomePage;