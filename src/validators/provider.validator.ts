import validator from 'validator';

export class ProviderValidator {
    public async validateStore(body: any) {
        // Contenedor de errores
        const errors = []

        try {
            const country_id: number = !body.country_id ?
                errors.push({message: 'El país es obligatorio'}) : body.country_id;

            const state_id: number = !body.state_id ?
                errors.push({message: 'El estado es obligatorio'}) : body.state_id;

            const city_id: number = !body.city_id ?
                errors.push({message: 'La ciudad es obligatoria'}) : body.city_id;

            const name: string = !body.name || validator.isEmpty(body.name) ?
                errors.push({message: 'El nombre del proveedor es obligatorio'}) : body.name;

            const address: string = !body.address || validator.isEmpty(body.address) ?
                errors.push({message: 'La dirección del proveedor es oblitaria'}) : body.address;

            const colony: string = !body.colony || validator.isEmpty(body.colony) ?
                errors.push({message: 'La colonia de la dirección es oblitaria'}) : body.colony;

            const zip: string = !body.zip || validator.isEmpty(body.zip) ?
                errors.push({message: 'El código postal es obligatoria'}) : body.zip;

            const responsable_name: string = !body.responsable_name || validator.isEmpty(body.responsable_name) ?
                errors.push({message: 'El nombre del responsable es obligatorio'}) : body.responsable_name;

            const responsable_lastname: string = !body.responsable_lastname || validator.isEmpty(body.responsable_lastname) ?
                errors.push({message: 'El apellido del responsable es obligatorio'}) : body.responsable_lastname;

            const responsable_email: string = !body.responsable_email || validator.isEmpty(body.responsable_email) ?
                errors.push({message: 'El email del responsable es obligatorio'}) : body.responsable_email;

            const responsable_cellphone: string = !body.responsable_cellphone || validator.isEmpty(body.responsable_cellphone) ?
                errors.push({message: 'El número del responsable es obligatorio'}) : body.responsable_cellphone;


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
            const country_id: number = !body.country_id ?
                errors.push({message: 'El país es obligatorio'}) : body.country_id;

            const state_id: number = !body.state_id ?
                errors.push({message: 'El estado es obligatorio'}) : body.state_id;

            const city_id: number = !body.city_id ?
                errors.push({message: 'La ciudad es obligatoria'}) : body.city_id;

            const name: string = !body.name || validator.isEmpty(body.name) ?
                errors.push({message: 'El nombre del proveedor es obligatorio'}) : body.name;

            const address: string = !body.address || validator.isEmpty(body.address) ?
                errors.push({message: 'La dirección de entrega es oblitaria'}) : body.address;

            const colony: string = !body.colony || validator.isEmpty(body.colony) ?
                errors.push({message: 'La colonia de la dirección es oblitaria'}) : body.colony;

            const zip: string = !body.zip || validator.isEmpty(body.zip) ?
                errors.push({message: 'El código postal es obligatoria'}) : body.zip;

            const responsable_name: string = !body.responsable_name || validator.isEmpty(body.responsable_name) ?
                errors.push({message: 'El nombre del responsable es obligatorio'}) : body.responsable_name;

            const responsable_lastname: string = !body.responsable_lastname || validator.isEmpty(body.responsable_lastname) ?
                errors.push({message: 'El apellido del responsable es obligatorio'}) : body.responsable_lastname;

            const responsable_email: string = !body.responsable_email || validator.isEmpty(body.responsable_email) ?
                errors.push({message: 'El email del responsable es obligatorio'}) : body.responsable_email;

            const responsable_cellphone: string = !body.responsable_cellphone || validator.isEmpty(body.responsable_cellphone) ?
                errors.push({message: 'El número del responsable es obligatorio'}) : body.responsable_cellphone;

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