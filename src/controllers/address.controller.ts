import validator from 'validator';
import * as bcrypt from 'bcrypt';
import {Request, Response} from 'express'
import {JsonResponse} from '../enums/json-response';
import {v4 as uuidv4} from 'uuid';
import moment from "moment";
import {AddressQueries} from "../queries/address.queries";
import {CitySuggestionValidator} from "../validators/city_suggestion.validator";
import {AddressValidator} from "../validators/address.validator";

export class AddressController {

    static addressesQueries: AddressQueries = new AddressQueries();
    static addressesValidator: AddressValidator = new AddressValidator();

    public async index(req: Request, res: Response) {
        let addresses = await AddressController.addressesQueries.index()

        if (!addresses.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Algo salio mal a la hora de traer las direcciones.'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            countries: addresses.addresses,
        })
    }

    public async store(req: Request, res: Response) {
        const body = req.body;
        const client_id = req.body.client_id;

        // Validacion del request
        const validatedData = await AddressController.addressesValidator.validateStore(body)

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const data = {
            client_id,
            country_id: body.country_id,
            state_id: body.state_id,
            city_id: body.city_id,
            uuid: uuidv4(),
            name_receiver: body.name_receiver,
            phone_receiver: body.phone_receiver,
            address: body.address,
            colony: body.colony,
            references: body.references,
            latitude: body.latitude,
            longitude: body.longitude,
            zip: body.zip,
            status: 1
        }

        console.log(data);

        let addressCreated = await AddressController.addressesQueries.create(data);

        if (!addressCreated.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: "Existen problemas al momento de crear el registro. Intente más tarde."}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'La dirección se creo exitosamente',
            client: addressCreated.address
        });
    }

    public async update(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const addressUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar la dirección'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        // Validacion del request
        const validatedData = await AddressController.addressesValidator.validateUpdate(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const address = await AddressController.addressesQueries.show({
            uuid: addressUuid
        });

        if (!address.ok) {
            errors.push({message: 'Existen problemas al buscar el registro solicitado'});
        } else if (!address.address) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const updateAddress = await AddressController.addressesQueries.update(address.address.id, body);

        if (!updateAddress.address) {
            errors.push({message: 'Se encontro un problema a la hora de actualizar la dirección. Intente de nuevamente'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'El registro se actualizo correctamente'
        });
    }

    public async delete(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const addressUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar la dirección.'}) : req.params.uuid

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const findedAdress = await AddressController.addressesQueries.show({
            uuid: addressUuid
        });

        if (!findedAdress.ok) {
            errors.push({message: 'Existen problema al buscar el registro solicitado'});
        } else if (!findedAdress.address) {
            errors.push({message: 'El registro no se encuentra dada de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const deletedAddress = await AddressController.addressesQueries.delete(findedAdress.address.id, { status: 0});

        if (!deletedAddress.ok) {
            errors.push({message: 'Existen problemas al momento de eliminar el registro. Intente de nuevamente'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }


        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'El registro se elimino correctamente.'
        });
    }
}
