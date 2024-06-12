import {Request, Response} from 'express'
import * as bcrypt from 'bcrypt';
import {JsonResponse} from '../enums/json-response';
import {Payload} from "../helpers/payload";
import {Mailer} from "../helpers/mailer";
import {CartValidator} from "../validators/cart.validator";
import {CartQueries} from "../queries/cart.queries";
import {CartProductQueries} from "../queries/cart_product.queries";
import {ImageQueries} from "../queries/image.queries";
import {File} from "../helpers/files";
import validator from "validator";

export class CartController {

    static file: File = new File();
    static cartQueries: CartQueries = new CartQueries();
    static cartProductQueries: CartProductQueries = new CartProductQueries();
    static cartValidator: CartValidator = new CartValidator();
    static imageQueries: ImageQueries = new ImageQueries();

    /*public async show(req: Request, res: Response) {
        const errors = [];

        const userUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar el usuario'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const client = await ClientController.clientQueries.show({
            uuid: userUuid
        });


        if (!client.ok) {
            errors.push({message: 'Existen problemas al buscar el registro solicitado'});
        } else if (!client.client) {
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
            client: client.client
        });
    }

    */

    public async show(req: Request, res: Response) {
        const client_id = req.body.client_id;
        const errors = [];

        let cart = await CartController.cartQueries.show(client_id)

        if (!cart.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Algo salio mal a la hora de traer el carrito de compras.'}]
            });
        }

        // 2. Obtenemos las imagenes de cada producto
        let tempProductsData: any;
        let productsWithImages = [];

        for (const product of cart.data['products']) {
            const image = await CartController.imageQueries.productImage({
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
                downloadedImages = await CartController.downloadImages(image.image);

                if (!downloadedImages.ok) {
                    return res.status(JsonResponse.BAD_REQUEST).json({
                        ok: false,
                        errors: downloadedImages.errors
                    })
                }
            }

            tempProductsData = {
                id: product.id,
                user_id: product.user_id,
                category_id: product.category_id,
                uuid: product.uuid,
                name: product.name,
                price: product.price,
                sku: product.sku,
                discount_percent: product.discount_percent,
                description: product.description,
                image: downloadedImages.image,
                status: product.status,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                quantity: product.CartProductModel.quantity
            }

            productsWithImages.push(tempProductsData);
        }

        const simplifiedCart = {
            id: cart.data.id,
            client_id: cart.data.client_id,
            status: cart.data.status,
            createdAt: cart.data.createdAt,
            updatedAt: cart.data.updatedAt,
            products: productsWithImages
        };

        return res.status(JsonResponse.OK).json({
            ok: true,
            cart: simplifiedCart,
        })
    }

    public async store(req: Request, res: Response) {
        const body = req.body;
        const client_id = req.body.client_id;
        const errors = [];

        // Validacion del request
        const validatedData = await CartController.cartValidator.validateStore(body)

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const cart = await CartController.cartQueries.getActiveClientCart(client_id);

        if (cart.data) { // Si hay un carrito activo, verificamos si el producto ya esta agregado
            const cartProduct = await CartController.cartProductQueries.show(cart.data.id, body.product_id);
            if (!cartProduct.data) { // Si no existe el producto, lo agregamos
                const cartProductData = {
                    cart_id: cart.data.id,
                    product_id: body.product_id,
                    quantity: body.quantity,
                }

                const cartProductCreated = await CartController.cartProductQueries.create(cartProductData);

                if (!cartProductCreated.ok) {
                    return res.status(JsonResponse.BAD_REQUEST).json({
                        ok: false,
                        errors: [{message: "Existen problemas al momento de cear el carrito de compras. Intente más tarde."}]
                    });
                }
            } else {
                const data = {
                    quantity: (cartProduct.data.quantity + body.quantity)
                }

                const updatedQuantity = await CartController.cartProductQueries.update(cartProduct.data.id, data);

                if (!updatedQuantity.data) {
                    errors.push({message: 'Se encontro un problema a la hora de actualizar el carrito de compras. Intente de nuevamente'});
                }

                if (errors.length > 0) {
                    return res.status(JsonResponse.BAD_REQUEST).json({
                        ok: false,
                        errors
                    });
                }
            }
        } else { // Si no hay un carrito activo, se crea y de añaden los productos
            const data = {
                client_id,
                status: 1
            }

            const cartCreated = await CartController.cartQueries.create(data);

            if (!cartCreated.ok) {
                return res.status(JsonResponse.BAD_REQUEST).json({
                    ok: false,
                    errors: [{message: "Existen problemas al momento de cear el carrito de compras. Intente más tarde."}]
                });
            }

            const cartProductData = {
                cart_id: cartCreated.data.id,
                product_id: body.product_id,
                quantity: body.quantity,
            }

            const cartProductCreated = await CartController.cartProductQueries.create(cartProductData);

            if (!cartProductCreated.ok) {
                return res.status(JsonResponse.BAD_REQUEST).json({
                    ok: false,
                    errors: [{message: "Existen problemas al momento de cear el carrito de compras. Intente más tarde."}]
                });
            }
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'Su añadio el producto al carrito de compras'
        });
    }

    public async quantity(req: Request, res: Response) {
        const body = req.body;
        const client_id = req.body.client_id;
        const errors = [];

        const productId = !req.params.productId ?
            errors.push({message: 'Favor de proporcionar el producto'}) : req.params.productId;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const updatedQuantity = await CartController.cartProductQueries.quantity(productId, body);

        if (!updatedQuantity.data) {
            errors.push({message: 'Se encontro un problema a la hora de actualizar el carrito de compras. Intente de nuevamente'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'Tu información se actualizo correctamente'
        });
    }

    public async update(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const cartId = !req.params.id || validator.isEmpty(req.params.id) ?
            errors.push({message: 'Favor de proporcionar el ID del carrito'}) : req.params.id;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const updatedCart = await CartController.cartQueries.update(cartId, body);

        if (!updatedCart.data) {
            errors.push({message: 'Existen problemas al momento de procesar el carrito. Intente de nuevamente'});
        }
        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'Tu información se actualizo correctamente'
        });
    }

    public async delete(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const cartId = !req.params.id || validator.isEmpty(req.params.id) ?
            errors.push({message: 'Favor de proporcionar el carrito de compras.'}) : req.params.id

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const findedCart = await CartController.cartQueries.show({
            id: cartId
        });

        if (!findedCart.ok) {
            errors.push({message: 'Existen problema al buscar el registro solicitado'});
        } else if (!findedCart.data) {
            errors.push({message: 'El registro no se encuentra dada de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const deletedCart = await CartController.cartQueries.delete(findedCart.data.id, { status: body.status});

        if (!deletedCart.ok) {
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

    public async deleteItem(req: Request, res: Response) {
        const body = req.body;
        const client_id = req.body.client_id;
        const errors = [];

        const cart = await CartController.cartQueries.getActiveClientCart(client_id);

        if (!cart.ok) {
            errors.push({message: 'Existen problema al buscar el registro solicitado'});
        } else if (!cart.data) {
            errors.push({message: 'El registro no se encuentra dada de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const productId = !req.params.id || validator.isEmpty(req.params.id) ?
            errors.push({message: 'Favor de proporcionar el producto a eliminar'}) : req.params.id;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }


        const cartProduct = await CartController.cartProductQueries.show(cart.data.id, productId);

        if (!cartProduct.ok) {
            errors.push({message: 'Existen problema al buscar el registro solicitado'});
        } else if (!cartProduct.data) {
            errors.push({message: 'El registro no se encuentra dada de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        console.log(cartProduct);

        const deletedCartProduct = await CartController.cartProductQueries.delete(cartProduct.data.id, productId);

        if (!deletedCartProduct.ok) {
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

    private static async downloadImages(images: any) {
        try {
            const base64Images = []
            if(Array.isArray(images)) {
                for (const image of images) {
                    const downloadedImage = await CartController.file.download(image, 'product')

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
                const downloadedImage = await CartController.file.download(images, 'product')
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