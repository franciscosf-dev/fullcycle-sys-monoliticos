import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "./product.entity";

type OrderItemProps = {
    id: Id;
    product: Product;
  };
  
  export default class OrderItem extends BaseEntity implements AggregateRoot {
    private _product: Product;
  
    constructor(props: OrderItemProps) {
      super(props.id);
      this._product = props.product;
    }
  
    get product(): Product {
      return this._product;
    }
  
  }