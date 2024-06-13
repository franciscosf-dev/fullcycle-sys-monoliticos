import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "../repository/invoice.model"
import { InvoiceItemModel } from "../repository/invoice-item.model"
import InvoiceRepository from "../repository/invoice.repository"
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase"
import InvoideFacade from "./invoice.facade"
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"

describe("Client Adm Facade test", () => {

    let sequelize: Sequelize
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        sync: { force: true }
      })
  
      sequelize.addModels([InvoiceModel,InvoiceItemModel])
      await sequelize.sync()
    })
  
    afterEach(async () => {
      await sequelize.close()
    })
  
    it("should create a invoice", async () => {
  
      const repository = new InvoiceRepository()
      const generateUsecase = new GenerateInvoiceUseCase(repository)
      const facade = new InvoideFacade({
        generateUsecase: generateUsecase,
        findUseCase: undefined,
      })
  
      const input = {
        id: "1",
        name: "Lucian",
        document: "1234-5678",
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipCode: "88888-888",
        items: [{id: "1",
                 name: "Item 1",
                 price: 25,},
                {id: "2",
                 name: "Item 2",
                 price: 35,}],
      }
  
      await facade.generate(input)
  
      const invoice = await InvoiceModel.findOne({ where: { id: "1" },
                                                  include: ["items"], })
  
      expect(invoice.id).toEqual(input.id)
      expect(invoice.name).toEqual(input.name)
      expect(invoice.document).toEqual(input.document)
      expect(invoice.street).toEqual(input.street)
      expect(invoice.number).toEqual(input.number)
      expect(invoice.complement).toEqual(input.complement)
      expect(invoice.city).toEqual(input.city)
      expect(invoice.state).toEqual(input.state)
      expect(invoice.zipcode).toEqual(input.zipCode)
      expect(invoice.items.length).toEqual(input.items.length)
      expect(invoice.items[0].id).toEqual(input.items[0].id)
      expect(invoice.items[0].name).toEqual(input.items[0].name)
      expect(invoice.items[0].price).toEqual(input.items[0].price)
      expect(invoice.items[1].id).toEqual(input.items[1].id)
      expect(invoice.items[1].name).toEqual(input.items[1].name)
      expect(invoice.items[1].price).toEqual(input.items[1].price)
    })
  
    it("should find a invoice", async () => {
  
       //const repository = new InvoiceRepository()
       //const generateUsecase = new GenerateInvoiceUseCase(repository)
       //const findUseCase = new FindInvoiceUseCase(repository)
       //const facade = new InvoideFacade({
       //  generateUsecase: generateUsecase,
       //  findUseCase: findUseCase
       //})
  
      const facade = InvoiceFacadeFactory.create()
  
      const input = {
        id: "1",
        name: "Lucian",
        document: "1234-5678",
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipCode: "88888-888",
        items: [{id: "1",
                 name: "Item 1",
                 price: 25,},
                {id: "2",
                 name: "Item 2",
                 price: 35,}],
      }
  
      await facade.generate(input)
  
      const invoice = await facade.find({ id: "1" })
  
      expect(invoice.id).toBeDefined
      expect(invoice.name).toEqual(input.name)
      expect(invoice.document).toEqual(input.document)
      expect(invoice.address.street).toEqual(input.street)
      expect(invoice.address.number).toEqual(input.number)
      expect(invoice.address.complement).toEqual(input.complement)
      expect(invoice.address.city).toEqual(input.city)
      expect(invoice.address.state).toEqual(input.state)
      expect(invoice.address.zipCode).toEqual(input.zipCode)
      expect(invoice.items.length).toEqual(input.items.length)
      expect(invoice.items[0].id).toEqual(input.items[0].id)
      expect(invoice.items[0].name).toEqual(input.items[0].name)
      expect(invoice.items[0].price).toEqual(input.items[0].price)
      expect(invoice.items[1].id).toEqual(input.items[1].id)
      expect(invoice.items[1].name).toEqual(input.items[1].name)
      expect(invoice.items[1].price).toEqual(input.items[1].price)
      expect(invoice.total).toEqual(60)
    })
  })