import validator from 'validator';
import * as bcrypt from 'bcrypt';
import {Request, Response} from 'express'
import {JsonResponse} from '../enums/json-response';
import {v4 as uuidv4} from 'uuid';
import {OrderValidator} from "../validators/order.validator";
import {OrderQueries} from "../queries/order.queries";
import moment from "moment";
import {OrderProductQueries} from "../queries/order_product.queries";
import {DECIMAL} from "sequelize";

export class OrderController {

    static ordersQueries: OrderQueries = new OrderQueries();
    static ordersProductQueries: OrderProductQueries = new OrderProductQueries();
    static ordersValidator: OrderValidator = new OrderValidator();

    /*public async index(req: Request, res: Response) {
        let addresses = await OrderController.addressesQueries.index()

        if (!addresses.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Algo salio mal a la hora de traer las direcciones.'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            addresses: addresses.addresses,
        })
    }*/

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
            special_price: parseFloat(body.special_price),
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
            order: orderCreated.data
        });
    }

    /*public async update(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const addressUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar la dirección'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        // Validacion del request
        const validatedData = await OrderController.addressesValidator.validateUpdate(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const address = await OrderController.addressesQueries.show({
            uuid: addressUuid
        });

        if (!address.ok) {
            errors.push({message: 'Existen problemas al buscar el registro solicitado'});
        } else if (!address.address) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const updateAddress = await OrderController.addressesQueries.update(address.address.id, body);

        if (!updateAddress.address) {
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

    public async delete(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const addressUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar la dirección.'}) : req.params.uuid

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const findedAdress = await OrderController.addressesQueries.show({
            uuid: addressUuid
        });

        if (!findedAdress.ok) {
            errors.push({message: 'Existen problema al buscar el registro solicitado'});
        } else if (!findedAdress.address) {
            errors.push({message: 'El registro no se encuentra dada de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const deletedAddress = await OrderController.addressesQueries.delete(findedAdress.address.id, { status: body.status});

        if (!deletedAddress.ok) {
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
    }*/
}
