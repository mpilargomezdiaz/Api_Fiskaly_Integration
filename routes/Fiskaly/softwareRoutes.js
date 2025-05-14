/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 31/03
  Descripción: Rutas relacionadas con software.
*/

/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 02/04
  Descripción: Comentarios del código.
*/

import { Router } from 'express';
import { getSoftware } from '../../controllers/Fiskaly/software.controllers.js';

const router = Router();

// Se define la ruta GET '/software' y se asigna el controlador 'getSoftware' para manejar la solicitud.
router.get('/software', getSoftware);

export { router };