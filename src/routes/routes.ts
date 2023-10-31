import express from 'express'

/** Importamos todos los controladores disponibles */
// import { ExampleController } from '../controllers/example.controller'

/** Importamos todos los middlewares disponibles: */
import { CheckHeaders } from '../middlewares/headers'

export class Routes {
    // public exampleController: ExampleController = new ExampleController()

    public routes(app: express.Application): void {
        /** Adjuntamos el tipo de petición que debe mandar el cliente para acceder
         *  al recurso: GET, POST, PUT, ETC 
        */
        /*app.route('/api/example')
            .get(/!*En esta parte agregamos los middlewares que sean necesarios, ejemplo: CheckHeaders.validateClientJWT*,*!/ this.exampleController.example)*/
    }
}