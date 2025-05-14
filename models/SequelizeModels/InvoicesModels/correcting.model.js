/*
Ticket de Jira: DP-24
  Nombre: Pilar
  Fecha: 10/04
  Descripción: Modelo se Sequelize correspondiente a las facturas rectificativas.
*/

/*
Ticket de Jira: DP-25
  Nombre: Pilar
  Fecha: 11/04
  Descripción: Implementación de la función para crear una factura rectificativa de prueba.
*/

import { DataTypes } from 'sequelize';
import { MySQLConnection } from '../../../databases/MySQL/mysql.js'
import { v4 as uuidv4 } from 'uuid';

const sequelize = MySQLConnection();

const CorrectingInvoice = sequelize.define('CorrectingInvoice', {
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [['CORRECTING']],
                msg: 'El tipo debe ser "CORRECTING".'
            }
        }
    },
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
            is: {
                args: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
                msg: 'El ID debe ser un UUID versión 4 válido (formato RFC 4122).'
            }
        }
    },
    invoice: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            isValidCorrectionInvoice(value) {
                if (typeof value !== 'object' || value === null || Array.isArray(value)) {
                    throw new Error('El campo "invoice" debe ser un objeto.');
                }
    
                const type = value.type;
    
                if (!['SIMPLIFIED', 'COMPLETE'].includes(type)) {
                    throw new Error('El campo "type" de invoice debe ser "SIMPLIFIED" o "COMPLETE".');
                }
    
                if (type === 'SIMPLIFIED') {
                    const requiredFields = ['number', 'issued_at', 'transaction_date', 'text', 'full_amount', 'items'];
    
                    for (const field of requiredFields) {
                        if (!value[field]) {
                            throw new Error(`El campo "${field}" es obligatorio en una factura simplificada.`);
                        }
                    }
    
                    if (!/^[0-9A-Z_/\-\.]{1,20}$/.test(value.number)) {
                        throw new Error('El número debe tener entre 1 y 20 caracteres válidos.');
                    }
    
                    if (value.series && (!/^[0-9A-Z_/\-\.]{1,20}$/.test(value.series) || /[IOW]/.test(value.series))) {
                        throw new Error('La serie no puede contener I, O o W y debe tener entre 1 y 20 caracteres válidos.');
                    }
    
                    if (!/^([0-2][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4} \d{2}:\d{2}:\d{2}$/.test(value.issued_at)) {
                        throw new Error('La fecha de emisión debe estar en el formato DD-MM-AAAA hh:mm:ss.');
                    }
    
                    if (!/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/.test(value.transaction_date)) {
                        throw new Error('La fecha de transacción debe estar en el formato DD-MM-AAAA.');
                    }
    
                    if (!/^[0-9A-Za-zñÑáÁàÀéÉíÍïÏóÓòÒúÚüÜçÇ°ºª.,:"() ]{1,250}$/.test(value.text)) {
                        throw new Error('El texto contiene caracteres no permitidos o excede el límite.');
                    }
    
                    if (!/^(-)?\d{1,12}(\.\d{1,2})?$/.test(value.full_amount)) {
                        throw new Error('El importe total debe ser un número válido con hasta 2 decimales.');
                    }
    
                    if (!Array.isArray(value.items) || value.items.length < 1 || value.items.length > 1000) {
                        throw new Error('Items debe ser un array con entre 1 y 1000 elementos.');
                    }
    
                    value.items.forEach((item, index) => {
                        if (!item.text || item.text.length > 250) {
                            throw new Error(`Texto del item ${index + 1} inválido.`);
                        }
                        ['quantity', 'unit_amount', 'full_amount'].forEach(field => {
                            if (!/^(-)?\d{1,12}(\.\d{1,8})?$/.test(item[field])) {
                                throw new Error(`${field} del item ${index + 1} no es válido.`);
                            }
                        });
                    });
    
                } else if (type === 'COMPLETE') {
                    if (typeof value.data !== 'object' || value.data === null) {
                        throw new Error('El campo "data" debe ser un objeto en facturas completas.');
                    }
    
                    if (!Array.isArray(value.recipients) || value.recipients.length < 1 || value.recipients.length > 100) {
                        throw new Error('Debe haber entre 1 y 100 destinatarios.');
                    }
    
                    if (value.vat_withholding && !/^(-)?\d{1,12}(\.\d{1,2})?$/.test(value.vat_withholding)) {
                        throw new Error('El importe de la retención no es válido.');
                    }
                }
            }
        },
    },
    method: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'SUBSTITUTION',
        validate: {
            isIn: {
                args: [['SUBSTITUTION', 'DIFFERENCES']],
                msg: 'El método debe ser "SUBSTITUTION" o "DIFFERENCES".'
            }
        }
    },
    code: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: {
                args: [['CORRECTION_1', 'CORRECTION_2', 'CORRECTION_3', 'CORRECTION_4']],
                msg: 'El código debe ser uno de: "CORRECTION_1", "CORRECTION_2", "CORRECTION_3", "CORRECTION_4".'
            }
        }
    },
    coupon: { 
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    annotations: {
        type: DataTypes.JSON,
        allowNull: true,
        validate: {
            isArray(value) {
                if (!Array.isArray(value)) {
                    throw new Error('Las anotaciones deben ser un array.');
                }
                if (value.length !== 1) {
                    throw new Error('Debe haber exactamente una anotación.');
                }

                const annotation = value[0];
                if (annotation.type !== 'INDIVIDUAL') {
                    throw new Error('El tipo de anotación debe ser "INDIVIDUAL".');
                }

                if (!annotation.activity_code || !/^[0-9.]{1,7}$/.test(annotation.activity_code)) {
                    throw new Error('El código de actividad debe tener entre 1 y 7 caracteres numéricos o con puntos.');
                }

                if (
                    annotation.income_tax_amount &&
                    !/^(-)?\d{1,12}(\.\d{1,2})?$/.test(annotation.income_tax_amount)
                ) {
                    throw new Error('El importe del IRPF debe ser un número decimal válido.');
                }

                if (typeof annotation.pay_collect !== 'boolean') {
                    throw new Error('El campo pay_collect debe ser un valor booleano.');
                }
            }
        },    
    },
    activity_code: { 
        type: DataTypes.STRING,
        allowNull: true,
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
                msg: 'El importe del IRPF debe ser un número decimal válido.'
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
                    throw new Error('El campo "metadata" debe ser un objeto.');
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
                            throw new Error(`La clave "${key}" supera los 40 caracteres permitidos.`);
                        }
                        if (typeof value[key] !== 'string') {
                            throw new Error(`El valor del metadato "${key}" debe ser una cadena.`);
                        }
                        if (value[key].length > 500) {
                            throw new Error(`El valor del metadato "${key}" supera los 500 caracteres permitidos.`);
                        }
                    });
                }
            }
        },    
    }
}, {
    tableName: 'correcting_invoices',
    timestamps: false
});

