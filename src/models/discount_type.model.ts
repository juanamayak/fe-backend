import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class DeliveryHourModel extends Model {
    public id: number;
    public type: string;
    public status: number;
}

DeliveryHourModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize: database,
    timestamps: true,
    tableName: 'discount_types'
});