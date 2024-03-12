import validator from 'validator';

export class ProductValidator {
    public async validateStore(body: any) {
        // Contenedor de errores
        const errors = []

        try {
            const category_id: number = !body.category_id || validator.isEmpty(body.category_id) ?
                errors.push({message: 'La categoría es obligatoria.'}) : body.category_id;

            const subcategory_id: number = !body.subcategory_id || validator.isEmpty(body.subcategory_id) ?
                errors.push({message: 'La subcategoria es obligatoria'}) : body.subcategory_id;

            const provider_id: number = !body.provider_id || validator.isEmpty(body.provider_id) ?
                errors.push({message: 'El proveedor es obligatorio'}) : body.provider_id;

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