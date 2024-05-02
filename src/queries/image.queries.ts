import {Op} from 'sequelize'
import {AddressModel} from '../models/address.model'
import {ImageModel} from "../models/image.model";

export class ImageQueries {

    public async index() {
        try {
            let images = await AddressModel.findAll()
            return {ok: true, images}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async create(data) {
        try {
            let image = await ImageModel.create(data);
            return {ok: true, image}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async update(addressId: any, data: any) {
        try {
            let address = await AddressModel.update(
                data, {
                    where: {
                        id: addressId,
                    }
                })
            return {ok: true, address}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async delete(imageId: any, data: any) {
        try {
            await ImageModel.destroy({
                where: {
                    id: imageId,
                }
            })
            return {ok: true}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async productImage(data: any) {
        try {
            const image = await ImageModel.findOne({
                where: {
                    imageable_id: data.imageable_id
                }
            })
            return {ok: true, image}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    public async productImages(data: any) {
        try {
            const images = await ImageModel.findAll({
                where: {
                    imageable_id: data.imageable_id
                }
            });
            return {ok: true, images}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }
}