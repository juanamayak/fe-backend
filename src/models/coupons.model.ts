import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class CouponModel extends Model {
    public id: number;
    public user_id: number;
    public uuid: string;
    public coupon: string;
    public quantity: number;
    public discount_percent: number;
    public expiration: string;
    public status: number;
    public createdAt: string;
    public updatedAt: string;
}

CouponModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {type: DataTypes.INTEGER},
    uuid: {type: DataTypes.STRING},
    coupon: {type: DataTypes.STRING},
    quantity: {type: DataTypes.NUMBER},
    discount_percent: {type: DataTypes.NUMBER},
    expiration: {type: DataTypes.DATE},
    status: {type: DataTypes.INTEGER},
    createdAt: {type: DataTypes.DATE, allowNull: true},
    updatedAt: {type: DataTypes.DATE, allowNull: true}
}, {
    sequelize: database,
    timestamps: true,
    tableName: 'coupons'
});