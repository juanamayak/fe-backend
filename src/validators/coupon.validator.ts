import validator from 'validator';

export class CouponValidator {
    public async validateStore(body: any) {
        // Contenedor de errores
        const errors = []

        try {
            const discount_type_id: number = !body.country_id || validator.isEmpty(body.country_id) ?
                errors.push({message: 'El país es obligatorio'}) : body.country_id;

            const coupon: number = !body.state_id || validator.isEmpty(body.state_id) ?
                errors.push({message: 'El estado es obligatorio'}) : body.state_id;

            const quantity: number = !body.city_id || validator.isEmpty(body.city_id) ?
                errors.push({message: 'La ciudad es obligatoria'}) : body.city_id;

            const discount_amount: string = !body.name || validator.isEmpty(body.name) ?
                errors.push({message: 'El nombre es obligatorio'}) : body.name;


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
            let discount_type_id: number = !body.country_id || validator.isEmpty(body.country_id) ?
                errors.push({message: 'El país es obligatorio'}) : body.country_id;

            let coupon: number = !body.state_id || validator.isEmpty(body.state_id) ?
                errors.push({message: 'El estado es obligatorio'}) : body.state_id;

            let quantity: number = !body.city_id || validator.isEmpty(body.city_id) ?
                errors.push({message: 'La ciudad es obligatoria'}) : body.city_id;

            let discount_amount: string = !body.name || validator.isEmpty(body.name) ?
                errors.push({message: 'El nombre es obligatorio'}) : body.name;

            const status: number = !body.status || validator.isEmpty(body.status) ?
                errors.push({message: 'El estatus es obligatorio.'}) : body.status;


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