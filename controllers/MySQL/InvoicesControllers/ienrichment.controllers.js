/*
Ticket de Jira: DP-25
  Nombre: Pilar
  Fecha: 11/04
  Descripción: Controlador correspondiente a las facturas de canje.
*/

/*
Ticket de Jira: SCRUM-7
  Nombre: Pilar
  Fecha: 23/04
  Descripción: Comentarios del código.
*/

// Se importa la función encargada de generar una factura de canje de prueba.
import { exampleEnrichmentInvoice } from '../../../models/SequelizeModels/InvoicesModels/enrichment.model.js'

// Función asíncrona que actúa como controlador para la creación de una factura de canje de prueba.
export async function createEnrichmentInvoice(req, res) {
  try {
    // Se ejecuta la función que genera una factura de canje de prueba.
    const invoice = await exampleEnrichmentInvoice(req, res);

    // Se registra en consola un mensaje informando que la factura fue creada con éxito.
    console.log('Factura de canje creada exitosamente');

    // Se devuelve la factura creada en formato JSON.
    res.status(201).json(invoice);
  } catch (error) {
    // Si ocurre un error durante el proceso, se imprime el mensaje del error en la consola.
    console.error('Error al crear la factura de canje: ', error.message);

    // Se responde con un error 500 y se devuelve el mensaje de error.
    res.status(500).json({ error: error.message });
  }
}


