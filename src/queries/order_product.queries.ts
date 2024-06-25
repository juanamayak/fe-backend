import sequelize, {Op} from 'sequelize'
import {AddressModel} from '../models/address.model'
import {CountryModel} from "../models/country.model";
import {StateModel} from "../models/state.model";
import {CityModel} from "../models/city.model";
import {OrderModel} from "../models/order.model";
import {OrderProductModel} from "../models/order_product.model";
import {ProductModel} from "../models/product.model";

export class OrderProductQueries {


    public async create(body) {
        try {
            let data = await OrderProductModel.create(body);
            return {ok: true, data}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

}
