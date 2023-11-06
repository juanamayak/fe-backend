import {Op} from 'sequelize'
import {AddressModel} from '../models/address.model'

export class AddressQueries {

    public async index() {
        try {
            let addresses = await AddressModel.findAll({order: [["createdAt", "ASC"]]})
            return {ok: true, addresses}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async create(data) {
        try {
            let address = await AddressModel.create(data);
            return {ok: true, address}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}
