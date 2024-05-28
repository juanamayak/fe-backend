import {Op} from 'sequelize'
import {AddressModel} from '../models/address.model'
import {ClientModel} from "../models/client.model";
import {ClientController} from "../controllers/client.controller";
import {UserModel} from "../models/user.model";
import {CartModel} from "../models/cart.model";
import {ProductModel} from "../models/product.model";
import {CartProductModel} from "../models/cart_product.model";

export class CartProductQueries {

    public async show(cartId: any, productId: any) {
        try {
            const data = await CartProductModel.findOne({
                where: {
                    cart_id: cartId,
                    product_id: productId
                }
            })
            return {ok: true, data}
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
            let data = await CartProductModel.create(body);
            return {ok: true, data}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async update(cartProductId: any, body: any) {
        try {
            let data = await CartProductModel.update(
                body, {
                    where: {
                        id: cartProductId,
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
