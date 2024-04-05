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
import {ProviderModel} from "../models/provider.model";
import {ImageModel} from "../models/image.model";

export default class Relationship {
    static init() {

        ProductModel.belongsToMany(SubcategoryModel, { through: 'ProductSubcategoryModel', foreignKey: 'product_id', as: 'subcategories'});
        SubcategoryModel.belongsToMany(ProductModel, {
            through: 'ProductSubcategoryModel', // Nombre de la tabla intermedia
            foreignKey: 'subcategory_id', // Nombre de la columna que hace referencia al id de la subcategoría
            as: 'products'
        });


        ProductModel.belongsToMany(ProviderModel, { through: 'ProductProviderModel', foreignKey: 'product_id', as: 'providers'});
        ProviderModel.belongsToMany(ProductModel, {
            through: 'ProductProviderModel', // Nombre de la tabla intermedia
            foreignKey: 'provider_id', // Nombre de la columna que hace referencia al id de la subcategoría
            as: 'products'
        });

        ProductModel.hasMany(ImageModel, { foreignKey: 'imageable_id', scope: {imageable_type: 'PRODUCT'}, as: 'images' });

        /* Relaciones de Categorias */
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
        CartModel.belongsToMany(ProductModel, {through: 'CartProduct', foreignKey: 'cart_id'});
        ProductModel.belongsToMany(CartModel, {through: 'CartProduct', foreignKey: 'product_id'});




    }
}