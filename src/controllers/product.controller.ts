import validator from 'validator';
import * as bcrypt from 'bcrypt';
import {Request, Response} from 'express'
import {JsonResponse} from '../enums/json-response';
import {File} from "../helpers/files";
import {v4 as uuidv4} from 'uuid';
import moment from "moment";
import {AddressQueries} from "../queries/address.queries";
import {CitySuggestionValidator} from "../validators/city_suggestion.validator";
import {AddressValidator} from "../validators/address.validator";
import {ProductValidator} from "../validators/product.validator";
import {CategoryQueries} from "../queries/category.queries";
import {CategoryValidator} from "../validators/category.validator";

export class ProductController {

    static categoriesQueries: CategoryQueries = new CategoryQueries();
    static productsValidator: CategoryValidator = new CategoryValidator();
    static file: File = new File();

    public async store(req: Request, res: Response) {
        const body = req.body;
        const files = req.files;
        const user_id = req.body.user_id;

        // Validacion del request
        const validatedData = await ProductController.productsValidator.validateStore(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        if (files) {
            const uploadFile = await ProductController.file.upload(files, null, 'images')
            if (!uploadFile.ok) {
                return {
                    ok: false,
                    errors: [{message: uploadFile.message}]
                }
            }

        }


    }
}