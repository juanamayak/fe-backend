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
import {LocationsController} from "../controllers/locations.controller";
import {MessageController} from "../controllers/message.controller";

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
    public locationsController: LocationsController = new LocationsController()
    public messagesController: MessageController = new MessageController()

    public routes(app: express.Application): void {
        // RUTAS DE USUARIOS
        app.route('/api/users').get(this.usersController.index);
        app.route('/api/users/login').post(this.usersController.login);
        app.route('/api/users/create').post(this.usersController.store);
        app.route('/api/users/update/:uuid').post(this.usersController.update);
        app.route('/api/users/status/:uuid').put(this.usersController.status);
        app.route('/api/users/delete/:uuid').put(this.usersController.delete);

        /* RUTAS DE CLIENTES */
        app.route('/api/clients').get(this.clientController.index);
        app.route('/api/clients/login').post(this.clientController.login);
        app.route('/api/clients/register').post(this.clientController.store);

        /* RUTAS DE CATEGORIAS */
        app.route('/api/categories').get(this.categoryController.index);
        app.route('/api/categories/create').post(CheckHeaders.validateJWTUser, this.categoryController.store);
        app.route('/api/categories/update').post(this.categoryController.update);
        app.route('/api/categories/delete/:uuid').put(this.categoryController.delete);

        /* RUTAS DE SUBCATEGORIES */
        app.route('/api/subcategories').get(this.subcategoryController.index);
        app.route('/api/subcategories/create').post(CheckHeaders.validateJWTUser, this.subcategoryController.store);
        app.route('/api/subcategories/update/:uuid').post(this.subcategoryController.update);
        app.route('/api/subcategories/delete/:uuid').put(this.subcategoryController.delete);

        /* RUTAS DE CUPONES */
        app.route('/api/coupons').get(this.couponController.index);
        app.route('/api/coupons/create').post(CheckHeaders.validateJWTUser, this.couponController.store);
        app.route('/api/coupons/update/:uuid').post(this.couponController.update);
        app.route('/api/coupons/status/:uuid').put(this.couponController.status);
        app.route('/api/coupons/delete/:uuid').put(this.couponController.delete);

        // RUTAS DE LOCALIDADES
        app.route('/api/countries').get(this.locationsController.countries);
        app.route('/api/states/:country_id').get(this.locationsController.states);
        app.route('/api/cities/:state_id').get(this.locationsController.cities);

        // RUTAS DE PRODUCTOS
        app.route('/api/products').get(this.productController.index);
        app.route('/api/products/create').post(this.productController.store);
        app.route('/api/products/update').post(this.productController.update);
        app.route('/api/products/delete').post(this.productController.delete);

        /* RUTAS DE PROVEEDORES  */
        app.route('/api/providers').get(this.providerController.index);
        app.route('/api/providers/create').post(CheckHeaders.validateJWTUser, this.providerController.store);
        app.route('/api/providers/update/:uuid').put(this.providerController.update);
        app.route('/api/providers/delete/:uuid').put(this.providerController.delete);

        /* RUTAS DIRECCIONES */
        app.route('/api/addresses').get(this.addressController.index);
        app.route('/api/addresses/create').post(this.addressController.store);
        app.route('/api/addresses/update').post(this.addressController.update);
        app.route('/api/addresses/delete').post(this.addressController.delete);

        /* RUTAS DEDICATORIAS */
        app.route('/api/dedications').get(this.messagesController.index);
        app.route('/api/dedications/create').post(CheckHeaders.validateJWTUser, this.messagesController.store);
        app.route('/api/dedications/update/:uuid').post(this.messagesController.update);
        app.route('/api/dedications/delete/:uuid').put(this.messagesController.delete);

        // RUTAS DE COSTOS DE ENVÍO

        // RUTAS DE CARRITO DE COMPRAS

        // RUTAS DE ORDENES

        // RUTAS DE ROLES
    }
}