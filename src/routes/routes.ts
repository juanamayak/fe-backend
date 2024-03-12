import express from 'express'
/** Importamos todos los middlewares disponibles: */
import { CheckHeaders } from '../middlewares/headers'

/** Importamos todos los controladores disponibles */
import {ProductController} from "../controllers/product.controller";
import {UsersController} from "../controllers/users.controller";

export class Routes {

    public sessionController: UsersController = new UsersController();
    public productController: ProductController = new ProductController()

    public routes(app: express.Application): void {
        // Rutas para Usuarios

        app.route('/api/users/login').post(this.sessionController.login)

        app.route('/api/products').post(this.productController.store);
    }
}