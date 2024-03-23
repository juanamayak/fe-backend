import {Op} from 'sequelize';
import {CategoryModel} from "../models/category.model";
import {SubcategoryModel} from "../models/subcategory.model";

export class CategoryQueries {

    public async show(data: any) {
        try {
            const category = await CategoryModel.findOne({
                where: {
                    uuid: data.uuid
                }
            })
            return {ok: true, category}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async index() {
        try {
            let categories = await CategoryModel.findAll(
                {
                    where: {
                        status: [0, 1]
                    },
                    order: [["createdAt", "ASC"]],
                    include: [{
                        model: SubcategoryModel,
                        as: 'subcategories'
                    }]
                })
            return {ok: true, categories}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async create(data) {
        try {
            let category = await CategoryModel.create(data);
            return {ok: true, category}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async update(categoryId: any, data: any) {
        try {
            let category = await CategoryModel.update(
                data, {
                    where: {
                        id: categoryId,
                    }
                })
            return {ok: true, category}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async delete(categoryId: any, data: any) {
        try {
            let address = await CategoryModel.update(
                data, {
                    where: {
                        id: categoryId,
                    }
                })
            return {ok: true}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}