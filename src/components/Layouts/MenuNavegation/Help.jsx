import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../../assets/Artesanías.png';
import BackgroundImage from '../../../assets/FondoMenu.png';
import Background from '../../../assets/Fondo.png';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';

// Función para manejar respuestas basadas en palabras clave
const handleKeywordResponses = (question) => {
  const keywords = {
    'mision': 'Nuestra misión es ofrecer productos de alta calidad y apoyar a los artesanos locales.',
    'recuperación de cuenta': 'Para recuperar tu cuenta, visita la página de recuperación de cuenta en nuestro sitio web.',
    'actualización de datos': 'Puedes actualizar tus datos desde la sección de perfil en tu cuenta.',
    'productos': 'Puedes explorar nuestros productos en la sección de artesanías en la página de inicio.',
    'estética': 'Para mejorar la estética de tus productos, asegúrate de usar imágenes de alta calidad, sin fondo o en su defecto uno de color blanco o neutro, y descripciones detalladas.',
    'hola': '¡Hola! ¿Cómo estás? ¿En qué te puedo ayudar hoy?',
    'bien': 'Me alegra escuchar eso. ¿Tienes alguna duda sobre nuestros productos o servicios?',
    'mal': 'Lamento escuchar eso. ¿Hay algo en lo que pueda ayudarte?',
    'gracias': '¡De nada! Estoy aquí para ayudarte.',
    'adiós': '¡Hasta luego! No dudes en volver si tienes más preguntas.',
    'chao': '¡Hasta luego! No dudes en volver si tienes más preguntas.',
    'valorar': 'Valorar cada momento puede enriquecer tu vida.',
    'ayudes': 'Claro, aqui estoy para ayudarte',
    'ayudar': 'Claro, aqui estoy para ayudarte',
'ayudame': 'Claro, aqui estoy para ayudarte',
    'renovar': 'Renovar tu visión y objetivos puede reavivar tu motivación.',
    'interactuar': 'Interactuar con otros puede enriquecer tu vida.',
    'motivar': 'Motivar a otros puede ser una experiencia gratificante.',
    'descubrir': 'Descubrir nuevas habilidades puede abrirte a nuevas oportunidades.',
    'abrir': 'Abrir tu corazón a nuevas experiencias puede ser liberador.',
    'cambiar': 'Cambiar tu perspectiva puede transformar tu vida.',
    'valorar_tienes': 'Valorar lo que tienes te ayuda a vivir en gratitud.',
    'fortalecer': 'Fortalecer la conexión con otros es esencial para el bienestar.',
    'transformar': 'Transformar tu vida comienza con un solo paso.',
    'trabajar': 'Trabajar por tus sueños es una inversión en ti mismo.',
    'compartir': 'Compartir tus logros, por pequeños que sean, es importante.',
    'reflexionar': 'Reflexionar sobre tus experiencias te ayuda a aprender.',
    'unir': 'Unir esfuerzos puede llevar a grandes logros.',
    'evaluar': 'Evaluar tus logros y fracasos te ayuda a crecer.',
    'fomentar': 'Fomentar la curiosidad es esencial para el aprendizaje.',
    'cultivar': 'Cultivar una mentalidad positiva puede cambiar tu vida.',
    'dedicación': 'La dedicación a tus sueños es fundamental para alcanzarlos.',
    'celebrar_logros': 'Celebrar tus logros es fundamental para mantenerte motivado.',
    'reconocer': 'Reconocer el esfuerzo de otros fomenta un ambiente positivo.',
    'iluminar': 'Iluminar el camino de otros puede ser un regalo valioso.',
    'explorar': 'Explorar nuevas ideas enriquece nuestra vida.',
    'reconstruir': 'Reconstruir después de un desafío puede fortalecer tu carácter.',
    'afrontar': 'Afrontar tus miedos es un paso hacia la libertad.',
    'celebrar_diversidad': 'Celebrar la diversidad enriquece nuestras vidas.',
    'compromiso': 'El compromiso contigo mismo es clave para el éxito a largo plazo.',
    'reflexionar_acciones': 'Reflexionar sobre tus acciones puede guiar tu futuro.',
    'vivir_presente': 'Vivir en el presente es la clave para disfrutar la vida.',
    'cambiar_entorno': 'Cambiar tu entorno puede motivarte a crecer.',
    'cultivar_relaciones': 'Cultivar relaciones positivas enriquece tu vida.',
    'cerámica': 'Arte de crear objetos de barro cocido.',
    'madera': 'Trabajo con madera para crear piezas únicas.',
    'textiles': 'Fabricación de prendas y tejidos diversos.',
    'joyería': 'Creación de adornos y accesorios con metales y piedras.',
    'cestería': 'Elaboración de canastas y objetos de mimbre.',
    'pintura': 'Arte de crear imágenes utilizando pigmentos.',
    'escultura': 'Creación de figuras tridimensionales en diversos materiales.',
    'caligrafía': 'El arte de la escritura decorativa.',
    'vidrio': 'Trabajo con vidrio para hacer objetos decorativos.',
    'barro': 'Uso de barro para modelar formas artísticas.',
    'cuero': 'Elaboración de productos a partir de piel de animales.',
    'mosaico': 'Arte de crear imágenes a partir de pequeñas piezas.',
    'bordado': 'Decoración de telas mediante hilos y aguja.',
    'costura': 'Unión de telas para crear prendas y accesorios.',
    'talla': 'Arte de esculpir en piedra o madera.',
    'alfarería': 'Fabricación de utensilios de barro.',
    'papiroflexia': 'Arte de doblar papel para crear figuras.',
    'sastrería': 'Creación de ropa a medida.',
    'dibujo': 'Representación gráfica en papel o lienzo.',
    'grabado': 'Técnica de imprimir imágenes sobre superficie.',
    'marquetería': 'Elaboración de objetos decorativos con piezas de madera.',
    'fieltro': 'Creación de objetos a partir de fibras de lana.',
    'serigrafía': 'Técnica de impresión a través de una malla.',
    'tattoo': 'Arte de hacer dibujos permanentes en la piel.',
    'repujado': 'Técnica de modelado en relieve sobre metal.',
    'papel': 'Creación de objetos y arte a partir de papel.',
    'piedra': 'Talla y modelado de piedras preciosas o semipreciosas.',
    'ceras': 'Creación de arte utilizando ceras de colores.',
    'artesanía': 'Técnica de crear objetos a mano.',
    'feltragem': 'Arte de hacer fieltro a partir de lana.',
    'enmarcado': 'Creación de marcos para obras de arte.',
    'esmalte': 'Aplicación de esmalte sobre objetos para decorarlos.',
    'pastelería': 'Arte de hacer postres y dulces.',
    'quilling': 'Técnica de enrollar tiras de papel para crear figuras.',
    'hilo': 'Creación de objetos mediante el uso de hilos.',
    'madera_reforestada': 'Uso de madera proveniente de fuentes sostenibles.',
    'cerámica_pintada': 'Cerámica decorada con pinturas a mano.',
    'vidrio_fusión': 'Técnica de unir piezas de vidrio mediante calor.',
    'weaving': 'Arte de tejer hilos para crear telas.',
    'stenciling': 'Uso de plantillas para decorar superficies.',
    'marfil': 'Trabajo con marfil para crear esculturas y objetos.',
    'forja': 'Técnica de moldear metales a altas temperaturas.',
    'caja': 'Creación de cajas decorativas de diversos materiales.',
    'bijouterie': 'Elaboración de joyería económica con materiales alternativos.',
    'pintura_en_frío': 'Técnica de pintar sobre superficies frías.',
    'collage': 'Composición artística a partir de diversos materiales.',
    'madera_reciclada': 'Uso de madera recuperada para crear objetos.',
    'algoritmo': 'Secuencia de pasos para resolver un problema.',
    'variable': 'Espacio de almacenamiento para datos.',
    'función': 'Bloque de código reutilizable que realiza una tarea.',
    'bucle': 'Estructura que repite un bloque de código.',
    'condicional': 'Estructura que ejecuta código basado en condiciones.',
    'array': 'Colección de elementos almacenados en una sola variable.',
    'objeto': 'Estructura que agrupa propiedades y métodos.',
    'clase': 'Plantilla para crear objetos en programación orientada a objetos.',
    'método': 'Función asociada a un objeto o clase.',
    'parámetro': 'Valor que se pasa a una función o método.',
    'excepción': 'Evento que altera el flujo normal de ejecución.',
    'depuración': 'Proceso de identificar y corregir errores en el código.',
    'sintaxis': 'Conjunto de reglas que definen la estructura del código.',
    'compilador': 'Programa que traduce código fuente a código máquina.',
    'interpretador': 'Programa que ejecuta código línea por línea.',
    'framework': 'Conjunto de herramientas y bibliotecas para facilitar el desarrollo.',
    'biblioteca': 'Colección de funciones y recursos reutilizables.',
    'sistema': 'Conjunto de componentes que trabajan juntos.',
    'interfaz': 'Conjunto de métodos que definen cómo interactúan los componentes.',
    'protocolo': 'Conjunto de reglas que rigen la comunicación entre sistemas.',
    'API': 'Interfaz que permite la interacción entre diferentes software.',
    'datos': 'Conjunto organizado de datos almacenados para acceso rápido.',
    'algoritmo_eficiente': 'Método que optimiza el uso de recursos.',
    'código_abierto': 'Software cuyo código fuente es accesible y modificable.',
    'codificación': 'Proceso de escribir instrucciones en un lenguaje de programación.',
    'recursión': 'Técnica donde una función se llama a sí misma.',
    'paradigma': 'Enfoque o estilo de programación.',
    'asíncrono': 'Ejecutar operaciones que no bloquean el flujo principal.',
    'microservicio': 'Arquitectura que descompone aplicaciones en servicios pequeños.',
    'devops': 'Práctica que une desarrollo y operaciones para mejorar el ciclo de vida del software.',
    'test_unitario': 'Prueba que verifica la funcionalidad de una unidad de código.',
    'gestor_de_versiones': 'Herramienta que ayuda a controlar los cambios en el código.',
    'optimización': 'Proceso de mejorar la eficiencia del código.',
    'documentación': 'Conjunto de información sobre el uso y funcionamiento del software.',
    'algoritmo_greedy': 'Método que toma decisiones óptimas en cada etapa.',
    'programación_funcional': 'Paradigma que trata la computación como la evaluación de funciones.',
    'programación_orientada_a_objetos': 'Paradigma que organiza el software en objetos.',
    'espresso': 'Café concentrado preparado mediante la extracción de agua caliente.',
    'latte': 'Café espresso con leche vaporizada y una capa de espuma.',
    'cappuccino': 'Mezcla de partes iguales de espresso, leche vaporizada y espuma.',
    'americano': 'Café espresso diluido con agua caliente.',
    'moka': 'Café preparado en una cafetera moka, con un sabor intenso.',
    'cold_brew': 'Café preparado con agua fría durante varias horas.',
    'aeropress': 'Método de preparación que utiliza presión para extraer café.',
    'filter': 'Método de preparación que utiliza un filtro para colar el café.',
    'grano': 'Semilla del café, que se tuesta para producir la bebida.',
    'tostado': 'Proceso de calentar los granos de café para desarrollar sabor.',
    'origen': 'Región donde se cultiva el café, influyendo en su sabor.',
    'blend': 'Mezcla de diferentes tipos de granos de café.',
    'barista': 'Profesional especializado en la preparación de café.',
    'crema': 'Capa dorada y espesa que se forma en la superficie del espresso.',
    'latte_art': 'Decoración en la superficie del café con espuma de leche.',
    'aroma': 'Olor característico que emana del café, importante para la experiencia.',
    'sabor': 'Percepción gustativa que se experimenta al beber café.',
    'acidez': 'Elemento que aporta frescura y brillo al café.',
    'cuerpo': 'Sensación de peso y textura del café en boca.',
    'sustituto': 'Alternativa al café tradicional, como el café de achicoria.',
    'café_molido': 'Granos de café que han sido triturados para su preparación.',
    'café_soluble': 'Café que se disuelve en agua, sin necesidad de filtrado.',
    'café_instantáneo': 'Café que se prepara rápidamente añadiendo agua caliente.',
    'café_de_cápsulas': 'Café preparado en máquinas que utilizan cápsulas individuales.',
    'espresso_macchiato': 'Espresso con una pequeña cantidad de leche o espuma.',
    'ristretto': 'Espresso más corto y concentrado que el normal.',
    'affogato': 'Postre que consiste en helado cubierto con espresso caliente.',
    'decaf': 'Café descafeinado, con bajo contenido de cafeína.',
    'café_cultivado': 'Café cultivado bajo prácticas sostenibles.',
    'café_arábica': 'Variedad de café conocida por su sabor suave y afrutado.',
    'café_robusta': 'Variedad de café más fuerte y amargo, con mayor cafeína.',
    'sistema_de_extracción': 'Método utilizado para preparar el café, influyendo en el sabor.',
    'coffeart': 'Es Ayudar a todos los artesanos a vender su hermosos productos artesanos.',
    'tee': 'cafe',
    'cristiano': 'JEJE SIUUUUUUUUU CR7.',
    'logo': 'Para reprentar el cafe de nuestra tierra',
    'gusta': 'me encanta',
'quienes': 'somos coffeArt',
'nombre': 'Me llamo coffeArt',
'estas': 'muy bien, gracias',
'esta': 'muy bien, gracias',
'artesania': 'Las artesanías son una hermosa forma de expresión cultural que refleja tradiciones y habilidades locales. Cada pieza cuenta una historia única y apoya la economía de la comunidad, enriqueciendo nuestra conexión con el patrimonio y la creatividad.',

  };

  for (const [keyword, response] of Object.entries(keywords)) {
    if (question.toLowerCase().includes(keyword)) {
      return response;
    }
  }
  return 'Lo siento, no tengo una respuesta para esa pregunta. Por favor intenta con otra consulta.';
};

