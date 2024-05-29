import {Request, Response} from 'express'
import * as bcrypt from 'bcrypt';
import {JsonResponse} from '../enums/json-response';
import {Payload} from "../helpers/payload";
import {Mailer} from "../helpers/mailer";
import {CartValidator} from "../validators/cart.validator";
import {CartQueries} from "../queries/cart.queries";
import {CartProductQueries} from "../queries/cart_product.queries";

export class CartController {
    static salt = bcrypt.genSaltSync(Number(process.env.NO_SALT));
    static cartQueries: CartQueries = new CartQueries();
    static cartProductQueries: CartProductQueries = new CartProductQueries();
    static cartValidator: CartValidator = new CartValidator();
    static payload: Payload = new Payload();
    static mailer: Mailer = new Mailer();

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

        let cart = await CartController.cartQueries.show(client_id)

        if (!cart.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Algo salio mal a la hora de traer el carrito de compras.'}]
            });
        }

        const simplifiedCart = {
            id: cart.data.id,
            client_id: cart.data.client_id,
            status: cart.data.status,
            createdAt: cart.data.createdAt,
            updatedAt: cart.data.updatedAt,
            products: cart.data['products'].map(product => ({
                id: product.id,
                user_id: product.user_id,
                category_id: product.category_id,
                uuid: product.uuid,
                name: product.name,
                price: product.price,
                sku: product.sku,
                discount_percent: product.discount_percent,
                description: product.description,
                status: product.status,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                quantity: product.CartProductModel.quantity // Aquí simplificamos el quantity
            }))
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

    /*

    public async addressUpdate(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const clientUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar el usuario'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        // Validacion del request
        const validatedData = await ClientController.clientValidator.validateUpdateAddress(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const client = await ClientController.clientQueries.show({
            uuid: clientUuid
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

        const updatedClient = await ClientController.clientQueries.update(client.client.id, body);

        if (!updatedClient.client) {
            errors.push({message: 'Existen problemas al momento de actualizar el registro. Intente de nuevamente'});
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

    public async login(req: Request, res: Response) {
        const body = req.body
        const errors = [];

        // Validacion del request
        const validatedData = await ClientController.clientValidator.validateLogin(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const clientExists = await ClientController.clientQueries.findClientByEmail(body.email);

        if (!clientExists.ok) {
            errors.push({message: 'Se encontraron algunos errores al iniciar la sesión. Por favor, inténtalo de nuevo más tarde o contacta con soporte si el problema persiste.'});
        } else if (!clientExists.client) {
            errors.push({message: 'Error al verificar la existencia del usuario.'});
        } else if (!bcrypt.compareSync(body.password, clientExists.client.password)) {
            errors.push({message: 'Email o contraseña incorrectos.'});
        } else if ([0, -2].includes(clientExists.client.status)) {
            errors.push({message: 'Su cuenta aún no ha sido verificada o ha sido dada de baja.'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }


        const data = {
            user_type: 'client',
            client_id: clientExists.client ? clientExists.client.id.toString() : false
        }

        /!* Creamos el JWT del cliente *!/
        const JWTCreated = await ClientController.payload.createToken(data);

        if (JWTCreated && !JWTCreated.ok) {
            errors.push({message: 'Existen problemas al momento de crear el token de autenticación.'})
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            token: JWTCreated ? JWTCreated.token : false,
            uuid: clientExists.client.uuid
        });
    }

    public async verify(req: Request, res: Response){
        const body = req.body;
        const errors = [];

        const clientUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'El usuario es obligatorio.'}) : req.params.uuid;

        const verificationCode = !req.params.code || validator.isEmpty(req.params.code) ?
            errors.push({message: 'El código de verificación es obligatorio.'}) : req.params.code;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const client = await ClientController.clientQueries.show({
            uuid: clientUuid
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

        if (verificationCode !== client.client.verification_code) {
            errors.push({message: 'El código de verficación es incorrecto'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const data = {
            account_verified: '1',
            status: 1
        }

        const verifiedAccount = await ClientController.clientQueries.update(client.client.id, data);

        if (!verifiedAccount.client) {
            errors.push({message: 'Se encontro un problema a la hora de activar la cuenta. Intente de nuevamente'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'El usuario se verifico y activo correctamente'
        });
    }
}*/

}