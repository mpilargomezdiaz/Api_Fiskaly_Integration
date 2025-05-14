/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 31/03
  Descripción: Rutas relacionadas con firmantes.
*/

/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 02/04
  Descripción: Comentarios del código.
*/

import { Router } from 'express';
import { createSigner, updateSigner, getSigner, listSigners } from '../../controllers/Fiskaly/signers.controllers.js';

const router = Router();

// Se define la ruta PUT '/signers/{signer_id}' y se asigna el controlador 'createSigner' para manejar la solicitud.
router.put('/signers/{signer_id}', createSigner);

// Se define la ruta PATCH '/signers/{signer_id}' y se asigna el controlador 'updateSigner' para manejar la solicitud.
router.patch('/signers/{signer_id}', updateSigner);

// Se define la ruta GET '/signers/{signer_id}' y se asigna el controlador 'getSigner' para manejar la solicitud.
router.get('/signers/{signer_id}', getSigner);

// Se define la ruta GET '/signers' y se asigna el controlador 'listSigners' para manejar la solicitud.
router.get('/signers', listSigners);

export { router };