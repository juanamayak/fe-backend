import {Request, Response} from 'express'
import validator from 'validator';
import * as bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import moment from "moment";
import {JsonResponse} from '../enums/json-response';
import {MessageQueries} from "../queries/message.queries";
import {MessageValidator} from "../validators/message.validator";


export class MessagesController {

    static messageQueries: MessageQueries = new MessageQueries();
    static messageValidators: MessageValidator = new MessageValidator();

    public async index(req: Request, res: Response) {
        let messages = await MessagesController.messageQueries.index()

        if (!messages.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Algo salio mal a la hora de traer las direcciones.'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            messages: messages.messages,
        })
    }

    public async store(req: Request, res: Response) {
        const body = req.body;

        const user_id = req.body.user_id;

        // Validacion del request
        const validatedData = await MessagesController.messageValidators.validateStore(body)

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const data = {
            user_id,
            uuid: uuidv4(),
            title: body.title,
            message: body.message,
            status: 1
        }

        const messageCreated = await MessagesController.messageQueries.create(data)

        if (!messageCreated.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: "Existen problemas al momento de dar de alta el registro. Intente más tarde"}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'El registro se ha creado correctamente'
        });
    }

    public async update(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const messageUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar el mensaje'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        // Validacion del request
        const validatedData = await MessagesController.messageValidators.validateUpdate(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const message = await MessagesController.messageQueries.show({
            uuid: messageUuid
        });

        if (!message.ok) {
            errors.push({message: 'Existen problemas al buscar el registro solicitado'});
        } else if (!message.message) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const updatedMessage = await MessagesController.messageQueries.update(message.message.id, body);

        if (!updatedMessage.message) {
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
}