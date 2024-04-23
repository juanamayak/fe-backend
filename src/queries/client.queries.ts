import {Op} from 'sequelize'
import {AddressModel} from '../models/address.model'
import {ClientModel} from "../models/client.model";
import {ClientController} from "../controllers/client.controller";
import {UserModel} from "../models/user.model";

export class ClientQueries {

    public async show(data: any) {
        try {
            const client = await ClientModel.findOne({
                where: {
                    uuid: data.uuid
                },
                attributes: ['id', 'name', 'lastname', 'email', 'birthday', 'cellphone', 'verification_code', 'country_id', 'state_id', 'city_id', 'address', 'zip']
            })
            return {ok: true, client}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async index() {
        try {
            let clients = await ClientModel.findAll({order: [["createdAt", "ASC"]]})
            return {ok: true, clients}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async create(data) {
        try {
            let client = await ClientModel.create(data);
            return {ok: true, client}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async update(clientId: any, data: any) {
        try {
            let client = await ClientModel.update(
                data, {
                    where: {
                        id: clientId,
                    }
                })
            return {ok: true, client}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async delete(addressId: any, data: any) {
        try {
            let address = await AddressModel.update(
                data, {
                    where: {
                        id: addressId,
                    }
                })
            return {ok: true}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async findClientByEmail(email) {
        try {
            const client = await ClientModel.findOne({
                where: {
                    email
                }
            });
            return {ok: true, client}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}
