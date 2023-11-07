import validator from 'validator';
import * as bcrypt from 'bcrypt';
import {Request, Response} from 'express'
import {JsonResponse} from '../enums/json-response';
import {v4 as uuidv4} from 'uuid';
import moment from "moment";
import {AddressQueries} from "../queries/address.queries";

export class AddressController {

    static addressesQueries: AddressQueries = new AddressQueries();

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
        let client_id = req.body.client_id;
        let body = req.body;

        let errors = [];

        let country_id: number = !body.country_id || validator.isEmpty(body.country_id) ?
            errors.push({message: 'El país es obligatorio'}) : body.country_id;

        let state_id: number = !body.state_id || validator.isEmpty(body.state_id) ?
            errors.push({message: 'El estado es obligatorio'}) : body.state_id;

        let city_id: number = !body.city_id || validator.isEmpty(body.city_id) ?
            errors.push({message: 'La ciudad es obligatoria'}) : body.city_id;

        let name_receiver: string = !body.name_receiver || validator.isEmpty(body.name_receiver) ?
            errors.push({message: 'El nombre del destinatario es obligatorio'}) : body.name_receiver;

        let phone_receiver: string = !body.phone_receiver || validator.isEmpty(body.phone_receiver) ?
            errors.push({message: 'El número del destinatario es obligatorio'}) : body.phone_receiver;

        let address: string = !body.address || validator.isEmpty(body.address) ?
            errors.push({message: 'La dirección de entrega es oblitaria'}) : body.address;

        let colony: string = !body.colony || validator.isEmpty(body.colony) ?
            errors.push({message: 'La colonia de la dirección es oblitaria'}) : body.colony;

        let reference: string = !body.reference || validator.isEmpty(body.reference) ?
            errors.push({message: 'La referencia es obligatoria'}) : body.reference;

        let latitude: string = !body.latitude || validator.isEmpty(body.latitude) ?
            errors.push({message: 'La posición en el mapa es obligatorio'}) : body.latitude;

        let longitude: string = !body.longitude || validator.isEmpty(body.longitude) ?
            errors.push({message: 'La posición en el mapa es obligatorio'}) : body.longitude;

        let zip: number = !body.zip || validator.isEmpty(body.zip) ?
            errors.push({message: 'El código postal es obligatorio'}) : body.zip;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        let createAddress = await AddressController.addressesQueries.create({
            client_id,
            uuid: uuidv4(),
            body,
            status: 1
        });

        if (!createAddress.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Hubo un error a la hora de crear la dirección. '}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'La dirección se creo exitosamente',
            client: createAddress.address
        });
    }

    public async update(req: Request, res: Response) {
        let client_id = req.body.client_id;
        let body = req.body;

        let errors = [];

        let addressUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar la dirección.'}) : req.params.uuid

        let country_id: number = !body.country_id || validator.isEmpty(body.country_id) ?
            errors.push({message: 'El país es obligatorio'}) : body.country_id;

        let state_id: number = !body.state_id || validator.isEmpty(body.state_id) ?
            errors.push({message: 'El estado es obligatorio'}) : body.state_id;

        let city_id: number = !body.city_id || validator.isEmpty(body.city_id) ?
            errors.push({message: 'La ciudad es obligatoria'}) : body.city_id;

        let name_receiver: string = !body.name_receiver || validator.isEmpty(body.name_receiver) ?
            errors.push({message: 'El nombre del destinatario es obligatorio'}) : body.name_receiver;

        let phone_receiver: string = !body.phone_receiver || validator.isEmpty(body.phone_receiver) ?
            errors.push({message: 'El número del destinatario es obligatorio'}) : body.phone_receiver;

        let address: string = !body.address || validator.isEmpty(body.address) ?
            errors.push({message: 'La dirección de entrega es oblitaria'}) : body.address;

        let colony: string = !body.colony || validator.isEmpty(body.colony) ?
            errors.push({message: 'La colonia de la dirección es oblitaria'}) : body.colony;

        let reference: string = !body.reference || validator.isEmpty(body.reference) ?
            errors.push({message: 'La referencia es obligatoria'}) : body.reference;

        let latitude: string = !body.latitude || validator.isEmpty(body.latitude) ?
            errors.push({message: 'La posición en el mapa es obligatorio'}) : body.latitude;

        let longitude: string = !body.longitude || validator.isEmpty(body.longitude) ?
            errors.push({message: 'La posición en el mapa es obligatorio'}) : body.longitude;

        let zip: number = !body.zip || validator.isEmpty(body.zip) ?
            errors.push({message: 'El código postal es obligatorio'}) : body.zip;

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
            errors.push({message: 'Existen problema al buscar la dirección solicitada'});
        } else if (!findedAdress.address) {
            errors.push({message: 'La dirección no se encuentra dada de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }


        const updateAddress = await AddressController.addressesQueries.update(findedAdress.address.id, body);

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
            message: 'La dirección se actualizo exitosamente'
        });
    }

    public async delete(req: Request, res: Response) {
        let client_id = req.body.client_id;
        let body = req.body;

        let errors = [];

        let addressUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
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
            errors.push({message: 'Existen problema al buscar la dirección solicitada'});
        } else if (!findedAdress.address) {
            errors.push({message: 'La dirección no se encuentra dada de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const deleteAddress = await AddressController.addressesQueries.delete(findedAdress.address.id, { status: 0});

        if (!deleteAddress.ok) {
            errors.push({message: 'Se encontro un problema a la hora de eliminar la dirección. Intente de nuevamente'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }


        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'La dirección se elimino exitosamente'
        });
    }
}
