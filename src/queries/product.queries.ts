import {Op} from 'sequelize'
import {ProductModel} from "../models/product.model";

export class ProductQueries {

    public async show(data: any) {
        try {
            const address = await ProductModel.findOne({
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
            let addresses = await ProductModel.findAll({order: [["createdAt", "ASC"]]})
            return {ok: true, addresses}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async create(data) {
        try {
            let product = await ProductModel.create(data);
            return {ok: true, product}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async update(addressId: any, data: any) {
        try {
            let address = await ProductModel.update(
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
            let address = await ProductModel.update(
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