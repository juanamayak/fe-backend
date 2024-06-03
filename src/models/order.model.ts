import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class OrderModel extends Model {
    public id: number;
    public client_id: number;
    public address_id: number;
    public delivery_hour_id: number;
    public uuid: string;
    public order_number: string;
    public delivery_date: string;
    public subtotal: string;
    public discount: string;
    public special_price: string;
    public delivery_price: string;
    public with_coupon: string;
    public coupon_discount: string;
    public total: string;
    public currency: string;
    public sign: string;
    public message: string;
    public status: number;
    public createdAt: string;
    public updatedAt: string;
}

OrderModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    client_id: {type: DataTypes.INTEGER},
    address_id: {type: DataTypes.INTEGER},
    delivery_hour_id: {type: DataTypes.INTEGER},
    uuid: {type: DataTypes.STRING},
    order_number: {type: DataTypes.STRING},
    delivery_date: {type: DataTypes.DATE},
    subtotal: {type: DataTypes.DECIMAL},
    discount: {type: DataTypes.DECIMAL},
    special_price: {type: DataTypes.DECIMAL},
    delivery_price: {type: DataTypes.DECIMAL},
    with_coupon: {type: DataTypes.DECIMAL},
    coupon_discount: {type: DataTypes.DECIMAL},
    total: {type: DataTypes.DECIMAL},
    currency: {type: DataTypes.STRING},
    sign: {type: DataTypes.STRING},
    message: {type: DataTypes.STRING},
    status: {type: DataTypes.INTEGER},
    createdAt: {type: DataTypes.DATE,allowNull: true},
    updatedAt: {type: DataTypes.DATE, allowNull: true}
}, {
    sequelize: database,
    timestamps: true,
    tableName: 'orders'
});