import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BackgroundImage from '../assets/BackgroundLogin.jpg';
import Logo from '../../src/assets/Artesanías.png';
import { FaHome } from 'react-icons/fa';

export const Login = () => {
    const navigate = useNavigate();

    const handleYesClick = () => {
        navigate('/signin');
    };

    const handleNoClick = () => {
        navigate('/register');
    };

    return (
        <div className="bg-white shadow p-10 flex flex-col justify-center items-center h-screen w-screen fixed top-0 left-0" style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <Link to="/" className="absolute top-4 left-4">
                <FaHome className="text-darkyellow text-4xl" />
            </Link>
            <img src={Logo} alt="Logo" className="h-64 w-64 mb-10 justify-center items-center" /> 
            <p className="text-white text-2xl text-center mb-20">¡Bienvenido a Coffe Art! ¿Ya estás registrado?</p> 
            <div className="flex justify-center">
                <button onClick={handleYesClick} className="bg-darkyellow text-white px-10 py-2 rounded hover:bg-lightyellow mx-8 font-mplus text-2xl">Sí</button> 
                <button onClick={handleNoClick} className="bg-darkyellow text-white px-10 py-2 rounded hover:bg-lightyellow mx-8 font-mplus text-2xl">No</button>
            </div>
        </div>
    );
};





