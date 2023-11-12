import {Request, Response} from "express";
import {JsonResponse} from "../enums/json-response";
import {CitySuggestionValidator} from "../validators/city_suggestion.validator";
import {CitySuggestionQueries} from "../queries/city_suggestion.queries";

export class CitySuggestionController {

    static citySuggestionQueries: CitySuggestionQueries = new CitySuggestionQueries();
    static citySuggestionValidator: CitySuggestionValidator = new CitySuggestionValidator();

    public async index(req: Request, res: Response) {
        let cities = await CitySuggestionController.citySuggestionQueries.index()

        if (!cities.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Ocurrio un error al obtener los registros.'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            countries: cities.cities,
        })
    }

    public async store(req: Request, res: Response) {
        const body = req.body;
        const client_id = req.body.client_id;

        // Validacion del request
        const validatedData = await CitySuggestionController.citySuggestionValidator.validateStore(body)

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const data = {
            client_id,
            country_id: body.country_id,
            state_id: body.state_id,
            name: body.name
        }

        const cityCreated = await CitySuggestionController.citySuggestionQueries.create(data)

        if (!cityCreated.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: "Existen problemas al momento de crear el registro. Intente más tarde."}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'Gracias por tu apoyo. Hemos recibido tu sugerencia de ciudad.'
        });
    }
}