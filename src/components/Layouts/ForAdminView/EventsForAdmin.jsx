import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Header } from '../ForView/Header';
import { Footer } from '../ForView/Footer';
import { NavLink, useLocation } from 'react-router-dom';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaCoffee } from 'react-icons/fa';
import Fondo from '../../../assets/FondoEmpresas.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const containerStyle = {
  width: '100%',
  height: '600px',
};

// Define the geocode function
const geocodeAddress = async (address, city) => {
  const geocoder = new google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    const fullAddress = `${address}, ${city}, Colombia`;
    geocoder.geocode({ address: fullAddress }, (results, status) => {
      if (status === 'OK') {
        const { lat, lng } = results[0].geometry.location;
        resolve({ lat: lat(), lng: lng() });
      } else {
        reject(new Error(`Geocode was not successful for the following reason: ${status}`));
      }
    });
  });
};

export const EventsForAdmin = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [center, setCenter] = useState({ lat: 4.5709, lng: -74.2973 }); // Center of Colombia
  const location = useLocation();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
const [eventToDelete, setEventToDelete] = useState(null);
const navigate = useNavigate();


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const idAdministrador = localStorage.getItem('userId');
  
        if (!token || !idAdministrador) {
          console.error('Token o ID de administrador no encontrados en el localStorage');
          return;
        }
  
        const response = await fetch(`https://checkpoint-9tp4.onrender.com/api/evento/admin/${idAdministrador}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log('Eventos obtenidos:', data); // Agrega este console.log para verificar la estructura
        setEvents(data);
      } catch (error) {
        console.error('Error al obtener eventos:', error.message);
      }
    };
  
    fetchEvents();
  }, [location.pathname]);
  

  const filteredEvents = events.filter(event =>
    event.nombreEvento.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEventClick = async (event) => {
    setSelectedEvent(event);

    // Geocode the address to get the location
    try {
      const location = await geocodeAddress(event.ubicacion, event.lugar);
      setCenter(location); // Update map center to the new location
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };


  const handleDeleteEvent = (event) => {
    setEventToDelete(event);
    setShowConfirmModal(true);
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado en el localStorage');
        return;
      }
  
      const response = await fetch(`https://checkpoint-9tp4.onrender.com/api/evento/${eventToDelete.idEvento}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      // Actualiza la lista de eventos después de la eliminación
      setEvents(prevEvents => prevEvents.filter(event => event.idEvento !== eventToDelete.idEvento));
      setShowConfirmModal(false); // Cierra el modal
    } catch (error) {
      console.error('Error al eliminar el evento:', error.message);
    }
  };

  const handleEditEvent = (eventId) => {
    navigate(`/EventsUpdateForm/${eventId}`);
  };
  
  
 
  
  return (
    <div className="min-h-screen bg-gray-200 font-sans">
      <Header />

      <div className="flex flex-col min-h-screen p-4 md:p-8 bg-gray-200">
        <section className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center md:items-start">
            {/* Search */}
            <div className="w-full max-w-full mb-6 relative">
              <input
                type="text"
                placeholder="Ingresa el evento que buscas"
                className="w-full p-3 pl-12 rounded border text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
            </div>


                        {/* Calendar */}
                        <div className="w-full max-w-full mt-8" style={{ width: '70rem', height: '25rem' }}>
  <Calendar
    className="w-full h-full text-lg"
    onChange={setSelectedDate}
    value={selectedDate}
    tileClassName={({ date }) => {
      const hasEvent = filteredEvents.some(event => new Date(event.fecha).toDateString() === date.toDateString());
      return hasEvent ? 'bg-orange-200' : null;
    }}
  />
</div>



            {/* Map */}
            <div className="w-full max-w-full mt-8">
              <LoadScript googleMapsApiKey="AIzaSyDlmwtbA4RlJtcDndjLKwzExz_cChUSMrk">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center} // Center is updated when an event is clicked
                  zoom={12}
                >
                  {filteredEvents.map(event => event.ubicacion && (
                    <Marker
                      key={event.idEvento}
                      position={{ lat: event.ubicacion.lat, lng: event.ubicacion.lng }}
                      onClick={() => handleEventClick(event)}
                    />
                  ))}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="text-center">
              <h2 className="text-darkyellow text-4xl font-bold mt-6 mb-10">Eventos</h2>
              <p className="max-w-2xl mt-2 mx-auto text-lg mb-5">
              ¡Bienvenido, artesano! Este espacio está diseñado para que puedas gestionar los eventos y ferias a los que planeas asistir para que lo vean posibles compradores.
              <br/><br/>
              Podrás encontrar un apartado en donde encontraras las fechas de tus eventos, además de un mapa como guia para que puedas  visualizar las ubicaciones que necesites.
              </p>
            </div>

            {/* Create New Event Container */}
