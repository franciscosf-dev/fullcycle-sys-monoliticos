import request from "supertest";
import { Sequelize } from "sequelize-typescript"
import express, { Express } from 'express'
import { Umzug } from "umzug";
import { migrator } from "./config-migrations/migrator";
import { productRoute } from "../infrastructure/api/routes/product.route";
import { ProductAdmModel } from "../modules/product-adm/repository/product.model";

describe("E2E test for product", () => {
 
  const app: Express = express()
  app.use(express.json())
  app.use("/products", productRoute)

  let sequelize: Sequelize

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })
    
    sequelize.addModels([ProductAdmModel])
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
 
  it("should create a product", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        salesPrice: 200,
        stock: 10,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product 1");
    expect(response.body.description).toBe("Product 1 description");
    expect(response.body.purchasePrice).toBe(100);
    expect(response.body.salesPrice).toBe(200);
    expect(response.body.stock).toBe(10);
  });
  
});

