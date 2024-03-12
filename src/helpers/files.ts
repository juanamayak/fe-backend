import fs from 'fs'
import moment from 'moment'

export class File {
    public async upload(data, last_file, type) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];

        if (!data) {
            return {
                ok: false,
                message: 'La imagen del producto es obligatoria'
            }
        }

        const fileName = data.image.name;


        // Obtener la extensión del archivo
        const fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));

        if (!allowedExtensions.includes(fileExtension)) {
            return {
                ok: false,
                message: 'El tipo de archivo no es permitido.'
            }
        }

        const size: number = data.image.size;
        const bytes: number = 1048576;
        const totalSize: number = (size / bytes);

        if(totalSize > 2.00) {
            return {
                ok: false,
                message: 'La imagen es demasiado pesada. Limite permitido: 2MB'
            }
        }

        /*



        let file: any = data.files.file
        let nameFile: number = moment().unix()
        let path: string = (type == 'tipo_uno') ? process.env.FILE_PATH :  
            (type == 'tipo_dos') ? process.env.FILE_PATH : null

        if (last_file != null) {
            try {
                fs.unlinkSync(path + last_file);
            } catch (e) {
                console.log('Error files a las: ' + moment().format('YYYY-MM-DD HH:mm:ss') + ', ' + e)
                return {
                    ok: false,
                    message: 'Existen problemas al momento de eliminar el archivo anterior'
                }
            }
        }

        file.mv(path + nameFile + '.pdf', function (e) {
            if (e) {
                console.log('Error files a las: ' + moment().format('YYYY-MM-DD HH:mm:ss') + ', ' + e)
                return {
                    ok: false,
                    message: 'Existen problemas al momento de salvar el archivo'
                }
            }
        })

        return { ok: true, nameFile: nameFile + '.pdf' }*/
    }

    public async download(name, type) {

        let path: string = (type == 'documentacion') ? process.env.DOCUMENTATION_PATH : process.env.MESSAGE_DOCS_PATH
        
        try {
            return { ok: true, pdf: fs.readFileSync(path + name) }
        } catch(e) {
            console.log('Error files a las: ' + moment().format('YYYY-MM-DD HH:mm:ss') + ', ' + e)
            return { ok: false, message: 'Existen problemas al momento de obtener el pdf!' }
        }

    }

    public async destroy(name, type) {
        let path: string = (type == 'documentacion') ? process.env.DOCUMENTATION_PATH : null

        try {
            return { ok: true, pdf: fs.unlinkSync(path + name) }
        } catch(e) {
            console.log('Error files a las: ' + moment().format('YYYY-MM-DD HH:mm:ss') + ', ' + e)
            return { ok: false, message: 'Existen problemas al momento de eliminar el pdf!' }
        }
    }
}