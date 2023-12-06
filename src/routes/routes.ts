import express from 'express'
/** Importamos todos los middlewares disponibles: */
import { CheckHeaders } from '../middlewares/headers'

/** Importamos todos los controladores disponibles */
import {ProductController} from "../controllers/product.controller";

export class Routes {
    public productController: ProductController = new ProductController()

    public routes(app: express.Application): void {
        /** Adjuntamos el tipo de petición que debe mandar el cliente para acceder
         *  al recurso: GET, POST, PUT, ETC 
        */
        app.route('/api/products').post(this.productController.store);
    }
}