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
import {PaymentValidator} from "../validators/payment.validator";
import {PaymentQueries} from "../queries/payment.queries";

export class PaymentController {

    static paymentQueries: PaymentQueries = new PaymentQueries();
    static paymentValidator: PaymentValidator = new PaymentValidator();

    public async store(req: Request, res: Response) {
        const body = req.body;
        const client_id = req.body.client_id;

        // Validacion del request
        const validatedData = await PaymentController.paymentValidator.validateStore(body)

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const data = {
            uuid: uuidv4(),
            order_id: body.order_id,
            transaction: body.transaction,
            payment_date: body.payment_date,
            payment_method: body.payment_method,
            payment_status: body.payment_status,
            currency: body.currency,
            payer_name: body.payer_name,
            payer_email: body.payer_email
        }

        let paymentCreated = await PaymentController.paymentQueries.create(data);

        if (!paymentCreated.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: "Existen problemas al momento de crear la orden. Intente más tarde."}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'La orden se creo exitosamente',
            payment: paymentCreated.data
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