export default CorrectingInvoice;

export async function exampleCorrectingInvoice() {
    const invoiceId = uuidv4();
  
    const existingInvoice = await CorrectingInvoice.findOne({
      where: { id: invoiceId },
    });
  
    if (existingInvoice) {
      return {
        success: false,
        message: 'Ya existe una factura con el mismo id.',
        invoice: existingInvoice.toJSON(),
      };
    }
  
    const invoiceData = {
      type: 'SIMPLIFIED',
      number: 'CORR-INV-2025-001',
      series: 'SER2025',
      issued_at: '10-04-2025 12:00:00',
      transaction_date: '10-04-2025',
      text: 'Factura corregida por error en el importe.',
      full_amount: '100.00',
      items: [
        {
          text: 'Servicio de mantenimiento',
          quantity: '1.00',
          unit_amount: '100.00',
          full_amount: '100.00',
        },
      ],
    };
  
    const annotationsData = [
      {
        type: 'INDIVIDUAL',
        activity_code: '841.1',
        income_tax_amount: '15.00',
        pay_collect: true,
      },
    ];
  
    const metadataData = {
      motivo: 'Corrección por importe erróneo',
      referencia_original: 'INV-2025-OLD',
    };
  
    const correctingInvoice = await CorrectingInvoice.create({
      type: 'CORRECTING',
      id: invoiceId,
      invoice: invoiceData,
      method: 'SUBSTITUTION',
      code: 'CORRECTION_1',
      coupon: false,
      annotations: annotationsData,
      activity_code: '841.1',
      income_tax_amount: '15.00',
      pay_collect: true,
      metadata: metadataData,
    });
  
    return {
      success: true,
      message: 'Factura rectificativa creada exitosamente.',
      invoice: correctingInvoice.toJSON()
    };
  }
  