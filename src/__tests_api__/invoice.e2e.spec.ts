import request from "supertest";
import { Sequelize } from "sequelize-typescript"
import express, { Express } from 'express'
import { Umzug } from "umzug";
import { migrator } from "./config-migrations/migrator";
import { invoiceRoute } from "../infrastructure/api/routes/invoice.route";
import { InvoiceModel } from "../modules/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../modules/invoice/repository/invoice-item.model";
import InvoiceItem from "../modules/invoice/domain/invoice-item.entity";
import Invoice from "../modules/invoice/domain/invoice.entity";
import Address from "../modules/@shared/domain/value-object/address";
import Id from "../modules/@shared/domain/value-object/id.value-object";

describe("E2E test for invoice", () => {
 
  const app: Express = express()
  app.use(express.json())
  app.use("/invoice", invoiceRoute)

  let sequelize: Sequelize

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })
    
    sequelize.addModels([InvoiceModel,InvoiceItemModel])
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
 
  it("should find a invoice", async () => {
   
    const invoiceAdd = new Invoice({
      id: new Id("1"),
      name: "Lucian",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888",
      ),
      items: [new InvoiceItem({id: new Id("1"),
                               name: "Item 1",
                               price: 25}),
              new InvoiceItem({id: new Id("2"),
                               name: "Item 2",
                               price: 35}),],
    });
    
    const invoice = await InvoiceModel.create({
      id: invoiceAdd.id.id,
      name: invoiceAdd.name,
      document: invoiceAdd.document,
      street: invoiceAdd.address.street,
      number: invoiceAdd.address.number,
      complement: invoiceAdd.address.complement,
      city: invoiceAdd.address.city,
      state: invoiceAdd.address.state,
      zipCode: invoiceAdd.address.zipCode,
      items: invoiceAdd.items.map((item)=>({id: item.id.id,
                                        name: item.name,
                                        price: item.price,
                                        invoice_id: invoiceAdd.id.id,
                                        createdAt: item.createdAt,
                                        updatedAt: item.updatedAt,
                                      })),
      createdAt: invoiceAdd.createdAt,
      updatedAt: invoiceAdd.updatedAt
    },
    {
      include: [{ model: InvoiceItemModel }],
    })
   
    const response = await request(app)
      .get("/invoice/1")
      .send();

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(invoice.id)
    expect(response.body.name).toEqual(invoice.name)
    expect(response.body.document).toEqual(invoice.document)
    expect(response.body.address.street).toEqual(invoice.street)
    expect(response.body.address.number).toEqual(invoice.number)
    expect(response.body.address.complement).toEqual(invoice.complement)
    expect(response.body.address.zipCode).toEqual(invoice.zipCode)
    expect(response.body.address.city).toEqual(invoice.city)
    expect(response.body.address.state).toEqual(invoice.state)
    expect(response.body.items.length).toEqual(invoice.items.length)
    expect(response.body.items[0].id).toEqual(invoice.items[0].id)
    expect(response.body.items[0].name).toEqual(invoice.items[0].name)
    expect(response.body.items[0].price).toEqual(invoice.items[0].price)
    expect(response.body.items[1].id).toEqual(invoice.items[1].id)
    expect(response.body.items[1].name).toEqual(invoice.items[1].name)
    expect(response.body.items[1].price).toEqual(invoice.items[1].price)
    expect(response.body.total).toEqual(60)

  });
  
});

