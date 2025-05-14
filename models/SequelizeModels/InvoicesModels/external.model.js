/*
Ticket de Jira: DP-24
  Nombre: Pilar
  Fecha: 10/04
  Descripción: Modelo se Sequelize correspondiente a las facturas externas.
*/

/*
Ticket de Jira: DP-25
  Nombre: Pilar
  Fecha: 11/04
  Descripción: Implementación de la función para crear una factura externa de prueba.
*/

import { DataTypes } from 'sequelize';
import { MySQLConnection } from '../../../databases/MySQL/mysql.js'

const sequelize = MySQLConnection();

const ExternalInvoice = sequelize.define('ExternalInvoice', {
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [['EXTERNAL']],
                msg: 'El tipo debe ser "EXTERNAL".'
            }
        }
    },
    data: { 
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La información detallada de la factura externa es obligatoria.'
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
    activity_code: { 
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^[0-9.]{1,7}$/ 
        }
    },
    income_tax_amount: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: /^(-)?\d{1,12}(\.\d{1,2})?$/
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
      tableName: 'external_invoices',
      timestamps: false,
    });
    
export default ExternalInvoice;

export async function exampleExternalInvoice(req, res) {
    try {
        const existingInvoice = await ExternalInvoice.findOne({
            where: {
                'data.invoice_reference': 'EXT-INV-001'
            }
        });
        if (existingInvoice) {
            console.log('Ya existe una factura con la referencia EXT-INV-001');
            return res.status(400).json({
                message: 'Ya existe una factura con esa referencia.',
                invoice: existingInvoice,
            });
        };
      const externalInvoice = await ExternalInvoice.create({
        type: 'EXTERNAL',
        data: {
          external_system: 'ERP_Contabilidad_2025',
          invoice_reference: 'EXT-INV-001',
          amount: 1000.00,
          currency: 'EUR',
          issued_at: '2025-04-10 11:30:00',
          details: 'Factura importada desde sistema externo'
        },
        annotations: [
          {
            type: 'INDIVIDUAL',
            activity_code: '601.2',
            income_tax_amount: '50.00',
            pay_collect: false
          }
        ],
        activity_code: '601.2',
        income_tax_amount: '50.00',
        pay_collect: false,
        metadata: {
          origen: 'integración_API',
          comentario: 'Factura sincronizada automáticamente desde ERP'
        }
      });
  
      console.log('Factura externa creada correctamente');
      return { success: true, invoice : externalInvoice };
    } catch (error) {
        console.error('Error al crear la factura externa:', error.message);
        return { error: error.message };
    }
}

