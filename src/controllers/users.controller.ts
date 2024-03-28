import {Request, Response} from "express";
import {JsonResponse} from "../enums/json-response";
import {UserQueries} from "../queries/user.queries";
import {UserValidator} from "../validators/user.validator";
import * as bcrypt from 'bcrypt';
import PasswordGenerator from 'generate-password';
import {v4 as uuidv4} from 'uuid';
import validator from "validator";
import {Payload} from "../helpers/payload";
import {Mailer} from "../helpers/mailer";

export class UsersController {
    static salt = bcrypt.genSaltSync(Number(process.env.NO_SALT));
    static userQueries: UserQueries = new UserQueries();
    static userValidators: UserValidator = new UserValidator();
    static payload: Payload = new Payload();
    static mailer: Mailer = new Mailer();

    public async index(req: Request, res: Response) {
        let users = await UsersController.userQueries.index();

        if (!users.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Ocurrio un error al obtener los registros.'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            users: users.users,
        });
    }

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

        const tempPassword = PasswordGenerator.generate({
            length: 10,
            numbers: true
        });

        console.log(tempPassword);

        const data = {
            uuid: uuidv4(),
            role_id: body.role_id,
            name: body.name,
            lastname: body.lastname,
            email: body.email,
            password: bcrypt.hashSync(tempPassword, UsersController.salt),
            status: 1
        }

        const userCreated = await UsersController.userQueries.create(data)

        if (!userCreated.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: "Existen problemas al momento de dar de alta el registro. Intente más tarde"}]
            });
        }

        // TODO: Log de la creación de usuarios
        // TODO: Envio de correo electrónico al usuario nuevo

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

    public async status(req: Request, res: Response) {
        const status = req.body.status
        const errors = [];

        const userUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar el usuario.'}) : req.params.uuid

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const findedUser = await UsersController.userQueries.show({
            uuid: userUuid
        });

        if (!findedUser.ok) {
            errors.push({message: 'Existen problemas al registro solicitado'});
        } else if (!findedUser.user) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const updatedStatus = await UsersController.userQueries.status(findedUser.user.id, {status: status});

        if (!updatedStatus.ok) {
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
            message: 'El registro se actualizo correctamente.'
        });
    }

    public async delete(req: Request, res: Response) {
        const errors = [];

        const userUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar el usuario.'}) : req.params.uuid

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const findedUser = await UsersController.userQueries.show({
            uuid: userUuid
        });

        if (!findedUser.ok) {
            errors.push({message: 'Existen problemas al registro solicitado'});
        } else if (!findedUser.user) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const deletedUser = await UsersController.userQueries.delete(findedUser.user.id, {status: -1});

        if (!deletedUser.ok) {
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

    public async login(req: Request, res: Response) {
        const body = req.body
        const errors = [];

        // Validacion del request
        const validatedData = await UsersController.userValidators.validateLogin(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const userExists = await UsersController.userQueries.findClientByEmail(body.email);

        if (!userExists.ok || [0, -2].includes(userExists.user.status)) {
            errors.push({message: 'Existen problemas al momento de verificar si el usuario esta dado de alta.'});
        } else if (!userExists) {
            errors.push({message: 'El email proporcionado no se encuentra dado de alta en el sistema.'});
        } else if (!userExists && !bcrypt.compareSync(body.password, userExists.user.password)) {
            errors.push({message: 'Las credenciales no coinciden. Intentalo nuevamente.'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const data = {
            user_type: 'user',
            user_id: userExists.user ? userExists.user.id.toString() : false,
            role_id: userExists.user ? userExists.user.role_id.toString() : false
        }

        /* Creamos el JWT del cliente */
        const JWTCreated = await UsersController.payload.createToken(data);

        if (JWTCreated && !JWTCreated.ok) {
            errors.push({message: 'Existen problemas al momento de crear el token de autenticación.'})
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            token: JWTCreated ? JWTCreated.token : false
        });
    }
}