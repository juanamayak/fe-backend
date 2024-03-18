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

export class ClientController {
    static salt = bcrypt.genSaltSync(Number(process.env.NO_SALT));
    static clientQueries: ClientQueries = new ClientQueries();
    static clientValidator: ClientValidator = new ClientValidator();
    static payload: Payload = new Payload();
    static mailer: Mailer = new Mailer()

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
            terms_and_conditions: body.terms_and_conditions,
            status: 1
        }

        const clientCreated = await ClientController.clientQueries.create(data)

        if (!clientCreated.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: "Existen problemas al momento de dar de alta su cuenta. Intente más tarde."}]
            });
        }

        const sendEmail = await ClientController.mailer.send({
            email: body.email,
            subject: 'Alta de cuenta',
            template: 'activation',
        });

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'Su cuenta se ha creado de forma exitosa.'
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
            errors.push({message: 'Existen problemas al momento de verificar si el usuario esta dado de alta.'});
        } else if (!clientExists) {
            errors.push({message: 'El email proporcionado no se encuentra dado de alta en el sistema.'});
        } else if (!clientExists && !bcrypt.compareSync(body.password, clientExists.client.password)) {
            errors.push({message: 'Las credenciales no coinciden. Intentalo nuevamente.'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }


        const data = {
            user_type: 'client',
            user_id: clientExists.client ? clientExists.client.id.toString() : false
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
            token: JWTCreated ? JWTCreated.token : false
        });
    }
}