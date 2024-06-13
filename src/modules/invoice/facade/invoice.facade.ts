import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDTO, FindInvoiceFaceOutputDTO, GenerateInvoiceFacadeInputDto } from "./invoice.facade.interface";

export interface UseCaseProps {
    findUseCase: UseCaseInterface;
    generateUsecase: UseCaseInterface;
  }
  
  export default class InvoideFacade implements InvoiceFacadeInterface {
    private _findUseCase: UseCaseInterface;
    private _generateUsecase: UseCaseInterface;
  
    constructor(usecaseProps: UseCaseProps) {
      this._findUseCase = usecaseProps.findUseCase;
      this._generateUsecase = usecaseProps.generateUsecase;
    }
  
    async generate(input: GenerateInvoiceFacadeInputDto): Promise<void> {
      await this._generateUsecase.execute(input);
    }
    async find(
      input: FindInvoiceFacadeInputDTO
    ): Promise<FindInvoiceFaceOutputDTO> {
      return await this._findUseCase.execute(input);
    }
  }
  