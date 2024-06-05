import validator from 'validator';

export class CartValidator {
    public async validateStore(body: any) {
        // Contenedor de errores
        const errors = []

        try {
            let product_id: string = !body.product_id ?
                errors.push({message: 'El producto es obligatorio'}) : body.product_id;

            let quantity: string = !body.quantity ?
                errors.push({message: 'La cantidad de productos es obligatorio'}) : body.quantity;


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
            let name: string = !body.name || validator.isEmpty(body.name) ?
                errors.push({message: 'El nombre es obligatorio'}) : body.name;

            let lastname: string = !body.lastname || validator.isEmpty(body.lastname) ?
                errors.push({message: 'El apellido es obligatorio'}) : body.lastname;

            let email: string = !body.email || validator.isEmpty(body.email) ?
                errors.push({message: 'El correo electrónico es obligatorio'}) : body.email;

            let birthday: string = !body.birthday || validator.isEmpty(body.birthday) ?
                errors.push({message: 'La fecha de nacimiento es obligatoria'}) : body.birthday;

            let cellphone: string = !body.cellphone || validator.isEmpty(body.cellphone) ?
                errors.push({message: 'El número celular es obligatorio'}) : body.cellphone;

            const regex = new RegExp('^[A-Za-zÀ-ú _]*[A-Za-zÀ-ú][A-Za-zÀ-ú _]*$');

            if (validator.isEmail(email) === false) {
                errors.push({message: 'Favor de respetar la nomenclatura del correo electrónico'})
            }

            if (!regex.test(name)) {
                errors.push({message: 'Favor proporcionar unicamente letras en el campo nombre(s)'})
            }

            if (!regex.test(lastname)) {
                errors.push({message: 'Favor de proporcionar unicamente letras en el campo apellidos(s)'})
            }

            if (!validator.isNumeric(cellphone)) {
                errors.push({message: 'Favor de solo proporcionar números para el campo de teléfono'})
            }

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