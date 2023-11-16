import {Op} from 'sequelize';
import {CouponModel} from "../models/coupons.model";
import {AddressModel} from "../models/address.model";
import {CategoryModel} from "../models/category.model";

export class CouponQueries {

    public async show(data: any) {
        try {
            const coupon = await CouponModel.findOne({
                where: {
                    uuid: data.uuid
                }
            })
            return {ok: true, coupon}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async index() {
        try {
            let coupons = await CouponModel.findAll({order: [["createdAt", "ASC"]]})
            return {ok: true, coupons}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async create(data) {
        try {
            let coupon = await CouponModel.create(data);
            return {ok: true, coupon}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async update(couponId: any, data: any) {
        try {
            let coupon = await CouponModel.update(
                data, {
                    where: {
                        id: couponId,
                    }
                })
            return {ok: true, coupon}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async delete(couponId: any, data: any) {
        try {
            let coupon = await CouponModel.update(
                data, {
                    where: {
                        id: couponId,
                    }
                });
            return {ok: true}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}