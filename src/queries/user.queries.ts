import {Op} from 'sequelize';
import {UserModel} from "../models/user.model";
import {CouponModel} from "../models/coupons.model";

export class UserQueries {

    public async show(data: any) {
        try {
            const user = await UserModel.findOne({
                where: {
                    uuid: data.uuid
                }
            })
            return {ok: true, user}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async index() {
        try {
            let users = await UserModel.findAll({order: [["createdAt", "ASC"]]})
            return {ok: true, users}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async create(data) {
        try {
            let user = await UserModel.create(data);
            return {ok: true, user}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async update(userId: any, data: any) {
        try {
            let user = await UserModel.update(
                data, {
                    where: {
                        id: userId,
                    }
                })
            return {ok: true, user}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}