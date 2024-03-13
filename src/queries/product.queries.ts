import {Op} from 'sequelize'
import {ProductModel} from "../models/product.model";

export class ProductQueries {

    public async show(data: any) {
        try {
            const product = await ProductModel.findOne({
                where: {
                    uuid: data.uuid
                }
            })
            return {ok: true, product}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async index() {
        try {
            let products = await ProductModel.findAll({order: [["createdAt", "ASC"]]})
            return {ok: true, products}
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

    public async update(productId: any, data: any) {
        try {
            let product = await ProductModel.update(
                data, {
                    where: {
                        id: productId,
                    }
                })
            return {ok: true, product}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async delete(productId: any, data: any) {
        try {
            let product = await ProductModel.update(
                data, {
                    where: {
                        id: productId,
                    }
                })
            return {ok: true}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}