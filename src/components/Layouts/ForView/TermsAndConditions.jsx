import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import Image from '../../../assets/LogoCoffe.png';

export const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 bg-darkpurple flex items-center justify-center relative">
        <NavLink to="/#" className="absolute top-4 left-4">
          <FaHome className="text-lightyellow text-4xl" />
        </NavLink>
        <img src={Image} alt="HeaderMain" className="w-11/12 h-auto max-w-2xl p-4" style={{ imageRendering: 'auto' }} />
      </div>

      <div className="w-full md:w-2/3 bg-gray-200 flex flex-col justify-center p-8 overflow-y-auto">
        <div className="container mx-auto max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-darkyellow">
              Términos y Condiciones
            </h1>
            <p className="text-base md:text-lg text-darkpurple leading-relaxed">
              Bienvenido a Coffee Art. Estos términos y condiciones describen las reglas y regulaciones para el uso del sitio web de Coffee Art. Al acceder y utilizar nuestro sitio, aceptas cumplir con estos términos. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro sitio.
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-darkpurple text-left">
            1. Aceptación de los Términos
          </h2>
          <p className="text-base md:text-lg text-darkpurple leading-relaxed mb-6 text-left">
            Al utilizar el sitio web, aceptas estos términos y condiciones en su totalidad. Nos reservamos el derecho a modificar estos términos en cualquier momento, y tu uso continuado del sitio después de cualquier cambio se considerará una aceptación de dichos cambios.
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-darkpurple text-left">
            2. Uso del Sitio
          </h2>
          <p className="text-base md:text-lg text-darkpurple leading-relaxed mb-6 text-left">
            El sitio web de Coffee Art está destinado para tu uso personal y no comercial. No debes utilizar el sitio de ninguna manera que pueda dañar, desactivar, sobrecargar o perjudicar el sitio o interferir con el uso y disfrute de otros usuarios.
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-darkpurple text-left">
            3. Registro de Usuario
          </h2>
          <p className="text-base md:text-lg text-darkpurple leading-relaxed mb-6 text-left">
            Para acceder a ciertas funcionalidades del sitio, es posible que debas registrarte y proporcionar información personal. Te comprometes a proporcionar información precisa, actual y completa durante el proceso de registro y a actualizar dicha información para mantenerla precisa y completa.
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-darkpurple text-left">
            4. Propiedad Intelectual
          </h2>
          <p className="text-base md:text-lg text-darkpurple leading-relaxed mb-6 text-left">
            Todo el contenido del sitio web, incluidos, entre otros, texto, gráficos, logotipos, iconos de botones, imágenes y software, es propiedad de Coffee Art o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual aplicables.
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-darkpurple text-left">
            5. Enlaces a Sitios de Terceros
          </h2>
          <p className="text-base md:text-lg text-darkpurple leading-relaxed mb-6 text-left">
            El sitio web puede contener enlaces a sitios web de terceros. Estos enlaces se proporcionan solo para tu conveniencia. No controlamos estos sitios y no somos responsables del contenido de los mismos. Tu uso de los sitios web enlazados está sujeto a sus propios términos y condiciones.
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-darkpurple text-left">
            6. Exclusión de Garantías
          </h2>
          <p className="text-base md:text-lg text-darkpurple leading-relaxed mb-6 text-left">
            El sitio web se proporciona "tal cual" y "según disponibilidad". No garantizamos que el sitio esté libre de errores, virus o defectos. No hacemos ninguna representación ni garantía, expresa o implícita, sobre el funcionamiento del sitio o la información contenida en el mismo.
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-darkpurple text-left">
            7. Limitación de Responsabilidad
          </h2>
          <p className="text-base md:text-lg text-darkpurple leading-relaxed mb-6 text-left">
            En ningún caso Coffee Art será responsable de daños directos, indirectos, incidentales, especiales o consecuentes que resulten del uso o la incapacidad de usar el sitio, incluso si Coffee Art ha sido advertido de la posibilidad de dichos daños.
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-darkpurple text-left">
            8. Modificaciones del Sitio
          </h2>
          <p className="text-base md:text-lg text-darkpurple leading-relaxed mb-6 text-left">
            Coffee Art se reserva el derecho a modificar o discontinuar el sitio o cualquier parte del mismo en cualquier momento y sin previo aviso. No seremos responsables ante ti o ante terceros por cualquier modificación, suspensión o interrupción del sitio.
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-darkpurple text-left">
            9. Legislación Aplicable
          </h2>
          <p className="text-base md:text-lg text-darkpurple leading-relaxed mb-6 text-left">
            Estos términos y condiciones se regirán e interpretarán de acuerdo con las leyes del país en el que Coffee Art esté establecido, sin tener en cuenta los principios de conflicto de leyes. Cualquier disputa relacionada con estos términos se someterá a la jurisdicción exclusiva de los tribunales del país correspondiente.
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-darkpurple text-left">
            10. Contacto
          </h2>
          <p className="text-base md:text-lg text-darkpurple leading-relaxed text-left">
            Si tienes alguna pregunta sobre estos términos y condiciones, por favor contáctanos a través de los medios proporcionados en nuestro sitio web.
          </p>
        </div>
      </div>
    </div>
  );
};
