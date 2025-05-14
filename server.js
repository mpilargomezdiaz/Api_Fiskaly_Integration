/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 31/03
  Descripción: Configuración de Swagger, importación de las rutas e inicialización del puerto.
*/

/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 02/04
  Descripción: Comentarios del código.
*/

/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 04/04
  Descripción: Importación de las rutas de usuarios y configuración de cors.
*/

import fs from 'fs';
import yaml from 'js-yaml';
import express from 'express';
import cors from 'cors';
import SwaggerUi from 'swagger-ui-express';
import { router as authRoutes } from './routes/Fiskaly/authRoutes.js';
import { router as clientsRoutes } from './routes/Fiskaly/clientsRoutes.js';
import { router as exportsRoutes } from './routes/Fiskaly/exportsRoutes.js';
import { router as invoicesRoutes } from './routes/Fiskaly/invoicesRoutes.js';
import { router as signersRoutes } from './routes/Fiskaly/signersRoutes.js';
import { router as softwareRoutes } from './routes/Fiskaly/softwareRoutes.js';
import { router as taxpayerRoutes } from './routes/Fiskaly/taxpayerRoutes.js';
import { router as usersRoutes } from './routes/MySQL/usersRoutes.js'
import { router as invoiceTypesRoutes } from './routes/MySQL/invoiceTypesRoutes.js';
// Se importa dotenv para cargar las variables de entorno desde el archivo .env
import dotenv from 'dotenv';
import { connectToDatabase } from './databases/MySQL/mysql.connection.js';
dotenv.config(); // Se cargan las variables de entorno

const app = express();

// Se configura CORS para aceptar sólo peticiones del frontend (localhost:3000)
const corsOptions = {
  origin: 'http://localhost:3000', // Sólo se permiten peticiones desde esta URL
  methods: ['GET', 'POST', 'PATCH', 'PUT'], // Métodos permitidos
  allowedHeaders: ['Content-Type'], // Cabeceras permitidas
};

app.use(cors(corsOptions)); // Se aplica la configuración de CORS

// Se lee el contenido del archivo YAML de la documentación Swagger
const fileContents = fs.readFileSync('./utils/Swagger/oas.yaml', 'utf8');
const swaggerDocument = yaml.load(fileContents);

// Se configura la ruta '/api-docs' para servir la documentación Swagger UI
app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));

// Se configuran los middlewares para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Se registran las rutas de autenticación
app.use(authRoutes);
// Se registran las rutas de clientes
app.use(clientsRoutes);
// Se registran las rutas de exportaciones
app.use(exportsRoutes);
// Se registran las rutas de facturas
app.use(invoicesRoutes);
// Se registran las rutas de firmantes
app.use(signersRoutes);
// Se registran las rutas de software
app.use(softwareRoutes);
// Se registran las rutas de contribuyentes
app.use(taxpayerRoutes);
// Se registran las rutas de los usuarios
app.use(usersRoutes);

app.use(invoiceTypesRoutes);

// app.use(cors()); // Middleware para habilitar CORS (permitir peticiones de diferentes orígenes).

// Se obtiene el puerto desde las variables de entorno
const port = process.env.PORT;

async function startServer() {
  try {
      await connectToDatabase(); // Conexión a la base de datos.
      
      // Una vez se conecta a la base de datos, inicia el servidor en el puerto indicado.
      app.listen(port, () => {
          console.log(`Server running on port ${port}`); // Se muestra en la consola que el servidor está corriendo.
      });
  } catch (error) {
      console.error('Error starting the server:', error); // Si ocurre un error al iniciar el servidor, se muestra el error en la consola.
  }
}

startServer(); // Se llama a la función para inicializar el servidor.