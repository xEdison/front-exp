// src/Context/EventsContext.js
import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const EventsContext = createContext();

// Proveedor del contexto
export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([
    { id: 1, name: 'Festival de Música', date: new Date('2024-07-30'), location: { lat: 37.7749, lng: -122.4194 }, companies: ['Empresa A', 'Empresa B'], duration: '4 horas', place: 'Central Park' },
    { id: 2, name: 'Feria de Artesanía', date: new Date('2024-07-31'), location: { lat: 37.7749, lng: -122.4194 }, companies: ['Empresa C', 'Empresa D'], duration: '3 horas', place: 'Market Street' },
    { id: 3, name: 'Rally de Food Trucks', date: new Date('2024-08-01'), location: { lat: 37.7849, lng: -122.4094 }, companies: ['Empresa E', 'Empresa F'], duration: '5 horas', place: 'Union Square' },
  ]);

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
      {children}
    </EventsContext.Provider>
  );
};

// Hook para usar el contexto
export const useEvents = () => useContext(EventsContext);