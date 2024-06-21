import request from "supertest";
import { Sequelize } from "sequelize-typescript"
import express, { Express } from 'express'
import { Umzug } from "umzug";
import { migrator } from "./config-migrations/migrator";
import { checkoutRoute } from "../infrastructure/api/routes/checkout.route";
import { OrderModel } from "../modules/checkout/repository/order.model";
import { OrderItemModel } from "../modules/checkout/repository/order-item.model";
import { ProductCheckoutModel } from "../modules/checkout/repository/product-checkout.model";
import { ClientCheckoutModel } from "../modules/checkout/repository/client-checkout.model";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import { InvoiceModel } from "../modules/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../modules/invoice/repository/invoice-item.model";
import ProductModel from "../modules/store-catalog/repository/product.model";
import { ProductAdmModel } from "../modules/product-adm/repository/product.model";
import TransactionModel from "../modules/payment/repository/transaction.model";

describe("E2E test for checkout", () => {
 
  const app: Express = express()
  app.use(express.json())
  app.use("/checkout", checkoutRoute)

  let sequelize: Sequelize

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })
    
    sequelize.addModels([ProductCheckoutModel, 
                         ClientCheckoutModel, 
                         ClientModel, 
                         OrderModel, 
                         OrderItemModel,
                         InvoiceModel,
                         InvoiceItemModel,
                         ProductModel,
                         ProductAdmModel,
                         TransactionModel])
    migration = migrator(sequelize)
    await migration.up()
  })

  afterEach(async () => {
    if (!migration || !sequelize) {
      return 
    }
    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
  })
 
  it("should create a checkout", async () => {
    
    await ClientModel.create({id: "C1",
                        name: "Client 1",
                        email: "client1@email.com",
                        document: "123456",
                        street: "street client",
                        number: "1",
                        complement: "complement 1",
                        city: "city",
                        state: "ST",
                        zipCode: "zip",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      });

    await ProductAdmModel.create({
        id: "P1",
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        salesPrice: 200,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    await ProductAdmModel.create({
      id: "P2",
      name: "Product 2",
      description: "Product 2 description",
      purchasePrice: 200,
      salesPrice: 400,
      stock: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: "C1",
        products: [{productId: "P1"},{productId: "P2"}]
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.invoiceId).toBeDefined();
    expect(response.body.total).toBe(600);
    expect(response.body.status).toBe("approved");
    expect(response.body.products.length).toBe(2);
  });
  
});

