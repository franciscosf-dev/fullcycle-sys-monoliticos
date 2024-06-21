import Address from "../../@shared/domain/value-object/address"
import Id from "../../@shared/domain/value-object/id.value-object"
import Client from "../domain/client.entity"
import OrderItem from "../domain/order-item.entity"
import Order from "../domain/order.entity"
import Product from "../domain/product.entity"
import CheckoutGateway from "../gateway/checkout.gateway"
import { ClientCheckoutModel } from "./client-checkout.model"
import { OrderItemModel } from "./order-item.model"
import { OrderModel } from "./order.model"


export default class OrderRepository implements CheckoutGateway {

    async addOrder(order: Order): Promise<void> {
  
      await OrderModel.create({
        id: order.id.id,
        client_id: order.client.id.id,
        items: order.items.map((item)=>({id: item.id.id,
                                        product_id: item.product.id.id,
                                        order_id: order.id.id,
                                        createdAt: item.createdAt,
                                        updatedAt: item.updatedAt,
                                        })),
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      },
      {
        include: [{ model: OrderItemModel },{ model: ClientCheckoutModel }],
      })
    }
  
    async findOrder(id: string): Promise<Order> {
  
      const order = await OrderModel.findOne({ where: { id },
        include: ["client","items"], })
  
      if (!order) {
        throw new Error("Order not found")
      }
  
      return new Order({
        id: new Id(order.id),
        client: new Client({
             id: new Id(order.client.id),
             name: order.client.name,
             email: order.client.email,
             address: order.client.address,
           }),
        status: order.status,
        items: order.items.map((item)=>(new OrderItem({id: new Id(item.id),
                                                       product: new Product( 
                                                                      {
                                                                        id: new Id(item.product.id),
                                                                        name: item.product.name,
                                                                        description: item.product.description,
                                                                        salesPrice: item.product.salesPrice,
                                                                      }),
                                                          }))),
      })
    }
  }