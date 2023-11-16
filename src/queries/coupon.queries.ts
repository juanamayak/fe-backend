import {Op} from 'sequelize';
import {CouponModel} from "../models/coupons.model";
import {AddressModel} from "../models/address.model";

export class CouponQueries {

    public async index() {
        try {
            let addresses = await AddressModel.findAll({order: [["createdAt", "ASC"]]})
            return {ok: true, addresses}
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
}