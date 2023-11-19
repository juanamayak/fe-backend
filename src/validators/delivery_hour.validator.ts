import validator from 'validator';

export class DeliveryHourValidator {
    public async validateStore(body: any) {
        // Contenedor de errores
        const errors = []

        try {
            const start_hour: string = !body.start_hour || validator.isEmpty(body.start_hour) ?
                errors.push({message: 'La hora de inicio es obligatorio'}) : body.start_hour;

            const end_hour: string = !body.end_hour || validator.isEmpty(body.end_hour) ?
                errors.push({message: 'La hora de fin es obligatorio'}) : body.end_hour;

            const special: number = !body.special || validator.isEmpty(body.special) ?
                errors.push({message: 'Indica si es horario especial'}) : body.special;


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
            const start_hour: string = !body.start_hour || validator.isEmpty(body.start_hour) ?
                errors.push({message: 'La hora de inicio es obligatorio'}) : body.start_hour;

            const end_hour: string = !body.end_hour || validator.isEmpty(body.end_hour) ?
                errors.push({message: 'La hora de fin es obligatorio'}) : body.end_hour;

            const special: number = !body.special || validator.isEmpty(body.special) ?
                errors.push({message: 'Indica si es horario especial'}) : body.special;

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