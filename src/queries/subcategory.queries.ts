import {Op} from 'sequelize';
import {SubcategoryModel} from "../models/subcategory.model";
import {CategoryModel} from "../models/category.model";

export class SubcategoryQueries {

    public async show(data: any) {
        try {
            const subcategory = await SubcategoryModel.findOne({
                where: {
                    uuid: data.uuid
                }
            })
            return {ok: true, subcategory}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async index() {
        try {
            let subcategories = await SubcategoryModel.findAll({order: [["createdAt", "ASC"]]})
            return {ok: true, subcategories}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async create(data) {
        try {
            let subcategory = await SubcategoryModel.create(data);
            return {ok: true, subcategory}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async update(subcategoryId: any, data: any) {
        try {
            let subcategory = await SubcategoryModel.update(
                data, {
                    where: {
                        id: subcategoryId,
                    }
                })
            return {ok: true, subcategory}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async delete(subcategoryId: any, data: any) {
        try {
            let subcategory = await SubcategoryModel.update(
                data, {
                    where: {
                        id: subcategoryId,
                    }
                })
            return {ok: true}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}