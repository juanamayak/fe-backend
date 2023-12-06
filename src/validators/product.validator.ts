import validator from 'validator';

export class ProductValidator {
    public async validateStore(body: any) {
        // Contenedor de errores
        const errors = []

        try {
            let name: string = !body.name || validator.isEmpty(body.name) ?
                errors.push({message: 'El nombre del producto es obligatorio'}) : body.name;

            let price: string = !body.price || validator.isEmpty(body.price) ?
                errors.push({message: 'El precio del producto es obligatorio'}) : body.price;

            let discount_amount: string = !body.discount_amount || validator.isEmpty(body.discount_amount) ?
                errors.push({message: 'El monto de descuento es obligatorio'}) : body.discount_amount;


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