<div className="border rounded-lg p-6 shadow-md bg-white mt-8 max-w-md mx-auto text-base mb-10">
  <h3 className="text-xl font-semibold mb-4">¿Vas a Asisitir a un Evento?</h3>
  <p className="mb-4">
    <NavLink to="/EventsForm" className="text-darkyellow font-bold hover:underline">
      Agregar Evento
    </NavLink>
  </p>
</div>

            <div className='overflow-y-auto overflow-x-hidden'  style={{ height: '55rem' }}>

<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 mt-8">
{filteredEvents.map(event => (
  <div
    key={event.idEvento}
    className="border rounded-lg p-5 shadow-md bg-white cursor-pointer text-base flex flex-col justify-between"
    style={{ height: '30rem', width: '20rem' }}
    onClick={() => handleEventClick(event)}
  >
    <div>
      <h3 className="font-semibold text-2xl">{event.nombreEvento}</h3>
      <br/><br/>
      <p className="text-base">{formatDate(event.fecha)}</p>
      <br/>
      <p className="text-base">{event.descripcion}</p>
      <br/>
      <p className="text-base">Empresa Asistente: {event.empresasAsistente || 'N/A'}</p>
      <br/>
    </div>
    <div className="flex justify-between gap-4 mt-4">
   
    <FaTrash
  className='text-darkpurple hover:text-lightpurple text-3xl'
  onClick={(e) => {
    e.stopPropagation(); // Evita que el clic se propague al contenedor del evento
    handleDeleteEvent(event); // Muestra el modal de confirmación
  }}
/>


<FaEdit
  className='text-darkyellow hover:text-lightyellow text-3xl'
  onClick={(e) => {
    e.stopPropagation(); // Evita que el clic se propague al contenedor del evento
    handleEditEvent(event.idEvento); // Envía el idEvento a la función que maneja la edición
  }}
/>


    </div>
  </div>
))}

   
</div>

</div>



          </div>
        </section>

        {selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/3 relative overflow-hidden">
              {/* Banner de Fondo */}
              <div className="relative">
                <img src={Fondo} alt="Banner" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <h2 className="text-2xl font-semibold text-white">{selectedEvent.nombreEvento}</h2>
                </div>
              </div>
              <div className="p-6">
                <p>¡Hola! Aquí puedes ver la Descripción del evento Anotado: </p>
                <br/>
                <p className="mb-2"><strong>Fecha: </strong> {formatDate(selectedEvent.fecha)}</p>
                <p className="mb-2"><strong>Ubicación: </strong> {selectedEvent.ubicacion}</p>
                <p className="mb-2"><strong>Ciudad: </strong> {selectedEvent.lugar}</p>
                <p className="mb-2"><strong>Duración: </strong> {selectedEvent.duracion}</p>
                <p className="mb-2"><strong>Descripción: </strong> {selectedEvent.descripcion}</p>
                <p className="mb-2"><strong>Asistencia: </strong> {selectedEvent.empresasAsistente}</p>
                <button
                    onClick={closeModal}
                    className="text-white bg-darkyellow hover:bg-lightyellow px-4 py-2 rounded mr-2 flex items-center mt-10"
                  >
                    Cerrar
                  </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showConfirmModal && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <div className='flex flex-col justify-center'>
        <div className='flex justify-center'>
          <svg className="w-6 h-6 mr-2 text-2xl text-darkyellow"><FaCoffee /></svg>
          <h3 className="text-lg font-semibold mb-4 text-darkyellow">Confirmar eliminación</h3>
        </div>
        <p className="mb-4 text-center">¿Estás seguro de que deseas eliminar el evento "{eventToDelete?.nombreEvento}"?</p>
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
          onClick={confirmDeleteEvent}
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
)}


      <Footer />
    </div>
  );
};
