import {Op} from 'sequelize'
import {ProviderModel} from "../models/provider.model";
import {AddressModel} from "../models/address.model";

export class ProviderQueries {

    public async show(data: any) {
        try {
            const provider = await ProviderModel.findOne({
                where: {
                    uuid: data.uuid
                }
            })
            return {ok: true, provider}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async index() {
        try {
            let providers = await ProviderModel.findAll({
                where: {
                    status: [1, 0]
                },
                order: [["createdAt", "ASC"]]
            })
            return {ok: true, providers}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async create(data) {
        try {
            let provider = await ProviderModel.create(data);
            return {ok: true, provider}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async update(providerId: any, data: any) {
        try {
            let provider = await ProviderModel.update(
                data, {
                    where: {
                        id: providerId,
                    }
                })
            return {ok: true, provider}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async delete(providerId: any, data: any) {
        try {
            let provider = await ProviderModel.update(
                data, {
                    where: {
                        id: providerId,
                    }
                })
            return {ok: true}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}