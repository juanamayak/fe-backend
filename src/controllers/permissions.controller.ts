import validator from 'validator';
import * as bcrypt from 'bcrypt';
import {Request, Response} from 'express'
import {JsonResponse} from '../enums/json-response';
import {RolesQueries} from "../queries/roles.queries";
import {PermissionsQueries} from "../queries/permissions.queries";

export class PermissionsController {

    static permissionsQueries: PermissionsQueries = new PermissionsQueries();

    public async assign(req: Request, res: Response) {
        let roles = await PermissionsController.permissionsQueries.index()

        if (!roles.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Algo salio mal a la hora de traer los roles.'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            roles: roles.roles,
        });
    }
}
