import validator from 'validator';

export class CategoryValidator {
    public async validateStore(body: any) {
        // Contenedor de errores
        const errors = []

        try {
            const regex = new RegExp('^[A-Za-zÀ-ú _]*[A-Za-zÀ-ú][A-Za-zÀ-ú _]*$');

            let name: string = !body.name || validator.isEmpty(body.name) ?
                errors.push({message: 'El nombre es obligatorio'}) : body.name;

            if (!regex.test(name)) {
                errors.push({message: 'Favor proporcionar unicamente letras en el campo nombre(s)'})
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

            let name: string = !body.name || validator.isEmpty(body.name) ?
                errors.push({message: 'El nombre es obligatorio'}) : body.name;

            let status: number = !body.status || validator.isEmpty(body.status) ?
                errors.push({message: 'El estatus es obligatorio.'}) : body.status;

            if (!regex.test(name)) {
                errors.push({message: 'Favor proporcionar unicamente letras en el campo nombre(s)'})
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