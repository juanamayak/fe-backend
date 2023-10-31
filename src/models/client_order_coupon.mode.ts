import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class ClientOrderCouponModel extends Model {
    public id: number;
    public client_id: number;
    public order_id: number;
    public coupon_id: number;
}

ClientOrderCouponModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    client_id: {
        type: DataTypes.INTEGER
    },
    order_id: {
        type: DataTypes.INTEGER
    },
    coupon_id: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize: database,
    timestamps: true,
    tableName: 'client_order_coupon'
});