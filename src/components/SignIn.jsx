import React, { useState, useCallback } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import BackgroundImage from '../assets/BackgroundLogin.jpg';
import { FaHome } from 'react-icons/fa';
import Logo from '../../src/assets/Artesanías.png';
import { useAuth } from '../Context/contextAuth';

export const SignIn = () => {
    const navigate = useNavigate();
    const { login, requestPasswordReset, verifyResetCode, resetPassword } = useAuth();
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        tipoUsuario: 'administrador',
        code: '',
        newPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [forgotPassword, setForgotPassword] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleChange = useCallback((e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    }, []);

    const showNotification = (message, isError = false) => {
        setNotification({ message, isError });
        setTimeout(() => {
            setNotification(null);
        }, 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true); 

    const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'El campo del correo electrónico es obligatorio.';
        }
        if (forgotPassword) {
            if (!verificationSent && !formData.tipoUsuario) {
                newErrors.tipoUsuario = 'El tipo de usuario es obligatorio';
            }
            if (verificationSent && !codeVerified && !formData.code) {
                newErrors.code = 'El campo del código de verificación es obligatorio.';
            }
            if (codeVerified && !formData.newPassword) {
                newErrors.newPassword = 'El campo de la nueva contraseña es obligatorio.';
            }
        } else {
            if (!formData.password) {
                newErrors.password = 'El campo de la contraseña es obligatorio.';
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                if (forgotPassword) {
                    if (!verificationSent) {
                        const result = await requestPasswordReset(formData.tipoUsuario, formData.email);
                        if (result.success) {
                            setVerificationSent(true);
                            showNotification(result.message || 'El correo de recuperación ha sido enviado con éxito.');
                        } else {
                            showNotification(result.error || 'Hubo un problema al procesar tu solicitud de recuperación de contraseña. Por favor, intenta nuevamente.', true);
                        }
                    } else if (!codeVerified) {
                        const codeResult = await verifyResetCode(formData.tipoUsuario, formData.email, formData.code);
                        if (codeResult.success) {
                            setCodeVerified(true);
                            showNotification('El código ha sido verificado con éxito. Ahora puedes establecer una nueva contraseña.');
                        } else {
                            showNotification(codeResult.error || 'El código de verificación ingresado es incorrecto.', true);
                        }
                    } else {
                        const resetResult = await resetPassword(formData.tipoUsuario, formData.email, formData.newPassword, formData.code);
                        if (resetResult.success) {
                            showNotification('¡Tu contraseña ha sido actualizada correctamente!');
                            setForgotPassword(false);
                            setVerificationSent(false);
                            setCodeVerified(false);
                        } else {
                            showNotification(resetResult.error || 'Hubo un problema al intentar actualizar la contraseña.', true);
                        }
                    }
                } else {
                    const result = await login(formData.tipoUsuario, formData.email, formData.password);
                    if (result.success) {
                        showNotification('¡Inicio de sesión exitoso!');
                        setTimeout(() => navigate('/'), 2000);
                    } else {
                        showNotification(result.error || 'Error desconocido. Intenta de nuevo.', true);
                    }
                }
            } catch (error) {
                
                showNotification('Hubo un problema al procesar la solicitud. Por favor, intenta de nuevo.', true);
            }
            finally {
                setIsSubmitting(false);
            }
        } else {
            showNotification('Por favor, asegúrate de completar correctamente el formulario.', true);
            setIsSubmitting(false); 
        }
        
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
            <NavLink to="/login" className="absolute top-4 left-4">
                <FaHome className="text-darkyellow text-4xl hover:text-lightyellow" />
            </NavLink>
            <div className="relative bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-4 sm:mx-8 md:mx-16 lg:mx-32">
                <img src={Logo} alt="Logo" className="h-24 w-24 mx-auto mb-6" />
                <h1 className="text-2xl font-bold mb-6 text-center">
                    {forgotPassword ? 'Recuperar Contraseña' : 'Iniciar Sesión'}
                </h1>
                {notification && (
                    <div className={`border px-4 py-3 rounded relative mb-4 ${notification.isError ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'}`} role="alert">
                        <span className="block sm:inline">{notification.message}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-black text-sm font-bold mb-2" htmlFor="tipoUsuario">
                            Tipo de Usuario
                        </label>
                        <select
                            id="tipoUsuario"
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline ${errors.tipoUsuario ? 'border-red-500' : ''}`}
                            value={formData.tipoUsuario}
                            onChange={handleChange}
                            aria-required="true"
                        >
                            <option value="administrador">Administrador</option>
                            <option value="comprador">Comprador</option>
                        </select>
                        {errors.tipoUsuario && <p className="text-red-500 text-xs italic">{errors.tipoUsuario}</p>}
                    </div>
                    {forgotPassword ? (
                        <>
                            <div className="mb-4">
                                <label className="block text-black text-sm font-bold mb-2" htmlFor="email">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                                    placeholder="Correo Electrónico"
                                    value={formData.email}
                                    onChange={handleChange}
                                    aria-required="true"
                                    disabled={verificationSent}
                                />
                                {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                            </div>
                            {verificationSent && !codeVerified && (
                                <div className="mb-4">
                                    <label className="block text-black text-sm font-bold mb-2" htmlFor="code">
                                        Código de Verificación
                                    </label>
                                    <input
                                        type="text"
                                        id="code"
                                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline ${errors.code ? 'border-red-500' : ''}`}
                                        placeholder="Código de Verificación"
                                        value={formData.code}
                                        onChange={handleChange}
                                        aria-required="true"
                                    />
                                    {errors.code && <p className="text-red-500 text-xs italic">{errors.code}</p>}
                                </div>
                            )}
                            {codeVerified && (
                                <div className="mb-4">
                                    <label className="block text-black text-sm font-bold mb-2" htmlFor="newPassword">
                                        Nueva Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline ${errors.newPassword ? 'border-red-500' : ''}`}
                                        placeholder="Nueva Contraseña"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        aria-required="true"
                                    />
                                    {errors.newPassword && <p className="text-red-500 text-xs italic">{errors.newPassword}</p>}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="mb-4">
                                <label className="block text-black text-sm font-bold mb-2" htmlFor="email">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                                    placeholder="Correo Electrónico"
                                    value={formData.email}
                                    onChange={handleChange}
                                    aria-required="true"
                                />
                                {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-black text-sm font-bold mb-2" htmlFor="password">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
                                    placeholder="Contraseña"
                                    value={formData.password}
                                    onChange={handleChange}
                                    aria-required="true"
                                />
                                {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
                            </div>
                        </>
                    )}
                    <div className="flex flex-col items-center space-y-4">
  <button
    type="submit"
    className={`bg-darkyellow hover:bg-lightyellow text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-lightyellow active:bg-lightyellow transition-colors duration-300'
    }`}
    disabled={isSubmitting}
  >
    {isSubmitting ? 'Iniciando Sesión...' : forgotPassword ? (codeVerified ? 'Actualizar Contraseña' : 'Enviar Código') : 'Iniciar Sesión'}
  </button>

  <button
    type="button"
    className="inline-block font-bold text-sm text-darkyellow hover:text-lightyellow"
    onClick={() => setForgotPassword(!forgotPassword)}
  >
    {forgotPassword ? 'Volver a Iniciar Sesión' : 'Olvidé mi Contraseña'}
  </button>
</div>
                    <p className="mt-4 text-center">
                        ¿No tienes una cuenta?{' '}
                        <NavLink to="/Register" className="text-darkyellow hover:underline">
                            Registrate
                        </NavLink>
                    </p>
                </form>
            </div>
        </div>
    );
};
