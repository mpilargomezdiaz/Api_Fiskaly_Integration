/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 01/04
  Descripción: Controladores relacionados con facturas:
  - Crear una factura.
  - Actualizar una factura.
  - Obtener una factura.
  - Listar las facturas.
  - Buscar las facturas.
  - Exportar facturas.
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

// Función para crear una factura
export const createInvoice = async (req, res) => {
    try {
        // Se extraen los parámetros de la solicitud
        const { client_id, invoice_id } = req.params;
        const { code } = req.query;

        // Se construye la URL para la solicitud a la API de Fiskaly
        let url = `${FISKALY_API_URL}/clients/${client_id}/invoices/${invoice_id}`;
        if (code) {
            url += `?code=${code}`;
        }
        // Se realiza la solicitud PUT a la API de Fiskaly para crear una factura
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`, // Se envía el token JWT en la cabecera
                'Content-Type': 'application/json', // Se especifica que el contenido es JSON
            },
            // Se envía el cuerpo con el contenido, las anotaciones y los metadatos
            body: JSON.stringify({
                content: req.body.content,
                annotations: req.body.annotations,
                metadata: req.body.metadata,
            }),
        });
        // Se parsea la respuesta de la API a JSON
        const data = await response.json(); // Se responde con la información de la información creada
        res.json(data);
    } catch (error) {
        // Se imprime el error en la consola.
        console.error("Error al enviar la factura:", error.message);

        
    // Se definen códigos de estado y mensajes de error por defecto
        let statusCode = 500;
        let errorMessage = "Error interno del servidor";

        const errorMessageLowerCase = error.message.toLowerCase(); // Se convierte el mensaje de error a minúsculas para facilitar la comparación

        // Se evalúa el error para determinar el código de estado y mensaje adecuado
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
            case errorMessageLowerCase.includes('429'):
                statusCode = 429;
                errorMessage = "Ocurrió un error de concurrencia en el uso del recurso";
                break;
        }
    // Se envía el error como respuesta
        res.status(statusCode).json({ error: errorMessage });
    }
};


// Función para actualizar una factura
export const updateInvoice = async (req, res) => {
    try {
        const { client_id, invoice_id } = req.params; // Se obtiene el ID del cliente y de la factura desde los parámetros
        const { code } = req.query; // Se obtiene el parámetro de consulta "code"

        let url = `${FISKALY_API_URL}/clients/${client_id}/invoices/${invoice_id}`;
        if (code) {
            url += `?code=${code}`;
        }
        // Se realiza la solicitud PATCH a la API de Fiskaly para actualizar la factura
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`, // Se envía el token JWT en la cabecera
                'Content-Type': 'application/json', // Se especifica que el contenido es JSON
            },
            // Se envía el cuerpo con el contenido, las anotaciones y los metadatos
            body: JSON.stringify({
                content: req.body.content,
                annotations: req.body.annotations,
                metadata: req.body.metadata,
            }),
        });
        const data = await response.json(); // Se parsea la respuesta de la API a JSON
        res.json(data); // Se responde con los datos de la factura actualizados
    } catch (error) {
        // Se imprime el error en la consola.
        console.error("Error al actualizar la factura:", error.message);

        let statusCode = 500;
        let errorMessage = "Error interno del servidor";

        const errorMessageLowerCase = error.message.toLowerCase(); // Se convierte el mensaje de error a minúsculas para facilitar la comparación

        // Se evalúa el error para determinar el código de estado y mensaje adecuado
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
        // Se envía el error como respuesta
        res.status(statusCode).json({ error: errorMessage });
    }
};

