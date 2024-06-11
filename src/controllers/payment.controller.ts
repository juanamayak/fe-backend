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
                currency: body.currency,
                payment_method_types: [body.payment_method],
                description: 'Compra en FloreriaEnvios.com',
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

    public async webhook(req: Request, res: Response) {
        const event = req.body;
        const errors = [];

        switch (event.type) {
            case 'payment_intent.succeeded':
                const transaction = event.data.object.id;
                const payment = await PaymentController.paymentQueries.showByTransaction({
                    transaction: transaction
                });

                if (!payment.ok) {
                    errors.push({message: 'Existen problemas al buscar el registro solicitado'});
                } else if (!payment.data) {
                    errors.push({message: 'El registro no se encuentra dado de alta'});
                }

                if (errors.length > 0) {
                    return res.status(JsonResponse.BAD_REQUEST).json({
                        ok: false,
                        errors
                    });
                }

                const updatedPayment = await PaymentController.paymentQueries.update(payment.data.id, {
                    payment_status: event.data.object.status.toUpperCase()
                });

                if (!updatedPayment.data) {
                    errors.push({message: 'Se encontro un problema a la hora de actualizar la dirección. Intente de nuevamente'});
                }

                if (errors.length > 0) {
                    return res.status(JsonResponse.BAD_REQUEST).json({
                        ok: false,
                        errors
                    });
                }

                break;
            case 'payment_intent.payment_failed':
                const failedPaymentIntent = event.data.object;
                // Actualizar el estado del pedido a 'fallido' en la base de datos
                console.log(failedPaymentIntent.metadata.orderId)
                break;
            case 'payment_intent.canceled':
                const canceledPaymentIntent = event.data.object;
                // Actualizar el estado del pedido a 'cancelado' en la base de datos
                console.log(canceledPaymentIntent.metadata.orderId)
                break;
            default:
                // Manejar otros tipos de eventos si es necesario
                break;
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'El registro se actualizo correctamente'
        });
    }

}
