import React, { useState, useEffect } from "react";
import axios from 'axios';
import authService from "../../services/authService";
import { ENDPOINTS } from '../../../config/api';

const getAuthConfig = () => {
  const token = authService.getToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const HotelRegisterWithRooms = () => {
  const [hotelData, setHotelData] = useState({
    name: "",
    city: "",
    address: "",
    nit: "",
    maxRooms: ""
  });

  const [roomAssignment, setRoomAssignment] = useState({
    roomType: "",
    accommodation: "",
    quantity: ""
  });

  const [hotels, setHotels] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [hotelRooms, setHotelRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1 = Hotel, 2 = Habitaciones
  const [message, setMessage] = useState({ text: "", type: "" });
  const [errors, setErrors] = useState({});

  const roomTypes = [
    { value: "ESTANDAR", label: "Habitación estándar" },
    { value: "JUNIOR", label: "Habitación Junior" },
    { value: "SUITE", label: "Habitación Suite" }
  ];

  const accommodationTypes = [
    { value: "SENCILLA", label: "Acomodación sencilla" },
    { value: "DOBLE", label: "Acomodación doble" },
    { value: "TRIPLE", label: "Acomodación triple" },
    { value: "CUADRUPLE", label: "Acomodación cuádruple" }
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
      console.error("Error al obtener hoteles:", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(ENDPOINTS.ROOMS, getAuthConfig());
      setAvailableRooms(response.data);
    } catch (error) {
      console.error("Error al obtener habitaciones:", error);
    }
  };

  const fetchHotelRooms = async () => {
    try {
      const response = await axios.get(ENDPOINTS.HOTELS);
      setHotelRooms(response.data);
    } catch (error) {
      console.error("Error al obtener asignaciones:", error);
    }
  };

  const handleHotelChange = (e) => {
    const { id, value } = e.target;

    if (id === "maxRooms") {
      const numericValue = value === "" ? "" : Number(value);
      setHotelData({
        ...hotelData,
        [id]: numericValue
      });
    } else {
      setHotelData({
        ...hotelData,
        [id]: value
      });
    }

    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: null
      });
    }
  };

  const handleRoomAssignmentChange = (e) => {
    const { id, value } = e.target;
    const updatedAssignment = { ...roomAssignment };

    if (id === "quantity") {
      updatedAssignment[id] = value === "" ? "" : Number(value);
    } else {
      updatedAssignment[id] = value;
    }

    if (id === "roomType") {
      updatedAssignment.accommodation = "";
    }

    setRoomAssignment(updatedAssignment);

    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: null
      });
    }
  };

  const validateHotelForm = () => {
    const newErrors = {};

    if (!hotelData.name.trim()) {
      newErrors.name = "El nombre del hotel es requerido";
    }

    if (!hotelData.city.trim()) {
      newErrors.city = "La ciudad es requerida";
    }

    if (!hotelData.address.trim()) {
      newErrors.address = "La dirección es requerida";
    }

    if (!hotelData.nit.trim()) {
      newErrors.nit = "El NIT es requerido";
    } else if (!/^\d+$/.test(hotelData.nit)) {
      newErrors.nit = "El NIT debe contener solo números";
    }

    if (hotelData.maxRooms === "") {
      newErrors.maxRooms = "El número máximo de habitaciones es requerido";
    } else if (isNaN(hotelData.maxRooms) || hotelData.maxRooms <= 0) {
      newErrors.maxRooms = "Debe ser un número mayor que 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRoomAssignmentForm = () => {
    const newErrors = {};

    if (!roomAssignment.roomType) {
      newErrors.roomType = "Seleccione un tipo de habitación";
    }

    if (!roomAssignment.accommodation) {
      newErrors.accommodation = "Seleccione un tipo de acomodación";
    }

    if (roomAssignment.quantity === "") {
      newErrors.quantity = "La cantidad es requerida";
    } else if (isNaN(roomAssignment.quantity) || roomAssignment.quantity <= 0) {
      newErrors.quantity = "Debe ser un número mayor que 0";
    }

    if (roomAssignment.roomType && roomAssignment.accommodation) {
      if (!isValidRoomTypeAccommodation(roomAssignment.roomType, roomAssignment.accommodation)) {
        newErrors.combination = "La combinación de tipo y acomodación no es válida";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidRoomTypeAccommodation = (type, accommodation) => {
    switch (type) {
      case "ESTANDAR":
        return ["SENCILLA", "DOBLE"].includes(accommodation);
      case "JUNIOR":
        return ["TRIPLE", "CUADRUPLE"].includes(accommodation);
      case "SUITE":
        return ["SENCILLA", "DOBLE", "TRIPLE"].includes(accommodation);
      default:
        return false;
    }
  };

  // SOLO VALIDAR Y PASAR AL SIGUIENTE PASO (NO GUARDAR)
  const handleHotelContinue = (e) => {
    e.preventDefault();

    if (!validateHotelForm()) {
      return;
    }

    // Solo cambiar al paso 2 SIN guardar en BD
    setCurrentStep(2);
    setMessage({
      text: "Ahora asigne las habitaciones al hotel",
      type: "success"
    });
  };

  const handleAddRoom = () => {
    if (!validateRoomAssignmentForm()) {
      return;
    }

    // Verificar si ya existe esta combinación en la lista
    const existingSelection = selectedRooms.findIndex(
        item => item.roomType === roomAssignment.roomType &&
            item.accommodation === roomAssignment.accommodation
    );

    if (existingSelection >= 0) {
      // Actualizar cantidad si ya existe
      const updatedRooms = [...selectedRooms];
      updatedRooms[existingSelection].quantity += Number(roomAssignment.quantity);
      setSelectedRooms(updatedRooms);
    } else {
      // Añadir a la lista
      setSelectedRooms([...selectedRooms, {
        roomType: roomAssignment.roomType,
        accommodation: roomAssignment.accommodation,
        quantity: Number(roomAssignment.quantity)
      }]);
    }

    // Limpiar formulario
    setRoomAssignment({
      roomType: "",
      accommodation: "",
      quantity: ""
    });

    setMessage({
      text: "Habitación añadida a la lista",
      type: "success"
    });
  };

  // ESTA ES LA FUNCIÓN QUE GUARDA TODO
  const handleSaveEverything = async () => {
    if (selectedRooms.length === 0) {
      setMessage({
        text: "Debe añadir al menos una habitación",
        type: "error"
      });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // PASO 1: Crear el hotel
      const hotelResponse = await axios.post(ENDPOINTS.HOTELS, {
        name: hotelData.name,
        city: hotelData.city,
        address: hotelData.address,
        nit: hotelData.nit,
        maxRooms: Number(hotelData.maxRooms)
      });

      const createdHotelId = hotelResponse.data.id;

      // PASO 2: Crear o encontrar las habitaciones y preparar IDs
      const roomsWithIds = [];

      for (const selectedRoom of selectedRooms) {
        // Buscar si ya existe esta combinación
        let existingRoom = availableRooms.find(
            room => room.type === selectedRoom.roomType &&
                room.accommodation === selectedRoom.accommodation
        );

        let roomId;

        if (existingRoom) {
          roomId = existingRoom.id;
        } else {
          // Crear la habitación
          const roomResponse = await axios.post(ENDPOINTS.ROOMS, {
            type: selectedRoom.roomType,
            accommodation: selectedRoom.accommodation
          }, getAuthConfig());

          roomId = roomResponse.data.id;
        }

        roomsWithIds.push({
          id: roomId,
          quantity: selectedRoom.quantity
        });
      }

      // PASO 3: Asignar habitaciones al hotel
      await axios.post(ENDPOINTS.HOTEL_ROOMS_ASIGNAR, {
        hotelId: createdHotelId,
        rooms: roomsWithIds
      }, getAuthConfig());

      // ÉXITO - Actualizar listas y limpiar formulario
      setMessage({
        text: "¡Hotel y habitaciones registrados exitosamente!",
        type: "success"
      });

      fetchHotels();
      fetchRooms();
      fetchHotelRooms();
      resetAll();

    } catch (error) {
      console.error("Error al guardar:", error);

      // Capturar el mensaje específico del backend
      let errorMessage = "Error al guardar el hotel y las habitaciones";

      if (error.response) {
        if (error.response.data) {
          if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          }
        }
      } else if (error.request) {
        errorMessage = "No se pudo conectar con el servidor. Verifique su conexión.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      setMessage({
        text: errorMessage,
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHotel = () => {
    setCurrentStep(1);
    setMessage({ text: "", type: "" });
  };

  const handleCancel = () => {
    resetAll();
  };

  const resetAll = () => {
    setHotelData({
      name: "",
      city: "",
      address: "",
      nit: "",
      maxRooms: ""
    });

    setRoomAssignment({
      roomType: "",
      accommodation: "",
      quantity: ""
    });

    setSelectedRooms([]);
    setCurrentStep(1);
    setErrors({});
    setMessage({ text: "", type: "" });
  };

  const handleRemoveRoom = (index) => {
    const updatedRooms = [...selectedRooms];
    updatedRooms.splice(index, 1);
    setSelectedRooms(updatedRooms);
  };

  const getRoomTypeName = (typeCode) => {
    const roomType = roomTypes.find(type => type.value === typeCode);
    return roomType ? roomType.label : typeCode;
  };

  const getAccommodationName = (accommodationCode) => {
    const accommodation = accommodationTypes.find(acc => acc.value === accommodationCode);
    return accommodation ? accommodation.label : accommodationCode;
  };

  const getCompatibleAccommodations = (roomType) => {
    if (!roomType) return accommodationTypes;

    switch(roomType) {
      case "ESTANDAR":
        return accommodationTypes.filter(acc =>
            ["SENCILLA", "DOBLE"].includes(acc.value)
        );
      case "JUNIOR":
        return accommodationTypes.filter(acc =>
            ["TRIPLE", "CUADRUPLE"].includes(acc.value)
        );
      case "SUITE":
        return accommodationTypes.filter(acc =>
            ["SENCILLA", "DOBLE", "TRIPLE"].includes(acc.value)
        );
      default:
        return accommodationTypes;
    }
  };

  return (
      <div className="content-section">
        {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
        )}

        {/* Indicador de pasos */}
        <div className="steps-indicator">
          <div className={`step ${currentStep === 1 ? 'active' : 'completed'}`}>
            <span className="step-number">1</span>
            <span className="step-label">Datos del Hotel</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Asignar Habitaciones</span>
          </div>
        </div>

        {currentStep === 1 ? (
            // PASO 1: DATOS DEL HOTEL
            <>
              <h2 className="section-title">Paso 1: Datos del Hotel</h2>
              <p className="section-description">
                Complete la información básica del hotel
              </p>

              <div className="form-container">
                <form className="register-form" onSubmit={handleHotelContinue}>
                  <div className="form-group">
                    <label htmlFor="name">Nombre del Hotel</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Ingrese nombre del hotel"
                        value={hotelData.name}
                        onChange={handleHotelChange}
                        className={errors.name ? "input-error" : ""}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">Ciudad</label>
                      <input
                          type="text"
                          id="city"
                          placeholder="Ej: Bogotá, Medellín"
                          value={hotelData.city}
                          onChange={handleHotelChange}
                          className={errors.city ? "input-error" : ""}
                      />
                      {errors.city && <span className="error-message">{errors.city}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="address">Dirección</label>
                      <input
                          type="text"
                          id="address"
                          placeholder="Calle, carrera, número"
                          value={hotelData.address}
                          onChange={handleHotelChange}
                          className={errors.address ? "input-error" : ""}
                      />
                      {errors.address && <span className="error-message">{errors.address}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="nit">NIT</label>
                      <input
                          type="text"
                          id="nit"
                          placeholder="123456789"
                          value={hotelData.nit}
                          onChange={handleHotelChange}
                          className={errors.nit ? "input-error" : ""}
                      />
                      {errors.nit && <span className="error-message">{errors.nit}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="maxRooms">Capacidad máxima de habitaciones</label>
                      <input
                          type="number"
                          id="maxRooms"
                          placeholder="Número de habitaciones"
                          value={hotelData.maxRooms}
                          onChange={handleHotelChange}
                          className={errors.maxRooms ? "input-error" : ""}
                          min="1"
                      />
                      {errors.maxRooms && <span className="error-message">{errors.maxRooms}</span>}
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      Continuar a Habitaciones →
                    </button>
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={handleCancel}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </>
        ) : (
            // PASO 2: ASIGNACIÓN DE HABITACIONES
            <>
              <h2 className="section-title">Paso 2: Asignar Habitaciones</h2>
              <p className="section-description">
                Hotel: <strong>{hotelData.name}</strong> - {hotelData.city}
              </p>

              <div className="form-container">
                <form className="register-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="roomType">Tipo de habitación</label>
                      <select
                          id="roomType"
                          value={roomAssignment.roomType}
                          onChange={handleRoomAssignmentChange}
                          className={errors.roomType || errors.combination ? "input-error" : ""}
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
                          className={errors.accommodation || errors.combination ? "input-error" : ""}
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
                          className={errors.quantity ? "input-error" : ""}
                          min="1"
                      />
                      {errors.quantity && <span className="error-message">{errors.quantity}</span>}
                    </div>
                  </div>

                  {errors.combination && (
                      <div className="form-group">
                        <span className="error-message">{errors.combination}</span>
                      </div>
                  )}

                  <div className="form-info">
                    <strong>Restricciones:</strong>
                    <ul>
                      <li>Habitación Estándar: Solo Sencilla o Doble</li>
                      <li>Habitación Junior: Solo Triple o Cuádruple</li>
                      <li>Habitación Suite: Solo Sencilla, Doble o Triple</li>
                    </ul>
                  </div>

                  <div className="form-actions">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={handleAddRoom}
                    >
                      ➕ Añadir Habitación
                    </button>
                  </div>
                </form>
              </div>

              {/* Lista de habitaciones seleccionadas */}
              <div className="selected-rooms-container">
                <h3>Habitaciones a asignar</h3>
                {selectedRooms.length > 0 ? (
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
                                  type="button"
                                  className="action-btn delete"
                                  onClick={() => handleRemoveRoom(index)}
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                ) : (
                    <p>No hay habitaciones añadidas. Agregue al menos una.</p>
                )}
              </div>

              <div className="form-actions">
                <button
                    type="button"
                    className="btn-primary"
                    onClick={handleSaveEverything}
                    disabled={loading || selectedRooms.length === 0}
                >
                  {loading ? "Guardando..." : "✓ Guardar Hotel y Habitaciones"}
                </button>
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleBackToHotel}
                    disabled={loading}
                >
                  ← Volver a Datos del Hotel
                </button>
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                >
                  Cancelar Todo
                </button>
              </div>
            </>
        )}

        {/* Tabla de hoteles registrados */}
        <div className="users-table-container">
          <h3 className="table-title">Hoteles y Habitaciones Registrados</h3>
          <table className="users-table">
            <thead>
            <tr>
              <th>Hotel</th>
              <th>Ciudad</th>
              <th>Dirección</th>
              <th>NIT</th>
              <th>Cantidad de Habitaciones</th>
            </tr>
            </thead>
            <tbody>
            {hotels.length > 0 ? (
                hotelRooms.map((hotels) => (
                    <tr key={hotels.id}>
                      <td>{hotels.name}</td>
                      <td>{hotels.city}</td>
                      <td>{hotels.address}</td>
                      <td>{hotels.nit}</td>
                      <td>{hotels.maxRooms}</td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No hay registros
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default HotelRegisterWithRooms;