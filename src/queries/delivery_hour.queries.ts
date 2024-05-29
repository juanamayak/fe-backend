import {Op} from 'sequelize';
import {DeliveryHourModel} from "../models/delivery_hour.model";
import {CategoryModel} from "../models/category.model";

export class DeliveryHourQueries {

    public async show(data: any) {
        try {
            const hour = await DeliveryHourModel.findOne({
                where: {
                    uuid: data.uuid
                }
            })
            return {ok: true, hour}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async index() {
        try {
            let data = await DeliveryHourModel.findAll({order: [["createdAt", "ASC"]]})
            return {ok: true, data}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async create(data) {
        try {
            const hour = await DeliveryHourModel.create(data);
            return {ok: true, hour}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async update(hourId: any, data: any) {
        try {
            let hour = await DeliveryHourModel.update(
                data, {
                    where: {
                        id: hourId,
                    }
                })
            return {ok: true, hour}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async delete(hourId: any, data: any) {
        try {
            let hour = await DeliveryHourModel.update(
                data, {
                    where: {
                        id: hourId,
                    }
                })
            return {ok: true}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}