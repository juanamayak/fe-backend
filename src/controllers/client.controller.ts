import validator from 'validator';
import * as bcrypt from 'bcrypt';
import {Request, Response} from 'express'
import {JsonResponse} from '../enums/json-response';
import {v4 as uuidv4} from 'uuid';
import moment from "moment";

export class ClientController {

    public async store(req: Request, res: Response) {
        let body = req.body;

        let errors = [];

        let country_id: number = !body.country_id || validator.isEmpty(body.country_id) ?
            errors.push({message: 'El país es obligatorio'}) : body.country_id;

        let state_id: number = !body.state_id || validator.isEmpty(body.state_id) ?
            errors.push({message: 'El estado es obligatorio'}) : body.state_id;

        let city_id: number = !body.city_id || validator.isEmpty(body.city_id) ?
            errors.push({message: 'La ciudad es obligatoria'}) : body.city_id;

        let name: string = !body.name || validator.isEmpty(body.name) ?
            errors.push({message: 'El nombre es obligatorio'}) : body.name;

        let lastname: string = !body.lastname || validator.isEmpty(body.lastname) ?
            errors.push({message: 'El apellido es obligatorio'}) : body.lastname;

        let email: string = !body.email || validator.isEmpty(body.email) ?
            errors.push({ message: 'El correo electrónico es obligatorio' }) : body.email;

        const password: string = body.password == null || validator.isEmpty(body.password) === true ?
            errors.push({ message: 'Favor de proporcionar su contraseña.' }) : body.password;

        const confirm_password: string = !body.confirm_password || validator.isEmpty(body.confirm_password) ?
            errors.push({ message: 'Favor de confirmar su contraseña.' }) : body.confirm_password;

        const birthday: string = !body.confirm_password || validator.isEmpty(body.confirm_password) ?
            errors.push({ message: 'Favor de confirmar su contraseña.' }) : body.confirm_password;

        const regex = new RegExp('^[A-Za-zÀ-ú _]*[A-Za-zÀ-ú][A-Za-zÀ-ú _]*$');

        if (errors.length > 0) {
            return res.status(400).json({
                ok: false,
                errors
            });
        }

        if (validator.isEmail(email) === false) {
            errors.push({ message: 'Favor de respetar la nomenclatura del email.' });
        }


        if (errors.length > 0) {
            return res.status(400).json({
                ok: false,
                errors
            });
        }

        const findContribuyenteByEmail = await ContribuyenteController.contribuyenteQueries.findContribuyenteByEmail({ email })

        if (findContribuyenteByEmail.ok === false) {
            errors.push({ message: 'Existen problemas al momento de verificar si el contribuyente esta dado de alta.' })
        } else if (findContribuyenteByEmail.contribuyente != null) {
            errors.push({ message: 'El email proporcionado ya se encuentra dado de alta en el sistema.' })
        }

        if (errors.length > 0) {
            return res.status(400).json({
                ok: false,
                errors
            })
        }

        const createContribuyente = await ContribuyenteController.contribuyenteQueries.create({
            uuid: uuidv4(),
            nombre,
            apellidos,
            email,
            password: bcrypt.hashSync(password, ContribuyenteController.salt),
            telefono: countryCode + telefono,
            rfc,
            genero,
            edad,
            fecha_alta: moment().format('YYYY-MM-DD HH:mm:ss'),
            codigo_activacion,
            activo: 0,
        })

        if (createContribuyente.ok === false) {
            errors.push({ message: 'Existen problemas al momento de dar de alta su cuenta, intente más tarde' })
        }

        if (errors.length > 0) {
            return res.status(400).json({
                ok: false,
                errors
            })
        }

        const smsMessage = 'Ayuntamiento de Solidaridad. Ingresa al siguiente link para activar tu cuenta: '+ process.env.PLATAFORMA_WEB + 'activar/' + codigo_activacion

        const sendSMS = await ContribuyenteController.smsTwilio.sendSMS(countryCode + telefono, smsMessage);

        /* const options = {
            data: {
                'email': email,
                'code': createContribuyente.contribuyente ? createContribuyente.contribuyente.codigoActivacion : false
            },
            url: 'http://144.126.219.159/delivery/api/mail/activation',
            method: 'POST'
        }

        const sendEmail = await ContribuyenteController.axios.getResponse(options) */

        const createLogContribuyente = await ContribuyenteController.log.contribuyente({
            contribuyente_id: createContribuyente.contribuyente ? createContribuyente.contribuyente.id : false,
            navegador: req.headers['user-agent'],
            accion: 'El contribuyente se ha dado de alta en el sistema',
            ip: req.socket.remoteAddress,
            fecha_alta: moment().format('YYYY-MM-DD HH:mm:ss')
        })

        return res.status(200).json({
            ok: true,
            codigo_activacion,
            message: 'Su cuenta ha sido creada exitosamente, en la brevedad recibirá un mensaje de texto para terminar el proceso de activación, gracias.'
        })
    }

