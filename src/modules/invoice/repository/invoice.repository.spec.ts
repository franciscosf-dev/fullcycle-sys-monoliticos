import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "./invoice.model"
import { InvoiceItemModel } from "./invoice-item.model"
import Invoice from "../domain/invoice.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"
import InvoiceItem from "../domain/invoice-item.entity"
import InvoiceRepository from "./invoice.repository"
import { Umzug } from "umzug"
import { migrator } from "../../../__tests_api__/config-migrations/migrator"

describe("Invoice Repository test", () => {

     let sequelize: Sequelize

    let migration: Umzug<any>;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        sync: { force: true }
      })

      sequelize.addModels([InvoiceModel,InvoiceItemModel])
      migration = migrator(sequelize)
      await migration.up()
  
      //sequelize.addModels([InvoiceModel,InvoiceItemModel])
      //await sequelize.sync()
    })
  
    afterEach(async () => {
      if (!migration || !sequelize) {
        return 
      }
      migration = migrator(sequelize)
      await migration.down()
      await sequelize.close()
      //await sequelize.close()
    })
  
    it("should create a invoice", async () => {
  
      const invoice = new Invoice({
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
      })
  
      const repository = new InvoiceRepository()
      await repository.generate(invoice)
  
      const invoiceDb = await InvoiceModel.findOne({ where: { id: "1" },
                                                     include: ["items"], })
  
      expect(invoiceDb).toBeDefined()
      expect(invoiceDb.id).toEqual(invoice.id.id)
      expect(invoiceDb.name).toEqual(invoice.name)
      expect(invoiceDb.document).toEqual(invoice.document)
      expect(invoiceDb.street).toEqual(invoice.address.street)
      expect(invoiceDb.number).toEqual(invoice.address.number)
      expect(invoiceDb.complement).toEqual(invoice.address.complement)
      expect(invoiceDb.city).toEqual(invoice.address.city)
      expect(invoiceDb.state).toEqual(invoice.address.state)
      expect(invoiceDb.zipCode).toEqual(invoice.address.zipCode)
      expect(invoiceDb.items.length).toEqual(invoice.items.length)
      expect(invoiceDb.items[0].id).toEqual(invoice.items[0].id.id)
      expect(invoiceDb.items[0].name).toEqual(invoice.items[0].name)
      expect(invoiceDb.items[0].price).toEqual(invoice.items[0].price)
      expect(invoiceDb.items[1].id).toEqual(invoice.items[1].id.id)
      expect(invoiceDb.items[1].name).toEqual(invoice.items[1].name)
      expect(invoiceDb.items[1].price).toEqual(invoice.items[1].price)
      expect(invoiceDb.createdAt).toStrictEqual(invoice.createdAt)
      expect(invoiceDb.updatedAt).toStrictEqual(invoice.updatedAt)
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
      })
      
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
  
      const repository = new InvoiceRepository()
      const result = await repository.find(invoice.id)
  
      expect(result.id.id).toEqual(invoice.id)
      expect(result.name).toEqual(invoice.name)
      expect(result.address.street).toEqual(invoice.street)
      expect(result.address.number).toEqual(invoice.number)
      expect(result.address.complement).toEqual(invoice.complement)
      expect(result.address.city).toEqual(invoice.city)
      expect(result.address.state).toEqual(invoice.state)
      expect(result.address.zipCode).toEqual(invoice.zipCode)
      expect(result.items.length).toEqual(invoice.items.length)
      expect(result.items[0].id.id).toEqual(invoice.items[0].id)
      expect(result.items[0].name).toEqual(invoice.items[0].name)
      expect(result.items[0].price).toEqual(invoice.items[0].price)
      expect(result.items[1].id.id).toEqual(invoice.items[1].id)
      expect(result.items[1].name).toEqual(invoice.items[1].name)
      expect(result.items[1].price).toEqual(invoice.items[1].price)
      expect(result.createdAt).toStrictEqual(invoice.createdAt)
      expect(result.updatedAt).toStrictEqual(invoice.updatedAt)
    })
     
  })