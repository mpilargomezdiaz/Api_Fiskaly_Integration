/*
Ticket de Jira: DP-24
  Nombre: Pilar
  Fecha: 10/04
  Descripción: Modelo se Sequelize correspondiente a las facturas de canje.
*/

/*
Ticket de Jira: DP-25
  Nombre: Pilar
  Fecha: 11/04
  Descripción: Implementación de la función para crear una factura de canje de prueba.
*/

import { DataTypes } from 'sequelize';
import { MySQLConnection } from '../../../databases/MySQL/mysql.js'
import { v4 as uuidv4 } from 'uuid';

const sequelize = MySQLConnection();

const EnrichmentInvoice = sequelize.define('EnrichmentInvoice', {
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'ENRICHMENT',
        validate: {
            isIn: {
                args: [['ENRICHMENT']],
                msg: 'El tipo debe ser "ENRICHMENT".'
            }
        }
    },
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
            isUUID: {
                args: 4,
                msg: 'El ID debe ser un UUIDv4 válido.'
            },
            isCorrectUUIDv4Format(value) {
                const uuidv4Regex = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
                if (!uuidv4Regex.test(value)) {
                    throw new Error('El ID no cumple con el formato exacto de UUIDv4 según RFC 4122.');
                }
            }
        }
    },
    number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            is: {
                args: /^[0-9A-Z_/\-\.]{1,20}$/,
                msg: 'El número debe tener entre 1 y 20 caracteres y solo puede contener letras mayúsculas, números y - / . _'
            },
            len: {
                args: [1, 20],
                msg: 'El número debe tener entre 1 y 20 caracteres.'
            }
        }
    },
    series: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            is: {
                args: /^[0-9A-Z_/\-\.]{1,20}$/,
                msg: 'La serie debe tener entre 1 y 20 caracteres válidos (letras mayúsculas, números y - / . _).'
            },
            isNotForbiddenLetters(value) {
                if (/[IOW]/.test(value)) {
                    throw new Error('La serie no puede contener las letras I, O ni W.');
                }
            },
            len: {
                args: [1, 20],
                msg: 'La serie debe tener entre 1 y 20 caracteres.'
            }
        }
    },
    issued_at: {
        type: DataTypes.STRING(19),
        allowNull: false,
        validate: {
            is: {
                args: /^([0-2][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4} \d{2}:\d{2}:\d{2}$/,
                msg: 'La fecha de emisión debe estar en formato DD-MM-AAAA hh:mm:ss.'
            },
            len: {
                args: [19, 19],
                msg: 'La fecha de emisión debe tener exactamente 19 caracteres.'
            }
        }
    },
    recipients: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            isArray(value) {
                if (!Array.isArray(value)) {
                    throw new Error('Recipients debe ser un array.');
                }
                if (value.length < 1 || value.length > 100) {
                    throw new Error('Recipients debe tener entre 1 y 100 elementos.');
                }
            }
        }
    },
    annotations: {
        type: DataTypes.JSON,
        allowNull: true,
        validate: {
            isValidAnnotations(value) {
                if (!value) return;
                if (!Array.isArray(value) || value.length !== 1) {
                    throw new Error('Debe haber exactamente una anotación.');
                }

                const annotation = value[0];
                if (annotation.type !== 'INDIVIDUAL') {
                    throw new Error('El tipo de anotación debe ser "INDIVIDUAL".');
                }

                if (!annotation.activity_code || !/^[0-9.]{1,7}$/.test(annotation.activity_code)) {
                    throw new Error('El código de actividad debe tener entre 1 y 7 caracteres numéricos o con puntos.');
                }

                if (annotation.income_tax_amount && !/^(-)?\d{1,12}(\.\d{1,2})?$/.test(annotation.income_tax_amount)) {
                    throw new Error('El importe del IRPF debe ser un número decimal válido.');
                }

                if (typeof annotation.pay_collect !== 'boolean') {
                    throw new Error('El campo pay_collect debe ser un valor booleano.');
                }
            }
        }
    },
    activity_code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: {
                args: /^[0-9.]{1,7}$/,
                msg: 'El código de actividad debe tener entre 1 y 7 caracteres numéricos o con puntos.'
            }
        }
    },
    income_tax_amount: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: {
                args: /^(-)?\d{1,12}(\.\d{1,2})?$/,
                msg: 'El importe del IRPF debe ser un número válido con hasta 2 decimales.'
            }
        }
    },
    pay_collect: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        validate: {
            isObject(value) {
                if (typeof value !== 'object' || Array.isArray(value)) {
                    throw new Error('Metadata debe ser un objeto.');
                }
            },
            isValidMetadata(value) {
                if (value) {
                    const keys = Object.keys(value);
                    if (keys.length > 20) {
                        throw new Error('El número máximo de metadatos es 20.');
                    }
                    keys.forEach((key) => {
                        if (key.length > 40) {
                            throw new Error('Cada clave de metadato debe tener como máximo 40 caracteres.');
                        }
                        if (value[key]?.length > 500) {
                            throw new Error('Cada valor de metadato debe tener como máximo 500 caracteres.');
                        }
                    });
                }
            }
        }
    }
}, {
    tableName: 'enrichment_invoices',
    timestamps: false
});

export default EnrichmentInvoice;

export async function exampleEnrichmentInvoice(req, res) {
    try {
        const existingInvoice = await EnrichmentInvoice.findOne({
            where: {
                number: 'ENR-2025-001',
                series: 'SER123'
            }
        });
        if (existingInvoice) {
            console.log('Ya existe una factura con el número ENR-2025-001 y la serie SERIE123');
            return res.status(400).json({
                message: 'Ya existe una factura con el mismo número y serie.',
                invoice: existingInvoice,
            });
        };
        const enrichmentInvoice = await EnrichmentInvoice.create({
            type: 'ENRICHMENT',
            id: uuidv4(),
            number: 'ENR-2025-001',
            series: 'SER123',
            issued_at: '10-04-2025 14:30:00',
            recipients: [
                {
                    name: 'Cliente Final',
                    tax_id: 'X12345678Y',
                    address: 'Calle Ejemplo, 123, Madrid',
                    email: 'cliente@correo.com'
                }
            ],
            annotations: [
                {
                    type: 'INDIVIDUAL',
                    activity_code: '123.4',
                    income_tax_amount: '12.50',
                    pay_collect: true
                }
            ],
            activity_code: '123.4',
            income_tax_amount: '12.50',
            pay_collect: true,
            metadata: {
                comentario: 'Factura de canje con datos de IRPF',
                origen: 'Sistema interno 2025'
            }
        });

        console.log('Factura de canje creada correctamente');
        return { success: true, invoice: enrichmentInvoice };
    } catch (error) {
        console.error('Error al crear la factura de canje:', error.message);
        return { error: error.message };
    }
}

