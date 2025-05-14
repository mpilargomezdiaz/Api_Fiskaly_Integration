/*
Ticket de Jira: SCRUM-6
  Nombre: Pilar
  Fecha: 21/04
  Descripción: Controlador que llama a la función encargada de exportar a JSON la información
  almacenada en las tablas relativas a facturas de MySQL.
*/

/*
Ticket de Jira: SCRUM-7
  Nombre: Pilar
  Fecha: 23/04
  Descripción: Comentarios del código.
*/

// Se importa la función encargada de exportar datos a formato JSON.
import { exportTables } from "../../../utils/JSON/exportToJson.js";

// Función asíncrona que actúa como controlador para la exportación de tablas a formato JSON.
export async function createExports(req, res) {
    try {
        // Llamada a la función
        await exportTables();

        // Si el proceso es exitoso, se devuelve una respuesta 200 y un mensaje indicando que las tablas fueron exportadas correctamente.
        res.status(200).json({ message: 'Tablas exportadas exitosamente a JSON' });
    } catch (error) {
        // En caso de producirse un error durante la exportación se responde con un mensaje de error.
        res.status(500).json({ message: 'Error al exportar las tablas', error: error.message });
    }
};
