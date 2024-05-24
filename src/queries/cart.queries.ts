import {Op} from 'sequelize'
import {AddressModel} from '../models/address.model'
import {ClientModel} from "../models/client.model";
import {ClientController} from "../controllers/client.controller";
import {UserModel} from "../models/user.model";
import {CartModel} from "../models/cart.model";
import {ProductModel} from "../models/product.model";

export class CartQueries {

    public async show(data: any) {
        try {
            const client = await ClientModel.findOne({
                where: {
                    uuid: data.uuid
                },
                attributes: ['id', 'name', 'lastname', 'email', 'birthday', 'cellphone', 'verification_code', 'country_id', 'state_id', 'city_id', 'address', 'zip']
            })
            return {ok: true, client}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async index(clientId: any) {
        try {
            let cart = await CartModel.findAll({
                where: {
                    client_id: clientId,
                    status: 1
                },
                include: [
                    {
                        model: ProductModel,
                        as: 'product',
                        where: {
                            status: 1
                        }
                    }
                ]
            })
            return {ok: true, cart}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async create(data) {
        try {
            let cart = await CartModel.create(data);
            return {ok: true, cart}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async update(clientId: any, data: any) {
        try {
            let client = await ClientModel.update(
                data, {
                    where: {
                        id: clientId,
                    }
                })
            return {ok: true, client}
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

    public async findIfExists(cartData) {
        try {
            const cart = await CartModel.findOne({
                where: {
                    product_id: cartData.product_id,
                    status: 1
                }
            });
            return {ok: true, cart}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}
