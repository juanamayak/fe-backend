import {Op} from 'sequelize'
import {RoleModel} from "../models/role.model";
import {PermissionModel} from "../models/permission.model";

export class PermissionsQueries {

    public async show(data: any) {
        try {
            const address = await RoleModel.findOne({
                where: {
                    uuid: data.uuid
                }
            })
            return {ok: true, address}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async index() {
        try {
            let roles = await PermissionModel.findAll();
            return {ok: true, roles}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}
