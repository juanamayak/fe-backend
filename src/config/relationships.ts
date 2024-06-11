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
import {ProductProviderModel} from "../models/product_provider.model";
import {CartProductModel} from "../models/cart_product.model";
import {OrderController} from "../controllers/order.controller";
import {PaymentModel} from "../models/payment.model";

export default class Relationship {
    static init() {

        ProductModel.belongsToMany(SubcategoryModel, {
            through: 'ProductSubcategoryModel',
            foreignKey: 'product_id',
            as: 'subcategories'
        });
        SubcategoryModel.belongsToMany(ProductModel, {
            through: 'ProductSubcategoryModel', // Nombre de la tabla intermedia
            foreignKey: 'subcategory_id', // Nombre de la columna que hace referencia al id de la subcategoría
            as: 'products'
        });


        ProductModel.belongsToMany(ProviderModel, {
            through: ProductProviderModel,
            as: 'providers',
            foreignKey: 'product_id',
            otherKey: 'provider_id'
        });
        ProviderModel.belongsToMany(ProductModel, {
            through: ProductProviderModel,
            as: 'products',
            foreignKey: 'provider_id',
            otherKey: 'product_id'

        });

        ProductModel.hasMany(ImageModel, {
            foreignKey: 'imageable_id',
            scope: {imageable_type: 'PRODUCT'},
            as: 'images'
        });

        ProductModel.belongsTo(CategoryModel, {foreignKey: 'category_id', as: 'category'})

        CountryModel.hasMany(AddressModel, {foreignKey: 'country_id', as: 'addresses'});
        StateModel.hasMany(AddressModel, {foreignKey: 'state_id', as: 'addresses'});
        CityModel.hasMany(AddressModel, {foreignKey: 'city_id', as: 'addresses'});


        AddressModel.belongsTo(CountryModel, {foreignKey: 'country_id', as: 'country'});
        AddressModel.belongsTo(StateModel, {foreignKey: 'state_id', as: 'state'});
        AddressModel.belongsTo(CityModel, {foreignKey: 'city_id', as: 'city'});

        /* Relaciones de Categorias */
        CategoryModel.hasMany(SubcategoryModel, {foreignKey: 'category_id', as: 'subcategories'});
        // CategoryModel.belongsTo(ProductModel, {foreignKey: 'category_id', as: 'category'});

        /* Relaciones de Clients */
        ClientModel.hasMany(CartModel, {foreignKey: 'client_id'});
        CartModel.belongsTo(ClientModel, {foreignKey: 'client_id'});

        ClientModel.hasMany(AddressModel, {foreignKey: 'client_id'});
        AddressModel.belongsTo(ClientModel, {foreignKey: 'client_id'});

        ClientModel.hasMany(CitySuggestionModel, {foreignKey: 'client_id'});
        CitySuggestionModel.belongsTo(ClientModel, {foreignKey: 'client_id'});

        // ClientModel.belongsTo(OrderModel, {foreignKey: 'client_id', as: 'client'});
        OrderModel.belongsTo(ClientModel, {foreignKey: 'client_id', as: 'client'});

        ClientModel.belongsToMany(CouponModel, {through: 'ClientOrderCouponModel', foreignKey: 'client_id'});
        CouponModel.belongsToMany(ClientModel, {through: 'ClientOrderCouponModel', foreignKey: 'coupon_id'});

        /* Relaciones de Carts */
        ProductModel.belongsToMany(CartModel, {
            through: 'CartProductModel',
            foreignKey: 'product_id',
            as: 'cart'
        });
        CartModel.belongsToMany(ProductModel, {
            through: 'CartProductModel', // Nombre de la tabla intermedia
            foreignKey: 'cart_id', // Nombre de la columna que hace referencia al id de la subcategoría
            as: 'products'
        });

        ProductModel.belongsToMany(OrderModel, {
            through: 'OrderProductModel',
            foreignKey: 'product_id',
            as: 'order'
        });
        OrderModel.belongsToMany(ProductModel, {
            through: 'OrderProductModel', // Nombre de la tabla intermedia
            foreignKey: 'order_id', // Nombre de la columna que hace referencia al id de la subcategoría
            as: 'products'
        });

        OrderModel.belongsTo(AddressModel, {foreignKey: 'address_id', as: 'addresses'});

    }
}