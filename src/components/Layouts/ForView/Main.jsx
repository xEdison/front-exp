import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import HeaderImage from '../../../assets/Cabecera.png';
import { InformationMain } from '../InformationMain';
import { Statistics } from '../HomePage/Statistics';

export const Main = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <section className="flex flex-col md:flex-row p-4 md:p-8 bg-gray-200">
        <div className="w-full md:w-1/2 flex justify-center items-center mb-4 md:mb-0">
          <img src={HeaderImage} alt="HeaderMain" className="block mx-auto max-w-full h-auto" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center md:text-left">
  <div className="container mx-auto px-4">
    <h1 className="text-2xl md:text-4xl font-bold mb-4 text-darkpurple ml-4 md:ml-8">
      COFFE ART
    </h1>
    <p className="text-sm md:text-lg px-2 md:px-8 py-2 max-w-3xl">
      Buscamos poner en valor y resaltar el incuestionable y valioso trabajo de los artesanos, promoviendo activamente sus productos únicos y auténticos, que son verdaderas expresiones de su arte y habilidades. Además, como una parte integral de nuestra misión, ofrecemos procesos y métodos diseñados para mejorar y ayudar en la gestión de sus negocios.
    </p>
  </div>
</div>


      </section>

      <div className="bg-darkpurple py-8">
        <div className="container mx-auto px-4 text-center">
          <Slider {...settings}>
            {InformationMain.map((item) => (
              <div key={item.id} className="p-4 bg-purple text-center relative">
                <h2 className="text-darkyellow text-2xl md:text-4xl font-bold">{item.title}</h2>
                <p className="text-white text-sm md:text-lg m-4">{item.description}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <Statistics />

      <div className="bg-gray-200 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-black text-2xl md:text-4xl font-bold mb-8">MIRA NUESTRO VIDEO DESTACADO</h1>
              <p className="text-black text-sm md:text-lg mb-6">
                Te invitamos a conocer más sobre nuestra labor y los productos únicos que ofrecemos a través de este video destacado. Aquí, podrás ver cómo trabajamos para resaltar la habilidad de los artesanos y ofrecerles una plataforma para mostrar su arte al mundo. Además, si estás interesado en explorar más contenido relacionado con nuestra misión y productos, puedes visitar nuestra página en YouTube para más videos y actualizaciones.
              </p>
              <a 
                href="https://www.youtube.com/@CoffeArt2024" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-darkyellow font-bold text-lg hover:underline"
              >
                ¡Visita nuestra página para ver más videos!
              </a>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <iframe 
                width="100%" 
                height="auto" 
                src="https://www.youtube.com/embed/P7kEcYwBBsk" 
                title="Video destacado" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="aspect-video"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

