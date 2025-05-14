/*
Ticket de Jira: DP-24
  Nombre: Pilar
  Fecha: 10/04
  Descripción: Modelo se Sequelize correspondiente a las facturas ordinarias.
*/

/*
Ticket de Jira: DP-25
  Nombre: Pilar
  Fecha: 11/04
  Descripción: Implementación de la función para crear una factura ordinaria de prueba.
*/

import { DataTypes } from 'sequelize';
import { MySQLConnection } from '../../../databases/MySQL/mysql.js'

const sequelize = MySQLConnection();

const CompleteInvoice = sequelize.define('CompleteInvoice', {
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [['COMPLETE']],
                msg: 'El tipo debe ser "COMPLETE".'
            }
        }
    },
    data: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            isObject: function (value) {
                if (typeof value !== 'object') {
                    throw new Error('El campo "data" debe ser un objeto de tipo "SimplifiedInvoice".');
                }
            }
        }
    },
    recipients: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            isArray: function (value) {
                if (!Array.isArray(value)) {
                    throw new Error('El campo "recipients" debe ser un array de objetos.');
                }
                if (value.length < 1 || value.length > 100) {
                    throw new Error('Debe haber entre 1 y 100 destinatarios.');
                }
                value.forEach((recipient, index) => {
                    if (typeof recipient !== 'object') {
                        throw new Error(`El destinatario en la posición ${index + 1} debe ser un objeto.`);
                    }
                });
            }
        }
    },
    vat_withholding: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: {
                args: /^(-)?\d{1,12}(\.\d{1,2})?$/,
                msg: 'El importe de la retención soportada debe ser un número decimal válido, con hasta 12 dígitos antes del punto y 2 después.'
            },
            len: {
                args: [1, 15],
                msg: 'El importe de la retención soportada debe tener entre 1 y 15 caracteres.'
            }
        }
    },
    annotations: {
        type: DataTypes.JSON,
        allowNull: true,
        validate: {
            isArray: function (value) {
                if (!Array.isArray(value)) {
                    throw new Error('Las anotaciones deben ser un array.');
                }
                if (value.length !== 1) {
                    throw new Error('Debe haber exactamente una anotación.');
                }
                value.forEach((annotation, index) => {
                    if (annotation.type === 'INCIDENT') {
                        if (!annotation.reason || typeof annotation.reason !== 'string' || annotation.reason.length < 1 || annotation.reason.length > 120) {
                            throw new Error(`La razón en la anotación en la posición ${index + 1} debe ser una cadena alfanumérica de entre 1 y 120 caracteres.`);
                        }
                    }
                    if (annotation.type === 'INDIVIDUAL') {
                        if (!annotation.activity_code || !/^[0-9.]{1,7}$/.test(annotation.activity_code)) {
                            throw new Error(`El código de actividad en la anotación en la posición ${index + 1} debe ser una cadena alfanumérica de entre 1 y 7 caracteres numéricos o con puntos.`);
                        }
                        if (annotation.income_tax_amount && !/^(-)?\d{1,12}(\.\d{1,2})?$/.test(annotation.income_tax_amount)) {
                            throw new Error(`El importe de IRPF en la anotación en la posición ${index + 1} debe ser un número decimal válido.`);
                        }
                        if (typeof annotation.pay_collect !== 'boolean') {
                            throw new Error(`El campo pay_collect en la anotación en la posición ${index + 1} debe ser un valor booleano.`);
                        }
                    }
                    if (annotation.type !== 'INCIDENT' && annotation.type !== 'INDIVIDUAL') {
                        throw new Error(`El tipo de anotación en la posición ${index + 1} debe ser "INCIDENT" o "INDIVIDUAL".`);
                    }
                });
            }
        }
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        validate: {
            isObject: function (value) {
                if (typeof value !== 'object') {
                    throw new Error('El campo "metadata" debe ser un objeto.');
                }
            },
            isValidMetadata: function (value) {
                if (value) {
                    Object.keys(value).forEach((key) => {
                        if (key.length > 40) {
                            throw new Error('Cada clave de metadatos debe tener como máximo 40 caracteres.');
                        }
                        if (value[key].length > 500) {
                            throw new Error('El valor de cada metadato debe tener como máximo 500 caracteres.');
                        }
                    });
                    if (Object.keys(value).length > 20) {
                        throw new Error('El número máximo de metadatos es 20.');
                    }
                }
            }
        }
    }
}, {
    tableName: 'complete_invoices',
    timestamps: false
});

export default CompleteInvoice;

export async function exampleCompleteInvoice(req, res) {
    try {
        const existingInvoice = await CompleteInvoice.findOne({
            where: {
                'data.number': 'COMP-2025-01',
            }
        });
        if (existingInvoice) {
            console.log('Ya existe una factura con el número COMP-2025-01');
            return res.status(400).json({
                message: 'Ya existe una factura con el mismo número.',
                invoice: existingInvoice,
            });
        }
        const invoice = await CompleteInvoice.create({
            type: 'COMPLETE',
            data: {
                type: 'SIMPLIFIED',
                number: 'COMP-2025-01',
                series: 'C2025',
                issued_at: '10-04-2025 15:45:00',
                transaction_date: '10-04-2025',
                text: 'Factura de prestación de servicios profesionales.',
                full_amount: '3000.00',
                items: [
                    {
                        text: 'Consultoría técnica',
                        quantity: '2.00',
                        unit_amount: '1500.00',
                        full_amount: '3000.00',
                        concept: 'NATIONAL_OR_SIMPLIFIED',
                        vat_type: 'IVA',
                        system: 'REGULAR'
                    }
                ]
            },
            recipients: [
                {
                    name: 'Empresa Receptora S.A.',
                    tax_id: 'B98765432',
                    country: 'ES'
                }
            ],
            vat_withholding: '150.00',
            annotations: [
                {
                    type: 'INDIVIDUAL',
                    activity_code: '841.3',
                    income_tax_amount: '300.00',
                    pay_collect: true
                }
            ],
            metadata: {
                cliente: 'cliente_demo',
                referencia: 'complete-factura-ejemplo',
                observaciones: 'Incluye retención IRPF del 10%'
            }
        });

        console.log('Factura ordinaria creada exitosamente');
        return { success: true, invoice };
    } catch (error) {
        console.error('Error al crear la factura ordinaria:', error.message);
        return { error: error.message };
    }
}
