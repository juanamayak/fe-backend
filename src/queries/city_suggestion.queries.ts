import {Op} from 'sequelize'
import {CitySuggestionModel} from "../models/city_suggestion.model";
import {AddressModel} from "../models/address.model";

export class CitySuggestionQueries {

    public async index() {
        try {
            let cities = await CitySuggestionModel.findAll({order: [["createdAt", "ASC"]]})
            return {ok: true, cities}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async create(data) {
        try {
            let city = await CitySuggestionModel.create(data);
            return {ok: true, city}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}