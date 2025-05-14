/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 02/04
  Descripción: Controladores relacionados con exportaciones:
  - Crear una exportación.
  - Actualizar una exportación.
  - Obtener una exportación.
  - Listar las exportaciones.
  - Descargar una exportación.
*/

/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 02/04
  Descripción: Comentarios del código.
*/

// Se importa dotenv para cargar las variables de entorno desde el archivo .env
import dotenv from 'dotenv';
dotenv.config(); // Se cargan las variables de entorno

// Se asignan las variables de entorno a constantes
const FISKALY_API_URL = process.env.FISKALY_API_URL; // URL base de la API de Fiskaly
const JWT_TOKEN = process.env.JWT_TOKEN; // Token JWT para autenticación

// Función para crear una exportación
export const createExport = async (req, res) => {
  try {
    const { export_id } = req.params; // Se obtiene el ID de la exportación desde los parámetros
    const { series, issued_at_from, issued_at_to, client_id } = req.query; // Se obtienen los parámetros de consulta
    const { metadata } = req.body; // Se obtienen los metadatos desde el cuerpo de la solicitud

    // Se construye la URL con los parámetros de consulta
    const url = new URL(`${FISKALY_API_URL}/exports/${export_id}`);
    if (series) url.searchParams.append('series', series); // Si se proporciona 'series', se añade como parámetro de consulta a la URL.
    if (issued_at_from) url.searchParams.append('issued_at_from', issued_at_from); // Si se proporciona 'issued_at_from', se añade como parámetro de consulta a la URL.
    if (issued_at_to) url.searchParams.append('issued_at_to', issued_at_to); // Si se proporciona 'issued_at_to', se añade como parámetro de consulta a la URL.
    if (client_id) url.searchParams.append('client_id', client_id); // Si se proporciona 'client_id', se añade como parámetro de consulta a la URL.

    // Se realiza una solicitud PUT para crear la exportación
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`, // Se envía el token JWT en la cabecera
        'Content-Type': 'application/json', // Se especifica que el contenido es JSON
      },
      body: JSON.stringify({ metadata }), // Se envía el cuerpo con los metadatos de la exportación
    });

    const data = await response.json(); // Se parsea la respuesta de la API a JSON
    res.json(data); // Se responde con la información de la exportación creada
  } catch (error) {
    console.error('Error al crear la exportación:', error.message); // Se imprime el error en la consola

    // Se definen códigos de estado y mensajes de error por defecto
    let statusCode = 500;
    let errorMessage = 'Error interno del servidor';

    const errorMessageLowerCase = error.message.toLowerCase(); // Se convierte el mensaje de error a minúsculas para facilitar la comparación

    // Se evalúa el error para determinar el código de estado y mensaje adecuado
    switch (true) {
      case errorMessageLowerCase.includes('400'):
        statusCode = 400;
        errorMessage = 'Solicitud incorrecta. Verifica los datos enviados.';
        break;
      case errorMessageLowerCase.includes('401'):
        statusCode = 401;
        errorMessage = 'Acceso no autorizado. Verifica tu token de autenticación.';
        break;
      case errorMessageLowerCase.includes('409'):
        statusCode = 409;
        errorMessage = 'El recurso solicitado tiene un conflicto.';
        break;
    }

    // Se envía el error como respuesta
    res.status(statusCode).json({ error: errorMessage });
  }
};

// Función para actualizar una exportación
export const updateExport = async (req, res) => {
  try {
    const { export_id } = req.params; // Se obtiene el ID de la exportación desde los parámetros
    const { metadata } = req.body; // Se obtiene los metadatos desde el cuerpo de la solicitud

    // Se realiza una solicitud PATCH para actualizar la exportación
    const response = await fetch(`${FISKALY_API_URL}/exports/${export_id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`, // Se envía el token JWT en la cabecera
        'Content-Type': 'application/json', // Se especifica que el contenido es JSON
      },
      body: JSON.stringify({ metadata }), // Se envía el cuerpo con los metadatos actualizados
    });

    const data = await response.json(); // Se parsea la respuesta de la API a JSON
    res.json(data); // Se responde con la información de la exportación actualizada
  } catch (error) {
    console.error('Error al actualizar la exportación:', error.message); // Se imprime el error en la consola
    let statusCode = 500;
    let errorMessage = 'Error interno del servidor';

    const errorMessageLowerCase = error.message.toLowerCase(); // Se convierte el mensaje de error a minúsculas para facilitar la comparación

    // Se evalúa el error para determinar el código de estado y mensaje adecuado
    switch (true) {
      case errorMessageLowerCase.includes('400'):
        statusCode = 400;
        errorMessage = 'Solicitud incorrecta. Verifica los datos enviados.';
        break;
      case errorMessageLowerCase.includes('401'):
        statusCode = 401;
        errorMessage = 'Acceso no autorizado. Verifica tu token de autenticación.';
        break;
      case errorMessageLowerCase.includes('404'):
        statusCode = 404;
        errorMessage = 'El recurso solicitado no existe.';
        break;
    }

    // Se envía el error como respuesta
    res.status(statusCode).json({ error: errorMessage });
  }
};

// Función para obtener una exportación
export const getExport = async (req, res) => {
  try {
    const { export_id } = req.params; // Se obtiene el ID de la exportación desde los parámetros

    // Se realiza una solicitud GET para obtener la exportación
    const response = await fetch(`${FISKALY_API_URL}/exports/${export_id}`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`, // Se envía el token JWT en la cabecera
        'Content-Type': 'application/json', // Se especifica que el contenido es JSON
      },
    });

    const data = await response.json(); // Se parsea la respuesta de la API a JSON
    res.json(data); // Se responde con la información de la exportación obtenida
  } catch (error) {
    console.error('Error al obtener la exportación:', error.message); // Se imprime el error en la consola
    let statusCode = 500;
    let errorMessage = 'Error interno del servidor';

    const errorMessageLowerCase = error.message.toLowerCase(); // Se convierte el mensaje de error a minúsculas para facilitar la comparación

    // Se evalúa el error para determinar el código de estado y mensaje adecuado
    switch (true) {
      case errorMessageLowerCase.includes('400'):
        statusCode = 400;
        errorMessage = 'Solicitud incorrecta. Verifica los datos enviados.';
        break;
      case errorMessageLowerCase.includes('401'):
        statusCode = 401;
        errorMessage = 'Acceso no autorizado. Verifica tu token de autenticación.';
        break;
      case errorMessageLowerCase.includes('404'):
        statusCode = 404;
        errorMessage = 'El recurso solicitado no existe.';
        break;
    }

    // Se envía el error como respuesta
    res.status(statusCode).json({ error: errorMessage });
  }
};

