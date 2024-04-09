import validator from 'validator';

export class ProductValidator {
    public async validateStore(body: any) {
        // Contenedor de errores
        const errors = []

        try {
            const category_id: number = !body.category_id ?
                errors.push({message: 'La categoría es obligatoria.'}) : body.category_id;

            let name: string = !body.name || validator.isEmpty(body.name) ?
                errors.push({message: 'El nombre del producto es obligatorio'}) : body.name;

            let price: string = !body.price ?
                errors.push({message: 'El precio del producto es obligatorio'}) : body.price;

            let providers: string = !body.providers || body.providers.length === 0 ?
                errors.push({message: 'El proveedor es obligatorio'}) : body.providers;

            let subcategories: string = !body.subcategories || body.subcategories.length === 0 ?
                errors.push({message: 'Selecciona una o más subcategorias'}) : body.subcategories;


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
            const category_id: number = !body.category_id ?
                errors.push({message: 'La categoría es obligatoria.'}) : body.category_id;

            let name: string = !body.name || validator.isEmpty(body.name) ?
                errors.push({message: 'El nombre del producto es obligatorio'}) : body.name;

            let price: string = !body.price ?
                errors.push({message: 'El precio del producto es obligatorio'}) : body.price;

            let providers: string = !body.providers || body.providers.length === 0 ?
                errors.push({message: 'El proveedor es obligatorio'}) : body.providers;

            let subcategories: string = !body.subcategories || body.subcategories.length === 0 ?
                errors.push({message: 'Selecciona una o más subcategorias'}) : body.subcategories;

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