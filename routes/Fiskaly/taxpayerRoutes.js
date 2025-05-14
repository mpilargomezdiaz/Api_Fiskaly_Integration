/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 31/03
  Descripción: Rutas relacionadas con contribuyentes.
*/

/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 02/04
  Descripción: Comentarios del código.
*/

import { Router } from 'express';
import { createTaxpayer, updateTaxpayer, getTaxpayer } from '../../controllers/Fiskaly/taxpayer.controllers.js';

const router = Router();

// Se define la ruta PUT '/taxpayer' y se asigna el controlador 'createTaxpayer' para manejar la solicitud.
router.put('/taxpayer', createTaxpayer);

// Se define la ruta PATCH '/taxpayer' y se asigna el controlador 'updateTaxpayer' para manejar la solicitud.
router.patch('/taxpayer', updateTaxpayer);

// Se define la ruta GET '/taxpayer' y se asigna el controlador 'getTaxpayer' para manejar la solicitud.
router.get('/taxpayer', getTaxpayer);

export { router };