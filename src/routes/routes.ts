import express from 'express'
/** Importamos todos los middlewares disponibles: */
import { CheckHeaders } from '../middlewares/headers'

/** Importamos todos los controladores disponibles */
import {ProductController} from "../controllers/product.controller";
import {UsersController} from "../controllers/users.controller";
import {ClientController} from "../controllers/client.controller";
import {AddressController} from "../controllers/address.controller";
import {CategoryController} from "../controllers/category.controller";
import {CouponController} from "../controllers/coupon.controller";
import {DeliveryHourController} from "../controllers/delivery_hour.controller";
import {ProviderController} from "../controllers/provider.controller";
import {SubcategoryController} from "../controllers/subcategory.controller";

export class Routes {
    public addressController: AddressController = new AddressController()
    public categoryController: CategoryController = new CategoryController()
    public couponController: CouponController = new CouponController()
    public deliveryHourController: DeliveryHourController = new DeliveryHourController()
    public productController: ProductController = new ProductController()
    public providerController: ProviderController = new ProviderController()
    public subcategoryController: SubcategoryController = new SubcategoryController()
    public clientController: ClientController = new ClientController()
    public usersController: UsersController = new UsersController()

    public routes(app: express.Application): void {
        // RUTAS DE USUARIOS
        app.route('/api/users/login').post(this.usersController.login)

        app.route('/api/products').post(this.productController.store);

        /* RUTAS DE CLIENTES */
        app.route('/api/clients/register').post(this.clientController.store);
        app.route('/api/clients/login').post(this.clientController.login);

        /* RUTAS DIRECCIONES */
        app.route('/api/addresses').get(this.addressController.index);
        app.route('/api/addresses/create').post(this.addressController.store);
        app.route('/api/addresses/update').post(this.addressController.update);
        app.route('/api/addresses/delete').post(this.addressController.delete);

        /* RUTAS DE CATEGORIAS */
        app.route('/api/categories').get(this.categoryController.index);
        app.route('/api/categories/create').post(this.categoryController.store);
        app.route('/api/categories/update').post(this.categoryController.update);
        app.route('/api/categories/delete').post(this.categoryController.delete);

        /* RUTAS DE SUBCATEGORIES */
        app.route('/api/subcategories').get(this.subcategoryController.index);
        app.route('/api/subcategories/create').post(this.subcategoryController.store);
        app.route('/api/subcategories/update').post(this.subcategoryController.update);
        app.route('/api/subcategories/delete').post(this.subcategoryController.delete);

        /* RUTAS DE CATEGORIAS */
        // app.route('/api/coupons').get(this.couponController.index);
        app.route('/api/coupons/create').post(this.couponController.store);
        app.route('/api/coupons/update').post(this.couponController.update);
        app.route('/api/coupons/delete').post(this.couponController.delete);

        /* RUTAS DE HORARIOS  */
        app.route('/api/hours').get(this.deliveryHourController.index);
        app.route('/api/hours/create').post(this.deliveryHourController.store);
        app.route('/api/hours/update').post(this.deliveryHourController.update);
        app.route('/api/hours/delete').post(this.deliveryHourController.delete);

        /* RUTAS DE PROVEEDORES  */
        app.route('/api/providers').get(this.providerController.index);
        app.route('/api/providers/create').post(this.providerController.store);
        app.route('/api/providers/update').post(this.providerController.update);
        app.route('/api/providers/delete').post(this.providerController.delete);
    }
}