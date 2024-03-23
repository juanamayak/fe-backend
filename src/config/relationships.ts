/** Aquí importamos todos los modelos creado.
 * De igual forma, en este espacio vamos a declarar cada una de las llaves foreneas.
 *  import { ExampleModel } from '../models/example.model'
 */
import {CountryModel} from "../models/country.model";
import {CityModel} from "../models/city.model";
import {StateModel} from "../models/state.model";
import {AddressModel} from "../models/address.model";
import {ClientModel} from "../models/client.model";
import {CartModel} from "../models/cart.model";
import {CitySuggestionModel} from "../models/city_suggestion.model";
import {ClientOrderCouponModel} from "../models/client_order_coupon.mode";
import {OrderModel} from "../models/order.model";
import {CouponModel} from "../models/coupons.model";
import {ProductModel} from "../models/product.model";
import {PaymentMethodModel} from "../models/payment_method.model";
import {CategoryModel} from "../models/category.model";
import {SubcategoryModel} from "../models/subcategory.model";

export default class Relationship {
    static init() {
        /**
         * Example.belongsTo(Foreign_Model_Name, { foreignKey: 'foreign_key_id', as: 'NameModel' })
         */


        // RELACIONES DE CATEGORIAS

        CategoryModel.hasMany(SubcategoryModel, {foreignKey: 'category_id', as: 'subcategories'});

        /* Relaciones de Clients */
        ClientModel.hasMany(CartModel, {foreignKey: 'client_id'});
        CartModel.belongsTo(ClientModel, {foreignKey: 'client_id'});

        ClientModel.hasMany(AddressModel, {foreignKey: 'client_id'});
        AddressModel.belongsTo(ClientModel, {foreignKey: 'client_id'});

        ClientModel.hasMany(CitySuggestionModel, {foreignKey: 'client_id'});
        CitySuggestionModel.belongsTo(ClientModel, {foreignKey: 'client_id'});

        ClientModel.hasMany(OrderModel, {foreignKey: 'client_id'});
        OrderModel.belongsTo(ClientModel, {foreignKey: 'client_id'});

        ClientModel.belongsToMany(OrderModel, {through: 'ClientOrderCouponModel', foreignKey: 'client_id'});
        OrderModel.belongsToMany(ClientModel, {through: 'ClientOrderCouponModel', foreignKey: 'order_id'});
        ClientModel.belongsToMany(CouponModel, {through: 'ClientOrderCouponModel', foreignKey: 'client_id'});
        CouponModel.belongsToMany(ClientModel, {through: 'ClientOrderCouponModel', foreignKey: 'coupon_id'});

        /* Relaciones de Carts */
        CartModel.belongsToMany(ProductModel, {through: 'CartProduct', foreignKey: 'cart_id'})
        ProductModel.belongsToMany(CartModel, {through: 'CartProduct', foreignKey: 'product_id'})


    }
}