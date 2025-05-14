/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 02/04
  Descripción: Controlador relacionado con el software. Se obtiene la información del software.
*/

/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 02/04
  Descripción: Comentarios del código.
*/

import dotenv from 'dotenv';
dotenv.config();

// Se asignan las variables de entorno a constantes
const FISKALY_API_URL = process.env.FISKALY_API_URL;
const JWT_TOKEN = process.env.JWT_TOKEN;

export const getSoftware = async (req, res) => {
    try {
        // Se realiza la solicitud GET a la API de Fiskaly para obtener información del software
        const response = await fetch(`${FISKALY_API_URL}/software`, {
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        // Se envía la respuesta JSON con el contenido del software
        const data = await response.json();
        res.json(data.content);
    } catch (error) {
        // Se imprime el error en la consola
        console.error("Error al obtener el software:", error.message);
        // Se inicializan el código de estado y el mensaje de error
        let statusCode = 500;
        let errorMessage = "Error interno del servidor";

        // Se convierte el mensaje de error a minúsculas para la comparación
        const errorMessageLowerCase = error.message.toLowerCase();

        // Se manejan los diferentes códigos de error de la API
        switch (true) {
            case errorMessageLowerCase.includes('400'):
                statusCode = 400;
                errorMessage = "Solicitud incorrecta. Verifica los datos enviados.";
                break;
            case errorMessageLowerCase.includes('401'):
                statusCode = 401;
                errorMessage = "Acceso no autorizado. Verifica tu token de autenticación.";
                break;
            case errorMessageLowerCase.includes('409'):
                statusCode = 409;
                errorMessage = "El recurso solicitado tiene un conflicto.";
                break;
        }

        // Se envía la respuesta de error con el código de estado y el mensaje correspondiente
        res.status(statusCode).json({ error: errorMessage });
    }
};