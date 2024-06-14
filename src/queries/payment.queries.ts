import {Op} from 'sequelize'
import {AddressModel} from '../models/address.model'
import {CountryModel} from "../models/country.model";
import {StateModel} from "../models/state.model";
import {CityModel} from "../models/city.model";
import {PaymentModel} from "../models/payment.model";

export class PaymentQueries {

    public async showByTransaction(body: any) {
        try {
            const data = await PaymentModel.findOne({
                where: {
                    transaction: body.transaction
                }
            })
            return {ok: true, data}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async showByOrder(orderId: any) {
        try {
            const data = await PaymentModel.findOne({
                where: {
                    order_id: orderId
                }
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

    public async clientAddresses(clientId: any) {
        try {
            let data = await AddressModel.findAll(
                {
                    where: {
                        client_id: clientId,
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
            return {ok: true, data}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async create(body) {
        try {
            let data = await PaymentModel.create(body);
            return {ok: true, data}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async update(paymentId: any, body: any) {
        try {
            let data = await PaymentModel.update(
                body, {
                    where: {
                        id: paymentId,
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
