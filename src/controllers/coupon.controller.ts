import {Request, Response} from 'express'
import validator from 'validator';
import * as bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import moment from "moment";
import {JsonResponse} from '../enums/json-response';
import {CouponQueries} from "../queries/coupon.queries";
import {CouponValidator} from "../validators/coupon.validator";


export class CouponController {

    static couponQueries: CouponQueries = new CouponQueries();
    static couponValidator: CouponValidator = new CouponValidator();

    public async store(req: Request, res: Response) {
        const body = req.body;

        const user_id = req.body.user_id;

        // Validacion del request
        const validatedData = await CouponController.couponValidator.validateStore(body)

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const data = {
            user_id,
            discount_type_id: body.discount_type_id,
            uuid: uuidv4(),
            coupon: body.coupon,
            quantity: body.quantity,
            discount_amount: body.discount_amount,
            expiration: body.expiration,
            status: 1
        }

        const couponCreated = await CouponController.couponQueries.create(data)

        if (!couponCreated.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{ message: "Existen problemas al momento de dar de alta el registro. Intente más tarde"}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            message: 'El registro se ha creado correctamente'
        });
    }

    public async update(req: Request, res: Response) {
        const body = req.body;
        const errors = [];

        const couponUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar el cupón'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        // Validacion del request
        const validatedData = await CouponController.couponValidator.validateUpdate(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const coupon = await CouponController.couponQueries.show({
            uuid: couponUuid
        });

        if (!coupon.ok) {
            errors.push({message: 'Existen problemas al buscar el registro solicitado'});
        } else if (!coupon.coupon) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const updateCoupon = await CouponController.couponQueries.update(coupon.coupon.id, body);

        if (!updateCoupon.coupon) {
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
            message: 'El registro se actualizo correctamente'
        });
    }

    public async delete(req: Request, res: Response) {
        const errors = [];

        const couponUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar la categoría.'}) : req.params.uuid

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const findedCoupon = await CouponController.couponQueries.show({
            uuid: couponUuid
        });

        if (!findedCoupon.ok) {
            errors.push({message: 'Existen problemas al registro solicitado'});
        } else if (!findedCoupon.coupon) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const deletedCoupon = await CouponController.couponQueries.delete(findedCoupon.coupon.id, { status: 0});

        if (!deletedCoupon.ok) {
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
}