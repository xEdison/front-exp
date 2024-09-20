import React, { useEffect, useState, useContext } from 'react';
import { useEmpresa } from '../../../Context/contextEmpresa';
import ProductoContext from '../../../Context/contextProducto';
import { Header } from '../ForView/Header';
import { Footer } from '../ForView/Footer';
import banner from '../../../assets/FondoEmpresas.png'; 
import { FaCoffee, FaEllipsisV } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

export const CompaniesComprador = () => {
    const { empresas, setEmpresas } = useEmpresa();
    const { getProductosByCodigoEmpresa } = useContext(ProductoContext);
    const [selectedEmpresa, setSelectedEmpresa] = useState(null);
    const [error, setError] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('');
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportingEmpresa, setReportingEmpresa] = useState(null);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [selectedEmpresaForOptions, setSelectedEmpresaForOptions] = useState(null);
    const [showNotification, setShowNotification] = useState(false);

    const [filterText, setFilterText] = useState(''); 

    useEffect(() => {
        fetchEmpresas();
    }, []);

    const fetchEmpresas = async () => {
        try {
            const response = await fetch('https://checkpoint-9tp4.onrender.com/api/comprador/ver/empresas');

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get("content-type");

            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                console.log('Datos recibidos del servidor:', data);

                if (Array.isArray(data[0])) {
                    setEmpresas(data[0]);
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

    const viewEmpresa = async (codigoempresa) => {
        if (!codigoempresa) {
            console.error('codigoempresa no está definido');
            return;
        }

        try {
            setLoadingMessage(`Obteniendo datos de la empresa con código: ${codigoempresa}`);

            const response = await fetch(`https://checkpoint-9tp4.onrender.com/api/comprador/ver/empresaAdmin/${codigoempresa}`);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const empresaData = await response.json();
            console.log('Datos de la empresa:', empresaData);

            if (Array.isArray(empresaData) && empresaData.length > 0) {
                const empresa = empresaData[0][0];
                setSelectedEmpresa(empresa);
            } else {
                console.error('Estructura de datos inesperada');
            }

            setLoadingMessage('');

        } catch (error) {
            console.error('Error al obtener la información de la empresa:', error.message);
            setLoadingMessage('');
        }
    };

    const closeEmpresaModal = () => {
        setSelectedEmpresa(null);
        setLoadingMessage('');
    };

    const openReportModal = (empresa) => {
        setReportingEmpresa(empresa);
        setShowReportModal(true);
        setShowOptionsMenu(false); // Cierra el menú de opciones
    };

    const closeReportModal = () => {
        setShowReportModal(false);
        setReportReason('');
        setReportingEmpresa(null);
    };

    const submitReport = async () => {
        if (!reportingEmpresa || !reportReason) {
            console.error('Empresa seleccionada o motivo del reporte no están definidos');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/api/reportes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    codigoempresa: reportingEmpresa.codigoempresa,
                    motivo: reportReason,
                }),
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // Obtén el texto de error si la respuesta no es OK
                throw new Error(`Error ${response.status}: ${errorText}`);
            }
    
            const result = await response.json();
            console.log('Reporte enviado con éxito:', result);
            setReportReason('');
            setShowReportModal(false);
            setShowNotification(true);

            // Ocultar la notificación después de 2 segundos
            setTimeout(() => {
                setShowNotification(false);
            }, 2000);

        } catch (error) {
            console.error('Error al enviar el reporte:', error.message);
        }
    };

    const toggleOptionsMenu = (empresa) => {
        setSelectedEmpresaForOptions(empresa);
        setShowOptionsMenu(!showOptionsMenu);
    };
    useEffect(() => {
        if (showNotification) {
            const progressBar = document.querySelector('.progress-bar');
            if (progressBar) {
                setTimeout(() => {
                    progressBar.style.height = '0%'; // Reduce la altura de la barra
                }, 100); // Demora pequeña para iniciar la animación
            }
        }
    }, [showNotification]);

    const filteredEmpresas = empresas.filter(empresa =>
        empresa.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
        empresa.direccion.toLowerCase().includes(filterText.toLowerCase())
    );
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-200">
            <Header />
            <div className="flex flex-col">
                <div className="flex flex-col items-center justify-center text-justify p4">
                    <div className='flex flex-row'>
                        <br /> <p className=' text-darkyellow md:text-4xl font-bold mt-5'>¡Bienvenido a empresas!</p> <br /><br />
                    </div>
                    <span className="text-black text-sm text-center mt-7 px-96 md:text-lg">
                        En esta sección, podrás explorar todas las empresas registradas en la aplicación. No solo podrás ver la información básica de cada empresa, sino que también tendrás acceso a una lista completa de los productos que están vinculados a ellas. Esto te permitirá tener una visión clara y completa de todo lo que ocurre en la plataforma.
                    </span>
                    <p className="text-black text-sm font-bold text-center mt-7 px-96 md:text-lg">¡Le deseamos un excelente y productivo día!</p>
                </div>

                <input
                        type="text"
                        placeholder="Buscar empresa por nombre..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)} // Actualiza el texto del filtro
                        className=" w-96  flex self-center border rounded p-2 mt-4"
                    />
            </div>
            <div className="container mx-auto my-8 flex-grow grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredEmpresas.length === 0 ? (
    <div className="bg-white border rounded-lg overflow-hidden shadow-md flex flex-col items-center p-4 cursor-pointer">
        <div className="flex flex-col items-center">
            <span className="text-black text-sm text-center">No hay empresas para mostrar</span>
        </div>
    </div>
) : (
    filteredEmpresas.map((empresa) => (
                        <div
                            key={empresa.codigoempresa}
                            className="bg-white border rounded-lg overflow-hidden shadow-md cursor-pointer flex flex-col items-center p-4 relative"
                            onClick={() => viewEmpresa(empresa.codigoempresa)}
                        >
                           <div className="flex flex-col items-center">
  <svg className="w-6 h-6 mb-2 text-2xl text-darkpurple">
    <FaCoffee />
  </svg>
  <div className="flex items-center">
    <p className="text-darkyellow font-bold">{empresa.nombre}</p>
    <button
      onClick={(e) => {
        e.stopPropagation(); // Previene que el click propague al div
        toggleOptionsMenu(empresa);
      }}
      className="ml-4 text-darkpurple hover:text-lightpurple"
    >
      <FaEllipsisV />
    </button>
  </div>
                            {showOptionsMenu && selectedEmpresaForOptions === empresa && (
                                    <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg ">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Previene que el click propague al div
                                                openReportModal(empresa);
                                            }}
                                            className="rounded text-center px-2 py-2 bg-darkyellow text-white hover:bg-lightyellow"
                                        >
                                            Reportar
                                        </button>
                                    </div>
                                )}
                            </div>
                            <hr className='w-52 h-1 my-3 bg-darkyellow opacity-50 border-0 '/>
                            <p className="text-center text-gray-600 mb-4">{empresa.direccion}</p>
                            <p className="text-center line-clamp-5 mb-5">{empresa.descripcion}</p>
                            <p className="text-center text-gray-600">ID: {empresa.codigoempresa}</p>
                        </div>
                    ))
                )}
            </div>
            {(selectedEmpresa || loadingMessage) && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
          <div className="relative w-full h-40 bg-gray-300 rounded-t-lg overflow-hidden">
              <img
                  src={banner}
                  alt="Banner de Empresa"
                  className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10">
                  <h2 className="text-white md:text-3xl font-bold"> 
                      {selectedEmpresa ? selectedEmpresa.nombre_empresa : 'Cargando...'}
                  </h2>
              </div>
          </div>
          {loadingMessage && (
              <p className="text-center mb-4 text-darkyellow mt-2 ">{loadingMessage}</p>
          )}
          {selectedEmpresa && (
              <div className='flex flex-col '>
                  <p className="mb-4 mt-2"> <span className='font-bold'>ID de la Empresa: </span> {selectedEmpresa.codigoempresa}</p>
                  <p className="mb-4 mt-2"><span className='font-bold'>Nombre de la Empresa: </span> {selectedEmpresa.nombre_empresa}</p>
                  <p className="mb-4 mt-2"><span className='font-bold'>Descripción: </span> <br/>  {selectedEmpresa.descripcion}</p>
                  <p className="mb-4 mt-2"><span className='font-bold'>Dirección: </span>  {selectedEmpresa.direccion}</p>
                  <p className="mb-4 mt-2"><span className='font-bold'>Fecha de Creación: </span>{new Date(selectedEmpresa.fecha_creacion).toLocaleDateString()}</p>
                  <p className="mb-4 mt-2"><span className='font-bold'>Teléfono: </span> {selectedEmpresa.telefono}</p>
                  <p className="mb-4 mt-2"><span className='font-bold'>Correo Electrónico: </span> {selectedEmpresa.correo_electronico}</p>
                  <p className="mb-4 mt-2"><span className='font-bold'>Nombre del Encargado:  </span>{selectedEmpresa.nombre_administrador}</p>
                  <NavLink
                      to={`/CompaniesProducts/${selectedEmpresa.codigoempresa}`}
                      className="bg-transparent text-darkyellow rounded text-lg font-semibold underline text-center"
                      activeClassName="font-bold"
                  >
                      Ver productos  
                  </NavLink>
                  <div className="flex justify-center mt-5">
                      <button
                          onClick={closeEmpresaModal}
                          className="bg-darkyellow text-white py-2 px-4 rounded justify-center hover:bg-lightyellow"
                      >
                          Cerrar
                      </button>
                  </div>
              </div>
          )}
      </div>
  </div>
)}
            {showReportModal && (
                <div className="fixed inset-0 bg-darkpurple bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                        <h2 className="text-2xl font-bold mb-4 justify-center items-center">Reportar Empresa</h2>
                        <p><strong>Nombre de la Empresa:</strong> {reportingEmpresa?.nombre}</p>
                        <textarea
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            rows="4"
                            className="w-full border border-gray-300 rounded p-2 mt-2"
                            placeholder="Motivo del reporte"
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={submitReport}
                                className="bg-darkpurple text-white px-4 py-2 rounded mr-2 hover:bg-lightpurple"
                            >
                                Enviar Reporte
                            </button>
                            <button
                                onClick={closeReportModal}
                                className="bg-darkyellow text-white px-4 py-2 rounded hover:bg-lightyellow"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
           {showNotification && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-darkyellow text-white p-4 rounded-lg shadow-lg text-center relative w-64 h-24">
                        <p className="text-xl font-bold">Reporte exitoso</p>
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                            {/* Barra de progreso vertical */}
                            <div
                                className="bg-white w-full progress-bar"
                                style={{
                                    height: '100%', // Comienza con 100% de altura
                                    transition: 'height 2s linear',
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}


            <Footer />
        </div>
    );
};
