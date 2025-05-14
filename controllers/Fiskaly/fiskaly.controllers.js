/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 31/03
  Descripción: Controlador relativo a la autenticación. A través de este controlador se obtiene el token.
*/

/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 02/04
  Descripción: Comentarios del código.
*/

import dotenv from 'dotenv';
dotenv.config(); // Carga de las variables de entorno

// Asignación de las variables de entorno
const FISKALY_API_URL = process.env.FISKALY_API_URL;
const API_KEY = process.env.FISKALY_API_KEY;
const API_SECRET = process.env.FISKALY_API_SECRET;

// Función para autenticar con la API de Fiskaly
export const authenticate = async () => {
  try {
    if (!FISKALY_API_URL) {
      console.error("Error: FISKALY_API_URL no está definido.");
      return { error: "Error en configuración del servidor" };
    }

    // Realizar la solicitud POST a la API de Fiskaly para la obtención del token
    const response = await fetch(`${FISKALY_API_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        content: {
          api_key: API_KEY,
          api_secret: API_SECRET,
        }
      }),
    });

    // Verificar si la respuesta es válida
    if (!response || !response.ok) {
      const errorData = await response?.json();
      throw new Error(errorData?.message || `Error en la solicitud: ${response?.status}`);
    }

    // Procesar la respuesta exitosa
    const data = await response.json();
    return data.content; // Retorna los datos del token de autenticación
  } catch (error) {
    console.error('Error en autenticación:', error.message);

    let statusCode = 500;
    let errorMessage = "Error interno del servidor";

    // Manejo de errores específicos
    const errorMessageLowerCase = error.message.toLowerCase();

    if (errorMessageLowerCase.includes('400')) {
      statusCode = 400;
      errorMessage = "Solicitud incorrecta.";
    } else if (errorMessageLowerCase.includes('401')) {
      statusCode = 401;
      errorMessage = "Acceso no autorizado.";
    }

    // Retorna un error si ocurre algo
    return { error: errorMessage };
  }
};