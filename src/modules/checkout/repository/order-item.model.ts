import { Model, Column, PrimaryKey, Table, ForeignKey, BelongsTo } from "sequelize-typescript"
import { OrderModel } from "./order.model";
import { ProductCheckoutModel } from "./product-checkout.model";

@Table({
    tableName: 'order_item',
    timestamps: false
  })
  export class OrderItemModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;
  
    @ForeignKey(() => ProductCheckoutModel)
    @Column({ allowNull: false })
    declare product_id: string;
  
    @BelongsTo(() => ProductCheckoutModel)
    declare product: ProductCheckoutModel;
  
    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false })
    declare order_id: string;
  
    @BelongsTo(() => OrderModel)
    declare order: OrderModel;
  
    @Column({ allowNull: false })
    createdAt: Date;
  
    @Column({ allowNull: false })
    updatedAt: Date;
  }