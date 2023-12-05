import {Request, Response} from 'express'
import {v4 as uuidv4} from 'uuid';
import {JsonResponse} from '../enums/json-response';
import {ProviderQueries} from "../queries/provider.queries";
import {ProviderValidator} from "../validators/provider.validator";
import validator from "validator";


export class ProviderController {

    static providerQueries: ProviderQueries = new ProviderQueries();
    static providerValidator: ProviderValidator = new ProviderValidator();

    public async index(req: Request, res: Response) {
        let providers = await ProviderController.providerQueries.index()

        if (!providers.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Algo salio mal a la hora de traer las direcciones.'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            providers: providers.providers,
        })
    }

    public async store(req: Request, res: Response) {
        const body = req.body;

        const user_id = req.body.user_id;

        // Validacion del request
        const validatedData = await ProviderController.providerValidator.validateStore(body)

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const data = {
            user_id,
            country_id: body.country_id,
            state_id: body.state_id,
            city_id: body.city_id,
            uuid: uuidv4(),
            name: body.name,
            address: body.address,
            colony: body.colony,
            zip: body.zip,
            responsable_name: body.responsable_name,
            responsable_lastname: body.responsable_lastname,
            responsable_email: body.responsable_email,
            responsable_cellphone: body.responsable_cellphone,
            status: 1
        }

        let providerCreated = await ProviderController.providerQueries.create(data);

        if (!providerCreated.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: "Existen problemas al momento de crear el registro. Intente más tarde."}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'El proveedor se creo exitosamente',
            provider: providerCreated.provider
        });
    }

    public async update(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const providerUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar el proveedor'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        // Validacion del request
        const validatedData = await ProviderController.providerValidator.validateUpdate(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const provider = await ProviderController.providerQueries.show({
            uuid: providerUuid
        });

        if (!provider.ok) {
            errors.push({message: 'Existen problemas al buscar el registro solicitado'});
        } else if (!provider.provider) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const updatedProvider = await ProviderController.providerQueries.update(provider.provider.id, body);

        if (!updatedProvider.provider) {
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

        const providerUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar el proveedor.'}) : req.params.uuid

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const findedAdress = await ProviderController.providerQueries.show({
            uuid: providerUuid
        });

        if (!findedAdress.ok) {
            errors.push({message: 'Existen problema al buscar el registro solicitado'});
        } else if (!findedAdress.provider) {
            errors.push({message: 'El registro no se encuentra dada de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const deletedAddress = await ProviderController.providerQueries.delete(findedAdress.provider.id, { status: 0});

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