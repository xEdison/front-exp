import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const Statistics = () => {
 
  const [expanded, setExpanded] = useState(null);

  const data = {
    labels: ['Productos Vendidos', 'Clientes Satisfechos', 'Productos en Inventario', 'Proveedores Asociados'],
    datasets: [
      {
        label: 'Estadísticas',
        data: [500, 1000, 200, 50],
        backgroundColor: ['#B89158', '#F1BF76', '#3B2A38', '#271D25'],
        borderColor: ['#B89158', '#F1BF76', '#3B2A38', '#271D25'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Categorías',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad',
        },
        beginAtZero: true,
      },
    },
  };

  const handleClick = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const info = [
    "El número total de productos vendidos se calcula sumando todas las transacciones realizadas en el último trimestre.",
    "La cantidad de clientes satisfechos se obtiene a partir de las encuestas de satisfacción y comentarios positivos.",
    "El número de productos en inventario se basa en los registros actuales de stock y las actualizaciones de inventario.",
    "Los proveedores asociados se cuentan de acuerdo con los contratos y acuerdos de suministro activos."
  ];

  return (
    <div className="bg-gray py-8">
      <div className="text-center mb-12 px-4">
        <h1 className="text-darck text-2xl md:text-4xl font-bold">ESTADÍSTICAS</h1>
        <p className="text-darck text-sm md:text-lg mx-auto max-w-2xl mt-4">
          Aquí presentamos algunas estadísticas interesantes sobre nuestros productos y servicios. 
          Cada dato refleja nuestro compromiso con la calidad y la satisfacción del cliente.
        </p>
      </div>

      <div className="flex flex-col items-center mb-12">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <Bar data={data} options={options} />
        </div>
      </div>

      <div>
      <h1 className="flex justify-center text-darck text-2xl md:text-4xl font-bold mt-4 mb-6">DATOS DE ACTIVIDAD</h1>
      <p className="flex justify-center text-center text-black text-sm md:text-lg mx-auto max-w-2xl mb-12">Muestra las acciones y eventos relevantes realizados dentro del sistema, permitiendo un seguimiento detallado de las operaciones y movimientos que se llevan a cabo.</p>
      <div className="flex flex-wrap justify-center">
        {['Productos Vendidos', 'Clientes Satisfechos', 'Productos en Inventario', 'Proveedores Asociados'].map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={`transition-all duration-300 ease-in-out bg-darkyellow rounded-lg p-4 shadow-md text-center flex flex-col justify-center items-center mx-2 mb-4 w-48 sm:w-64 lg:w-80 cursor-pointer ${
              expanded === index ? 'h-auto' : 'h-24'
            }`}
          >
            <h3 className="text-lg font-bold text-white">{['500+', '1000+', '200+', '50+'][index]}</h3>
            <p className="text-sm mt-1 text-white">{item}</p>
            {expanded === index && (
              <div className="mt-4 text-sm text-white">
                <p>{info[index]}</p>
              </div>
            )}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};
