import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Función para decodificar JWT
const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [userType, setUserType] = useState(localStorage.getItem('userType') || 'comprador'); // Valor predeterminado
    const [notification, setNotification] = useState('');

    const login = async (tipoUsuario, correo_electronico, contrasena) => {
        try {
            const response = await fetch('https://checkpoint-9tp4.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tipoUsuario, correo_electronico, contrasena })
            });

            const data = await response.json();
            console.log('Server response:', data);

            if (response.ok) {
                setToken(data.token);
                localStorage.setItem('token', data.token);

                const decodedToken = decodeToken(data.token);
                if (decodedToken) {
                    setUserId(decodedToken.id);
                    setUserType(decodedToken.tipoUsuario);
                    localStorage.setItem('userId', decodedToken.id);
                    localStorage.setItem('userType', decodedToken.tipoUsuario);
                    setNotification('Inicio de sesión exitoso');
                    return { success: true };
                } else {
                    throw new Error('Error decoding token');
                }
            } else {
                throw new Error(data.error || data.message || 'Error desconocido');
            }
        } catch (error) {
            console.error('Error al intentar iniciar sesión:', error);
            setNotification(error.message);
            return { success: false, error: error.message };
        }
    };

    const register = async (tipoUsuario, nombre, contrasena, correo_electronico, telefono, historia) => {
        try {
            const response = await fetch('https://checkpoint-9tp4.onrender.com/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tipoUsuario, nombre, contrasena, correo_electronico, telefono, historia })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Usuario registrado con éxito');
                return { success: true };
            } else {
                throw new Error(data.error || data.message || 'Error desconocido');
            }
        } catch (error) {
            console.error('Error al intentar registrar el usuario:', error);
            return { success: false, error: error.message };
        }
    };

    const requestPasswordReset = async (tipoUsuario, correo_electronico) => {
        try {
            const response = await fetch('https://checkpoint-9tp4.onrender.com/api/auth/request-password-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tipoUsuario, correo_electronico }),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, message: data.message || 'Se ha enviado un enlace para restablecer la contraseña a tu correo electrónico' };
            } else {
                return { success: false, error: data.message || 'Error en la solicitud de restablecimiento de contraseña' };
            }
        } catch (error) {
            return { success: false, error: error.message || 'Error en la solicitud de restablecimiento de contraseña' };
        }
    };

    const verifyResetCode = async (tipoUsuario, correo_electronico, verificationCode) => {
        try {
            const response = await fetch('https://checkpoint-9tp4.onrender.com/api/auth/verify-reset-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tipoUsuario, correo_electronico, verificationCode }),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, message: data.message || 'Código de verificación válido' };
            } else {
                return { success: false, error: data.message || 'Código de verificación no válido o expirado' };
            }
        } catch (error) {
            return { success: false, error: error.message || 'Error en la verificación del código' };
        }
    };

    const resetPassword = async (tipoUsuario, correo_electronico, nuevaContrasena, verificationCode) => {
        try {
            const response = await fetch('https://checkpoint-9tp4.onrender.com/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tipoUsuario, correo_electronico, nuevaContrasena, verificationCode }),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, message: data.message || 'Contraseña restablecida con éxito' };
            } else {
                return { success: false, error: data.message || 'Error al restablecer la contraseña' };
            }
        } catch (error) {
            return { success: false, error: error.message || 'Error al restablecer la contraseña' };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setUserId(null);
        setUserType('comprador'); // Restablecer el tipo de usuario a 'comprador'
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userType');
        setNotification('Has cerrado sesión exitosamente');
    };

    useEffect(() => {
        // Recuperar el token y el id del usuario del local storage al iniciar la aplicación
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);

            // Decodificar el token y almacenar el id del usuario
            const decodedToken = decodeToken(storedToken);
            if (decodedToken) {
                setUserId(decodedToken.id);
                setUserType(decodedToken.tipoUsuario);
                localStorage.setItem('userId', decodedToken.id);
                localStorage.setItem('userType', decodedToken.tipoUsuario);
            }
        } else {
            // Si no hay token, establecer el tipo de usuario a 'comprador'
            setUserType('comprador');
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, userId, userType, login, register, logout, notification, requestPasswordReset, verifyResetCode, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar el contexto
export const useAuth = () => {
    return useContext(AuthContext);
};