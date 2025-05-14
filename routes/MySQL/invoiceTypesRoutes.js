/*
Ticket de Jira: DP-25
  Nombre: Pilar
  Fecha: 11/04
  Descripción: Rutas referentes a los diferentes tipos de facturas.
*/

/*
Ticket de Jira: SCRUM-6
  Nombre: Pilar
  Fecha: 21/04
  Descripción: Añadida ruta para la petición GET al controlador
  correspondiente a la creación de archivos JSON basados en los datos almacenados
  en las tablas relativas a facturas de MySQL.
*/

import { Router } from 'express';

// Controladores para los distintos tipos de facturas
import { createCompleteInvoice } from '../../controllers/MySQL/InvoicesControllers/icomplete.controllers.js';
import { createCorrectingInvoice } from '../../controllers/MySQL/InvoicesControllers/icorrecting.controllers.js';
import { createEnrichmentInvoice } from '../../controllers/MySQL/InvoicesControllers/ienrichment.controllers.js';
import { createExternalInvoice } from '../../controllers/MySQL/InvoicesControllers/iexternal.controllers.js';
import { createRemedyInvoice } from '../../controllers/MySQL/InvoicesControllers/iremedy.controllers.js';
import { createSimplifiedInvoice } from '../../controllers/MySQL/InvoicesControllers/isimplified.controllers.js';
import { createExports } from '../../controllers/MySQL/InvoicesControllers/iexports.controllers.js';

const router = Router();

// Rutas GET para la generación de facturas en formato JSON
router.get('/exampleComInvoice', createCompleteInvoice);     // Factura ordinaria
router.get('/exampleCorrInvoice', createCorrectingInvoice);  // Factura rectificativa
router.get('/exampleEnrichInvoice', createEnrichmentInvoice); // Factura de canje
router.get('/exampleExtInvoice', createExternalInvoice);     // Factura externa
router.get('/exampleRemInvoice', createRemedyInvoice);       // Factura de subsanación
router.get('/exampleSimpInvoice', createSimplifiedInvoice);  // Factura simplificada

// Ruta GET para exportar los datos a JSON
router.get('/exportToJson', createExports);

export { router };
