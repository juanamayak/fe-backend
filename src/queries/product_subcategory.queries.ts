import {Op} from 'sequelize'
import {ProductSubcategoryModel} from "../models/product_subcategory.model";
import {ProductProviderModel} from "../models/product_provider.model";

export class ProductSubcategoryQueries {
    public async create(data, transaction) {
        try {
            let productSubcategory = await ProductSubcategoryModel.bulkCreate(data, transaction);
            return {ok: true}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async delete(subcategoryId, transaction) {
        try {
            let subcategory = await ProductSubcategoryModel.destroy({
                where: {
                    id: subcategoryId
                },
                transaction
            });

            return {ok: true};
        } catch (e) {
            console.log(e);
            return {ok: false}
        }
    }

    public async getProductSubcategories(productId: any) {
        try {
            let subcategories = await ProductSubcategoryModel.findAll(
                {
                    where: {
                        product_id: productId,
                    }
                })
            return {ok: true, subcategories}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}
