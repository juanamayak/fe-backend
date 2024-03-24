import {Op} from 'sequelize'
import {CountryModel} from "../models/country.model";
import {StateModel} from "../models/state.model";
import {CityModel} from "../models/city.model";

export class LocationQueries {

    public async countries() {
        try {
            let countries = await CountryModel.findAll();
            return {ok: true, countries}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async states(countryId) {
        try {
            let states = await StateModel.findAll({
                where: {
                    country_id: countryId
                }
            });
            return {ok: true, states}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async cities(stateId) {
        try {
            let cities = await CityModel.findAll({
                where: {
                    state_id: stateId
                }
            });
            return {ok: true, cities}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}
