/*
Ticket de Jira: DP-25
  Nombre: Pilar
  Fecha: 11/04
  Descripción: Controlador correspondiente a las facturas de subsanación.
*/

/*
Ticket de Jira: SCRUM-7
  Nombre: Pilar
  Fecha: 23/04
  Descripción: Comentarios del código.
*/

// Se importa la función responsable de generar una factura de subsanación de prueba.
import { exampleRemedyInvoice } from '../../../models/SequelizeModels/InvoicesModels/remedy.model.js'

// Función asíncrona que actúa como controlador para la creación de la factura de subsanación de prueba.
export async function createRemedyInvoice(req, res) {
  try {
    // Llamada a la función.
    const invoice = await exampleRemedyInvoice(req, res);

    // Se registra en consola un mensaje indicando que la factura fue creada con éxito.
    console.log('Factura de subsanación creada exitosamente');

    // Se devuelve la factura en formato JSON.
    res.status(201).json(invoice);
  } catch (error) {
    // En caso de error, se imprime el mensaje del error en consola.
    console.error('Error al crear la factura de subsanación:', error.message);

    // Se devuelve una respuesta 500 con el mensaje de error.
    res.status(500).json({ error: error.message });
  }
}