// Función para listar las exportaciones
export const listExports = async (req, res) => {
  try {
    const { limit, token } = req.query; // Se obtienen los parámetros de consulta 'limit' y 'token'
    const url = new URL(`${FISKALY_API_URL}/exports`); // Se construye la URL de la API para obtener la lista de exportaciones
    if (limit) url.searchParams.append('limit', limit); // Si hay un límite, se agrega a la URL
    if (token) url.searchParams.append('token', token); // Si hay un token, se agrega a la URL

    // Se realiza una solicitud GET para listar las exportaciones
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`, // Se envía el token JWT en la cabecera
        'Content-Type': 'application/json', // Se especifica que el contenido es JSON
      },
    });

    const data = await response.json(); // Se parsea la respuesta de la API a JSON
    res.json(data.content); // Se responde con la información de las exportaciones obtenidas
  } catch (error) {
    console.error('Error al listar las exportaciones:', error.message); // Se imprime el error en la consola

    let statusCode = 500;
    let errorMessage = 'Error interno del servidor';

    const errorMessageLowerCase = error.message.toLowerCase(); // Se convierte el mensaje de error a minúsculas para facilitar la comparación

    // Se evalúa el error para determinar el código de estado y mensaje adecuado
    switch (true) {
      case errorMessageLowerCase.includes('400'):
        statusCode = 400;
        errorMessage = 'Solicitud incorrecta. Verifica los datos enviados.';
        break;
      case errorMessageLowerCase.includes('401'):
        statusCode = 401;
        errorMessage = 'Acceso no autorizado. Verifica tu token de autenticación.';
        break;
    }

    // Se envía el error como respuesta
    res.status(statusCode).json({ error: errorMessage });
  }
};

// Función para descargar una exportación
export const downloadExport = async (req, res) => {
  try {
    const { export_id } = req.params; // Se obtiene el ID de la exportación desde los parámetros

    // Se realiza una solicitud GET para descargar la exportación como un archivo zip
    const response = await fetch(`${FISKALY_API_URL}/exports/${export_id}.zip`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`, // Se envía el token JWT en la cabecera
      },
    });

    // Se verifica que la respuesta sea válida
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    res.setHeader('Content-Type', 'application/zip'); // Se establece el tipo de contenido como archivo zip
    res.send(await response.buffer()); // Se envía el archivo zip como respuesta
  } catch (error) {
    console.error('Error al descargar la exportación:', error.message); // Se imprime el error en la consola
    let statusCode = 500;
    let errorMessage = 'Error interno del servidor';

    const errorMessageLowerCase = error.message.toLowerCase(); // Se convierte el mensaje de error a minúsculas para facilitar la comparación

    // Se evalúa el error para determinar el código de estado y mensaje adecuado
    switch (true) {
      case errorMessageLowerCase.includes('400'):
        statusCode = 400;
        errorMessage = 'Solicitud incorrecta. Verifica los datos enviados.';
        break;
      case errorMessageLowerCase.includes('401'):
        statusCode = 401;
        errorMessage = 'Acceso no autorizado. Verifica tu token de autenticación.';
        break;
      case errorMessageLowerCase.includes('404'):
        statusCode = 404;
        errorMessage = 'El recurso solicitado no existe.';
        break;
    }

    // Se envía el error como respuesta
    res.status(statusCode).json({ error: errorMessage });
  }
};
