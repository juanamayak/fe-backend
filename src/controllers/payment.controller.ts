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

export class PaymentController {

    static ordersQueries: OrderQueries = new OrderQueries();
    static ordersProductQueries: OrderProductQueries = new OrderProductQueries();
    static ordersValidator: OrderValidator = new OrderValidator();

    public async store(req: Request, res: Response) {
        const body = req.body;
        const client_id = req.body.client_id;

        // Validacion del request
        const validatedData = await PaymentController.ordersValidator.validateCreate(body)

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

        console.log(data);

        let orderCreated = await PaymentController.ordersQueries.create(data);

        if (!orderCreated.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: "Existen problemas al momento de crear la orden. Intente más tarde."}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'La orden se creo exitosamente',
            order: orderCreated.data.uuid
        });
    }

    public async intent(req: Request, res: Response) {
        const body = req.body;
        const stripe = new Stripe(process.env.STRIPE_SECRET, {apiVersion: '2024-04-10'});

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: body.amount,
                currency: body.currency
            });

            return res.status(JsonResponse.OK).json({
                ok: true,
                message: 'La intento se creo exitosamente',
                clientSecret: paymentIntent.client_secret
            });
        } catch (error) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: error.message}]
            });
        }
    }

}
