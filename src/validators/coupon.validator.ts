import validator from 'validator';

export class CouponValidator {
    public async validateStore(body: any) {
        // Contenedor de errores
        const errors = []

        try {
            const coupon: number = !body.coupon || validator.isEmpty(body.coupon) ?
                errors.push({message: 'El cupón es obligatorio'}) : body.coupon;

            const quantity: number = !body.quantity || validator.isEmpty(body.quantity) ?
                errors.push({message: 'La cantidad de cupones es obligatorio'}) : body.quantity;

            const discount_percent: string = !body.discount_percent || validator.isEmpty(body.discount_percent) ?
                errors.push({message: 'El porcentaje de descuento es obligatorio'}) : body.discount_percent;

            const expiration: string = !body.expiration || validator.isEmpty(body.expiration) ?
                errors.push({message: 'La fecha de expiración es obligatoria'}) : body.expiration;


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
            const coupon: number = !body.coupon || validator.isEmpty(body.coupon) ?
                errors.push({message: 'El cupón es obligatorio'}) : body.coupon;

            const quantity: number = !body.quantity || validator.isEmpty(body.quantity) ?
                errors.push({message: 'La cantidad de cupones es obligatorio'}) : body.quantity;

            const discount_percent: string = !body.discount_percent || validator.isEmpty(body.discount_percent) ?
                errors.push({message: 'El porcentaje de descuento es obligatorio'}) : body.discount_percent;

            const expiration: string = !body.expiration || validator.isEmpty(body.expiration) ?
                errors.push({message: 'La fecha de expiración es obligatoria'}) : body.expiration;


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