import validator from 'validator';

export class UserValidator {
    public async validateStore(body: any) {
        // Contenedor de errores
        const errors = []

        try {
            const regex = new RegExp('^[A-Za-zÀ-ú _]*[A-Za-zÀ-ú][A-Za-zÀ-ú _]*$');

            const role_id: number = !body.role_id || validator.isEmpty(body.role_id) ?
                errors.push({message: 'El rol es obligatorio'}) : body.role_id;

            const name: string = !body.name || validator.isEmpty(body.name) ?
                errors.push({message: 'El nombre es obligatorio'}) : body.name;

            const lastname: string = !body.lastname || validator.isEmpty(body.lastname) ?
                errors.push({message: 'El apellido es obligatoria'}) : body.lastname;

            const email: string = !body.email || validator.isEmpty(body.email) ?
                errors.push({message: 'El email es obligatorio'}) : body.email;


            if (!validator.isEmail(email)) {
                errors.push({message: 'Favor de respetar la nomenclatura del correo electrónico'})
            }

            if (!regex.test(name)) {
                errors.push({message: 'Favor proporcionar unicamente letras en el campo nombre(s)'})
            }

            if (!regex.test(lastname)) {
                errors.push({message: 'Favor de proporcionar unicamente letras en el campo apellidos(s)'})
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

    public async validateUpdate(body: any) {
        // Contenedor de errores
        const errors = []

        try {
            const regex = new RegExp('^[A-Za-zÀ-ú _]*[A-Za-zÀ-ú][A-Za-zÀ-ú _]*$');

            const role_id: number = !body.role_id || validator.isEmpty(body.role_id) ?
                errors.push({message: 'El rol es obligatorio'}) : body.role_id;

            const name: string = !body.name || validator.isEmpty(body.name) ?
                errors.push({message: 'El nombre es obligatorio'}) : body.name;

            const lastname: string = !body.lastname || validator.isEmpty(body.lastname) ?
                errors.push({message: 'El apellido es obligatoria'}) : body.lastname;

            const email: string = !body.email || validator.isEmpty(body.email) ?
                errors.push({message: 'El email es obligatorio'}) : body.email;

            const status: number = !body.status || validator.isEmpty(body.status) ?
                errors.push({message: 'El estatus es obligatorio.'}) : body.status;

            if (!validator.isEmail(email)) {
                errors.push({message: 'Favor de respetar la nomenclatura del correo electrónico'})
            }

            if (!regex.test(name)) {
                errors.push({message: 'Favor proporcionar unicamente letras en el campo nombre(s)'})
            }

            if (!regex.test(lastname)) {
                errors.push({message: 'Favor de proporcionar unicamente letras en el campo apellidos(s)'})
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