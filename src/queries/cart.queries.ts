import {Op} from 'sequelize'
import {AddressModel} from '../models/address.model'
import {ClientModel} from "../models/client.model";
import {ClientController} from "../controllers/client.controller";
import {UserModel} from "../models/user.model";
import {CartModel} from "../models/cart.model";
import {ProductModel} from "../models/product.model";

export class CartQueries {

    public async show(clientId: any) {
        try {
            let data = await CartModel.findOne({
                where: {
                    client_id: clientId,
                    status: 1
                },
                include: [
                    {
                        model: ProductModel,
                        as: 'products',
                        through: {
                            attributes: ['quantity']
                        },
                        where: {
                            status: 1
                        }
                    }
                ]
            })
            return {ok: true, data}
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

    public async update(cartId: any, body: any) {
        try {
            let data = await CartModel.update(
                body, {
                    where: {
                        id: cartId,
                    }
                })
            return {ok: true, data}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async delete(cartId: any, body: any) {
        try {
            let data = await CartModel.update(
                body, {
                    where: {
                        id: cartId,
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
            const data = await CartModel.findOne({
                where: {
                    client_id: clientId,
                    status: 1 // 1 = activo, 0 = inactivo
                }
            });
            return {ok: true, data}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}
