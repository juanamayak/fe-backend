import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class OrderProductModel extends Model {
    public id: number;
    public order_id: number;
    public product_id: number;
    public order_number: string;
    public price: string;
    public createdAt: string;
    public updatedAt: string;
}

OrderProductModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.INTEGER
    },
    product_id: {
        type: DataTypes.INTEGER
    },
    order_number: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.DECIMAL
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: database,
    timestamps: true,
    tableName: 'order_product'
});