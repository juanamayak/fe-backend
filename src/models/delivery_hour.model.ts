import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class DeliveryHourModel extends Model {
    public id: number;
    public user_id: number;
    public uuid: string;
    public start_hour: string;
    public end_hour: string;
    public special: number;
    public status: number;
    public createdAt: string;
    public updatedAt: string;
}

DeliveryHourModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    uuid: {
        type: DataTypes.STRING
    },
    start_hour: {
        type: DataTypes.STRING
    },
    end_hour: {
        type: DataTypes.STRING
    },
    special: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.INTEGER
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
    tableName: 'delivery_hours'
});