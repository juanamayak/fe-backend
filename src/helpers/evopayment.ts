/** Library to do connections to others web services */
import { Axios } from './axios'

export class EvoPayment {
    /** Incoporamos librería para hacer peticiones a clientes */
    static Axios: Axios = new Axios()

    /** Funciónn que nos permite autentificarnos con EVO PAYMENTS */
    public async authenticate() {
        /** Creamos un objeto con los datos de autentiucación */
        let credentials = { 'user': process.env.EVO_USER, 'pass': process.env.EVO_PASS }
        /** Proporcionamos esos datos y hacemos la solicitud al cliente */
        let options = {
            method: 'POST',
            url: process.env.EVO_URL + 'access',
            headers: {
                'Content-Type': 'application/json'
            },
            data: credentials
        }

        let response = await EvoPayment.Axios.getResponse(options)

        if (response['ok'] == true) {
            return { ok: true, token: response.result.information }
        } else {
            return { ok: false, message: response.result }
        }
    }

    /** Función para realizar una transacción bancaria () */
    public async transaction(data) {
        /** Para poder hace una solicitud debemos proporcionar la siguiente arquitectura */
        let information = {
            'order': {
                'firstName': data.firstName,
                'lastName': data.lastName,
                'reference': data.reference,
                'amount': data.amount,
                'currency': data.currency,
                'detail': data.detail,
                'email': data.email
            },
            'userPlatform': data.userPlatform,
            'redirectUrl': process.env.EVO_REDIRECT_URL,
            'confirmationUrl': process.env.EVO_CONFIRMATION_URL
        }

        /** Proporcionamos esos datos y hacemos la solicitud al cliente */
        let options = {
            method: 'POST',
            url: process.env.EVO_URL + 'generate',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': data.token
            },
            data: information
        }

        /** Wait a response to Axios and validate the response */
        let response = await EvoPayment.Axios.getResponse(options)

        if (response['ok'] == true) {
            return { ok: true, link: response.result.information }
        } else {
            return { ok: false, message: response.result }
        }
    }
    /** Nos ayuda a procesar el link de pago en dado caso de procesar el pago
     * dentro de nuestra aplicación
     */
    public async processLink(data) {
        let information = {
            'transactionKey': data.transaction_key
        }
        let options = {
            method: 'POST',
            url: process.env.EVO_URL + 'transaction/process-link',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': data.token
            },
            data: information
        }

        /** Wait a response to Axios and validate the response */
        let response = await EvoPayment.Axios.getResponse(options)

        if (response['ok'] == true) {
            return { ok: true, process: response.result.information }
        } else {
            return { ok: false, message: response.result }
        }
    }
    /** Nos ayuda a inscribir la tarjeta al proceso del 3D'S */
    public async check3ds(data) {

        let information = {
            'transactionKey': data.transaction_key,
            'cc': data.cc,
            'cc_m': data.fexpm,
            'cc_y': data.fexpy,
            'cc_sc': data.cvv,
            'bypass': true
        }
        let options = {
            method: 'POST',
            url: process.env.EVO_URL + 'transaction/check3ds',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': data.token
            },
            data: information
        }
        /** Wait a response to Axios and validate the response */
        let response = await EvoPayment.Axios.getResponse(options)

        if (response['ok'] == true) {
            return { ok: true, result: response.result.information }
        } else {
            return { ok: false, message: response.result }
        }
    }

    /** Esta función procesa la información devuelta por el proveedor EVO PAYMENT (buscamos si existe 
     * un error de validación o del 3DS).
     *  Dicho cliente debe devolver cualquiera de estas respuestas:
     *  3DS o Validation se interpreta como un error al procesar el pago.
     *  3DS: Hubo un problema al pasar por el proceso 3D.
     *  Validación: la tarjeta proporcionada tiene datos incorrectos.
     */
    public async getEvoResponse(data, order) {
        if (data.ok == false) {
            return {
                type: data.information.type,
                acquirerCode: data.information.acquierCode,
                message: data.information.message,
                orderStatus: data.information.orderStatus,
                order,
                status: '-1'
            }
        } else {
            return {
                type: data.information.type,
                order: data.information.order,
                amount: data.information.amount,
                currency: data.information.currency,
                orderSystemId: data.information.orderSystemId,
                orderStatus: data.information.orderStatus,
                totalAuthorized: data.information.totalAuthorized,
                acquirerCode: data.information.acquierCode,
                message: data.information.message,
                brand: data.information.brand,
                issuer: data.information.issuer,
                card: data.information.card,
                merchant: data.information.merchant,
                merchantId: data.information.merchantId,
                authorizationCode: data.information.authorizationCode,
                transactionid: data.information.transactionid,
                receipt: data.information.receipt,
                terminal: data.information.terminal,
                status: data.information.status,
            }
        }
    }
}