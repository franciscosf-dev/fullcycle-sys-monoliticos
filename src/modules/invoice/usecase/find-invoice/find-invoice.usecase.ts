import Id from "../../../@shared/domain/value-object/id.value-object"
import InvoiceGateway from "../../gateway/invoice.gateway"
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.usecase.dto"

export default class FindInvoiceUseCase {

    private _invoiceRepository: InvoiceGateway
  
    constructor(invoiceRepository: InvoiceGateway) {
      this._invoiceRepository = invoiceRepository
    }
  
    async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
  
      const result = await this._invoiceRepository.find(input.id)
  
      let soma = 0;
      return {
        id: result.id.id,
        name: result.name,
        document: result.document,
        address: {
            street: result.address.street,
            number: result.address.number,
            complement: result.address.complement,
            city: result.address.city,
            state: result.address.state,
            zipCode: result.address.zipCode,
        },
        items: result.items.map((item)=>({
            id: item.id.id,
            name: item.name,
            price: item.price,}
        )),
        total: result.items.reduce(function(soma, item) {
            return soma + item.price;
          }, 0),
        createdAt: result.createdAt,
      }
    }
  }