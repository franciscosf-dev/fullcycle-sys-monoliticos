import express, { Request, Response } from "express";
import AddClientUseCase from "../../../modules/client-adm/usecase/add-client/add-client.usecase";
import ClientRepository from "../../../modules/client-adm/repository/client.repository";
import Address from "../../../modules/@shared/domain/value-object/address";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  const usecase = new AddClientUseCase(new ClientRepository());
  try {
    const clientDto = {

      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: new Address(
        req.body.address.street,
        req.body.address.number,
        req.body.address.complement,
        req.body.address.city,
        req.body.address.state,
        req.body.address.zipCode
      ),
    };
    const output = await usecase.execute(clientDto);
    res.send(
      {
        id: output.id,
        name: output.name,
        email: output.email,
        document: output.document,
        address: {
          street: output.address.street,
          number: output.address.number,
          complement: output.address.complement,
          city: output.address.city,
          state: output.address.state,
          zipCode: output.address.zipCode,
        }
    });
  } catch (err) {
    res.status(500).send(err);
  }
});
