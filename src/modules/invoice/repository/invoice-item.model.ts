import { Model, BelongsTo, Column, ForeignKey, PrimaryKey, Table } from "sequelize-typescript"
import { InvoiceModel } from "./invoice.model"

@Table({
    tableName: 'invoice_item',
    timestamps: false
  })
  export class InvoiceItemModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string
  
    @Column({ allowNull: false })
    name: string
  
    @Column({ allowNull: false })
    price: number
  
    @ForeignKey(() => InvoiceModel)
    invoice_id: string;
  
    @BelongsTo(() => InvoiceModel)
    declare invoice: InvoiceModel;

    @Column({ allowNull: false })
    createdAt: Date
  
    @Column({ allowNull: false })
    updatedAt: Date
  }