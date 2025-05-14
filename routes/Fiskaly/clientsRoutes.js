/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 31/03
  Descripción: Rutas relacionadas con clientes.
*/

/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 02/04
  Descripción: Comentarios del código.
*/

import { Router } from 'express';
import { createClient, getClient, updateClient, listClients } from '../../controllers/Fiskaly/clients.controllers.js';

const router = Router();

// Se define la ruta PUT '/clients/{client_id}' y se asigna el controlador 'createClient' para manejar la solicitud
router.put('/clients/{client_id}', createClient);

// Se define la ruta PATCH '/clients/{client_id}' y se asigna el controlador 'updateClient' para manejar la solicitud
router.patch('/clients/{client_id}', updateClient);

// Se define la ruta GET '/clients/{client_id}' y se asigna el controlador 'getClient' para manejar la solicitud
router.get('/clients/{client_id}', getClient);

// Se define la ruta PUT '/clients' y se asigna el controlador 'listClients' para manejar la solicitud
router.put('/clients', listClients);

export { router };