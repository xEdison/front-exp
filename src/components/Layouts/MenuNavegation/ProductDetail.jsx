import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import imageEarring from '../../../assets/AretesArtesanales.jpg'; // Puedes agregar más imágenes
import imageRuana from '../../../assets/RuanaArtesanal.jpg';
import imageBracelet from '../../../assets/PulserasArtesanales.jpg';
import imageBag from '.../../../assets/BolsoArtesanal.jpg';

const images = {
  1: [imageEarring, imageRuana, imageBracelet],
  2: [imageRuana, imageBracelet],
  3: [imageBag, imageEarring],
  // Agrega imágenes para otros productos si tienes más
};

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Encuentra el producto por ID
  const [product] = useState({
    id: Number(id),
    vendedor: 'Vendedor A',
    producto: 'Producto A',
    descripcion: 'Descripción del Producto A',
    stock: 10,
    precio: 100,
    imagen: imageEarring,
    categoria: 'earrings',
    rating: 4
  }); // Simulación de búsqueda por ID

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageChange = (index) => {
    setSelectedImageIndex(index);
  };

   // Función para cerrar la sesión y borrar el localStorage
   const handleLogout = () => {
    localStorage.clear(); // Limpia el localStorage
    navigate('/'); // Redirige al login o página inicial
    window.location.reload(); // Recarga la página
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-200 p-4">
      <div className="max-w-4xl mx-auto bg-white border rounded-lg overflow-hidden shadow-md">
        <button
          className="absolute top-4 right-4 text-gray-600 text-2xl"
          onClick={() => navigate('/')}
        >
          &times;
        </button>
        <div className="flex">
          {/* Carrusel de imágenes */}
          <div className="flex-1 p-4">
            <img
              src={images[product.id][selectedImageIndex]}
              alt={product.producto}
              className="object-cover h-96 w-full mb-4"
            />
            <div className="flex space-x-2">
              {images[product.id].map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  className={`cursor-pointer w-24 h-24 object-cover ${index === selectedImageIndex ? 'border-2 border-darkyellow' : ''}`}
                  onClick={() => handleImageChange(index)}
                />
              ))}
            </div>
          </div>

          {/* Detalles del producto */}
          <div className="flex-1 p-4">
            <h2 className="text-2xl font-bold mb-2">{product.producto}</h2>
            <p className="text-lg mb-2"><strong>Vendedor:</strong> {product.vendedor}</p>
            <p className="text-lg mb-2"><strong>Descripción:</strong> {product.descripcion}</p>
            <p className="text-lg mb-2"><strong>Precio:</strong> ${product.precio}</p>
            <p className="text-lg mb-2"><strong>Stock:</strong> {product.stock}</p>
            <div className="flex mb-2">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={`text-2xl ${index < product.rating ? 'text-darkyellow' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <label htmlFor="quantity" className="text-lg font-bold">Cantidad:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stock}
                defaultValue="1"
                className="shadow border rounded w-20 py-2 px-3"
              />
            </div>
            <button
              className="bg-darkyellow hover:bg-lightyellow text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => {} /* Lógica para agregar al carrito */}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

