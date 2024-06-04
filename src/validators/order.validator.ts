import validator from 'validator';

export class OrderValidator {
    public async validateCreate(body: any) {
        // Contenedor de errores
        const errors = []

        try {
            const delivery_date: number = !body.delivery_date || validator.isEmpty(body.delivery_date) ?
                errors.push({message: 'La fecha de envio es obligatorio'}) : body.delivery_date;

            const delivery_hour_id: number = !body.delivery_hour_id ?
                errors.push({message: 'La hora de entrega es obligatoria'}) : body.delivery_hour_id;

            const subtotal: string = !body.subtotal ?
                errors.push({message: 'El subtotal es obligatorio'}) : body.phone_receiver;

            const delivery_price: string = !body.delivery_price ?
                errors.push({message: 'El costo de envio es obligatorio'}) : body.delivery_price;

            const total: string = !body.total ?
                errors.push({message: 'El total de la orden es obligatorio'}) : body.total;

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
            const address_id: number = !body.address_id ?
                errors.push({message: 'El país es obligatorio'}) : body.address_id;

            const message: string = !body.message || validator.isEmpty(body.message) ?
                errors.push({message: 'El mensaje es obligatorio'}) : body.message;

            const sign: string = !body.sign || validator.isEmpty(body.sign) ?
                errors.push({message: 'La firma es obligatoria'}) : body.sign;

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