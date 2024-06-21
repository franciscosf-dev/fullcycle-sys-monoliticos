import { Model, Column, HasMany, PrimaryKey, Table, HasOne, ForeignKey, BelongsTo } from "sequelize-typescript"
import { ClientCheckoutModel } from "./client-checkout.model";
import { OrderItemModel } from "./order-item.model";

@Table({
    tableName: 'order',
    timestamps: false
  })
  export class OrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;
  
    @ForeignKey(() => ClientCheckoutModel)
    @Column({ allowNull: false })
    declare client_id: string;

    @BelongsTo(() => ClientCheckoutModel)
    declare client: ClientCheckoutModel;
  
    @HasMany(() => OrderItemModel)
    declare items: OrderItemModel[];

    @Column({ allowNull: true })
    status: string;
  
    @Column({ allowNull: false })
    createdAt: Date;
  
    @Column({ allowNull: false })
    updatedAt: Date;
  }