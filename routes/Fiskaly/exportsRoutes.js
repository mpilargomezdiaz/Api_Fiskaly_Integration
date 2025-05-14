/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 31/03
  Descripción: Rutas relacionadas con exportaciones.
*/

/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 02/04
  Descripción: Comentarios del código.
*/

import { Router } from 'express';
import { createExport, updateExport, getExport, listExports, downloadExport } from '../../controllers/Fiskaly/exports.controllers.js';

const router = Router();

// Se define la ruta PUT '/exports/{export_id}' y se asigna el controlador 'createExport' para manejar la solicitud
router.put('/exports/{export_id}', createExport);

// Se define la ruta PATCH '/exports/{export_id}' y se asigna el controlador 'updateExport' para manejar la solicitud
router.patch('/exports/{export_id}', updateExport);

// Se define la ruta GET '/exports/{export_id}' y se asigna el controlador 'getExport' para manejar la solicitud
router.get('/exports/{export_id}', getExport);

// Se define la ruta GET '/exports' y se asigna el controlador 'listExports' para manejar la solicitud
router.get('/exports', listExports);

// Se define la ruta GET '/exports/{export_id}.zip' y se asigna el controlador 'downloadExport' para manejar la solicitud de descarga de archivos zip
router.get('/exports/{export_id}.zip', downloadExport);

export { router };