import React, { useEffect, useState, useContext } from 'react';
import { useEmpresa } from '../../../Context/contextEmpresa';
import ProductoContext from '../../../Context/contextProducto';
import { Header } from '../ForView/Header';
import { NavLink } from 'react-router-dom';
import { Footer } from '../ForView/Footer';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import banner from '../../../assets/FondoEmpresas.png'; 
import { FaCoffee } from "react-icons/fa";

export const CompaniesForAdmin = () => {
    const { empresas, setEmpresas } = useEmpresa();
    const { getProductosByCodigoEmpresa } = useContext(ProductoContext);
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [selectedEmpresa, setSelectedEmpresa] = useState(null);
    const [error, setError] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [empresaToDelete, setEmpresaToDelete] = useState(null);
    const [showEmpresaModal, setShowEmpresaModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchText, setSearchText] = useState(''); 


    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            console.log('User ID encontrado en localStorage:', storedUserId);
            setUserId(storedUserId);
            fetchEmpresas(storedUserId);
        } else {
            console.log('No se encontró User ID en localStorage');
        }
    }, []);

    useEffect(() => {
        if (selectedEmpresa) {
            getProductosByCodigoEmpresa(selectedEmpresa.codigoempresa);
        }
    }, [selectedEmpresa]);

    const fetchEmpresas = async (idadministrador) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token de autenticación no encontrado');
            }
            
            const response = await fetch(`https://backtesteo.onrender.com/api/empresa/consultarPorAdministrador/${idadministrador}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Token de autenticación inválido o expirado');
                }
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get("content-type");

            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                console.log('Datos recibidos del servidor:', data);

                if (Array.isArray(data) && Array.isArray(data[0])) {
                    const empresas = data[0];
                    setEmpresas(empresas);
                } else {
                    throw new Error('Formato de datos inesperado');
                }
            } else {
                const text = await response.text();
                console.error('Respuesta no es JSON:', text);
                throw new Error('Respuesta no es JSON');
            }
        } catch (error) {
            console.error('Error al obtener empresas:', error.message);
        }
    };

    useEffect(() => {
        if (selectedEmpresa) {
            console.log(`Empresa seleccionada: ${selectedEmpresa.nombre}`);
        }
    }, [selectedEmpresa]);

     useEffect(() => {
        if (selectedEmpresa) {
            console.log(`Empresa seleccionada: ${selectedEmpresa.nombre}`);
            setShowEmpresaModal(true); // Mostrar el modal al seleccionar una empresa
        }
    }, [selectedEmpresa]);

    const viewEmpresa = (empresa) => {
        setSelectedEmpresa(empresa);
    };

    const closeEmpresaModal = () => {
        setSelectedEmpresa(null);
    };

    const handleUpdate = (empresa) => {
        navigate(`/UpdateCompany/${empresa.codigoempresa}`);
    };

    const confirmDelete = (empresa) => {
        setEmpresaToDelete(empresa);
        setShowConfirmModal(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token de autenticación no encontrado');
            }
            
            const response = await fetch(`https://backtesteo.onrender.com/api/empresa/eliminar/${empresaToDelete.codigoempresa}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Token de autenticación inválido o expirado');
                }
                // Verifica el mensaje de error en el cuerpo de la respuesta si está disponible
                const errorResponse = await response.json();
                if (errorResponse.message) {
                    setError(`Error: ${errorResponse.message}`);
                } else {
                    setError('No se pudo eliminar la empresa. Inténtelo de nuevo más tarde.');
                }
                return; // Salir de la función si hubo un error
            }

            // Si todo salió bien, actualiza el estado
            setEmpresas(empresas.filter(emp => emp.codigoempresa !== empresaToDelete.codigoempresa));
            setShowConfirmModal(false); // Cerrar el modal de confirmación
            setError(''); // Limpiar el mensaje de error en caso de éxito
        } catch (error) {
            console.error('Error al eliminar empresa:', error.message);
            setError('Error: Hay productos previamente registrados en la página'); // Establecer el mensaje de error específico
        }
    };

    
   // Filtrar empresas basadas en el texto de búsqueda
  const filteredEmpresas = empresas.filter(empresa =>
    empresa.nombre.toLowerCase().includes(searchText) ||
    empresa.direccion.toLowerCase().includes(searchText)
  );


     // Función para manejar los cambios en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  




    return (
        <div>
            <div className="flex flex-col min-h-screen bg-gray-200">
                <Header />
                <input
                        type="text"
                        placeholder='Buscar Empresas...'
                        value={searchText}
                        onChange={handleSearchChange}
                        className="flex self-center w-96 mt-5 mb-4 p-2 border border-gray-300 rounded"
                    />
                <div className="container mx-auto my-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    <div className="bg-white border rounded-lg overflow-hidden shadow-md flex flex-col items-center p-4 cursor-pointer mb-4">
                        <div className="flex flex-col items-center">
                            <span className="text-black text-sm text-center">
                                Bienvenido, aquí podrá consultar información sobre sus locales y empresas.<br /><br />
                                Recuerde, no puede borrar una empresa con productos anteriormente registrados en esta, deberá cambiar los productos de empresa o eliminarlos primero.<br />
                                <br />
                                ¡Tenga un feliz día!
                            </span>
                        </div>
                    </div>
                    {filteredEmpresas.length === 0 ? (
    <div className="bg-white border rounded-lg overflow-hidden shadow-md flex flex-col items-center p-4 cursor-pointer">
        <div className="flex flex-col items-center">
            <span className="text-black text-sm text-center">No hay empresas que coincidan con la búsqueda</span>
        </div>
    </div>
) : (
    filteredEmpresas.map((empresa) => (
        <div
            key={empresa.codigoempresa}
            className="bg-white border rounded-lg overflow-hidden shadow-md cursor-pointer flex flex-col items-center p-4"
            onClick={() => viewEmpresa(empresa)}
        >
            <h3 className="text-lg font-semibold mb-2 text-center">{empresa.nombre}</h3>
            <p className="text-center underline text-darkyellow">{empresa.direccion}</p>
            <p className="text-center line-clamp-5">{empresa.descripcion}</p>
            <p className="text-center text-gray-600">ID: {empresa.codigoempresa}</p>
            <div className="flex gap-32 mt-4">
                <button
                    className="text-darkyellow hover:text-lightyellow text-3xl"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleUpdate(empresa);
                    }}
                >
                    <FaEdit className="text-xl" />
                </button>
                <button
                    className="text-darkpurple hover:text-lightpurple text-3xl"
                    onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(empresa);
                    }}
                >
                    <FaTrash className="text-xl" />
                </button>
            </div>
        </div>
    ))
)}

                    <div className="bg-white border rounded-lg overflow-hidden shadow-md flex flex-col items-center p-4 cursor-pointer">
                        <div className="flex flex-col items-center" onClick={() => navigate('/LoginCompanies')}>
                            <svg
                                className="w-8 h-8 mb-2 text-darkyellow"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                ></path>
                            </svg>
                            <span className="text-black text-sm text-center">Agregar una empresa nueva</span>
                            <NavLink to="/LoginCompanies" className="text-darkyellow hover:underline text-sm ml-2">
                                Agregar Empresa
                            </NavLink>
                        </div>
                    </div>
                </div>
                {/* Mostrar mensaje de error si hay uno */}
                {error && (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-brown-600 bg-darkyellow text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
                        <svg className="w-6 h-6 mr-2 text-2xl text-white"> <FaCoffee /> </svg>
                        <span> ¡Aún hay productos registrados en la empresa!</span>
                        <button
                            className="ml-4 bg-darkyellow text-white hover:text-gray-200"
                            onClick={() => setError('')}
                        >
                            <FaTimes />
                        </button>
                    </div>
                )}
                {/* Modal de confirmación de eliminación */}
                {showConfirmModal && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                            <div className='organizator flex flex-col justify-center'>
                            <div className='flex justify-center'>
                            <svg className="w-6 h-6 mr-2 text-2xl text-darkyellow"> <FaCoffee /> </svg>
                            <h3 className="text-lg font-semibold mb-4  text-darkyellow">Confirmar eliminación</h3>
                            </div>
                            <p className="mb-4 text-center ">¿Estás seguro de que deseas eliminar la empresa "{empresaToDelete.nombre}"?</p>
                            </div>
                            <div className="flex justify-center gap-4">
                                <button
                                    className="bg-gray-300 text-black px-4 py-2 rounded-lg"
                                    onClick={() => setShowConfirmModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="text-white bg-darkpurple px-4 py-2 rounded-lg"
                                    onClick={handleDelete}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showEmpresaModal && selectedEmpresa && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/3 relative overflow-hidden">
            {/* Banner de Fondo */}
            <div className="relative">
                <img src={banner} alt="Banner" className="w-full h-40 object-cover" />
                {/* Texto sobre el banner */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <h2 className="text-2xl font-semibold text-white">{selectedEmpresa.nombre}</h2>
                </div>
            </div>
            {/* Contenido de la Modal */}
            <div className="p-6">
                <p className="mb-2"><strong>Dirección:</strong> {selectedEmpresa.direccion}</p>
                <p className="mb-2"><strong>Descripción:</strong> {selectedEmpresa.descripcion}</p>
                <p className="mb-4"><strong>ID:</strong> {selectedEmpresa.codigoempresa}</p>
                <div className="flex justify-end">
                    <button
                        className= "text-white bg-darkyellow hover:bg-lightyellow px-4 py-2 rounded mr-2 flex items-center"
                        onClick={closeEmpresaModal}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>
)}

            </div>
            <Footer />
        </div>
        
    );
};

