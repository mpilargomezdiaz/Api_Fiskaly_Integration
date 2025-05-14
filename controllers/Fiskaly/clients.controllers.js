/*
  Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 31/03
  Descripción: Controladores relacionados con clientes:
  - Crear cliente.
  - Actualizar cliente.
  - Obtener un cliente.
  - Listar todos los clientes.
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

// Función para crear un cliente
export const createClient = async (req, res) => {
  try {
    const { client_id } = req.params; // Se obtiene el ID del cliente desde los parámetros de la URL
    const { content, metadata } = req.body; // Se obtiene el contenido y metadatos del cuerpo de la solicitud

    // Se realiza una solicitud PUT a la API de Fiskaly para crear un cliente.
    const response = await fetch(`${FISKALY_API_URL}/clients/${client_id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`, // Se envía el token JWT en la cabecera
        'Content-Type': 'application/json', // Se especifica que el contenido es JSON
      },
      body: JSON.stringify({ content, metadata }), // Se envía el cuerpo con el contenido y metadatos del cliente
    });

    const data = await response.json(); // Se parsea la respuesta de la API a JSON
    res.json(data.content); // Se responde con el contenido del cliente creado
  } catch (error) {
    console.error("Error al crear cliente:", error.message); // Se imprime el error en la consola

    // Se definen códigos de estado y mensajes de error por defecto
    let statusCode = 500;
    let errorMessage = "Error interno del servidor";

    const errorMessageLowerCase = error.message.toLowerCase(); // Se convierte el mensaje de error a minúsculas para facilitar la comparación

    // Se evalúa el error para determinar el código de estado y mensaje adecuado
    switch (true) {
        case errorMessageLowerCase.includes('400'):
            statusCode = 400;
            errorMessage = "Solicitud incorrecta. Verificar los datos enviados.";
            break;
        case errorMessageLowerCase.includes('401'):
            statusCode = 401;
            errorMessage = "Acceso no autorizado. Verificar el token de autenticación.";
            break;
        case errorMessageLowerCase.includes('409'):
            statusCode = 409;
            errorMessage = "El recurso solicitado tiene un conflicto.";
            break;
    }

    // Se envía el error como respuesta
    res.status(statusCode).json({ error: errorMessage });
  }
};

// Función para actualizar un cliente
export const updateClient = async (req, res) => {
  try {
    const { client_id } = req.params; // Se obtiene el ID del cliente desde los parámetros
    const { content, metadata } = req.body; // Se obtiene el contenido y metadatos del cuerpo de la solicitud

    // Se realiza una solicitud PATCH a la API de Fiskaly para actualizar el cliente
    const response = await fetch(`${FISKALY_API_URL}/clients/${client_id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`, // Se envía el token JWT en la cabecera
        'Content-Type': 'application/json', // Se especifica que el contenido es JSON
      },
      body: JSON.stringify({ content, metadata }), // Se envía el cuerpo con el contenido y metadatos del cliente
    });

    const data = await response.json(); // Se parsea la respuesta de la API a JSON
    res.json(data.content); // Se responde con el contenido del cliente actualizado
  } catch (error) {
    console.error("Error al actualizar cliente:", error.message); // Se imprime el error en la consola
    let statusCode = 500;
    let errorMessage = "Error interno del servidor";

    const errorMessageLowerCase = error.message.toLowerCase(); // Se convierte el mensaje de error a minúsculas para facilitar la comparación

    // Se evalúa el error para determinar el código de estado y mensaje adecuado
    switch (true) {
        case errorMessageLowerCase.includes('400'):
            statusCode = 400;
            errorMessage = "Solicitud incorrecta. Verificar los datos enviados.";
            break;
        case errorMessageLowerCase.includes('401'):
            statusCode = 401;
            errorMessage = "Acceso no autorizado. Verificar el token de autenticación.";
            break;
        case errorMessageLowerCase.includes('404'):
            statusCode = 404;
            errorMessage = "El recurso solicitado no existe.";
            break;
    }

    // Se envía el error como respuesta
    res.status(statusCode).json({ error: errorMessage });
  }
};

// Función para obtener un cliente
export const getClient = async (req, res) => {
  try {
    const { client_id } = req.params; // Se obtiene el ID del cliente desde los parámetros

    // Se realiza una solicitud GET a la API de Fiskaly para obtener el cliente
    const response = await fetch(`${FISKALY_API_URL}/clients/${client_id}`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`, // Se envía el token JWT en la cabecera
        'Content-Type': 'application/json', // Se especifica que el contenido es JSON
      },
    });

    const data = await response.json(); // Se parsea la respuesta de la API a JSON
    res.json(data.content); // Se responde con el contenido del cliente obtenido
  } catch (error) {
    console.error("Error al obtener cliente:", error.message); // Se imprime el error en la consola
    let statusCode = 500;
    let errorMessage = "Error interno del servidor";

    const errorMessageLowerCase = error.message.toLowerCase(); // Se convierte el mensaje de error a minúsculas para facilitar la comparación

    // Se evalúa el error para determinar el código de estado y mensaje adecuado
    switch (true) {
        case errorMessageLowerCase.includes('400'):
            statusCode = 400;
            errorMessage = "Solicitud incorrecta. Verificar los datos enviados.";
            break;
        case errorMessageLowerCase.includes('401'):
            statusCode = 401;
            errorMessage = "Acceso no autorizado. Verificar el token de autenticación.";
            break;
        case errorMessageLowerCase.includes('404'):
            statusCode = 404;
            errorMessage = "El recurso solicitado no existe.";
            break;
    }

    // Se envía el error como respuesta
    res.status(statusCode).json({ error: errorMessage });
  }
};

// Función para listar todos los clientes
export const listClients = async (req, res) => {
  try {
    const { limit, token } = req.query; // Se obtienen los parámetros de consulta 'limit' y 'token'
    const url = new URL(`${FISKALY_API_URL}/clients`); // Se crea la URL de la API para obtener la lista de clientes
    if (limit) url.searchParams.append('limit', limit); // Si hay un límite, se agrega a la URL
    if (token) url.searchParams.append('token', token); // Si hay un token, se agrega a la URL

    // Se realiza una solicitud GET a la API de Fiskaly para listar los clientes
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`, // Se envía el token JWT en la cabecera
        'Content-Type': 'application/json', // Se especifica que el contenido es JSON
      },
    });

    const data = await response.json(); // Se parsea la respuesta de la API a JSON
    res.json(data.content); // Se responde con el contenido de los clientes obtenidos
  } catch (error) {
    console.error("Error al listar clientes:", error.message); // Se imprime el error en la consola
 
    let statusCode = 500;
    let errorMessage = "Error interno del servidor";

    const errorMessageLowerCase = error.message.toLowerCase(); // Se convierte el mensaje de error a minúsculas para facilitar la comparación

    // Se evalúa el error para determinar el código de estado y mensaje adecuado
    switch (true) {
        case errorMessageLowerCase.includes('400'):
            statusCode = 400;
            errorMessage = "Solicitud incorrecta. Verificar los datos enviados.";
            break;
        case errorMessageLowerCase.includes('401'):
            statusCode = 401;
            errorMessage = "Acceso no autorizado. Verificar el token de autenticación.";
            break;
    }

    // Se envía el error como respuesta
    res.status(statusCode).json({ error: errorMessage });
  }
};
