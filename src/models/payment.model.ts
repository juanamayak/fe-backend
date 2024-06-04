import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class PaymentModel extends Model {
    public id: number;
    public uuid: string;
    public order_id: number;
    public transaction: string;
    public payment_date: string;
    public payment_method: string;
    public payment_status: string;
    public currency: string;
    public payer_name: string;
    public payer_email: string;
    public createdAt: string;
    public updatedAt: string;
}

PaymentModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    uuid: {type: DataTypes.STRING},
    order_id: {type: DataTypes.INTEGER},
    transaction: {type: DataTypes.STRING},
    payment_date: {type: DataTypes.STRING},
    payment_method: {type: DataTypes.STRING},
    payment_status: {type: DataTypes.STRING},
    currency: {type: DataTypes.STRING},
    payer_name: {type: DataTypes.STRING},
    payer_email: {type: DataTypes.STRING},
    createdAt: {type: DataTypes.DATE, allowNull: true},
    updatedAt: {type: DataTypes.DATE, allowNull: true}
}, {
    sequelize: database,
    timestamps: true,
    tableName: 'payments'
});