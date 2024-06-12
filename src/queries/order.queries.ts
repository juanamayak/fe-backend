import {Op} from 'sequelize'
import {AddressModel} from '../models/address.model'
import {CountryModel} from "../models/country.model";
import {StateModel} from "../models/state.model";
import {CityModel} from "../models/city.model";
import {OrderModel} from "../models/order.model";
import {ProductModel} from "../models/product.model";
import {PaymentModel} from "../models/payment.model";
import {ClientModel} from "../models/client.model";
import {OrderController} from "../controllers/order.controller";

export class OrderQueries {

    public async show(body: any) {
        try {
            const data = await OrderModel.findOne({
                where: {
                    uuid: body.uuid,
                    status: 0
                },
                include: [
                    {
                        model: AddressModel, as: 'addresses',
                        include: [
                            {model: StateModel, as: 'state'},
                            {model: CityModel, as: 'city'},
                        ]
                    },
                    {
                        model: ClientModel, as: 'client'
                    }
                ]
            })
            return {ok: true, data}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async index(clientId: any) {
        try {
            let data = await OrderModel.findAll(
                {
                    where: {
                        client_id: clientId,
                        status: [1]
                    },
                    include: [
                        {model: ProductModel, as: 'products'}
                    ],
                    order: [["createdAt", "DESC"]],
                },
            )
            return {ok: true, data}
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
