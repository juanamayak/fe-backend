import validator from 'validator';
import * as bcrypt from 'bcrypt';
import {File} from "../helpers/files";
import {Request, Response} from 'express'
import {JsonResponse} from '../enums/json-response';
import {v4 as uuidv4} from 'uuid';
import moment from "moment";
import {ImageQueries} from "../queries/image.queries";

export class ImagesController {

    static file: File = new File()
    static imagesQueries: ImageQueries = new ImageQueries();

    public async index(req: Request, res: Response) {
        let addresses = await ImagesController.imagesQueries.index()

        if (!addresses.ok) {
            return res.status(JsonResponse.BAD_REQUEST).json({
                ok: false,
                errors: [{message: 'Algo salio mal a la hora de traer las direcciones.'}]
            });
        }

        return res.status(JsonResponse.OK).json({
            ok: true,
            countries: addresses.addresses,
        })
    }

    public async store(req: Request, res: Response) {
        const images = req.files.images;
        const productId = req.body.product_id;

        if (images != null) {
            if (Array.isArray(images)) {
                for (const image of images) {
                    const uploadImage = await ImagesController.file.upload(image, productId);

                    if (!uploadImage.ok) {
                        return {
                            ok: false,
                            errors: [{message: uploadImage.message}]
                        }
                    }

                    const data = {
                        public_path: uploadImage.image.public_path,
                        media_type: uploadImage.image.media_type,
                        imageable_type: uploadImage.image.imageable_type,
                        imageable_id: uploadImage.image.imageable_id
                    }

                    const createdImage = await ImagesController.imagesQueries.create(data);
                }
            }
        }

        return res.status(JsonResponse.OK).json({
            ok: true
        });
    }

}
