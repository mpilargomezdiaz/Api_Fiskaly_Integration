/*
Ticket de Jira: DP-25
  Nombre: Pilar
  Fecha: 11/04
  Descripción: Controlador correspondiente a las facturas ordinarias.
*/

/*
Ticket de Jira: SCRUM-7
  Nombre: Pilar
  Fecha: 23/04
  Descripción: Comentarios del código.
*/

// Se importa una función relacionada con la creación de una factura ordinaria de prueba desde su ruta correspondiente.
import { exampleCompleteInvoice } from '../../../models/SequelizeModels/InvoicesModels/complete.model.js'

// Función asíncrona que maneja la creación de una factura ordinaria.
export async function createCompleteInvoice(req, res) {
  try {
    // Se ejecuta la función para generar una factura ordinaria de prueba.
    const invoice = await exampleCompleteInvoice();

    // Se imprime un mensaje de éxito en la consola.
    console.log('Factura ordinaria creada exitosamente');

    // Se devuelve la factura generada en formato JSON.
    res.status(201).json(invoice);
  } catch (error) {
    // En caso de error durante el proceso, se imprime el mensaje de error en la consola.
    console.error('Error al crear la factura ordinaria: ', error.message);

    // Se responde con un error 500 y se devuelve el mensaje de error.
    res.status(500).json({ error: error.message });
  }
}


