/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 31/03
  Descripción: Rutas relacionadas con la autenticación.
*/

/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 02/04
  Descripción: Comentarios del código.
*/

import { Router } from 'express';
import { authenticate } from '../../controllers/Fiskaly/auth.controllers.js';

const router = Router();

// Se define la ruta POST '/auth' y se asigna el controlador 'authenticate' para manejar la solicitud
router.post('/auth', authenticate);


export { router };