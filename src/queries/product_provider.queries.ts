import {Op} from 'sequelize'
import {ProductProviderModel} from "../models/product_provider.model";

export class ProductProviderQueries {
    public async create(data) {
        try {
            let productProvider = await ProductProviderModel.create(data);
            return {ok: true, productProvider}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}