    /*public async login(req: Request, res: Response) {
        /!* Get data from client *!/
        let body = req.body
        /!** Array than container the errors *!/
        let errors = []

        let email: string = !body.email || validator.isEmpty(body.email) ?
            errors.push({ message: 'El correo electrónico es obligatorio' }) : body.email

        let password: string = body.password == null || validator.isEmpty(body.password) == true ?
            errors.push({ message: 'Please provide your password.' }) : body.password

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            })
        }

        if (!validator.isEmail(email)) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: 'Please respect the e-mail nomenclature.' }]
            })
        }

        let findUser = await SessionController.userQueries.findUser({ email })

        if (findUser.ok == false) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: 'Action not available, please try again later.' }]
            })
        } else if (findUser.user == null) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: 'The provided user does not exist.' }]
            })
        } else if (findUser.user.active == 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: 'The provided user is not active.' }]
            })
        }

        let developerInfo = {
            id: findUser.user['Developer']['id'],
            code: findUser.user['Developer']['code'],
            name: findUser.user['Developer']['name'],
            state: findUser.user['Developer']['state'],
            city: findUser.user['Developer']['city'],
            zip: findUser.user['Developer']['zip']
        }

        let corporationInfo = {
            code: findUser.user['Developer']['Corporation']['code'],
            name: findUser.user['Developer']['Corporation']['name']
        }

        /!** Check if the password is the same than password db *!/
        let samePassword = bcrypt.compareSync(password, findUser.user.password)

        /!* Validate if the password is correct *!/
        if (samePassword == false) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: 'The provided password does not match.' }]
            })
        }

        let getPermissions = await SessionController.userQueries.getPermissions({ role: findUser.user.role })

        if (getPermissions.ok == false) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: 'Action not available, please try again later.' }]
            })
        }

        if (findUser.user.role == 1) {
            let createSelectedRoom = await SessionController.selectedRoomQueries.create({
                developer_id: findUser.user.developer_id,
                user_id: findUser.user.id,
            })
        }else if(findUser.user.role == 2){
            let getCorporations = await SessionController.corporationsQueries.getCorporations()
            corporations = getCorporations.corporations
        }

        /!** Create the token with thye payload settled down *!/
        let createToken = await SessionController.payload.create({
            user_id: findUser.user.id,
            role: findUser.user.role,
            demo: findUser.user.is_demo,
            developer: findUser.user.developer_id,
            corporation: findUser.user['Developer']['Corporation']['id']
        })

        if (createToken.ok == false) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: 'Failed to create authentication token, please try again later.' }]
            })
        }

        let createLogUser = await SessionController.logs.user({
            user_id: findUser.user.id,
            browser: req.headers['user-agent'],
            action: 'El usuario ha iniciado sesión en el sistema',
            ip: req.socket.remoteAddress
        })

        return res.status(JsonResponse.OK).json({
            ok: true,
            token: createToken.token,
            message: 'Welcome: ' + findUser.user.name,
            permissions: getPermissions.permissions,
            developer: developerInfo,
            corporative: corporationInfo,
            corporations,
            role: (findUser.user.role == 1) ? 'agent' : 'admin',
            user_id: findUser.user.id,
        })
    }*/
}