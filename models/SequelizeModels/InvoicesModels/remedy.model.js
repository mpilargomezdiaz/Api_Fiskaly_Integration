/*
Ticket de Jira: DP-24
  Nombre: Pilar
  Fecha: 10/04
  Descripción: Modelo se Sequelize correspondiente a las facturas de subsanación.
*/

/*
Ticket de Jira: DP-25
  Nombre: Pilar
  Fecha: 11/04
  Descripción: Implementación de la función para crear una factura de subsanación de prueba.
*/

import { DataTypes } from 'sequelize';
import { MySQLConnection } from '../../../databases/MySQL/mysql.js'
import { v4 as uuidv4 } from 'uuid';


const sequelize = MySQLConnection();

const RemedyInvoice = sequelize.define('RemedyInvoice', {
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [['REMEDY']],
                msg: 'El tipo debe ser "REMEDY".'
            }
        }
    },
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
            isUUID: 4,
        },
        comment: 'El ID debe corresponder a una factura que no haya sido modificada mediante subsanación, corrección o canje.',
    },
    invoice: { 
        type: DataTypes.JSON, 
        allowNull: false,
        validate: {
            isObject(value) {
                if (typeof value !== 'object' || value === null) {
                    throw new Error('La factura de subsanación debe ser un objeto');
                }
                if (!value.type || !['SIMPLIFIED', 'COMPLETE', 'CORRECTING'].includes(value.type)) {
                    throw new Error('El tipo de factura debe ser SIMPLIFIED, COMPLETE o CORRECTING');
                }
                switch (value.type) {
                    case 'SIMPLIFIED':
                        if (!value.number || !/^[0-9A-Z_/\-\.]{1,20}$/.test(value.number)) {
                            throw new Error('El número de factura simplificada no es válido');
                        }
                        if (value.series && !/^[0-9A-Z_/\-\.]{1,20}$/.test(value.series)) {
                            throw new Error('El número de serie no es válido');
                        }
                        if (!value.issued_at || !/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(value.issued_at)) {
                            throw new Error('La fecha de emisión no es válida');
                        }
                        if (!value.transaction_date || !/^\d{2}-\d{2}-\d{4}$/.test(value.transaction_date)) {
                            throw new Error('La fecha de la transacción no es válida');
                        }
                        if (!value.text || !/^[\w\W]{1,250}$/.test(value.text)) {
                            throw new Error('El texto descriptivo de la factura debe tener entre 1 y 250 caracteres');
                        }
                        if (!value.full_amount || !/^(-)?\d{1,12}(\.\d{1,2})?$/.test(value.full_amount)) {
                            throw new Error('El importe total de la factura no es válido');
                        }
                        if (!Array.isArray(value.items) || value.items.length === 0 || value.items.length > 1000) {
                            throw new Error('Los elementos de la factura deben ser un array con entre 1 y 1000 ítems');
                        }
                        break;
                    
                    case 'COMPLETE':
                        if (!value.data || typeof value.data !== 'object') {
                            throw new Error('Debe proporcionar la factura simplificada completa');
                        }
                        if (!Array.isArray(value.recipients) || value.recipients.length < 1 || value.recipients.length > 100) {
                            throw new Error('Debe especificar entre 1 y 100 destinatarios');
                        }
                        if (value.vat_withholding && !/^(-)?\d{1,12}(\.\d{1,2})?$/.test(value.vat_withholding)) {
                            throw new Error('El importe de la retención soportada no es válido');
                        }
                        break;
                    
                    case 'CORRECTING':
                        if (!value.id || !/^[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab]{1}[a-f0-9]{3}-?[a-f0-9]{12}$/.test(value.id)) {
                            throw new Error('El ID de la factura corregida no es válido');
                        }
                        if (!value.invoice || typeof value.invoice !== 'object') {
                            throw new Error('Debe proporcionar la factura corregida');
                        }
                        if (!value.invoice.type || value.invoice.type !== 'SIMPLIFIED') {
                            throw new Error('La factura corregida debe ser del tipo SIMPLIFIED');
                        }
                        if (value.method && !['SUBSTITUTION', 'DIFFERENCES'].includes(value.method)) {
                            throw new Error('El método de corrección debe ser SUSTITUCIÓN o DIFERENCIAS');
                        }
                        if (value.code && !['CORRECTION_1', 'CORRECTION_2', 'CORRECTION_3', 'CORRECTION_4'].includes(value.code)) {
                            throw new Error('El código de corrección no es válido');
                        }
                        if (value.coupon && typeof value.coupon !== 'boolean') {
                            throw new Error('El campo "coupon" debe ser un valor booleano');
                        }
                        break;
                }
            }
        }
    },
    annotations: {
        type: DataTypes.JSON,
        allowNull: true,
        validate: {
            isArray(value) {
                if (!Array.isArray(value)) {
                    throw new Error('Annotations debe ser un array');
                }
                if (value.length !== 1) {
                    throw new Error('Annotations debe contener exactamente 1 elemento');
                }
                const annotation = value[0];
                if (!annotation.type || !['INDIVIDUAL', 'INCIDENT'].includes(annotation.type)) {
                    throw new Error('El tipo de anotación debe ser "INDIVIDUAL" o "INCIDENT"');
                }
                if (annotation.type === 'INDIVIDUAL') {
                    if (!annotation.activity_code || !/^[0-9.]{1,7}$/.test(annotation.activity_code)) {
                        throw new Error('El código de actividad debe ser válido para INDIVIDUAL');
                    }
                    if (annotation.income_tax_amount && !/^(-)?\d{1,12}(\.\d{1,2})?$/.test(annotation.income_tax_amount)) {
                        throw new Error('El importe de ingreso en IRPF no es válido');
                    }
                    if (typeof annotation.pay_collect !== 'boolean') {
                        throw new Error('El valor de "pay_collect" debe ser un booleano');
                    }
                }
                if (annotation.type === 'INCIDENT') {
                    if (!annotation.reason || !/^[\w\W]{1,120}$/.test(annotation.reason)) {
                        throw new Error('El campo "reason" debe tener entre 1 y 120 caracteres');
                    }
                }
            }
        },
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        validate: {
          isValidMetadata(value) {
            if (value) {
              const keys = Object.keys(value);
              if (keys.length > 20) {
                throw new Error('Se pueden especificar hasta 20 claves en metadata');
              }
    
              keys.forEach((key) => {
                if (key.length > 40) {
                  throw new Error('Las claves en metadata no pueden tener más de 40 caracteres');
                }
                if (value[key]?.length > 500) {
                  throw new Error('Los valores de metadata no pueden tener más de 500 caracteres');
                }
              });
            }
          },
        },
      },
    }, {
    tableName: 'remedy_invoices', 
    timestamps: false
});

