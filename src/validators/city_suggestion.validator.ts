import validator from 'validator';

export class CitySuggestionValidator {
    public async validateStore(body: any) {
        // Contenedor de errores
        const errors = []

        try {
            let country_id: number = !body.country_id || validator.isEmpty(body.country_id) ?
                errors.push({message: 'El país es obligatorio'}) : body.country_id;

            let state_id: number = !body.state_id || validator.isEmpty(body.state_id) ?
                errors.push({message: 'El estado es obligatorio'}) : body.state_id;

            let name: string = !body.name || validator.isEmpty(body.name) ?
                errors.push({message: 'El nombre es obligatorio'}) : body.name;


            const regex = new RegExp('^[A-Za-zÀ-ú _]*[A-Za-zÀ-ú][A-Za-zÀ-ú _]*$');

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