// Función para obtener una factura
export const getInvoice = async (req, res) => {
    try {
        const { client_id, invoice_id } = req.params; // Se obtiene el ID del cliente y el ID de la factura desde los parámetros
        const { code } = req.query; // Se obtiene el parámetro de consulta "code"

        let url = `${FISKALY_API_URL}/clients/${client_id}/invoices/${invoice_id}`;
        if (code) {
            url += `?code=${code}`;
        }
        // Se realiza la solicitud GET a la API de Fiskaly para obtener la factura
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`, // Se envía el token JWT en la cabecera
                'Content-Type': 'application/json', // Se especifica que el contenido es JSON
            },
        });
        const data = await response.json(); // Se parsea la respuesta de la API a JSON
        res.json(data); // Se responde con los datos de la factura obtenidos
    } catch (error) {
        // Se imprime el error en la consola
        console.error("Error al obtener la factura:", error.message);

        let statusCode = 500;
        let errorMessage = "Error interno del servidor";

        const errorMessageLowerCase = error.message.toLowerCase(); // Se convierte el mensaje de error a minúsculas para facilitar la comparación

         // Se evalúa el error para determinar el código de estado y mensaje adecuado
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
    // Se envía el error como respuesta
        res.status(statusCode).json({ error: errorMessage });
    }
};

// Función para listar las facturas
export const listInvoices = async (req, res) => {
    try {
        const { client_id } = req.params; // Se obtiene el ID del cliente desde los parámetros
        const { code, limit, token } = req.query; // Parámetros de consulta

        const params = new URLSearchParams({ code, limit, token });
        let url = `${FISKALY_API_URL}/clients/${client_id}/invoices`;

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${JWT_TOKEN}`, 'Content-Type': 'application/json' },
        });

        // Se verifica si la respuesta es exitosa
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }

        const data = await response.json(); // Se parsea la respuesta de la API a JSON
        res.json(data); // Se responde con los datos de las facturas obtenidas
    } catch (error) {
        // Se imprime el error en la consola.
        console.error("Error al obtener las facturas:", error.message);

        let statusCode = 500;
        let errorMessage = "Error interno del servidor";

        const errorMessageLowerCase = error.message.toLowerCase(); // Se convierte el mensaje de error a minúsculas para facilitar la comparación

        // Se evalúa el error para determinar el código de estado y mensaje adecuado
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
    // Se envía el error como respuesta
        res.status(statusCode).json({ error: errorMessage });
    }
};

// Función para buscar facturas
export const searchInvoices = async (req, res) => {
    try {
        const { number, series, issued_at_from, issued_at_to, client_id, limit, token } = req.query; // Parámetros de consulta

        const params = new URLSearchParams({ number, series, issued_at_from, issued_at_to, client_id, limit, token });
        let url = `${FISKALY_API_URL}/invoices`;

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${JWT_TOKEN}`, 'Content-Type': 'application/json' },
        });

        // Se verifica si la respuesta es exitosa.
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }

        const data = await response.json(); // Se parsea la respuesta de la API a JSON
        res.json(data); // Se responde con los datos de las facturas obtenidas
    } catch (error) {
        // Se imprime el error en la consola
        console.error("Error al obtener la lista de facturas firmadas:", error.message);

        let statusCode = 500;
        let errorMessage = "Error interno del servidor";

        const errorMessageLowerCase = error.message.toLowerCase(); // Se convierte el mensaje de error a minúsculas para facilitar la comparación
// Se evalúa el error para determinar el código de estado y mensaje adecuado
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
    // Se envía el error como respuesta
        res.status(statusCode).json({ error: errorMessage });
    }
};


// Función para exportar una factura
export const exportInvoice = async (req, res) => {
    try {
        // Se obtiene el ID del cliente y de la factura desde los parámetros de la URL
        const { client_id, invoice_id } = req.params; 

        // Se construye la URL para solicitar la exportación de la factura en formato XML
        const url = `${FISKALY_API_URL}/clients/${client_id}/invoices/${invoice_id}/xml`;

        // Se realiza la solicitud GET a la API de Fiskaly
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }, // Se envía el token JWT en la cabecera
        });

        // Se verifica si la respuesta es exitosa.
        if (!response.ok) {
            try {
                // Se intenta parsear la respuesta en formato JSON en caso de error
                const errorData = await response.json();
                return res.status(response.status).json(errorData);
            } catch (jsonError) {
                // Si la respuesta no es un JSON válido, se envía como texto
                return res.status(response.status).send(await response.text());
            }
        }
        
        // Se establece el tipo de contenido de la respuesta como XML
        res.setHeader('Content-Type', 'application/xml');
        
        // Se envía la respuesta con el contenido XML de la factura
        res.send(await response.text());
    } catch (error) {
        // Se imprime el error en la consola.
        console.error("Error al exportar la factura:", error.message);

        // Valores por defecto para el código de estado y mensaje de error
        let statusCode = 500;
        let errorMessage = "Error interno del servidor";

        // Se convierte el mensaje de error a minúsculas para facilitar la comparación
        const errorMessageLowerCase = error.message.toLowerCase();

        // Se evalúa el error para determinar el código de estado y mensaje adecuado
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

        // Se envía el error como respuesta con el código de estado correspondiente
        res.status(statusCode).json({ error: errorMessage });
    }
};
