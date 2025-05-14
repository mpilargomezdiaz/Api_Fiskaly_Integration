/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 31/03
  Descripción: Rutas relacionadas con facturas.
*/

/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 02/04
  Descripción: Comentarios del código.
*/

import { Router } from 'express';
import { createInvoice, updateInvoice, getInvoice, listInvoices, searchInvoices, exportInvoice } from '../../controllers/Fiskaly/invoices.controllers.js';

const router = Router();

// Se define la ruta PUT '/clients/{client_id}/invoices/{invoice_id}' y se asigna el controlador 'createInvoice' para manejar la solicitud.
router.put('/clients/{client_id}/invoices/{invoice_id}', createInvoice);

// Se define la ruta PATCH '/clients/{client_id}/invoices/{invoice_id}' y se asigna el controlador 'updateInvoice' para manejar la solicitud.
router.patch('/clients/{client_id}/invoices/{invoice_id}', updateInvoice);

// Se define la ruta GET '/clients/{client_id}/invoices/{invoice_id}' y se asigna el controlador 'getInvoice' para manejar la solicitud.
router.get('/clients/{client_id}/invoices/{invoice_id}', getInvoice);

// Se define la ruta GET '/clients/{client_id}/invoices' y se asigna el controlador 'listInvoices' para manejar la solicitud.
router.get('/clients/{client_id}/invoices', listInvoices);

// Se define la ruta GET '/invoices' y se asigna el controlador 'searchInvoices' para manejar la solicitud.
router.get('/invoices', searchInvoices);

// Se define la ruta PUT '/clients/{client_id}/invoices/{invoice_id}/xml' y se asigna el controlador 'exportInvoice' para manejar la solicitud.
router.put('/clients/{client_id}/invoices/{invoice_id}/xml', exportInvoice);

export { router };