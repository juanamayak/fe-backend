import {Request, Response} from 'express'
import validator from 'validator';
import * as bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import moment from "moment";
import {JsonResponse} from '../enums/json-response';
import {SubcategoryQueries} from "../queries/subcategory.queries";
import {SubcategoryValidator} from "../validators/subcategory.validator";

export class SubcategoryController {

    static subcategoriesQueries: SubcategoryQueries = new SubcategoryQueries();
    static subcategoriesValidator: SubcategoryValidator = new SubcategoryValidator();

    public async index(req: Request, res: Response) {
        let subcategories = await SubcategoryController.subcategoriesQueries.index();

        if (!subcategories.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Ocurrio un error al obtener los registros.'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            subcategories: subcategories.subcategories,
        });
    }

    public async store(req: Request, res: Response) {
        const body = req.body;

        const user_id = req.body.user_id;

        // Validacion del request
        const validatedData = await SubcategoryController.subcategoriesValidator.validateStore(body)

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
            status: 1
        }

        const subcategoryCreated = await SubcategoryController.subcategoriesQueries.create(data)

        if (!subcategoryCreated.ok) {
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

        const subcategoryUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar la categoria'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        // Validacion del request
        const validatedData = await SubcategoryController.subcategoriesValidator.validateUpdate(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const subcategory = await SubcategoryController.subcategoriesQueries.show({
            uuid: subcategoryUuid
        });

        if (!subcategory.ok) {
            errors.push({message: 'Existen problema al buscar el registro solicitado'});
        } else if (!subcategory.subcategory) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const updateSubcategory = await SubcategoryController.subcategoriesQueries.update(subcategory.subcategory.id, body);

        if (!updateSubcategory.subcategory) {
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

        const subcategoryUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar la dirección.'}) : req.params.uuid

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const findedSubcategory = await SubcategoryController.subcategoriesQueries.show({
            uuid: subcategoryUuid
        });

        if (!findedSubcategory.ok) {
            errors.push({message: 'Existen problemas al registro solicitado'});
        } else if (!findedSubcategory.subcategory) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const deletedSubcategory = await SubcategoryController.subcategoriesQueries.delete(findedSubcategory.subcategory.id, { status: 0});

        if (!deletedSubcategory.ok) {
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