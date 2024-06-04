import validator from 'validator';

export class PaymentValidator {
    public async validateStore(body: any) {
        // Contenedor de errores
        const errors = []

        try {
            const order_id: number = !body.order_id ?
                errors.push({message: 'La orden es obligatoria'}) : body.order_id;

            const transaction: string = !body.transaction || validator.isEmpty(body.transaction) ?
                errors.push({message: 'El número de transacción es obligatorio'}) : body.transaction;

            const payment_date: string = !body.payment_date || validator.isEmpty(body.payment_date) ?
                errors.push({message: 'La fecha de pago es obligatoria'}) : body.payment_date;

            const payment_method: string = !body.payment_method || validator.isEmpty(body.payment_method) ?
                errors.push({message: 'El método de pago es obligatorio'}) : body.payment_method;

            const payment_status: string = !body.payment_status || validator.isEmpty(body.payment_status) ?
                errors.push({message: 'El estado de pago es obligatorio'}) : body.payment_status;

            const currency: string = !body.currency || validator.isEmpty(body.currency) ?
                errors.push({message: 'La moneda de pago es obligatorio'}) : body.currency;

            const payer_name: number = !body.payer_name || validator.isEmpty(body.payer_name) ?
                errors.push({message: 'El nombre del cliente es obligatorio'}) : body.payer_name;

            const payer_email: number = !body.payer_email || validator.isEmpty(body.payer_email) ?
                errors.push({message: 'El email del cliente es obligatorio'}) : body.payer_email;

            if (errors.length > 0) {
                return {
                    ok: false,
                    errors
                }
            }

            return {
                ok: true
            }
        } catch (e) {
            console.log(e)
            errors.push({message: 'Error al validar los datos proporcionados'})
            return {
                ok: false,
                errors
            }
        }
    }

    public async validateUpdate(body: any) {
        // Contenedor de errores
        const errors = []

        try {
            const country_id: number = !body.country_id ?
                errors.push({message: 'El país es obligatorio'}) : body.country_id;

            const state_id: number = !body.state_id ?
                errors.push({message: 'El estado es obligatorio'}) : body.state_id;

            const city_id: number = !body.city_id ?
                errors.push({message: 'La ciudad es obligatoria'}) : body.city_id;

            const name_receiver: string = !body.name_receiver || validator.isEmpty(body.name_receiver) ?
                errors.push({message: 'El nombre del destinatario es obligatorio'}) : body.name_receiver;

            const phone_receiver: string = !body.phone_receiver || validator.isEmpty(body.phone_receiver) ?
                errors.push({message: 'El número del destinatario es obligatorio'}) : body.phone_receiver;

            const address: string = !body.address || validator.isEmpty(body.address) ?
                errors.push({message: 'La dirección de entrega es oblitaria'}) : body.address;

            const colony: string = !body.colony || validator.isEmpty(body.colony) ?
                errors.push({message: 'La colonia de la dirección es oblitaria'}) : body.colony;

            const references: string = !body.references || validator.isEmpty(body.references) ?
                errors.push({message: 'La referencia es obligatoria'}) : body.references;

            /*const latitude: string = !body.latitude || validator.isEmpty(body.latitude) ?
                errors.push({message: 'La posición en el mapa es obligatorio'}) : body.latitude;

            const longitude: string = !body.longitude || validator.isEmpty(body.longitude) ?
                errors.push({message: 'La posición en el mapa es obligatorio'}) : body.longitude;*/

            const zip: number = !body.zip || validator.isEmpty(body.zip) ?
                errors.push({message: 'El código postal es obligatorio'}) : body.zip;

            if (errors.length > 0) {
                return {
                    ok: false,
                    errors
                }
            }

            return {
                ok: true
            }
        } catch (e) {
            console.log(e)
            errors.push({message: 'Error al validar los datos proporcionados'})
            return {
                ok: false,
                errors
            }
        }
    }
}