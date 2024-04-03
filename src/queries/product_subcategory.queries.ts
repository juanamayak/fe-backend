import {Op} from 'sequelize'
import {ProductSubcategoryModel} from "../models/product_subcategory.model";

export class ProductSubcategoryQueries {
    public async create(data) {
        try {
            let productSubcategory = await ProductSubcategoryModel.bulkCreate(data);
            return {ok: true}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}
