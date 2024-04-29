import validator from 'validator';
import * as bcrypt from 'bcrypt';
import {Request, Response} from 'express'
import {JsonResponse} from '../enums/json-response';
import {v4 as uuidv4} from 'uuid';
import moment from "moment";
import {AddressQueries} from "../queries/address.queries";
import {CitySuggestionValidator} from "../validators/city_suggestion.validator";
import {AddressValidator} from "../validators/address.validator";
import {LocationQueries} from "../queries/location.queries";

export class LocationsController {

    static locationQueries: LocationQueries = new LocationQueries();

    public async countries(req: Request, res: Response) {
        let countries = await LocationsController.locationQueries.countries();

        if (!countries.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Algo salio mal a la hora de traer los paises'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            countries: countries.countries,
        })
    }

    public async states(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const countryId = !req.params.country_id || validator.isEmpty(req.params.country_id) ?
            errors.push({message: 'Favor de proporcionar la dirección'}) : req.params.country_id;

        let states = await LocationsController.locationQueries.states(countryId);

        if (!states.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Algo salio mal a la hora de traer los paises'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            states: states.states,
        })
    }

    public async cities(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const stateId = !req.params.state_id || validator.isEmpty(req.params.state_id) ?
            errors.push({message: 'Favor de proporcionar la dirección'}) : req.params.state_id;

        let cities = await LocationsController.locationQueries.cities(stateId);

        if (!cities.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Algo salio mal a la hora de traer los paises'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            cities: cities.cities,
        })
    }

    public async city(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const cityId = !req.params.id || validator.isEmpty(req.params.id) ?
            errors.push({message: 'Favor de proporcionar la dirección'}) : req.params.id;

        let city = await LocationsController.locationQueries.city(cityId);

        if (!city.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Algo salio mal a la hora de traer los paises'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            city: city.city,
        })
    }
}
