/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 04/04
  Descripción: Definición del modelo de usuario y función de login.
*/

/*
Ticket de Jira: DP-18
  Nombre: Pilar
  Fecha: 04/04
  Descripción: Comentarios del código.
*/

import { DataTypes } from 'sequelize'; 
import { MySQLConnection } from '../../databases/MySQL/mysql.js'; // Se importa la configuración de la conexión a MySQL.
import bcrypt from 'bcryptjs'; // Se importa bcrypt para la verificación de contraseñas.
import { Op } from 'sequelize'; // Operadores de Sequelize.

const sequelize = MySQLConnection(); // Llamada a la conexión de MySQL.

// Definición del modelo de usuario.
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER, // Tipo de dato INTEGER para el id.
        primaryKey: true, // Se marca este campo como clave primaria.
        autoIncrement: true // La ID se autoincrementa.
    },
    isRegistered: {
        type: DataTypes.INTEGER, // Tipo de dato INTEGER.
        allowNull: false, // Este campo no puede estar vacío.
        defaultValue: 0 // El usuario no está registrado por defecto.
    },
    username: {
        type: DataTypes.STRING(100), // Tipo de dato STRING para el nombre del usuario.
        allowNull: false, // El nombre de usuario no puede estar vacío.
        unique: true  // El nombre del usuario debe ser único
    },
    email: {
        type: DataTypes.STRING(100), // Tipo de dato STRING para el email del usuario.
        allowNull: false, // Este campo no puede estar vacío.
        unique: true, // El email debe ser único.
        validate: {
            isEmail: {
                msg: "Por favor, ingresa una dirección de correo electrónico válida." // Validación para verificar que el campo 'email' sea una dirección de correo válida.
            }
        }
    },
    password_hash: { 
        type: DataTypes.STRING(255), // Tipo de dato STRING para el hash de la contraseña.
        allowNull: false, // Este campo no puede estar vacío.
    },
}, {
    tableName: 'users', // El nombre de la tabla en la base de datos.
    timestamps: false // No se manejan automáticamente las marcas de tiempo (createdAt, updatedAt).
});

export default User; // Se exporta el modelo para poderlo utilizar en otras partes de la aplicación.

/// --------- CRUD ----------- ///


// Función del login de un usuario buscando su username o email junto con la contraseña.

export async function loginUser(login, pass) {
    try {
        // Se busca el usuario por email o username.
        const user = await User.findOne({
            where: {
                [Op.and]: [
                    { isRegistered: 1 }, // El usuario debe estar registrado.
                ],
                [Op.or]: [
                    { email: login }, 
                    { username: login }
                ]
            },
            attributes: ['id', 'username', 'email', 'password_hash'] 
        });

        // Si no se encuentra el usuario, se retorna null.
        if (!user) {
            console.log("Usuario no encontrado");
            return null;
        }

        // Se verifica si la contraseña proporcionada coincide con el hash almacenado.
        const passwordMatch = await bcrypt.compare(pass, user.password_hash);

        // Si no coincide se retorna null.
        if (!passwordMatch) {
            console.log("Contraseña incorrecta");
            return null;
        }

        console.log("Login exitoso");
        return user; // Si el usuario y la contraseña son correctos, retorna el usuario.
    } catch (e) {
        console.error("Error al iniciar sesión:", e); // Si ocurre un error, lo muestra en la consola.
        throw new Error('Error al iniciar sesión');
    }
}