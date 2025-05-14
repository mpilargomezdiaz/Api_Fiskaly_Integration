/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 04/04
  Descripción: Llamada a la conexión con MySQL, sincronización de modelos y creación de un usuario de prueba.
*/

/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 04/04
  Descripción: Comentarios del código.
*/

import { MySQLConnection } from './mysql.js'; // Se importa la configuración de MySQL.
import bcrypt from 'bcryptjs'; // Para cifrar la contraseña.
import User from '../../models/SequelizeModels/user.model.js'; // Se importa el modelo User.
import CompleteInvoice from '../../models/SequelizeModels/InvoicesModels/complete.model.js';
import CorrectingInvoice from '../../models/SequelizeModels/InvoicesModels/correcting.model.js';
import EnrichmentInvoice from '../../models/SequelizeModels/InvoicesModels/enrichment.model.js';
import ExternalInvoice from '../../models/SequelizeModels/InvoicesModels/external.model.js';
import RemedyInvoice from '../../models/SequelizeModels/InvoicesModels/remedy.model.js';
import SimplifiedInvoice  from '../../models/SequelizeModels/InvoicesModels/simplified.model.js';
const sequelize = MySQLConnection(); // Llamada a la conexión de MySQL.

const saltRounds = 10; // Número de rondas para bcrypt.

export async function connectToDatabase() {
  try {
    // Se autentica la conexión con la base de datos
    await sequelize.authenticate();
    console.log('Conexión establecida correctamente.');
    
    // Se sincronizan los modelos con la base de datos (si no existen las tablas, se crean).
    await User.sync();
    await CompleteInvoice.sync();
    await CorrectingInvoice.sync();
    await EnrichmentInvoice.sync();
    await ExternalInvoice.sync();
    await RemedyInvoice.sync();
    await SimplifiedInvoice.sync();
    console.log('Modelos correctamente sincronizados con la base de datos.');

    // Se verifica si el usuario predeterminado ya existe
    const existingUser = await User.findOne({ where: { username: 'testuser' } });

    if (!existingUser) {
      // Si el usuario no existe, se crea con la contraseña cifrada
      const password = 'testpassword'; // Contraseña de prueba que va a ser cifrada.
      const password_hash = await bcrypt.hash(password, saltRounds); // Se cifra la contraseña.

      // Se crea el usuario predeterminado en la base de datos
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password_hash,
        isRegistered: 1, // Se indica que el usuario está registrado
      });

      console.log('Usuario de prueba creado exitosamente');
      
    } else {
      console.log('El usuario de prueba ya existe.');
    }
    
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
};