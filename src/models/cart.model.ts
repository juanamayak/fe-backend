import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class CartModel extends Model {
    public id: number;
    public client_id: number;
    public status: number;
    public createdAt: string;
    public updatedAt: string;
}

CartModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    client_id: {
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
    tableName: 'cart'
});