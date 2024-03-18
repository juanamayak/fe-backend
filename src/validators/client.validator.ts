import validator from 'validator';

export class ClientValidator {
    public async validateStore(body: any) {
        // Contenedor de errores
        const errors = []

        try {
            let name: string = !body.name || validator.isEmpty(body.name) ?
                errors.push({message: 'El nombre es obligatorio'}) : body.name;

            let lastname: string = !body.lastname || validator.isEmpty(body.lastname) ?
                errors.push({message: 'El apellido es obligatorio'}) : body.lastname;

            let email: string = !body.email || validator.isEmpty(body.email) ?
                errors.push({message: 'El correo electrónico es obligatorio'}) : body.email;

            let password: string = body.password == null || validator.isEmpty(body.password) === true ?
                errors.push({message: 'La contraseña es obligatoria'}) : body.password;

            let confirm_password: string = !body.confirm_password || validator.isEmpty(body.confirm_password) ?
                errors.push({message: 'Favor de confirmar su contraseña'}) : body.confirm_password;

            let newsletter: number = body.newsletter;

            let cellphone: string = !body.cellphone || validator.isEmpty(body.cellphone) ?
                errors.push({message: 'El número celular es obligatorio'}) : body.cellphone;

            let terms_and_conditions: number = !body.terms_and_conditions ?
                errors.push({message: 'Es necesario aceptar los terminos y condiciones'}) : body.terms_and_conditions;

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

            if (password !== confirm_password) {
                errors.push({message: 'La contraseñas proporcionadas no coinciden'})
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

    public async validateLogin(body: any) {
        const errors = []

        try {
            const email: string = body.email == null || validator.isEmpty(body.email) ?
                errors.push({message: 'El correo electrónico es obligatorio'}) : body.email;

            const password: string = body.password == null || validator.isEmpty(body.password) ?
                errors.push({message: 'La contraseña es obligatoria'}) : body.password;

            if (!validator.isEmail(email)) {
                errors.push({message: 'Favor de respetar la nomenclatura del email.'})
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