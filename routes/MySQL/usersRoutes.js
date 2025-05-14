/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 04/04
  Descripción: Rutas referentes a usuarios.
*/

/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 04/04
  Descripción: Comentarios del código.
*/

import { Router } from 'express';
import { login } from '../../controllers/MySQL/user.controllers.js';

const router = Router();

// Se define la ruta POST '/login' y se asigna el controlador 'login' para manejar la solicitud
router.post('/login', login);


export { router };