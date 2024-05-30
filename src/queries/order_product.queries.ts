import {Op} from 'sequelize'
import {AddressModel} from '../models/address.model'
import {CountryModel} from "../models/country.model";
import {StateModel} from "../models/state.model";
import {CityModel} from "../models/city.model";
import {OrderModel} from "../models/order.model";
import {OrderProductModel} from "../models/order_product.model";

    export class OrderProductQueries {

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

    public async create(body) {
        try {
            let data = await OrderProductModel.create(body);
            return {ok: true, data}
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
