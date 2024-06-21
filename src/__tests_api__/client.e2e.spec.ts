import request from "supertest";
import express, { Express } from 'express'
import { Sequelize } from "sequelize-typescript"
import { clientRoute } from "../infrastructure/api/routes/client.route";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import Address from "../modules/@shared/domain/value-object/address";

describe("E2E test for client", () => {
  const app: Express = express()
  app.use(express.json())
  app.use("/clients", clientRoute)

  let sequelize: Sequelize

 
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })
    
    sequelize.addModels([ClientModel])
    await sequelize.sync({ force: true });
  })

  afterEach(async () => {
    if (!sequelize) {
      return 
    }
    await sequelize.close()
  })

  it("should create a client", async () => {
    
    const response = await request(app)
      .post("/clients")
      .send({
        id: "1",
        name: "Lucian",
        email: "lucian@123.com",
        document: "1234-5678",
        address: {
          street: "Rua 123",
          number: "99",
          complement: "Casa Verde",
          city: "Criciúma",
          state: "SC",
          zipCode: "88888-888",
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Lucian");
    expect(response.body.email).toBe("lucian@123.com");
    expect(response.body.document).toBe("1234-5678");
    expect(response.body.address.street).toBe("Rua 123");
    expect(response.body.address.number).toBe("99");
    expect(response.body.address.complement).toBe("Casa Verde");
    expect(response.body.address.city).toBe("Criciúma");
    expect(response.body.address.state).toBe("SC");
    expect(response.body.address.zipCode).toBe("88888-888");
  });

});
