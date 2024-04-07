import fs from 'fs'
import moment from 'moment'

export class File {
    public async upload(image, imageName, type) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        const imageExtension = image.name.toLowerCase().substring(image.name.lastIndexOf('.'));

        if (!image) {
            return {
                ok: false,
                message: 'La imagen del producto es obligatoria'
            }
        }

        if (!allowedExtensions.includes(imageExtension)) {
            return {
                ok: false,
                message: 'El tipo de archivo no es permitido.'
            }
        }

        const size: number = image.size;
        const bytes: number = 1048576;
        const totalSize: number = (size / bytes);

        if (totalSize > 2.00) {
            return {
                ok: false,
                message: 'La imagen es demasiado pesada. Limite permitido: 2MB'
            }
        }

        let path: string;

        switch (type) {
            case 'product':
                path = process.env.PROD_IMAGES_PATH;
                break
            default:
                return {
                    ok: false,
                    message: 'Favor de proporcionar un archivo con extensión válida'
                }
        }


        image.mv(path + imageName, function (e) {
            if (e) {
                console.log('Error files a las: ' + moment().format('YYYY-MM-DD HH:mm:ss') + ', ' + e)
                return {
                    ok: false,
                    message: 'Existen problemas al momento de salvar el archivo'
                }
            }
        })

        return {ok: true, imageName}
    }

    public async download(image, type) {

        // let path: string = (type == 'product') ? process.env.PROD_IMAGES_PATH : '';

        try {
            return {
                ok: true,
                image: {
                    file: {
                        name: image.name,
                        type: image.media_type,
                    },
                    url: fs.readFileSync(image.path, {encoding: 'base64'})
                }
            }
        } catch (e) {
            console.log('Error files a las: ' + moment().format('YYYY-MM-DD HH:mm:ss') + ', ' + e)
            return {ok: false, message: 'Existen problemas al momento de obtener la imagen'}
        }

    }

    public async destroy(name, type) {
        let path: string = (type == 'documentacion') ? process.env.DOCUMENTATION_PATH : null

        try {
            return {ok: true, pdf: fs.unlinkSync(path + name)}
        } catch (e) {
            console.log('Error files a las: ' + moment().format('YYYY-MM-DD HH:mm:ss') + ', ' + e)
            return {ok: false, message: 'Existen problemas al momento de eliminar el pdf!'}
        }
    }
}