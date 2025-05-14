/*
Ticket de Jira: DP-24
  Nombre: Pilar
  Fecha: 10/04
  Descripción: Modelo se Sequelize correspondiente a las facturas simplificadas.
*/

/*
Ticket de Jira: DP-25
  Nombre: Pilar
  Fecha: 11/04
  Descripción: Implementación de la función para crear una factura simplificada de prueba.
*/

/*
Ticket de Jira: SCRUM-12
  Nombre: Pilar
  Fecha: 22/04
  Descripción: Modificación tanto del modelo de Sequelize como de la factura simplificada de prueba
  para poder generar un JSON que se adapte a lo solicitado por Fiskaly.
*/


import { DataTypes, where, fn, col } from 'sequelize';
import { MySQLConnection } from '../../../databases/MySQL/mysql.js'

const sequelize = MySQLConnection();

const SimplifiedInvoice = sequelize.define('SimplifiedInvoice', {
    content: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            isValidContent(value) {
                if (typeof value !== 'object' || Array.isArray(value)) {
                    throw new Error('El campo content debe ser un objeto.');
                }

                const { type, number, series, issued_at, transaction_date, text, full_amount, items } = value;
                if (type !== 'SIMPLIFIED') {
                    throw new Error('El tipo debe ser "SIMPLIFIED".');
                }
                if (!/^[0-9A-Z_/\-\.]{1,20}$/.test(number)) {
                    throw new Error('El número de la factura debe contener solo letras mayúsculas, números y los caracteres especiales - / . _.');
                }
                if (series) {
                    if (!/^[0-9A-Z_/\-\.]{1,20}$/.test(series)) {
                        throw new Error('El número de serie debe contener solo letras mayúsculas, números y los caracteres especiales - / . _.');
                    }
                    if (/[IOW]/.test(series)) {
                        throw new Error('El número de serie no puede contener las letras I, O ni W.');
                    }
                }
                if (issued_at && !/^([0-2][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4} \d{2}:\d{2}:\d{2}$/.test(issued_at)) {
                    throw new Error('La fecha de emisión debe estar en el formato DD-MM-AAAA hh:mm:ss.');
                }
                if (transaction_date && !/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/.test(transaction_date)) {
                    throw new Error('La fecha de transacción debe estar en el formato DD-MM-AAAA.');
                }
                if (!text || typeof text !== 'string' || text.length < 1 || text.length > 250 || !/^[0-9A-Za-zñÑáÁàÀéÉíÍïÏóÓòÒúÚüÜçÇ°ºª.,:"()¿?¡!\-_/ ]*$/.test(text)) {
                    throw new Error('El texto de la factura debe tener entre 1 y 250 caracteres y contener solo caracteres válidos.');
                }
                if (!/^(-)?\d{1,12}(\.\d{1,2})?$/.test(full_amount)) {
                    throw new Error('El importe total debe ser un número decimal válido, con hasta 12 dígitos antes del punto y 2 después.');
                }
                if (!Array.isArray(items)) {
                    throw new Error('Los items deben ser un array.');
                }
                if (items.length < 1 || items.length > 1000) {
                    throw new Error('Debe haber entre 1 y 1000 items.');
                }

                items.forEach((item, index) => {
                    const prefix = `Item ${index + 1}`;
                    if (!item.text || item.text.length < 1 || item.text.length > 250) {
                        throw new Error(`${prefix}: El texto debe tener entre 1 y 250 caracteres.`);
                    }
                    const decimalRegex = /^(-)?\d{1,12}(\.\d{1,8})?$/;
                    if (!item.quantity || !decimalRegex.test(item.quantity)) {
                        throw new Error(`${prefix}: La cantidad debe ser un número válido.`);
                    }
                    if (!item.unit_amount || !decimalRegex.test(item.unit_amount)) {
                        throw new Error(`${prefix}: El importe unitario debe ser un número válido.`);
                    }
                    if (!item.full_amount || !decimalRegex.test(item.full_amount)) {
                        throw new Error(`${prefix}: El importe total debe ser un número válido.`);
                    }
                    if (item.discount && !decimalRegex.test(item.discount)) {
                        throw new Error(`${prefix}: El descuento debe ser un número válido.`);
                    }
                    if (item.concept && !['NATIONAL_OR_SIMPLIFIED', 'INTERNATIONAL_GOOD', 'INTERNATIONAL_SERVICE'].includes(item.concept)) {
                        throw new Error(`${prefix}: El concepto debe ser uno válido.`);
                    }
                    if (item.vat_type && !['IVA', 'IPSI', 'IGIC', 'OTHER'].includes(item.vat_type)) {
                        throw new Error(`${prefix}: El tipo de IVA debe ser uno válido.`);
                    }

                    if (!item.system || !['REGULAR', 'SIMPLIFIED_REGIME', 'EQUIVALENCE_SURCHARGE', 'EXPORT'].includes(item.system.type)) {
                        throw new Error(`${prefix}: El sistema debe ser uno de los tipos válidos.`);
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
                if (typeof value !== 'object' || Array.isArray(value)) {
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
    tableName: 'simplified_invoices',
    timestamps: false
});


export default SimplifiedInvoice;


export async function exampleSimplifiedInvoice(req, res) {
    try {
        const existingInvoice = await SimplifiedInvoice.findOne({
            where: where(
                fn('JSON_UNQUOTE', fn('JSON_EXTRACT', col('content'), '$.number')),
                'SIMPL-0001'
            )
        });

        if (existingInvoice) {
            console.log('Ya existe una factura con el id número SIMPL-0001');
            return res.status(400).json({
                message: 'Ya existe una factura con el mismo número.',
                invoice: existingInvoice,
            });
        }

        const invoiceData = {
            content: {
                type: 'SIMPLIFIED',
                number: 'SIMPL-0001',
                text: 'Venta de artículos electrónicos con garantía incluida.',
                full_amount: '1200.50',
                items: [
                    {
                        text: 'Tablet Android 10',
                        quantity: '1.00',
                        unit_amount: '1000.00',
                        full_amount: '1000.00',
                        system: {
                            type: 'REGULAR',
                            category: {
                                type: 'VAT'
                            }
                        }
                    },
                    {
                        text: 'Funda protectora',
                        quantity: '1.00',
                        unit_amount: '200.50',
                        full_amount: '200.50',
                        system: {
                            type: 'REGULAR',
                            category: {
                                type: 'VAT'
                            }
                        }
                    }
                ]
            },
            metadata: {
                cliente: 'juan_perez',
                proyecto: 'simplified-invoice-demo',
                referencia_interna: 'FACT-APRIL-2025-01'
            }
        };
        const invoice = await SimplifiedInvoice.create(invoiceData);
        console.log('Factura simplificada de prueba creada exitosamente');
        return { success: true, invoice: invoice };
    } catch (error) {
        console.error('Error al crear la factura simplificada:', error.message);
        return { error: error.message };
    }
}
