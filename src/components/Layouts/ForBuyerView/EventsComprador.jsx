import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Header } from '../ForView/Header';
import { Footer } from '../ForView/Footer';
import { useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import Fondo from '../../../assets/FondoEmpresas.png';

const containerStyle = {
  width: '100%',
  height: '100%',
};

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

export const EventsComprador = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [center, setCenter] = useState({ lat: 4.5709, lng: -74.2973 });
  const [highlightedDates, setHighlightedDates] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://checkpoint-9tp4.onrender.com/api/comprador/ver/eventos');
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Eventos obtenidos:', data);

        const eventos = Array.isArray(data[0]) ? data[0] : data;
        setEvents(eventos);

        const dates = eventos.map(event => new Date(event.fecha).toDateString());
        setHighlightedDates(dates);
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

    try {
      const location = await geocodeAddress(event.ubicacion, event.lugar);
      setCenter(location);
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

  return (
    <div className="min-h-screen bg-gray-200 font-sans">
      <Header />

      <main className="flex flex-col min-h-screen p-4 md:p-8 bg-gray-200">
        <section className="flex flex-col md:flex-row gap-8">
          {/* Left Section: Search, Calendar, Map */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
            {/* Search */}
            <div className="relative w-full mb-6">
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
            <div className="w-full mt-8">
              <Calendar
                className="w-full text-lg"
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={({ date }) => {
                  const hasEvent = highlightedDates.includes(date.toDateString());
                  return hasEvent ? 'bg-orange-200' : null;
                }}
              />
            </div>

            {/* Map */}
            <div className="w-full mt-8" style={{ height: '400px' }}>
              <LoadScript googleMapsApiKey="AIzaSyDlmwtbA4RlJtcDndjLKwzExz_cChUSMrk">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
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

          {/* Right Section: Event List */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="text-center">
              <h2 className="text-darkyellow md:text-4xl font-bold mt-5 mb-8 text-center">¡Bienvenido a Eventos!</h2>
              <p className="max-w-2xl mt-2 mx-auto text-lg mb-5">
                Aquí puedes ver los eventos especiales que tendrán lugar en diferentes partes. Descubre qué está pasando y participa en ellos.
              </p>
            </div>

            {/* Event List */}
            <div className="overflow-y-auto w-full" style={{ height: '55rem' }}>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                {filteredEvents.map(event => (
                  <div
                    key={event.idEvento}
                    className="border rounded-lg p-5 shadow-md bg-white cursor-pointer text-base flex flex-col justify-between"
                    onClick={() => handleEventClick(event)}
                  >
                    <div>
                      <h3 className="font-semibold text-xl md:text-2xl">{event.nombreEvento}</h3>
                      <p className="text-base mt-2">{formatDate(event.fecha)}</p>
                      <p className="text-base mt-2">{event.descripcion}</p>
                      <p className="text-base mt-2">Empresa Asistente: {event.empresasAsistente || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/3 relative overflow-hidden">
              <div className="relative">
                <img src={Fondo} alt="Banner" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <h2 className="text-2xl font-semibold text-white">{selectedEvent.nombreEvento}</h2>
                </div>
              </div>
              <div className="p-6">
                <p><strong>Fecha:</strong> {formatDate(selectedEvent.fecha)}</p>
                <p><strong>Ubicación:</strong> {selectedEvent.ubicacion}</p>
                <p><strong>Ciudad:</strong> {selectedEvent.lugar}</p>
                <p><strong>Duración:</strong> {selectedEvent.duracion}</p>
                <p><strong>Descripción:</strong> {selectedEvent.descripcion}</p>
                <p><strong>Asistencia:</strong> {selectedEvent.empresasAsistente}</p>
                <button
                  onClick={closeModal}
                  className="text-white bg-darkyellow hover:bg-lightyellow px-4 py-2 rounded mt-4"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
