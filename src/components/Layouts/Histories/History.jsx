import React, { useState } from 'react';
import person1 from '../../../assets/Hanna.jpg';
import person2 from '../../../assets/Saject.jpg';
import person3 from '../../../assets/Erick.jpg';
import { Footer } from '../ForView/Footer';
import { Header } from '../ForView/Header';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaPlus } from 'react-icons/fa'; // Importa los íconos
import './people.css';

const people = [
    {
        id: 1,
        name: 'Hanna',
        photo: person1,
        description: 'Hanna es una emprendedora experimentada con un sólido background en tecnología e innovación.',
        companies: [
            { name: 'Tech Innovations', description: 'Una empresa líder en innovaciones tecnológicas.' },
            { name: 'Future Ventures', description: 'Invirtiendo en el futuro de la tecnología y los negocios.' }
        ]
    },
    {
        id: 2,
        name: 'Saject',
        photo: person2,
        description: 'Saject es un líder visionario conocido por su trabajo en desarrollo sostenible y tecnologías verdes.',
        companies: [
            { name: 'Green Solutions', description: 'Pioneros en tecnologías verdes para un futuro sostenible.' },
            { name: 'Eco Projects', description: 'Proyectos enfocados en la sostenibilidad ambiental.' }
        ]
    },
    {
        id: 3,
        name: 'Erick',
        photo: person3,
        description: 'Erick tiene un portafolio diverso con experiencia en finanzas y estrategia empresarial.',
        companies: [
            { name: 'Finance Group', description: 'Expertos en planificación y gestión financiera.' },
            { name: 'Strategic Growth', description: 'Ayudando a los negocios a crecer con planificación estratégica.' }
        ]
    }
];

export const History = () => {
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const navigate = useNavigate();

    const handlePersonClick = (person) => {
        setSelectedPerson(person);
        setSelectedCompany(null); // Reset selected company when selecting a person
    };

    const handleCompanyClick = (company) => {
        setSelectedCompany(company);
    };

    const handleBackClick = () => {
        setSelectedPerson(null);
        setSelectedCompany(null);
    };

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-gray-100 p-4">
                {selectedPerson ? (
                    selectedCompany ? (
                        <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
                            <button 
                                onClick={handleBackClick} 
                                className="absolute top-4 left-4 text-darkyellow text-lg"
                            >
                                <FaHome className="text-2xl" />
                            </button>
                            <div className="text-center">
                                <h1 className="text-4xl font-bold mb-4 text-darkyellow">{selectedCompany.name}</h1>
                                <p className="text-lg mb-4">{selectedCompany.description}</p>
                                <p className="text-darkyellow hover:underline">
                                    <span className="text-black text-sm">¿Quieres saber más sobre esta empresa?</span>
                                    <NavLink to="/Companies" className="text-darkyellow hover:underline text-sm ml-2">
                                        Ver Empresa
                                    </NavLink>
                                </p>
                                <button onClick={() => setSelectedCompany(null)} className="text-darkyellow text-lg mt-4 inline-flex items-center">
                                    &larr; Volver a Persona
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
                            <button 
                                onClick={handleBackClick} 
                                className="absolute top-4 left-4 text-darkyellow text-lg"
                            >
                                <FaHome className="text-2xl" />
                            </button>
                            <div className="text-center">
                                <h1 className="text-4xl font-bold mb-4">{selectedPerson.name}</h1>
                                <img src={selectedPerson.photo} alt={selectedPerson.name} className="w-40 h-40 rounded-full mb-4 mx-auto border-4 border-darkyellow glow-border" />
                                <p className="text-lg mb-4">{selectedPerson.description}</p>
                                <h2 className="text-3xl font-semibold mb-4 text-darkyellow">Empresas Asociadas:</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedPerson.companies.map((company, index) => (
                                        <div
                                            key={index}
                                            className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center cursor-pointer hover:shadow-xl transition-shadow duration-300"
                                            onClick={() => handleCompanyClick(company)}
                                        >
                                            <h3 className="text-lg font-medium mb-2">{company.name}</h3>
                                            <p className="text-gray-700">{company.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {people.map(person => (
                                <div
                                    key={person.id}
                                    className="bg-white p-6 rounded-lg shadow-lg flex items-center cursor-pointer hover:shadow-xl transition-shadow duration-300"
                                    onClick={() => handlePersonClick(person)}
                                >
                                    <img src={person.photo} alt={person.name} className="w-32 h-32 rounded-full mr-6 border-4 border-darkyellow glow-border" />
                                    <div>
                                        <h2 className="text-2xl font-semibold mb-2">{person.name}</h2>
                                        <p className="text-gray-700">{person.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white border rounded-lg overflow-hidden shadow-md flex flex-col items-center p-4 max-w-sm mx-auto mt-6">
                            <div className="text-center mb-4">
                                <FaPlus className="text-darkyellow text-3xl" />
                            </div>
                            <div className="text-center">
                                <span className="text-black text-sm">¿Quieres agregar tu historia?</span>
                                <NavLink to="/CreateStory" className="text-darkyellow hover:underline text-sm ml-2">
                                    Crear historia
                                </NavLink>
                            </div>
                        </div>
                    </div>
                )}
                <div className="fixed bottom-4 right-4 space-y-4">
                    <div className="relative">
                        <button
                            className="bg-darkpurple text-white p-4 rounded-full shadow-md"
                            onClick={() => navigate('/craft')}
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 8l1.1 5H19m-7-5a2 2 0 100 4 2 2 0 000-4zm-5 2a2 2 0 100 4 2 2 0 000-4z"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
