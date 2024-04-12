import {Op} from 'sequelize'
import {ProductProviderModel} from "../models/product_provider.model";
import {ProductModel} from "../models/product.model";

export class ProductProviderQueries {

    public async create(data) {
        try {
            let productProvider = await ProductProviderModel.bulkCreate(data);
            return {ok: true}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async delete(providerId){
        try {
            let provider = await ProductProviderModel.destroy({
                where: {
                    id: providerId
                }
            });

            return {ok: true};
        } catch (e) {
            console.log(e);
            return {ok: false}
        }
    }

    public async getProductProviders(productId: any) {
        try {
            let providers = await ProductProviderModel.findAll(
                {
                    where: {
                        product_id: productId,
                    }
                })
            return {ok: true, providers}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}
