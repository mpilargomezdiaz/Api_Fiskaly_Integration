/*
Ticket de Jira: DP-25
  Nombre: Pilar
  Fecha: 11/04
  Descripción: Controlador correspondiente a las facturas rectificativas.
*/

/*
Ticket de Jira: SCRUM-7
  Nombre: Pilar
  Fecha: 23/04
  Descripción: Comentarios del código.
*/

// Se importa la función encargada de generar una factura rectificativa de prueba desde el modelo correspondiente.
import { exampleCorrectingInvoice } from '../../../models/SequelizeModels/InvoicesModels/correcting.model.js'

// Función asíncrona que gestiona la creación de una factura rectificativa de prueba.
export async function createCorrectingInvoice(req, res) {
  try {
    // Llamada a la función que genera una factura rectificativa de prueba.
    const invoice = await exampleCorrectingInvoice(req, res);

    // Se registra en consola que la factura se ha creado correctamente.
    console.log('Factura rectificativa creada exitosamente');

    // Se responde con la factura generada en formato JSON.
    res.status(201).json(invoice);
  } catch (error) {
    // En caso de fallo en el proceso, se muestra el mensaje de error en la consola.
    console.error('Error al crear la factura rectificativa: ', error.message);

    // Se responde con un error 500 y se devuelve el mensaje de error.
    res.status(500).json({ error: error.message });
  }
}


