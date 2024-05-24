import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class CartProductModel extends Model {
    public id: number;
    public cart_id: number;
    public product_id: number;
    public quantity: number;
}

CartProductModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    cart_id: {
        type: DataTypes.INTEGER
    },
    product_id: {
        type: DataTypes.INTEGER
    },
    quantity: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize: database,
    timestamps: false,
    tableName: 'cart_product'
});