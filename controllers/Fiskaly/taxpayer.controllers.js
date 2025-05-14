/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 31/03
  Descripción: Controlador relacionado con contribuyentes:
  - Creación de contribuyente.
  - Actualización de contribuyente.
  - Obtención de contribuyente.
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

export const createTaxpayer = async (req, res) => {
    try {
        // Se extraen los datos del cuerpo de la solicitud
        const { content, metadata } = req.body;

        // Se definen las cabeceras para la solicitud
        const headers = {
            'Authorization': `Bearer ${JWT_TOKEN}`,
            'Content-Type': 'application/json',
        };

        // Se realiza la solicitud PUT a la API de Fiskaly para crear un contribuyente
        const response = await fetch(`${FISKALY_API_URL}/taxpayer`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ content, metadata }),
        });

        // Se envía la respuesta JSON con el contenido del contribuyente creado
        const data = await response.json();
        res.json(data.content);
    } catch (error) {
        // Se imprime el error en la consola
        console.error("Error al crear el contribuyente:", error.message);
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
            case errorMessageLowerCase.includes('405'):
                statusCode = 405;
                errorMessage = "El método de solicitud no está permitido.";
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

export const updateTaxpayer = async (req, res) => {
    try {
        // Se extraen los datos del cuerpo de la solicitud
        const { content, metadata } = req.body;

        // Se definen las cabeceras para la solicitud
        const headers = {
            'Authorization': `Bearer ${JWT_TOKEN}`,
            'Content-Type': 'application/json',
        };

        // Se realiza la solicitud PATCH a la API de Fiskaly para actualizar un contribuyente
        const response = await fetch(`${FISKALY_API_URL}/taxpayer`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ content, metadata }),
        });

        // Se envía la respuesta JSON con el contenido del contribuyente actualizado
        const data = await response.json();
        res.json(data.content);
    } catch (error) {
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
            case errorMessageLowerCase.includes('404'):
                statusCode = 404;
                errorMessage = "El recurso solicitado no existe.";
                break;
        }

        // Se envía la respuesta de error con el código de estado y el mensaje correspondiente
        res.status(statusCode).json({ error: errorMessage });
    }
};

export const getTaxpayer = async (req, res) => {
    try {
        // Se definen las cabeceras para la solicitud
        const headers = {
            'Authorization': `Bearer ${JWT_TOKEN}`,
            'Content-Type': 'application/json',
        };

        // Se construye la URL para la solicitud GET
        const url = new URL(`${FISKALY_API_URL}/taxpayer`);
        // Se realiza la solicitud GET a la API de Fiskaly para obtener información del contribuyente
        const response = await fetch(url.toString(), {
            headers,
        });

        // Se envía la respuesta JSON con el contenido del contribuyente
        const data = await response.json();
        res.json(data.content);
    } catch (error) {
        // Se imprime el error en la consola
        console.error("Error al obtener contribuyente:", error.message);
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
            case errorMessageLowerCase.includes('404'):
                statusCode = 404;
                errorMessage = "El recurso solicitado no existe.";
                break;
        }

        // Se envía la respuesta de error con el código de estado y el mensaje correspondiente
        res.status(statusCode).json({ error: errorMessage });
    }
};