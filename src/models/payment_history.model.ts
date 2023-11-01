import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class PaymentHistoryModel extends Model {
    public id: number;
    public order_id: number;
    public payment_method_id: number;
    public uuid: string;
    public payment_order: string;
    public payment_date: string;
    public payer_id: string;
    public payer_name: string;
    public payer_email: string;
    public createdAt: string;
    public updatedAt: string;
}

PaymentHistoryModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    order_id: {type: DataTypes.INTEGER},
    payment_method_id: {type: DataTypes.INTEGER},
    uuid: {type: DataTypes.STRING},
    payment_order: {type: DataTypes.STRING},
    payment_date: {type: DataTypes.STRING},
    payer_id: {type: DataTypes.STRING},
    payer_name: {type: DataTypes.STRING},
    payer_email: {type: DataTypes.STRING},
    createdAt: {type: DataTypes.DATE, allowNull: true},
    updatedAt: {type: DataTypes.DATE, allowNull: true}
}, {
    sequelize: database,
    timestamps: true,
    tableName: 'payment_history'
});