export default RemedyInvoice;

export async function exampleRemedyInvoice(req, res) {
    try {
        const existingInvoice = await RemedyInvoice.findOne({
            where: {
            'invoice.invoice.number' : 'REM-2025-001',
            'invoice.invoice.issued_at' : '10-04-2025 14:30:00'
            }
        });
        if (existingInvoice) {
            console.log('Ya existe una factura con el número REM-2025-001');
            return res.status(400).json({
                message: 'Ya existe una factura con el mismo número.',
                invoice: existingInvoice,
            });
        };
      const remedyInvoice = await RemedyInvoice.create({
        type: 'REMEDY',
        id: uuidv4(),
        invoice: {
          type: 'CORRECTING',
          id: uuidv4(),
          method: 'SUBSTITUTION',
          code: 'CORRECTION_1',
          coupon: false,
          invoice: {
            type: 'SIMPLIFIED',
            number: 'REM-2025-001',
            issued_at: '10-04-2025 14:30:00',
            transaction_date: '10-04-2025',
            text: 'Subsanación de factura original',
            full_amount: '550.00',
            items: [
              {
                text: 'Producto X',
                quantity: '1',
                unit_amount: '500.00',
                full_amount: '500.00'
              },
              {
                text: 'IVA 10%',
                quantity: '1',
                unit_amount: '50.00',
                full_amount: '50.00'
              }
            ]
          }
        },
        annotations: [
          {
            type: 'INDIVIDUAL',
            activity_code: '602.3',
            income_tax_amount: '15.00',
            pay_collect: false
          }
        ],
        metadata: {
          origen: 'subsanación_manual',
          observaciones: 'Factura generada tras revisión interna'
        }
      });
  
      console.log('Factura de subsanación creada con éxito');
      return { success: true, invoice : remedyInvoice};
    } catch (error) {
        console.error('Error al crear la factura de subsanación:', error.message);
        return { error: error.message };
    }
}

