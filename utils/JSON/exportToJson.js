/*
Ticket de Jira: SCRUM-6
  Nombre: Pilar
  Fecha: 21/04
  Descripción: Función para exportar la información de las tablas de facturas de MySQL a JSON.
*/

/*
Ticket de Jira: SCRUM-12
  Nombre: Pilar
  Fecha: 22/04
  Descripción: Modificación de la función para excluir el 'id' a la hora de generar el JSON.
*/

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { MySQLConnection } from '../../databases/MySQL/mysql.js';

// Importación de modelos Sequelize para las diferentes tablas de facturas
import CompleteInvoice from '../../models/SequelizeModels/InvoicesModels/complete.model.js';
import CorrectingInvoice from '../../models/SequelizeModels/InvoicesModels/correcting.model.js';
import EnrichmentInvoice from '../../models/SequelizeModels/InvoicesModels/enrichment.model.js';
import ExternalInvoice from '../../models/SequelizeModels/InvoicesModels/external.model.js';
import RemedyInvoice from '../../models/SequelizeModels/InvoicesModels/remedy.model.js';
import SimplifiedInvoice from '../../models/SequelizeModels/InvoicesModels/simplified.model.js';

const sequelize = MySQLConnection();

// Obtención de la ruta actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista de modelos a exportar
const models = [
    { name: 'CompleteInvoice', model: CompleteInvoice },
    { name: 'CorrectingInvoice', model: CorrectingInvoice },
    { name: 'EnrichmenteInvoice', model: EnrichmentInvoice },
    { name: 'ExternalInvoice', model: ExternalInvoice },
    { name: 'RemedyInvoice', model: RemedyInvoice },
    { name: 'SimplifiedInvoice', model: SimplifiedInvoice }
];

export async function exportTables() {
    const outputDir = path.join(__dirname, './invoices');
    await fs.mkdir(outputDir, { recursive: true }); // Crea la carpeta si no existe

    try {
        // Conexión a la base de datos
        await sequelize.authenticate();
        console.log('Conectado a la base de datos');

        // Recorre cada modelo para exportar los datos
        for (const { name, model } of models) {
            const data = await model.findAll({ raw: true });

            // Se excluye el campo 'id' de los datos exportados
            const DataWithoutId = data.map(({ id, ...rest }) => rest);

            // Escribe los datos en un archivo JSON
            const filePath = path.join(outputDir, `${name}.json`);
            await fs.writeFile(filePath, JSON.stringify(DataWithoutId, null, 2), 'utf-8');
            console.log(`Tabla ${name} exportada a ${filePath}`);
        }

        console.log('Exportación completada');
    } catch (error) {
        console.error('Error al realizar la exportación: ', error.message);
    } finally {
        // Cierra la conexión con la base de datos
        await sequelize.close();
    }
}
