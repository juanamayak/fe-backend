import {Op} from 'sequelize'
import {ProductModel} from "../models/product.model";
import {SubcategoryModel} from "../models/subcategory.model";
import {ProviderModel} from "../models/provider.model";
import {ImageModel} from "../models/image.model";
import {ProductProviderModel} from "../models/product_provider.model";
import {CategoryModel} from "../models/category.model";

export class ProductQueries {

    public async show(data: any) {
        try {
            const product = await ProductModel.findOne({
                where: {
                    uuid: data.uuid
                },
                include: [
                    {model: CategoryModel, as: 'category'},
                    {model: SubcategoryModel, as: 'subcategories'},
                    {model: ProviderModel, as: 'providers'}
                ]
            })

            return {ok: true, product}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async index() {
        try {
            let products = await ProductModel.findAll({order: [["createdAt", "DESC"]]})
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

    public async getProductsByCategory(categoryId) {
        try {
            let products = await ProductModel.findAll(
                {
                    where: {
                        category_id: categoryId,
                        status: 1
                    },
                    include: [
                        {
                            model: ProviderModel,
                            as: 'providers',
                            attributes: ['country_id', 'state_id', 'city_id', 'name']
                        },
                        {
                            model: SubcategoryModel,
                            as: 'subcategories',
                            where: {
                                status: 1
                            },
                            attributes: ['id', 'name', 'status']
                        }
                    ],
                    attributes: ['id', 'uuid', 'sku', 'name', 'description', 'price', 'discount_percent', 'status']
                });
            return {ok: true, products}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}