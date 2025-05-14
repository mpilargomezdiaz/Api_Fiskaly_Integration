/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 01/04
  Descripción: Controladores relacionados con firmantes:
  - Crear un firmante.
  - Actualizar un firmante.
  - Obtener un firmante.
  - Listar firmantes.
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

export const createSigner = async (req, res) => {
    try {
        // Se extraen los datos del cuerpo de la solicitud y el ID del firmante de los parámetros
        const { content, metadata } = req.body;
        const { signer_id } = req.params;

        // Se realiza la solicitud PUT a la API de Fiskaly para crear un firmante
        const response = await fetch(`${FISKALY_API_URL}/signers/${signer_id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content, metadata }),
        });

        // Se envía la respuesta JSON con el contenido del firmante creado
        const data = await response.json();
        res.json(data.content);
    } catch (error) {
        // Se imprime el error en la consola
        console.error("Error al crear dispositivo firmante:", error.message);

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

export const updateSigner = async (req, res) => {
    try {
        // Se extraen el ID del firmante de los parámetros y los datos del cuerpo de la solicitud
        const { signer_id } = req.params;
        const { content, metadata } = req.body;

        // Se realiza la solicitud PATCH a la API de Fiskaly para actualizar un firmante
        const response = await fetch(`${FISKALY_API_URL}/signers/${signer_id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content, metadata }),
        });

        // Se envía la respuesta JSON con el contenido del firmante actualizado
        const data = await response.json();
        res.json(data.content);
    } catch (error) {
        // Se imprime el error en la consola
        console.error("Error al actualizar dispositivo firmante:", error.message);

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

export const getSigner = async (req, res) => {
    try {
        // Se extrae el ID del firmante de los parámetros
        const { signer_id } = req.params;

        // Se realiza la solicitud GET a la API de Fiskaly para obtener un firmante
        const response = await fetch(`${FISKALY_API_URL}/signers/${signer_id}`, {
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        // Se envía la respuesta JSON con el contenido del firmante obtenido
        const data = await response.json();
        res.json(data.content);
    } catch (error) {
        // Se imprime el error en la consola
        console.error("Error al obtener un firmante:", error.message);

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

export const listSigners = async (req, res) => {
    try {
        // Se extraen los parámetros de la consulta
        const { limit, token } = req.query;
        // Se construye la URL con los parámetros de la consulta
        const url = new URL(`${FISKALY_API_URL}/signers`);
        if (limit) url.searchParams.append('limit', limit);
        if (token) url.searchParams.append('token', token);

        // Se realiza la solicitud GET a la API de Fiskaly para listar los firmantes
        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        // Se envía la respuesta JSON con la lista de firmantes
        const data = await response.json();
        res.json(data.content);
    } catch (error) {
        // Se imprime el error en la consola
        console.error("Error al listar dispositivo firmante:", error.message);

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
        }

        // Se envía la respuesta de error con el código de estado y el mensaje correspondiente
        res.status(statusCode).json({ error: errorMessage });
    }
};