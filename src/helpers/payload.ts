/* Libraries to create the jwt */
import jwt from 'jsonwebtoken'
import fs from 'fs'
import Cryptr from 'cryptr';

export class Payload {

    public createToken(data) {
        let private_key: any

        if (process.env.MODE != 'dev') {
            private_key = fs.readFileSync(process.env.PRIVATE_KEY, 'utf8')
        } else {
            private_key = fs.readFileSync('./src/keys/private.pem', 'utf8')
        }

        let cryptr = new Cryptr(process.env.CRYPTR_KEY)

        const user_id = cryptr.encrypt((data.user_id))
        const role = cryptr.encrypt((data.role))
        const room = cryptr.encrypt((data.room))

        return jwt.sign({
            user_id: user_id,
            role: role,
            room: room
        }, private_key, { algorithm: 'RS256', expiresIn: '9h' })
    }
}
