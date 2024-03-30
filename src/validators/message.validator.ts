import validator from 'validator';

export class MessageValidator {
    public async validateStore(body: any) {
        // Contenedor de errores
        const errors = []

        try {
            const title: number = !body.title || validator.isEmpty(body.title) ?
                errors.push({message: 'El titulo es obligatorio'}) : body.title;

            const message: number = !body.message || validator.isEmpty(body.message) ?
                errors.push({message: 'El mensaje es obligatorio'}) : body.message;


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
            const title: number = !body.title || validator.isEmpty(body.title) ?
                errors.push({message: 'El titulo es obligatorio'}) : body.title;

            const message: number = !body.message || validator.isEmpty(body.message) ?
                errors.push({message: 'El mensaje es obligatorio'}) : body.message;


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