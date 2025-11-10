import React, { useState, useEffect } from "react";
import axios from 'axios';
import authService from "../../services/authService";
import { ENDPOINTS } from '../../../config/api';

const getAuthConfig = () => {
  const token = authService.getToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const RentasRegister = () => {
  const [formData, setFormData] = useState({
    userId: "",
    hotelId: "",
    hotelRoomId: "",
    startDate: "",
    endDate: "",
    totalPrice: ""
  });

  const roomPrices = {
    "ESTANDAR": {
      "SENCILLA": 120000,
      "DOBLE":   180000
    },
    "JUNIOR": {
      "TRIPLE":    250000,
      "CUADRUPLE": 300000
    },
    "SUITE": {
      "SENCILLA": 300000,
      "DOBLE":    350000,
      "TRIPLE":   400000
    }
  };

  const [message, setMessage] = useState({ text: "", type: "" });

  // Estados para listas
  const [sales, setSales] = useState([]);
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [allHotelRooms, setAllHotelRooms] = useState([]);
  const [filteredHotelRooms, setFilteredHotelRooms] = useState([]);

  // Estados de UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Cargar datos al iniciar el componente
  useEffect(() => {
    fetchSales();
    fetchUsers();
    fetchHotels();
    fetchAllHotelRooms();
  }, []);

  // Calcular precio total cuando cambian las fechas
  useEffect(() => {
    calculateTotalPrice();
  }, [formData.startDate, formData.endDate, formData.hotelRoomId]);

  // Función para obtener la lista de ventas/rentas
  const fetchSales = async () => {
    try {
      const response = await axios.get(ENDPOINTS.SALES, getAuthConfig());
      setSales(response.data);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      setMessage({
        text: "Error al cargar la lista de ventas",
        type: "error"
      });
    }
  };

  // Función para obtener la lista de usuarios
  const fetchUsers = async () => {
    try {
      const response = await axios.get(ENDPOINTS.USERS, getAuthConfig());
      setUsers(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setMessage({
        text: "Error al cargar la lista de usuarios",
        type: "error"
      });
    }
  };

  // Función para obtener la lista de hoteles
  const fetchHotels = async () => {
    try {
      const response = await axios.get(ENDPOINTS.HOTELS);
      setHotels(response.data);
    } catch (error) {
      console.error("Error al obtener hoteles:", error);
      setMessage({
        text: "Error al cargar la lista de hoteles",
        type: "error"
      });
    }
  };

  // Función para obtener todas las habitaciones de hotel
  const fetchAllHotelRooms = async () => {
    try {
      const response = await axios.get(ENDPOINTS.HOTEL_ROOMS);
      setAllHotelRooms(response.data);
    } catch (error) {
      console.error("Error al obtener habitaciones:", error);
      setMessage({
        text: "Error al cargar la lista de habitaciones",
        type: "error"
      });
    }
  };

  // Filtrar habitaciones por hotel seleccionado
  const filterRoomsByHotel = (hotelId) => {
    if (!hotelId) {
      setFilteredHotelRooms([]);
      return;
    }

    const filtered = allHotelRooms.filter(room => room.hotel.id === hotelId);
    setFilteredHotelRooms(filtered);

    // Si había una habitación seleccionada, limpiarla
    setFormData(prev => ({
      ...prev,
      hotelRoomId: "",
      totalPrice: ""
    }));
  };

  // Calcular el precio total
  const calculateTotalPrice = () => {
    const { startDate, endDate, hotelRoomId } = formData;

    if (!startDate || !endDate || !hotelRoomId) {
      return;
    }

    // Encontrar la habitación seleccionada
    const selectedRoom = filteredHotelRooms.find(room => room.id === hotelRoomId);

    if (!selectedRoom) {
      return;
    }

    // Obtener el precio por noche según tipo y acomodación
    const pricePerNight = getPriceForRoom(selectedRoom.room.type, selectedRoom.room.accommodation);

    // Calcular número de días
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calcular precio total
    const totalPrice = pricePerNight * diffDays;

    // Actualizar el formulario
    setFormData(prev => ({
      ...prev,
      totalPrice: totalPrice.toString()
    }));
  };

  // Obtener precio para un tipo de habitación y acomodación
  const getPriceForRoom = (type, accommodation) => {
    if (roomPrices[type] && roomPrices[type][accommodation]) {
      return roomPrices[type][accommodation];
    }
    return 100000; // Precio por defecto
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData({
      ...formData,
      [id]: value
    });

    // Si cambia el hotel, filtrar habitaciones
    if (id === "hotelId") {
      filterRoomsByHotel(value);
    }

    // Limpiar error específico cuando el usuario comienza a escribir
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: null
      });
    }
  };

  // Validar el formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar usuario
    if (!formData.userId) {
      newErrors.userId = "Debe seleccionar un usuario";
    }

    // Validar hotel
    if (!formData.hotelId) {
      newErrors.hotelId = "Debe seleccionar un hotel";
    }

    // Validar habitación
    if (!formData.hotelRoomId) {
      newErrors.hotelRoomId = "Debe seleccionar una habitación";
    }

    // Validar fecha de inicio
    if (!formData.startDate) {
      newErrors.startDate = "La fecha de inicio es requerida";
    }

    // Validar fecha de fin
    if (!formData.endDate) {
      newErrors.endDate = "La fecha de fin es requerida";
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = "La fecha de fin debe ser posterior a la fecha de inicio";
    }

    // Validar precio total (debería calcularse automáticamente)
    if (!formData.totalPrice || formData.totalPrice === "0") {
      newErrors.totalPrice = "No se ha podido calcular el precio total";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      // Datos a enviar a la API
      const saleData = {
        user: { id: formData.userId },
        hotelRoom: { id: formData.hotelRoomId },
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalPrice: parseFloat(formData.totalPrice)
      };

      // Realizar la petición POST
      await axios.post(ENDPOINTS.SALES, saleData, getAuthConfig());

      // Mostrar mensaje de éxito
      setMessage({
        text: "Venta registrada exitosamente",
        type: "success"
      });

      // Limpiar formulario
      resetForm();

      // Actualizar lista de ventas
      fetchSales();
    } catch (error) {
      console.error("Error al registrar venta:", error);

      let errorMessage = "Error al registrar la venta";

      // Mostrar mensaje de error específico si está disponible
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }

      setMessage({
        text: errorMessage,
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      userId: "",
      hotelId: "",
      hotelRoomId: "",
      startDate: "",
      endDate: "",
      totalPrice: ""
    });
    setFilteredHotelRooms([]);
    setErrors({});
  };

  // Manejar cancelación
  const handleCancel = () => {
    resetForm();
    setMessage({ text: "", type: "" });
  };

  // Formatear fecha para mostrar en la tabla
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  // Formatear precio como moneda
  const formatCurrency = (amount) => {
    if (!amount) return "$0";
    return `$${parseInt(amount).toLocaleString('es-CO')}`;
  };

  // Obtener nombre de usuario por ID
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.fullName : "Usuario desconocido";
  };

  // Obtener detalles de habitación por ID
  const getRoomDetails = (roomId) => {
    const room = allHotelRooms.find(r => r.id === roomId);
    if (!room) return { hotelName: "Desconocido", roomType: "Desconocida" };

    return {
      hotelName: room.hotel.name,
      roomType: `${room.room.type} - ${room.room.accommodation}`
    };
  };

  return (
      <div className="content-section">
        <h2 className="section-title">Registro de Ventas</h2>
        <p className="section-description">
          Complete el formulario para registrar nuevas ventas de habitaciones.
        </p>

        {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
        )}

        <div className="form-container">
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="userId">Usuario</label>
                <select
                    id="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    className={errors.userId ? "input-error" : ""}
                    disabled={isSubmitting}
                >
                  <option value="">Seleccionar usuario</option>
                  {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.fullName} - {user.documentNumber}
                      </option>
                  ))}
                </select>
                {errors.userId && <span className="error-message">{errors.userId}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="hotelId">Hotel</label>
                <select
                    id="hotelId"
                    value={formData.hotelId}
                    onChange={handleChange}
                    className={errors.hotelId ? "input-error" : ""}
                    disabled={isSubmitting}
                >
                  <option value="">Seleccionar hotel</option>
                  {hotels.map((hotel) => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name} - {hotel.city}
                      </option>
                  ))}
                </select>
                {errors.hotelId && <span className="error-message">{errors.hotelId}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="hotelRoomId">Habitación</label>
                <select
                    id="hotelRoomId"
                    value={formData.hotelRoomId}
                    onChange={handleChange}
                    className={errors.hotelRoomId ? "input-error" : ""}
                    disabled={isSubmitting || !formData.hotelId}
                >
                  <option value="">Seleccionar habitación</option>
                  {filteredHotelRooms.map((hotelRoom) => (
                      <option key={hotelRoom.id} value={hotelRoom.id}>
                        {hotelRoom.room.type} - {hotelRoom.room.accommodation} - {formatCurrency(getPriceForRoom(hotelRoom.room.type, hotelRoom.room.accommodation))}
                      </option>
                  ))}
                </select>
                {errors.hotelRoomId && <span className="error-message">{errors.hotelRoomId}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="totalPrice">Precio Total</label>
                <input
                    type="text"
                    id="totalPrice"
                    value={formData.totalPrice ? formatCurrency(formData.totalPrice) : ""}
                    readOnly
                    className={errors.totalPrice ? "input-error" : ""}
                />
                {errors.totalPrice && <span className="error-message">{errors.totalPrice}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Fecha de inicio</label>
                <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={errors.startDate ? "input-error" : ""}
                    disabled={isSubmitting}
                    min={new Date().toISOString().split('T')[0]}
                />
                {errors.startDate && <span className="error-message">{errors.startDate}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="endDate">Fecha de fin</label>
                <input
                    type="date"
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={errors.endDate ? "input-error" : ""}
                    disabled={isSubmitting}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                />
                {errors.endDate && <span className="error-message">{errors.endDate}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Registrar Venta"}
              </button>
              <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancel}
                  disabled={isSubmitting}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <div className="users-table-container">
          <h3 className="table-title">Ventas Registradas</h3>
          <table className="users-table">
            <thead>
            <tr>
              <th>Usuario</th>
              <th>Hotel</th>
              <th>Habitación</th>
              <th>Fecha inicio</th>
              <th>Fecha fin</th>
              <th>Precio</th>
            </tr>
            </thead>
            <tbody>
            {sales.length > 0 ? (
                sales.map((sale) => {
                  const roomDetails = getRoomDetails(sale.hotelRoom?.id);

                  return (
                      <tr key={sale.id}>
                        <td>{getUserName(sale.user?.id)}</td>
                        <td>{roomDetails.hotelName}</td>
                        <td>{roomDetails.roomType}</td>
                        <td>{formatDate(sale.startDate)}</td>
                        <td>{formatDate(sale.endDate)}</td>
                        <td>{formatCurrency(sale.totalPrice)}</td>
                      </tr>
                  );
                })
            ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No hay ventas registradas
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default RentasRegister;