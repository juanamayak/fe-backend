import validator from 'validator';
import * as bcrypt from 'bcrypt';
import {Request, Response} from 'express'
import {JsonResponse} from '../enums/json-response';
import {v4 as uuidv4} from 'uuid';
import {OrderValidator} from "../validators/order.validator";
import {OrderQueries} from "../queries/order.queries";
import moment from "moment";
import {OrderProductQueries} from "../queries/order_product.queries";
import Stripe from 'stripe';
import {ImageQueries} from "../queries/image.queries";
import {File} from "../helpers/files";

export class OrderController {
    static file: File = new File();
    static ordersQueries: OrderQueries = new OrderQueries();
    static ordersProductQueries: OrderProductQueries = new OrderProductQueries();
    static ordersValidator: OrderValidator = new OrderValidator();
    static imageQueries: ImageQueries = new ImageQueries();


    public async show(req: Request, res: Response) {
        const errors = [];

        const orderUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar el producto'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const order = await OrderController.ordersQueries.show({
            uuid: orderUuid
        });

        if (!order.ok) {
            errors.push({message: 'Existen problemas al buscar el registro solicitado'});
        } else if (!order.data) {
            errors.push({message: 'El registro no se encuentra o ya fue procesado'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            order: order.data
        });
    }

    public async clientsShow(req: Request, res: Response) {
        const errors = [];

        const orderUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar el producto'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const order = await OrderController.ordersQueries.show({
            uuid: orderUuid
        });

        if (!order.ok) {
            errors.push({message: 'Existen problemas al buscar el registro solicitado'});
        } else if (!order.data) {
            errors.push({message: 'El registro no se encuentra o ya fue procesado'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            order: order.data
        });
    }

    public async index(req: Request, res: Response) {
        let orders = await OrderController.ordersQueries.index();

        if (!orders.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Algo salio mal a la hora de traer las direcciones.'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            orders: orders.data,
        })
    }

    public async clientsIndex(req: Request, res: Response) {
        const clientId = req.body.client_id;

        let orders = await OrderController.ordersQueries.clientsIndex(clientId);

        if (!orders.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Algo salio mal a la hora de traer las direcciones.'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            orders: orders.data,
        })
    }

    public async store(req: Request, res: Response) {
        const body = req.body;
        const client_id = req.body.client_id;

        // Validacion del request
        const validatedData = await OrderController.ordersValidator.validateCreate(body)

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const data = {
            client_id,
            uuid: uuidv4(),
            delivery_date: body.delivery_date,
            delivery_hour_id: body.delivery_hour_id,
            order_number: `OR${client_id}${moment().unix()}`,
            subtotal: parseFloat(body.subtotal),
            special_price: body.special_price !== '' ? parseFloat(body.special_price) : null,
            delivery_price: parseFloat(body.delivery_price),
            total: parseFloat(body.total),
            currency: 'MXN',
            status: 0 // borrador creado
        }


        let orderCreated = await OrderController.ordersQueries.create(data);

        if (!orderCreated.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: "Existen problemas al momento de crear la orden. Intente más tarde."}]
            });
        }

        for (const product of body.products) {
            const orderProductData = {
                order_id: orderCreated.data.id,
                product_id: product.id,
                order_number: orderCreated.data.order_number,
                quantity: product.quantity,
                price: product.price
            }

            const orderProductCreated = await OrderController.ordersProductQueries.create(orderProductData);

            if (!orderProductCreated.ok) {
                return res.status(JsonResponse.BAD_REQUEST).json({
                    ok: false,
                    errors: [{message: "Existen problemas al momento de crear los productos. Intente más tarde."}]
                });
            }
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'La orden se creo exitosamente',
            order: orderCreated.data.uuid
        });
    }

    public async update(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const orderUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar la dirección'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        // Validacion del request
        const validatedData = await OrderController.ordersValidator.validateUpdate(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const order = await OrderController.ordersQueries.show({
            uuid: orderUuid
        });

        if (!order.ok) {
            errors.push({message: 'Existen problemas al buscar el registro solicitado'});
        } else if (!order.data) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const data = {
            address_id: body.address_id,
            message: body.message,
            sign: body.sign,
            status: 1 // pendiente
        }

        const updatedOrder = await OrderController.ordersQueries.update(order.data.id, data);

        if (!updatedOrder.data) {
            errors.push({message: 'Se encontro un problema a la hora de actualizar la dirección. Intente de nuevamente'});
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

    public async changeStatus(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const orderUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar la orden'}) : req.params.uuid;

        const status: string = !body.status || validator.isEmpty(body.status) ?
            errors.push({message: 'El estatus es obligatorio'}) : body.status;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const order = await OrderController.ordersQueries.show({
            uuid: orderUuid
        });

        if (!order.ok) {
            errors.push({message: 'Existen problemas al buscar el registro solicitado'});
        } else if (!order.data) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const updatedOrder = await OrderController.ordersQueries.update(order.data.id, body);

        if (!updatedOrder.data) {
            errors.push({message: 'Se encontro un problema a la hora de actualizar la orden. Intente de nuevamente'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'El estatus de la orden se cambio exitosamente'
        });
    }
}
