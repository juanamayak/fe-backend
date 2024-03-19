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
import {ImageQueries} from "../queries/image.queries";

export class ProductController {

    static file: File = new File();

    static productsValidator: ProductValidator = new ProductValidator();

    static productProviderQueries: ProductProviderQueries = new ProductProviderQueries();
    static productQueries: ProductQueries = new ProductQueries();
    static imageQueries: ImageQueries = new ImageQueries();

    public async index(req: Request, res: Response) {
        let products = await ProductController.productQueries.index()

        if (!products.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Algo salio mal a la hora de traer los productos.'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            products: products.products,
        })
    }

    public async store(req: Request, res: Response) {
        const body = req.body;
        const images = req.files;
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
                errors: [{message: "Existen problemas al momento de crear el producto. Intente más tarde."}]
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
                errors: [{message: "Existen problemas al momento de agregar el producto al proveedor. Intente más tarde."}]
            });
        }

        const productImagesCreated = await ProductController.processImages(images, createdProduct.product);
        if (!productImagesCreated.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: productImagesCreated.errors
            })
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'El producto se creo correctamente',
            product: createdProduct.product
        });
    }

    public async update(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const productUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar el producto'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        // Validacion del request
        const validatedData = await ProductController.productsValidator.validateUpdate(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const product = await ProductController.productQueries.show({
            uuid: productUuid
        });

        if (!product.ok) {
            errors.push({message: 'Existen problemas al buscar el registro solicitado'});
        } else if (!product.product) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const productUpdated = await ProductController.productQueries.update(product.product.id, body);

        if (!productUpdated.product) {
            errors.push({message: 'Se encontro un problema a la hora de actualizar el producto. Intente de nuevamente'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'El registro se actualizo correctamente'
        });
    }

    public async delete(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const productUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar el producto'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const product = await ProductController.productQueries.show({
            uuid: productUuid
        });

        if (!product.ok) {
            errors.push({message: 'Existen problema al buscar el registro solicitado'});
        } else if (!product.product) {
            errors.push({message: 'El registro no se encuentra dada de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const deletedProduct = await ProductController.productQueries.delete(product.product.id, { status: 0});

        if (!deletedProduct.ok) {
            errors.push({message: 'Existen problemas al momento de eliminar el registro. Intente de nuevamente'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }


        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'El registro se elimino correctamente.'
        });
    }

    private static async processImages(images: any, product: any) {
        for (const image of images) {
            const imageExtension = image.name.toLowerCase().substring(image.name.lastIndexOf('.'));
            const imageName = `P-${moment().unix()}-${product.id}${imageExtension}`;

            const imageUploaded = await ProductController.file.upload(image, imageName, 'product')

            if (!imageUploaded.ok) {
                return {
                    ok: false,
                    errors: [{message: imageUploaded.message}]
                }
            }

            const data = {
                name: imageName,
                path: process.env.PROD_IMAGES_PATH + imageName,
                media_type: image.mimetype,
                imageable_type: 'Product',
                imageable_id: product.id
            }

            const imageCreated = await ProductController.imageQueries.create(data);

            if (!imageCreated.ok) {
                return {
                    ok: false,
                    errors: [{message: 'Existen problemas al momento de procesar las imagenes del producto.'}]
                }
            }

        }
        return {ok: true}
    }
}