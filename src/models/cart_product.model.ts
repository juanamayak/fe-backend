import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class CartpProductModel extends Model {
    public id: number;
    public cart_id: number;
    public product_id: number;
    public order_number: string;
    public status: number;
}

CartpProductModel.init({
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
    order_number: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.INTEGER
    },
}, {
    sequelize: database,
    timestamps: true,
    tableName: 'cart_product'
});