import {Request, Response} from "express";
import {JsonResponse} from "../enums/json-response";
import {CitySuggestionValidator} from "../validators/city_suggestion.validator";

export class CitySuggestionController {

    static citySuggestionValidator: CitySuggestionValidator = new CitySuggestionValidator()
    public async store(req: Request, res: Response) {
        const body = req.body;

        // Validacion del request
        const validatedData = await CitySuggestionController.citySuggestionValidator.validateStore(body)

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const data = {
            country_id: body.country_id,
            state_id: body.state_id,
            city_id: body.city_id,
            uuid: uuidv4(),
            greeting: body.greeting,
            name: body.name,
            lastname: body.lastname,
            email: body.email,
            password: bcrypt.hashSync(body.password, ClientController.salt),
            birthday: body.birthday,
            cellphone: body.cellphone,
            newsletter: body.newsletter,
            terms_and_conditions: body.terms_and_conditions,
            status: 1
        }

        const clientCreated = await ClientController.clientQueries.create(data)

        if (!clientCreated.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: "Existen problemas al momento de dar de alta su cuenta. Intente más tarde."}]
            });
        }

        const sendEmail = await ClientController.mailer.send({
            email: body.email,
            subject: 'Alta de cuenta',
            template: 'activation',
        });

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'Su cuenta se ha creado de forma exitosa.'
        });
    }
}