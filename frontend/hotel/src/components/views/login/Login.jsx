import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Star, AlertCircle, CheckCircle } from 'lucide-react';
import authService from '../../services/authService';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Formato de correo electrónico inválido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      setLoginMessage('');

      try {
        await authService.login(email, password);

        setLoginMessage('¡Inicio de sesión exitoso!');

        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);

      } catch (error) {
        console.error('Error de inicio de sesión:', error);

        if (error.response) {
          if (error.response.status === 401) {
            setLoginMessage('Credenciales incorrectas. Verifique su email y contraseña.');
          } else {
            setLoginMessage(`Error al iniciar sesión (${error.response.status}). Intente nuevamente.`);
          }
        } else if (error.request) {
          setLoginMessage('No se pudo conectar con el servidor. Verifique su conexión a internet.');
        } else {
          setLoginMessage('Error al procesar su solicitud. Intente nuevamente.');
        }

        setIsSubmitting(false);
      }
    }
  };

  return (
      <div className="login-page">
        <div className="login-background"></div>

        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <Star className="login-star-icon" size={40} fill="currentColor" />
              <h1 className="login-title">Hoteles de Lujo</h1>
              <p className="login-subtitle">Bienvenido de vuelta</p>
            </div>

            {loginMessage && (
                <div className={`login-message ${loginMessage.includes('exitoso') ? 'success' : 'error'}`}>
                  {loginMessage.includes('exitoso') ? (
                      <CheckCircle size={20} />
                  ) : (
                      <AlertCircle size={20} />
                  )}
                  <span>{loginMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-form-group">
                <label htmlFor="email" className="login-label">
                  <Mail size={18} />
                  <span>Correo Electrónico</span>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`login-input ${errors.email ? 'input-error' : ''}`}
                    placeholder="correo@ejemplo.com"
                    disabled={isSubmitting}
                />
                {errors.email && (
                    <span className="login-error-message">
                  <AlertCircle size={14} />
                      {errors.email}
                </span>
                )}
              </div>

              <div className="login-form-group">
                <label htmlFor="password" className="login-label">
                  <Lock size={18} />
                  <span>Contraseña</span>
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`login-input ${errors.password ? 'input-error' : ''}`}
                    placeholder="Tu contraseña"
                    disabled={isSubmitting}
                />
                {errors.password && (
                    <span className="login-error-message">
                  <AlertCircle size={14} />
                      {errors.password}
                </span>
                )}
              </div>

              <button
                  type="submit"
                  disabled={isSubmitting}
                  className="login-button"
              >
                {isSubmitting ? (
                    <>
                      <div className="login-spinner"></div>
                      <span>Iniciando sesión...</span>
                    </>
                ) : (
                    <>
                      <LogIn size={20} />
                      <span>Iniciar Sesión</span>
                    </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>© 2025 Hoteles de Lujo</p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Login;