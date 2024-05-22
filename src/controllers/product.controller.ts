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
import {ProductSubcategoryQueries} from "../queries/product_subcategory.queries";
import {random, randomInt} from "mathjs";
import sequelize from "sequelize";
import {database} from "../config/database";

export class ProductController {

    static file: File = new File();
    static productsValidator: ProductValidator = new ProductValidator();
    static productProviderQueries: ProductProviderQueries = new ProductProviderQueries();
    static productSubcategoryQueries: ProductSubcategoryQueries = new ProductSubcategoryQueries();
    static productQueries: ProductQueries = new ProductQueries();
    static categoryQueries: CategoryQueries = new CategoryQueries();
    static providerQueries: ProviderQueries = new ProviderQueries();
    static imageQueries: ImageQueries = new ImageQueries();

    public async show(req: Request, res: Response) {
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

        return res.status(JsonResponse.OK).json({
            ok: true,
            product: product.product
        });
    }

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
        const user_id = req.body.user_id;
        const providers = req.body.providers;
        const subcategories = req.body.subcategories;
        const images = req.files.images;
        const errors = [];

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
            category_id: body.category_id,
            uuid: uuidv4(),
            name: body.name,
            price: body.price,
            sku: moment().unix(),
            discount_percent: body.discount_percent ? body.discount_percent : null,
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

