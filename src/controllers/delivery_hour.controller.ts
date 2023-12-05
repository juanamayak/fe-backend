import {Request, Response} from "express";
import {JsonResponse} from "../enums/json-response";
import {DeliveryHourQueries} from "../queries/delivery_hour.queries";
import {DeliveryHourValidator} from "../validators/delivery_hour.validator";
import {v4 as uuidv4} from 'uuid';
import validator from "validator";

export class DeliveryHourController {
    static deliveryHourQueries: DeliveryHourQueries = new DeliveryHourQueries();
    static deliveryHourValidator: DeliveryHourValidator = new DeliveryHourValidator();

    public async index(req: Request, res: Response) {
        let deliveryHours = await DeliveryHourController.deliveryHourQueries.index();

        if (!deliveryHours.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Ocurrio un error al obtener los registros.'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            hours: deliveryHours.hours,
        });
    }

    public async store(req: Request, res: Response) {
        const body = req.body;
        const user_id = req.body.user_id;

        // Validacion del request
        const validatedData = await DeliveryHourController.deliveryHourValidator.validateStore(body)

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const data = {
            user_id,
            uuid: uuidv4(),
            start_hour: body.start_hour,
            end_hour: body.end_hour,
            special: body.special,
            status: 1
        }

        const hourCreated = await DeliveryHourController.deliveryHourQueries.create(data)

        if (!hourCreated.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: "Existen problemas al momento de crear el registro. Intente más tarde."}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'Gracias por tu apoyo. Hemos recibido tu sugerencia de ciudad.'
        });
    }

    public async update(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const hourUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar la hora'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        // Validacion del request
        const validatedData = await DeliveryHourController.deliveryHourValidator.validateUpdate(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const hour = await DeliveryHourController.deliveryHourQueries.show({
            uuid: hourUuid
        });

        if (!hour.ok) {
            errors.push({message: 'Existen problema al buscar el registro solicitado'});
        } else if (!hour.hour) {
            errors.push({message: 'El registro no se encuentra dada de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const updatedHour = await DeliveryHourController.deliveryHourQueries.update(hour.hour.id, body);

        if (!updatedHour.hour) {
            errors.push({message: 'Existen problemas al momento de actualizar el registro. Intente de nuevamente'});
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
        const errors = [];

        const hourUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar la hora'}) : req.params.uuid

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const findedHour = await DeliveryHourController.deliveryHourQueries.show({
            uuid: hourUuid
        });

        if (!findedHour.ok) {
            errors.push({message: 'Existen problemas al registro solicitado'});
        } else if (!findedHour.hour) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const deletedHour = await DeliveryHourController.deliveryHourQueries.delete(findedHour.hour.id, { status: 0});

        if (!deletedHour.ok) {
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