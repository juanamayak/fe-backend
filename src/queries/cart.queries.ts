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

    public async create(body) {
        try {
            let data = await CartModel.create(body);
            return {ok: true, data}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async update(cartId: any, data: any) {
        try {
            let cart = await CartModel.update(
                data, {
                    where: {
                        id: cartId,
                    }
                })
            return {ok: true, cart}
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

    public async getActiveClientCart(clientId: any) {
        try {
            const cart = await CartModel.findOne({
                where: {
                    client_id: clientId,
                    status: 1 // 1 = activo, 0 = inactivo
                }
            });
            return {ok: true, cart}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}
