import {Op} from 'sequelize'
import {AddressModel} from '../models/address.model'
import {CountryModel} from "../models/country.model";
import {StateModel} from "../models/state.model";
import {CityModel} from "../models/city.model";
import {OrderModel} from "../models/order.model";
import {ProductModel} from "../models/product.model";
import {PaymentModel} from "../models/payment.model";

export class OrderQueries {

    public async show(body: any) {
        try {
            const data = await OrderModel.findOne({
                where: {
                    uuid: body.uuid
                },
                include: [
                    {
                        model: AddressModel, as: 'addresses',
                        include: [
                            { model: StateModel, as: 'state' },
                            { model: CityModel, as: 'city' },
                        ]
                    }
                ]
            })
            return {ok: true, data}
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
                        {model: CountryModel, as: 'country'},
                        {model: StateModel, as: 'state'},
                        {model: CityModel, as: 'city'}
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
            let data = await OrderModel.create(body);
            return {ok: true, data}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async update(orderId: any, body: any) {
        try {
            let data = await OrderModel.update(
                body, {
                    where: {
                        id: orderId,
                    }
                })
            return {ok: true, data}
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
