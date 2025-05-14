/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 04/04
  Descripción: Controlador relativo al inicio de sesión de los usuarios. A través de este controlador se lleva a cabo la comprobación de
  si el usuario que está llevando a cabo el inicio de sesión existe y, de ser así, hace una llamada al controlador de autenticación para
  obtener el token de Fiskaly.
*/

/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 04/04
  Descripción: Comentarios del código.
*/

import { loginUser } from '../../models/SequelizeModels/user.model.js'; // Importación del modelo User
import dotenv from 'dotenv'; // Importación de dotenv
import { authenticate } from '../Fiskaly/fiskaly.controllers.js'; // Importación de la función de autenticación de Fiskaly

dotenv.config(); // Carga de variables de entorno

// Función para el login
export async function login(req, res) {
    const { login, password } = req.body; // Obtención de las credenciales

    try {
        // Verificación de las credenciales en la base de datos
        const user = await loginUser(login, password);
        
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado o contraseña incorrecta" });
        }

        console.log("Usuario existente");

        // Llamada al controlador de autenticación de Fiskaly
        const tokenData = await authenticate();
        
        if (!tokenData) {
            return res.status(500).json({ error: "Error al obtener el token de Fiskaly" });
        }

        // Respuesta con el token de Fiskaly
        return res.status(200).json({ token: tokenData });

    } catch (error) {
        console.error("Error en el login o autenticación con Fiskaly:", error);
        return res.status(500).json({ error: "Error en el login o autenticación" });
    }
}
