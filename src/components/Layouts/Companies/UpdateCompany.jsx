import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import BackgroundImage from '../../../assets/BackgroundLogin.jpg';
import { FaHome } from 'react-icons/fa';
import Logo from '../../../assets/Artesanías.png';
import { useEmpresa } from '../../../Context/contextEmpresa';

export const UpdateCompany = () => {
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const [idadministrador, setIdAdministrador] = useState('');
    const navigate = useNavigate();
    const { setEmpresas } = useEmpresa();
    const { id } = useParams(); // Obtener el ID de la URL

    useEffect(() => {
        const storedId = localStorage.getItem('userId');
        if (storedId) {
            setIdAdministrador(storedId);
        }

        const fetchCompany = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token de autenticación no encontrado');
                }
        
                const response = await fetch(`https://backtesteo.onrender.com/api/empresa/consultar/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
        
                if (!response.ok) {
                    const errorDetails = await response.json();
                    console.error('Error al obtener la empresa:', errorDetails);
                    throw new Error('Error al obtener la empresa');
                }
        
                const data = await response.json();
                console.log('Datos recibidos:', data); // Depuración completa
        
                // Verificar si data es un array y tiene al menos un objeto
                if (Array.isArray(data) && data.length > 0) {
                    const company = data[0]; // Acceder al primer objeto del array
                    if (company.nombre !== undefined && company.direccion !== undefined && company.descripcion !== undefined) {
                        setNombre(company.nombre || '');
                        setDireccion(company.direccion || '');
                        setDescripcion(company.descripcion || '');
                    } else {
                        throw new Error('Datos de empresa incompletos');
                    }
                } else {
                    throw new Error('Datos de empresa incompletos');
                }
            } catch (error) {
                console.error('Error al cargar la empresa:', error);
                setError('Error al cargar la información de la empresa.');
            }
        };

        fetchCompany();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedEmpresa = {
            nombre,
            direccion,
            descripcion,
            idadministrador
        };

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No se encontró un token en localStorage');
            setError('No se encontró un token en localStorage');
            return;
        }

        try {
            const response = await fetch(`https://backtesteo.onrender.com/api/empresa/actualizar/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedEmpresa),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                console.error('Error en la actualización de la empresa:', errorDetails);
                throw new Error('Error en la actualización de la empresa');
            }
            
            const result = await response.json();
            console.log('Empresa actualizada exitosamente:', result);

            setNotification('Empresa actualizada exitosamente');
            setTimeout(() => {
                setNotification('');
                navigate('/CompaniesForAdmin');
            }, 2000);

            setEmpresas(prevEmpresas =>
                prevEmpresas.map(emp => emp.codigoempresa === id ? { ...emp, ...updatedEmpresa } : emp)
            );
        } catch (error) {
            console.error('Error al actualizar la empresa:', error);
            setError('Error al actualizar la empresa.');
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: `url(${BackgroundImage})`,
            }}
        >
            <NavLink to="/companiesForAdmin" className="absolute top-4 left-4">
                <FaHome className="text-darkyellow text-4xl" />
            </NavLink>
            <div className="relative bg-white p-5 rounded-lg shadow-md w-full max-w-md mx-4 sm:mx-8 md:mx-16 lg:mx-32">
                <img src={Logo} alt="Logo" className="h-24 w-24 mx-auto mb-6" />
                <h1 className="text-2xl font-bold mb-6 text-center">Actualizar Empresa</h1>
                {error && (
                    <div className="border px-4 py-3 rounded relative mb-4 bg-red-100 border-red-400 text-red-700" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                {notification && (
                    <div className={`border px-4 py-3 rounded relative mb-4 ${notification.startsWith('Error') ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'}`} role="alert">
                        <span className="block sm:inline">{notification}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-black text-sm font-bold mb-2" htmlFor="nombre">
                            Nombre de Empresa
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nombre de Empresa"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-black text-sm font-bold mb-2" htmlFor="direccion">
                            Dirección
                        </label>
                        <input
                            type="text"
                            id="direccion"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Dirección"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-black text-sm font-bold mb-2" htmlFor="descripcion">
                            Descripción
                        </label>
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Descripción"
                            required
                        />
                    </div>
                    <div className="flex ">
                        <button
                            type="submit"
                            className="bg-darkyellow hover:bg-lightyellow text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Actualizar Empresa
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
