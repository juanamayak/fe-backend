import {Request, Response} from 'express'
import validator from 'validator';
import * as bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import moment from "moment";
import {JsonResponse} from '../enums/json-response';
import {CategoryValidator} from "../validators/category.validator";
import {CategoryQueries} from "../queries/category.queries";


export class CategoryController {

    static categoriesQueries: CategoryQueries = new CategoryQueries();
    static categoriesValidator: CategoryValidator = new CategoryValidator();

    public async show(req: Request, res: Response) {
        const errors = [];

        const categoryUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar la categoria'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        console.log('hola')

        const category = await CategoryController.categoriesQueries.show({
            uuid: categoryUuid
        });


        if (!category.ok) {
            errors.push({message: 'Existen problemas al buscar el registro solicitado'});
        } else if (!category.category) {
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
            category: category.category
        });
    }

    public async index(req: Request, res: Response) {
        let categories = await CategoryController.categoriesQueries.index();

        if (!categories.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Ocurrio un error al obtener los registros.'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            categories: categories.categories,
        });
    }

    public async store(req: Request, res: Response) {
        const body = req.body;
        const user_id = req.body.user_id;

        // Validacion del request
        const validatedData = await CategoryController.categoriesValidator.validateStore(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const data = {
            user_id,
            uuid: uuidv4(),
            name: body.name,
            status: 1
        }

        const categoryCreated = await CategoryController.categoriesQueries.create(data)

        if (!categoryCreated.ok) {
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

        const categoryUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar la categoria'}) : req.params.uuid;

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        // Validacion del request
        const validatedData = await CategoryController.categoriesValidator.validateUpdate(body);

        if (!validatedData.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: validatedData.errors
            });
        }

        const category = await CategoryController.categoriesQueries.show({
            uuid: categoryUuid
        });

        if (!category.ok) {
            errors.push({message: 'Existen problema al buscar la categoria solicitada'});
        } else if (!category.category) {
            errors.push({message: 'La categoria no se encuentra dada de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const updateCategory = await CategoryController.categoriesQueries.update(category.category.id, body);

        if (!updateCategory.category) {
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

        const categoryUuid = !req.params.uuid || validator.isEmpty(req.params.uuid) ?
            errors.push({message: 'Favor de proporcionar la categoría.'}) : req.params.uuid

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const findedCategory = await CategoryController.categoriesQueries.show({
            uuid: categoryUuid
        });

        if (!findedCategory.ok) {
            errors.push({message: 'Existen problemas al registro solicitado'});
        } else if (!findedCategory.category) {
            errors.push({message: 'El registro no se encuentra dado de alta'});
        }

        if (errors.length > 0) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors
            });
        }

        const deletedCategory = await CategoryController.categoriesQueries.delete(findedCategory.category.id, { status: -1});

        if (!deletedCategory.ok) {
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