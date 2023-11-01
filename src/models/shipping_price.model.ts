import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class ShippingPriceModel extends Model {
    public id: number;
    public name: string;
    public price: string;
    public status: number;
}

ShippingPriceModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {type: DataTypes.STRING},
    price: {type: DataTypes.DECIMAL},
    status: {type: DataTypes.INTEGER},
}, {
    sequelize: database,
    timestamps: true,
    tableName: 'providers'
});