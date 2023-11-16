import validator from 'validator';

export class AddressValidator {
    public async validateStore(body: any) {
        // Contenedor de errores
        const errors = []

        try {
            const country_id: number = !body.country_id || validator.isEmpty(body.country_id) ?
                errors.push({message: 'El país es obligatorio'}) : body.country_id;

            const state_id: number = !body.state_id || validator.isEmpty(body.state_id) ?
                errors.push({message: 'El estado es obligatorio'}) : body.state_id;

            const city_id: number = !body.city_id || validator.isEmpty(body.city_id) ?
                errors.push({message: 'La ciudad es obligatoria'}) : body.city_id;

            const name_receiver: string = !body.name_receiver || validator.isEmpty(body.name_receiver) ?
                errors.push({message: 'El nombre del destinatario es obligatorio'}) : body.name_receiver;

            const phone_receiver: string = !body.phone_receiver || validator.isEmpty(body.phone_receiver) ?
                errors.push({message: 'El número del destinatario es obligatorio'}) : body.phone_receiver;

            const address: string = !body.address || validator.isEmpty(body.address) ?
                errors.push({message: 'La dirección de entrega es oblitaria'}) : body.address;

            const colony: string = !body.colony || validator.isEmpty(body.colony) ?
                errors.push({message: 'La colonia de la dirección es oblitaria'}) : body.colony;

            const reference: string = !body.reference || validator.isEmpty(body.reference) ?
                errors.push({message: 'La referencia es obligatoria'}) : body.reference;

            const latitude: string = !body.latitude || validator.isEmpty(body.latitude) ?
                errors.push({message: 'La posición en el mapa es obligatorio'}) : body.latitude;

            const longitude: string = !body.longitude || validator.isEmpty(body.longitude) ?
                errors.push({message: 'La posición en el mapa es obligatorio'}) : body.longitude;

            const zip: number = !body.zip || validator.isEmpty(body.zip) ?
                errors.push({message: 'El código postal es obligatorio'}) : body.zip;

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
            const country_id: number = !body.country_id || validator.isEmpty(body.country_id) ?
                errors.push({message: 'El país es obligatorio'}) : body.country_id;

            const state_id: number = !body.state_id || validator.isEmpty(body.state_id) ?
                errors.push({message: 'El estado es obligatorio'}) : body.state_id;

            const city_id: number = !body.city_id || validator.isEmpty(body.city_id) ?
                errors.push({message: 'La ciudad es obligatoria'}) : body.city_id;

            const name_receiver: string = !body.name_receiver || validator.isEmpty(body.name_receiver) ?
                errors.push({message: 'El nombre del destinatario es obligatorio'}) : body.name_receiver;

            const phone_receiver: string = !body.phone_receiver || validator.isEmpty(body.phone_receiver) ?
                errors.push({message: 'El número del destinatario es obligatorio'}) : body.phone_receiver;

            const address: string = !body.address || validator.isEmpty(body.address) ?
                errors.push({message: 'La dirección de entrega es oblitaria'}) : body.address;

            const colony: string = !body.colony || validator.isEmpty(body.colony) ?
                errors.push({message: 'La colonia de la dirección es oblitaria'}) : body.colony;

            const reference: string = !body.reference || validator.isEmpty(body.reference) ?
                errors.push({message: 'La referencia es obligatoria'}) : body.reference;

            const latitude: string = !body.latitude || validator.isEmpty(body.latitude) ?
                errors.push({message: 'La posición en el mapa es obligatorio'}) : body.latitude;

            const longitude: string = !body.longitude || validator.isEmpty(body.longitude) ?
                errors.push({message: 'La posición en el mapa es obligatorio'}) : body.longitude;

            const zip: number = !body.zip || validator.isEmpty(body.zip) ?
                errors.push({message: 'El código postal es obligatorio'}) : body.zip;

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