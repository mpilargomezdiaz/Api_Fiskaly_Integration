/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 03/04
  Descripción: Controlador relativo a la autenticación. A través de este controlador se obtiene el token.
  Se ha modificado 'fiskaly.controllers.js' a 'auth.controllers.js' para que pueda conectarse con el formulario que está en proceso.
*/

/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 03/04
  Descripción: Comentarios del código.
*/

// Se importa dotenv para cargar las variables de entorno desde el archivo .env
import dotenv from 'dotenv';
dotenv.config(); // Se cargan las variables de entorno

// Se asigna la URL base de la API de Fiskaly a una constante desde las variables de entorno
const FISKALY_API_URL = process.env.FISKALY_API_URL;

// Función para manejar la autenticación con la API de Fiskaly
export const authenticate = async (req, res) => {
    try {
        // Se extraen apiKey y apiSecret del cuerpo de la solicitud
        const { apiKey, apiSecret } = req.body;

        // Se valida que ambos valores estén presentes en la solicitud
        if (!apiKey || !apiSecret) {
            return res.status(400).json({ error: "API Key y API Secret son requeridos." });
        }

        // Se realiza una solicitud POST a la API de Fiskaly para autenticación
        const response = await fetch(`${FISKALY_API_URL}/auth`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                content: { 
                    api_key: apiKey, 
                    api_secret: apiSecret 
                }
            }),
        });

        // Se verifica si la respuesta de la API es exitosa
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error en la solicitud: ${response.status}`);
        }

        // Se obtiene el contenido de la respuesta en formato JSON
        const data = await response.json();

        // Se devuelve la respuesta con los datos de autenticación
        res.json(data.content);
    } catch (error) {
        console.error('Error en autenticación:', error.message); // Se imprime el error en la consola

        // Se definen códigos de estado y mensajes de error por defecto
        let statusCode = 500;
        let errorMessage = "Error interno del servidor";
    
        const errorMessageLowerCase = error.message.toLowerCase(); // Se convierte el mensaje de error a minúsculas para facilitar la comparación
    
        // Se evalúa el error para determinar el código de estado y mensaje adecuado
        switch (true) {
            case errorMessageLowerCase.includes('400'):
                statusCode = 400;
                errorMessage = "Solicitud incorrecta."; // Error en la solicitud
                break;
            case errorMessageLowerCase.includes('401'):
                statusCode = 401;
                errorMessage = "Acceso no autorizado."; // Error de autenticación
                break;
        }
    
        // Se envía el error como respuesta
        res.status(statusCode).json({ error: errorMessage });
      }
    };
    