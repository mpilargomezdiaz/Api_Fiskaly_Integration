/*
Ticket de Jira: DP-25
  Nombre: Pilar
  Fecha: 11/04
  Descripción: Controlador correspondiente a las facturas simplificadas.
*/

/*
Ticket de Jira: SCRUM-7
  Nombre: Pilar
  Fecha: 23/04
  Descripción: Comentarios del código.
*/

// Se importa la función encargada de generar una factura simplificada de prueba.
import { exampleSimplifiedInvoice } from '../../../models/SequelizeModels/InvoicesModels/simplified.model.js'

// Función asíncrona que actúa como controlador para la creación de una factura simplificada de prueba.
export async function createSimplifiedInvoice(req, res) {
  try {
    // Llamada a la función.
    const invoice = await exampleSimplifiedInvoice(req, res);

    // Se registra un mensaje en la consola indicando que la factura ha sido generada exitosamente.
    console.log('Factura simplificada creada exitosamente');

    // Se responde con la factura en formato JSON.
    res.status(201).json(invoice);
  } catch (error) {
    // En caso de error durante el proceso de generación, se muestra el mensaje de error en la consola.
    console.error('Error al crear la factura simplificada: ', error.message);

    // Se responde con un código 500 y el mensaje de error.
    res.status(500).json({ error: error.message });
  }
}




