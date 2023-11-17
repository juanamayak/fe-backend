import {Op} from 'sequelize';
import {MessageModel} from "../models/message.model";
import {CouponModel} from "../models/coupons.model";

export class MessageQueries {

    public async show(data: any) {
        try {
            const message = await MessageModel.findOne({
                where: {
                    uuid: data.uuid
                }
            })
            return {ok: true, message}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async index() {
        try {
            let messages = await MessageModel.findAll({order: [["createdAt", "ASC"]]})
            return {ok: true, messages}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async create(data) {
        try {
            let message = await MessageModel.create(data);
            return {ok: true, message}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async update(messageId: any, data: any) {
        try {
            let message = await MessageModel.update(
                data, {
                    where: {
                        id: messageId,
                    }
                })
            return {ok: true, message}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}