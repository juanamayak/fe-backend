import {Request, Response} from 'express'
import validator from 'validator';
import * as bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import moment from "moment";
import {JsonResponse} from '../enums/json-response';
import {ClientValidator} from "../validators/client.validator";
import {ClientQueries} from "../queries/client.queries";
import {Payload} from "../helpers/payload";
import {Mailer} from "../helpers/mailer";
import {UsersController} from "./users.controller";

export class ClientController {
    static salt = bcrypt.genSaltSync(Number(process.env.NO_SALT));
    static clientQueries: ClientQueries = new ClientQueries();
    static clientValidator: ClientValidator = new ClientValidator();
    static payload: Payload = new Payload();
    static mailer: Mailer = new Mailer();

    public async show(req: Request, res: Response) {
        const errors = [];

        const userUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar el usuario'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const client = await ClientController.clientQueries.show({
            uuid: userUuid
        });


        if (!client.ok) {
            errors.push({message: 'Existen problemas al buscar el registro solicitado'});
        } else if (!client.client) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            client: client.client
        });
    }

    public async index(req: Request, res: Response) {
        let clients = await ClientController.clientQueries.index()

        if (!clients.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Algo salio mal a la hora de traer los productos.'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            clients: clients.clients,
        })
    }

    public async store(req: Request, res: Response) {
        const body = req.body;

        // Validacion del request
        const validatedData = await ClientController.clientValidator.validateStore(body)

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const data = {
            uuid: uuidv4(),
            name: body.name,
            lastname: body.lastname,
            email: body.email,
            password: bcrypt.hashSync(body.password, ClientController.salt),
            cellphone: body.cellphone,
            terms_and_conditions: body.terms_and_conditions ? '1' : '0',
            verification_code: moment().unix(),
            status: 0
        }

        const clientCreated = await ClientController.clientQueries.create(data)

        if (!clientCreated.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: "Existen problemas al momento de dar de alta su cuenta. Intente más tarde."}]
            });
        }

        let configuration = {
            subject: 'Activación de cuenta FloreriaEnvios.com',
            email: body.email,
            template: 'activation',
            uuid: clientCreated.data.uuid,
            code: clientCreated.data.verification_code
        }

        const sendEmail = await ClientController.mailer.send(configuration);

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'Su cuenta se ha creado de forma exitosa.'
        });
    }

    public async update(req: Request, res: Response) {
        const body = req.body;
        console.log(body);
        const errors = [];

        const clientUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar el usuario'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        // Validacion del request
        const validatedData = await ClientController.clientValidator.validateUpdate(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const client = await ClientController.clientQueries.show({
            uuid: clientUuid
        });

        if (!client.ok) {
            errors.push({message: 'Existen problemas al buscar el registro solicitado'});
        } else if (!client.client) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const updatedClient = await ClientController.clientQueries.update(client.client.id, body);

        if (!updatedClient.client) {
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
            message: 'Tu información se actualizo correctamente'
        });
    }

    public async addressUpdate(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const clientUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar el usuario'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        // Validacion del request
        const validatedData = await ClientController.clientValidator.validateUpdateAddress(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const client = await ClientController.clientQueries.show({
            uuid: clientUuid
        });

        if (!client.ok) {
            errors.push({message: 'Existen problemas al buscar el registro solicitado'});
        } else if (!client.client) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const updatedClient = await ClientController.clientQueries.update(client.client.id, body);

        if (!updatedClient.client) {
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
            message: 'Tu información se actualizo correctamente'
        });
    }

    public async login(req: Request, res: Response) {
        const body = req.body
        const errors = [];

        // Validacion del request
        const validatedData = await ClientController.clientValidator.validateLogin(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const clientExists = await ClientController.clientQueries.findClientByEmail(body.email);

        if (!clientExists.ok) {
            errors.push({message: 'Se encontraron algunos errores al iniciar la sesión. Por favor, inténtalo de nuevo más tarde o contacta con soporte si el problema persiste.'});
        } else if (!clientExists.data) {
            errors.push({message: 'Error al verificar la existencia del usuario.'});
        } else if (!bcrypt.compareSync(body.password, clientExists.data.password)) {
            errors.push({message: 'Email o contraseña incorrectos.'});
        } else if ([0, -2].includes(clientExists.data.status)) {
            errors.push({message: 'Su cuenta aún no ha sido verificada o ha sido dada de baja.'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }


        const data = {
            user_type: 'client',
            client_id: clientExists.data ? clientExists.data.id.toString() : false
        }

        /* Creamos el JWT del cliente */
        const JWTCreated = await ClientController.payload.createToken(data);

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
            token: JWTCreated ? JWTCreated.token : false,
            uuid: clientExists.data.uuid
        });
    }

    public async verify(req: Request, res: Response){
        const body = req.body;
        const errors = [];

        const clientUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'El usuario es obligatorio.'}) : req.params.uuid;

        const verificationCode = !req.params.code || validator.isEmpty(req.params.code) ?
            errors.push({message: 'El código de verificación es obligatorio.'}) : req.params.code;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const client = await ClientController.clientQueries.show({
            uuid: clientUuid
        });

        if (!client.ok) {
            errors.push({message: 'Existen problemas al buscar el registro solicitado'});
        } else if (!client.client) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        if (verificationCode !== client.client.verification_code) {
            errors.push({message: 'El código de verficación es incorrecto'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const data = {
            account_verified: '1',
            status: 1
        }

        const verifiedAccount = await ClientController.clientQueries.update(client.client.id, data);

        if (!verifiedAccount.client) {
            errors.push({message: 'Se encontro un problema a la hora de activar la cuenta. Intente de nuevamente'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'El usuario se verifico y activo correctamente'
        });
    }

    public async recoveryPassword(req: Request, res: Response) {
        // Variables de la funcion
        const body = req.body
        const restoreCode = moment().unix()
        // Contenedor de errores
        const errors = [];

        // Validacion del request
        const validatedData = await ClientController.clientValidator.validateRestoreRequest(body)

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            })
        }

        const client = await ClientController.clientQueries.findClientByEmail(body.email)

        if (!client.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: { message: 'Existen problemas al momento de verificar si el usuario esta dado de alta.' }
            })
        } else if (client.data === null) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: {message: 'El email proporcionado no esta dado de alta en el sistema.'}
            })
        }

        const restoreRequest = await ClientController.clientQueries.restoreRequest({
            restore_password_code: restoreCode,
            client_id: client.data ? client.data.id : false
        });

        if (!restoreRequest.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: { message: 'Existen problemas al momento de realizar la solicitud de restauración de contraseña.' }
            })
        }

        const configuration = {
            subject: 'Restablecer mi contraseña FloreriaEnvios.com',
            email: body.email,
            template: 'reset',
            code: restoreCode
        }

        const sendEmail = await ClientController.mailer.send(configuration);

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'Se ha enviado los pasos a seguir para restablecer su contraseña al correo proporcionado'
        })
    }
}