export const Help = () => {
  const userRole = localStorage.getItem('userType') || 'anonimo';
  const navigate = useNavigate();
  const [userQuestion, setUserQuestion] = useState('');
  const [messages, setMessages] = useState([
    { text: 'Hola, ¿cómo podemos ayudarte hoy? Aquí tienes algunas ideas sobre lo que puedes preguntar:', sender: 'system' },

  ]);
  const chatEndRef = useRef(null);

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/#');
  };

  const handleUserInput = (e) => {
    setUserQuestion(e.target.value);
  };

  const handleLoginClick = () => {
    navigate('/#');
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    const question = userQuestion.trim();

    if (!question) return;

    // Añadir la pregunta del usuario al chat
    setMessages(prevMessages => [
      ...prevMessages,
      { text: question, sender: 'user' }
    ]);

    // Obtener la respuesta basada en palabras clave
    const response = handleKeywordResponses(question);

    // Añadir la respuesta al chat
    setMessages(prevMessages => [
      ...prevMessages,
      { text: response, sender: 'system' }
    ]);

    setUserQuestion('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <div
        className="md:w-1/5 lg:w-1/6 bg-cover bg-center p-4 text-white flex justify-center items-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="flex flex-col items-center">
          <a href="/#" onClick={handleLogoClick} className="mb-6">
            <img src={Logo} alt="Logo" className="h-32 w-32" />
          </a>
          <nav className="flex flex-col items-center space-y-6">
            <NavLink to="/menu" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Bienvenido</NavLink>

            {/* Solo muestra el perfil si el usuario no es anonimo */}
            {userRole !== 'anonimo' && (
              <NavLink to={userRole === 'comprador' ? '/ProfileComprador' : userRole === 'administrador' ? '/ProfileForAdmin' : '/ProfileForEmpleado'} className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">
                Perfil
              </NavLink>
            )}

            {/* Rutas para el rol 'comprador' o 'anonimo' */}
            {(userRole === 'comprador') && (
              <NavLink to="/Cart" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Carrito</NavLink>
            )}

            {(userRole === 'anonimo') && (
              <NavLink to="/Cart" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Carrito</NavLink>
            )}

            {/* Rutas para los roles 'administrador' y 'empleado' */}
            {(userRole === 'administrador' || userRole === 'empleado') && (
              <>
                <NavLink to="/SalesOverview" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Ventas</NavLink>
                <NavLink to="/MaterialsForAdmin" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Insumos</NavLink>
              </>
            )}

            {/* Ruta común para todos */}
            <NavLink to="/Help" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Ayuda</NavLink>

            <button
              className="bg-darkyellow text-white px-4 py-2 rounded hover:bg-lightyellow mt-4 text-lg font-bold"
              onClick={handleLoginClick}
            >
              Regresar
            </button>

            {/* Botón para cerrar sesión, visible solo si no es 'anonimo' */}
            {userRole !== 'anonimo' && (
              <button
                className="bg-darkpurple text-white px-4 py-2 rounded hover:bg-lightpurple mt-4 text-lg font-bold"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            )}
          </nav>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center md:w-4/5 lg:w-5/6">
        <div className="w-full h-full flex justify-center items-center bg-cover bg-center p-4" style={{ backgroundImage: `url(${Background})` }}>
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white bg-opacity-70 rounded-lg max-w-lg mx-auto md:max-w-2xl w-full">
            <div className="w-full max-w-lg mb-8">
              <img src={Logo} alt="Logo" className="h-20 w-20 text-gray-800 mb-4 mx-auto" />
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Coffe Art chat de ayuda</h1>

              <div className="flex flex-col space-y-4 w-full mb-8 overflow-y-auto max-h-60 border border-gray-300 p-4 rounded-lg bg-gray-100">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex items-start space-x-4 mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-lg flex items-center space-x-2 ${msg.sender === 'user' ? 'bg-darkpurple text-white' : 'bg-lightpurple text-white'}`}>
                      {msg.sender === 'system' && <img src={Logo} alt="Logo" className="h-8 w-8" />}
                      {msg.sender === 'user' && <FaUserCircle className="text-white h-8 w-8" />}
                      <p className="text-lg">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleQuestionSubmit} className="flex items-center w-full max-w-lg">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Escribe tu pregunta aquí..."
                  value={userQuestion}
                  onChange={handleUserInput}
                  required
                />
                <button
                  type="submit"
                  className="ml-2 bg-darkyellow text-white px-4 py-2 rounded hover:bg-lightyellow text-xl font-bold"
                >
                  Preguntar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
