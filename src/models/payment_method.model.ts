import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class PaymentMethodModel extends Model {
    public id: number;
    public name: string;
    public status: number;
}

PaymentMethodModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {type: DataTypes.STRING},
    status: {type: DataTypes.INTEGER}
}, {
    sequelize: database,
    timestamps: true,
    tableName: 'payment_methods'
});