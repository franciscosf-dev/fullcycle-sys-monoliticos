export interface GenerateInvoiceFacadeInputDto {
    id?:string,
    name: string;
    document: string;
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
    items: {
      id: string;
      name: string;
      price: number;
    }[];
  }
  
  export interface FindInvoiceFacadeInputDTO {
    id: string;
  }
  
  export interface FindInvoiceFaceOutputDTO {
    id: string;
    name: string;
    document: string;
    address: {
      street: string;
      number: string;
      complement: string;
      city: string;
      state: string;
      zipCode: string;
    };
    items: {
      id: string;
      name: string;
      price: number;
    }[];
    total: number;
    createdAt: Date;
  }
  
  export default interface InvoiceFacadeInterface {
    generate(input: GenerateInvoiceFacadeInputDto): Promise<void>;
    find(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFaceOutputDTO>;
  }