# Api_Fiskaly_Integration

API RESTful desarrollada con Node.js y MySQL para integrar los servicios de Fiskaly.

---

## 📝 Sobre el proyecto

Este backend fue desarrollado durante mis prácticas (160 horas) como parte del curso de formación **IFCD0210**. El objetivo fue crear una solución funcional y documentada para comunicar sistemas con Fiskaly y gestionar datos fiscales simulados.

Este repositorio contiene **únicamente código propio** y no incluye información confidencial, sensible ni privada de ninguna empresa. El desarrollo se realizó con fines **formativos**, durante horario de prácticas, y **no está vinculado a ningún producto comercial**.

---

## Tecnologías utilizadas

- **Backend:** Node.js, Express  
- **Base de datos:** MySQL  
- **ORM:** Sequelize  
- **Autenticación:** JWT (JSON Web Token)  
- **Documentación:** Swagger  
- **Control de versiones:** Git, GitHub  

---

## Funcionalidades

- CRUD de usuarios y registros fiscales  
- Integración con los servicios fiscales de Fiskaly  
- Validación de datos y autenticación con tokens  
- Documentación completa de la API con Swagger UI  
- Variables de entorno seguras a través de `.env`

---

## Cómo ejecutar

1.- Clona el repositorio.

2.- Instala las dependencias con npm install.

3.- Configura las variables de entorno.

**¡Importante!**

   Para que la API funcione correctamente, necesitas obtener las credenciales de autenticación de Fiskaly y definir otras variables necesarias. Sigue estos pasos:

   - Regístrate gratuitamente en el [Dashboard de Fiskaly](https://dashboard.fiskaly.com/).
   - Una vez dentro, crea un nuevo proyecto para obtener tu **API Key** y **API Secret**.
   - En la raíz del proyecto, crea un archivo llamado `.env` y añade lo siguiente (sustituye los valores por los tuyos):

   ```env

    # Puerto del servidor
    PORT=3001

    # Configuración de Fiskaly
    FISKALY_API_URL=https://test.es.sign.fiskaly.com/api/v1
    FISKALY_API_KEY=your_api_key
    FISKALY_API_SECRET=your_api_secret

    # Configuración de la base de datos MySQL
    SQL_LOCALHOST=localhost
    SQL_HOST=your_host
    SQL_USER=your_user
    SQL_PASS=your_password
    SQL_BBDD=your_database
```

4.- Ejecuta npm start.

---

## Pruebas

Para realizar las pruebas relacionadas con las facturas y otros endpoints de la API (además del formulario de login, que ya está integrado con React), puedes utilizar herramientas como **Postman** para hacer peticiones a los endpoints RESTful.

### **Pasos para probar la API:**

1.- Abre **Postman** (si no lo tienes, puedes descargarlo [aquí](https://www.postman.com/downloads/)).

2.- Asegúrate de tener la API en ejecución con el comando npm start.

3.- ¡Ya está todo preparado para que realices tus pruebas!
