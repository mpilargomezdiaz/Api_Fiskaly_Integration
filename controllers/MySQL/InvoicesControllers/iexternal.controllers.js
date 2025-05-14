/*
Ticket de Jira: DP-25
  Nombre: Pilar
  Fecha: 11/04
  Descripción: Controlador correspondiente a las facturas externas.
*/

/*
Ticket de Jira: SCRUM-7
  Nombre: Pilar
  Fecha: 23/04
  Descripción: Comentarios del código.
*/

// Se importa la función encargada de generar una factura externa de prueba.
import { exampleExternalInvoice } from '../../../models/SequelizeModels/InvoicesModels/external.model.js'

// Función asíncrona que sirve como controlador para la creación de la factura externa de prueba.
export async function createExternalInvoice(req, res) {
  try {
    // Llamada a la función.
    const invoice = await exampleExternalInvoice(req, res);

    // En caso de no producirse ningún error, se registra en consola.
    console.log('Factura externa creada exitosamente');

    // Se responde al cliente con un estado 201 y la factura en formato JSON.
    res.status(201).json(invoice);
  } catch (error) {
    // En caso de error, se registra en consola el mensaje del error capturado.
    console.error('Error al crear la factura externa: ', error.message);

    // Se devuelve una respuesta 500 con el mensaje de error en formato JSON.
    res.status(500).json({ error: error.message });
  }
}


