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
import {ProductQueries} from "../queries/product.queries";
import {ProviderQueries} from "../queries/provider.queries";
import {ProductProviderQueries} from "../queries/product_provider.queries";

export class ProductController {

    static productProviderQueries: ProductProviderQueries = new ProductProviderQueries();
    static productQueries: ProductQueries = new ProductQueries();
    static productsValidator: ProductValidator = new ProductValidator();
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

        const data = {
            user_id,
            country_id: body.country_id,
            discount_type_id: body.discount_type_id,
            uuid: uuidv4(),
            name: body.name,
            price: body.price,
            sku: moment().unix(),
            discount_amount: body.discount_amount,
            description: body.description,
            status: 1
        }

        const createdProduct = await ProductController.productQueries.create(data);

        if (!createdProduct.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: "Existen problemas al momento de crear el producto. Intente más tarde."}]
            });
        }

        const productProviderData = {
            product_id: createdProduct.product ? createdProduct.product.id : 0,
            provider_id: body.provider_id
        }

        const createdProductProvider = await ProductController.productProviderQueries.create(productProviderData);

        if (!createdProductProvider.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: "Existen problemas al momento de agregar el producto al proveedor. Intente más tarde."}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'El producto se creo correctamente',
            product: createdProduct.product
        });

    }
}