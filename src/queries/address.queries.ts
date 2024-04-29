import {Op} from 'sequelize'
import {AddressModel} from '../models/address.model'
import {CountryModel} from "../models/country.model";
import {StateModel} from "../models/state.model";
import {CityModel} from "../models/city.model";

export class AddressQueries {

    public async show(data: any) {
        try {
            const address = await AddressModel.findOne({
                where: {
                    uuid: data.uuid
                }
            })
            return {ok: true, address}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async index() {
        try {
            let addresses = await AddressModel.findAll(
                {
                    where: {
                        status: [1]
                    },
                    order: [["createdAt", "DESC"]],
                    include: [
                        { model: CountryModel, as: 'country' },
                        { model: StateModel, as: 'state' },
                        { model: CityModel, as: 'city' }
                    ]
                },
            )
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

    public async update(addressId: any, data: any) {
        try {
            let address = await AddressModel.update(
                data, {
                    where: {
                        id: addressId,
                    }
                })
            return {ok: true, address}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async delete(addressId: any, data: any) {
        try {
            let address = await AddressModel.update(
                data, {
                    where: {
                        id: addressId,
                    }
                })
            return {ok: true}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}