        const transaction = await database.transaction();
        try {
            let productProviders = providers.map(providerId => ({
                product_id: createdProduct.product.id,
                provider_id: providerId
            }));

            await ProductController.productProviderQueries.create(productProviders, {transaction});

            let productSubcategories = subcategories.map(subcategoryId => ({
                product_id: createdProduct.product.id,
                provider_id: subcategoryId
            }));

            await ProductController.productSubcategoryQueries.create(productSubcategories, {transaction});
        } catch (e) {
            await transaction.rollback();
            errors.push({message: 'Se encontro un error a la hora de crear los proveedores y/o subcategorias'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const productImagesCreated = await ProductController.processImages(images, createdProduct.product);
        if (!productImagesCreated.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: productImagesCreated.errors
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'El producto se creo correctamente',
            product: createdProduct.product
        });
    }

    public async update(req: Request, res: Response) {
        const body = req.body;
        const providers = req.body.providers;
        const subcategories = req.body.subcategories;
        const images = req.files.images;
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

        const data = {
            category_id: body.category_id,
            name: body.name,
            price: body.price,
            discount_percent: body.discount_percent ? body.discount_percent : null,
            description: body.description
        }

        const productUpdated = await ProductController.productQueries.update(product.product.id, data);

        if (!productUpdated.product) {
            errors.push({message: 'Se encontro un problema a la hora de actualizar el producto. Intente de nuevamente'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        // Obtenemos proveedores que tiene el producto
        const currentProductProviders = await ProductController.productProviderQueries.getProductProviders(product.product.id);

        if (!currentProductProviders.ok) {
            errors.push({message: 'Existen problemas al obtener los proveedores actuales'});
        } else if (!currentProductProviders.providers) {
            errors.push({message: 'Los proveedores no se encontraron'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        // Obtenemos subcategorias que tiene el producto
        const currentProductSubcategories = await ProductController.productSubcategoryQueries.getProductSubcategories(product.product.id);

        if (!currentProductSubcategories.ok) {
            errors.push({message: 'Existen problemas al obtener las subcategorias actuales'});
        } else if (!currentProductProviders.providers) {
            errors.push({message: 'Las subcategorias no se encontraron'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        // Obtenemos las imagenes actuales del producto
        const currentProductImages = await ProductController.imageQueries.productImages({
            imageable_id: product.product.id
        });

        if (!currentProductImages.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: "Existen problemas al momento de obtener las imagenes del producto"}]
            })
        }

        const transaction = await database.transaction({autocommit: false});
        try {
            // Recorremos las subcategorias actuales
            for (const image of currentProductImages.images) {
                // Eliminados cada uno de ellos
                await ProductController.file.destroy(image.path, 'product')
                await ProductController.imageQueries.delete(image.id, transaction);
            }

            // Recorremos las subcategorias actuales
            for (const subcategory of currentProductSubcategories.subcategories) {
                // Eliminados cada uno de ellos
                await ProductController.productSubcategoryQueries.delete(subcategory.id, transaction);
            }

            // Recorremos los proveedores actuales
            for (const provider of currentProductProviders.providers) {
                // Eliminados cada uno de ellos
                await ProductController.productProviderQueries.delete(provider.id, transaction);
            }

            // Crear nuevos registros de proveedores
            let productProviders = []
            for (const provider of providers) {
                productProviders.push({
                    product_id: product.product.id,
                    provider_id: provider
                });
            }

            // Se insertan los nuevos proveedores que se envian
            await ProductController.productProviderQueries.create(productProviders, transaction);

            // Crear nuevos registros de subcategorias
            let productSubcategories = []
            for (const subcategory of subcategories) {
                productSubcategories.push({
                    product_id: product.product.id,
                    subcategory_id: subcategory
                });
            }

            // Se insertan las nuevas subcategorias que se envian
            await ProductController.productSubcategoryQueries.create(productSubcategories, transaction);

            // Se insertan las nuevas imagenes
            await ProductController.processImages(images, product.product);

            // Si todas las eliminaciones son exitosas, confirmar la transacción
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            console.log('Error a las: ' + moment().format('YYYY-MM-DD HH:mm:ss') + ', ' + e);
            errors.push({message: 'Se encontro un error a la hora de actualizar los proveedores y/o subcategorias'});
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

        const deletedProduct = await ProductController.productQueries.delete(product.product.id, {status: 0});

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

    public async productsByCategory(req: Request, res: Response) {
        const errors = [];

        const categoryUuid = !req.params.category_uuid ?
            errors.push({message: 'Favor de proporcionar la ciudad de destino'}) : req.params.category_uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const category = await ProductController.categoryQueries.show({
            uuid: categoryUuid
        });

        if (!category.ok) {
            errors.push({message: 'Existen problema al buscar la categoria solicitada'});
        } else if (!category.category) {
            errors.push({message: 'La categoria no se encuentra dada de alta'});
        }

        // 1. Primero buscamos productos por categoria
        let products = await ProductController.productQueries.getProductsByCategory(category.category.id);

        if (!products.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Algo salio mal a la hora de traer los productos.'}]
            });
        }

        // 2. Obtenemos las imagenes de cada producto
        let tempProductsData: any;
        let productsWithImages = [];
        for (const product of products.products) {
            const image = await ProductController.imageQueries.productImage({
                imageable_id: product.id
            })

            if (!image.ok) {
                return res.status(JsonResponse.BAD_REQUEST).json({
                    ok: false,
                    errors: [{message: "Existen problemas al momento de obtener los archivos de evidencia del operador."}]
                })
            }

            let downloadedImages: any;
            if (image.image) {
                downloadedImages = await ProductController.downloadImages(image.image);

                if (!downloadedImages.ok) {
                    return res.status(JsonResponse.BAD_REQUEST).json({
                        ok: false,
                        errors: downloadedImages.errors
                    })
                }
            }

            tempProductsData = {
                id: product.id,
                uuid: product.uuid,
                sku: product.sku,
                name: product.name,
                description: product.description,
                price: product.price,
                discount_percent: product.discount_percent,
                status: product.status,
                image: downloadedImages.image,
                providers: product['providers'],
                subcategories: product['subcategories']
            }

            productsWithImages.push(tempProductsData);
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            products: productsWithImages
        });
    }

    public async images(req: Request, res: Response) {
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
            errors.push({message: 'Existen problemas al buscar el registro solicitado'});
        } else if (!product.product) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        // Obtenemos los archivos subidos al reporte
        const images = await ProductController.imageQueries.productImages({
            imageable_id: product.product.id
        })

        if (!images.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: "Existen problemas al momento de obtener los archivos de evidencia del operador."}]
            })
        }
        let downloadedImages: any;
        if (images.images && images.images.length > 0) {
            downloadedImages = await ProductController.downloadImages(images.images);

            if (!downloadedImages.ok) {
                return res.status(JsonResponse.BAD_REQUEST).json({
                    ok: false,
                    errors: downloadedImages.errors
                })
            }
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            images: downloadedImages ? downloadedImages.base64Images : []
        });
    }

    private static async processImages(images: any, product: any) {
        // TODO: Refactorizar función
        if(Array.isArray(images)) {
            for (const image of images) {
                const imageExtension = image.name.toLowerCase().substring(image.name.lastIndexOf('.'));
                const imageName = `p-${uuidv4()}-${product.id}${imageExtension}`;

                const imageUploaded = await ProductController.file.upload(image, imageName, 'product');

                if (!imageUploaded.ok) {
                    return {
                        ok: false,
                        errors: [{message: imageUploaded.message}]
                    }
                }

                const data = {
                    path: process.env.PROD_IMAGES_PATH + imageName,
                    name: imageName,
                    media_type: image.mimetype,
                    imageable_type: 'PRODUCT',
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
        } else {
            const imageExtension = images.name.toLowerCase().substring(images.name.lastIndexOf('.'));
            const imageName = `p-${uuidv4()}-${product.id}${imageExtension}`;

            const imageUploaded = await ProductController.file.upload(images, imageName, 'product');

            if (!imageUploaded.ok) {
                return {
                    ok: false,
                    errors: [{message: imageUploaded.message}]
                }
            }

            const data = {
                path: process.env.PROD_IMAGES_PATH + imageName,
                name: imageName,
                media_type: images.mimetype,
                imageable_type: 'PRODUCT',
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

    private static async downloadImages(images: any) {
        try {
            const base64Images = []
            if(Array.isArray(images)) {
                for (const image of images) {
                    const downloadedImage = await ProductController.file.download(image, 'product')

                    if (!downloadedImage.ok) {
                        return {
                            ok: false,
                            errors: [{message: "Existen problemas al momento de obtener el archivo."}]
                        }
                    }

                    base64Images.push(downloadedImage.image)
                }
                return {ok: true, base64Images}
            } else {
                const downloadedImage = await ProductController.file.download(images, 'product')
                if (!downloadedImage.ok) {
                    return {
                        ok: false,
                        errors: [{message: "Existen problemas al momento de obtener el archivo."}]
                    }
                }

                return {ok: true, image: downloadedImage.image}
            }
        } catch (e) {
            console.log(e)
            return {
                ok: false,
                errors: [{message: "Existen problemas al momento de obtener los archivos de la evidencia."}]
            }
        }
    }
}