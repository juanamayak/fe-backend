import {Request, Response} from "express";
import {JsonResponse} from "../enums/json-response";
import {UserQueries} from "../queries/user.queries";
import {UserValidator} from "../validators/user.validator";
import * as bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import validator from "validator";

export class UsersController {
    static salt = bcrypt.genSaltSync(Number(process.env.NO_SALT));
    static userQueries: UserQueries = new UserQueries();
    static userValidators: UserValidator = new UserValidator();

    public async store(req: Request, res: Response) {
        const body = req.body;

        const user_id = req.body.user_id;

        // Validacion del request
        const validatedData = await UsersController.userValidators.validateStore(body)

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const data = {
            uuid: uuidv4(),
            role_id: body.role_id,
            name: body.name,
            lastname: body.lastname,
            email: body.email,
            password: bcrypt.hashSync(body.password, UsersController.salt),
            status: 1
        }

        const userCreated = await UsersController.userQueries.create(data)

        if (!userCreated.ok) {
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

        const userUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar el usuario'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        // Validacion del request
        const validatedData = await UsersController.userValidators.validateUpdate(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const user = await UsersController.userQueries.show({
            uuid: userUuid
        });

        if (!user.ok) {
            errors.push({message: 'Existen problemas al buscar el registro solicitado'});
        } else if (!user.user) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const updatedUser = await UsersController.userQueries.update(user.user.id, body);

        if (!updatedUser.user) {
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