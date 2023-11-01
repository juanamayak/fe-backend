import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class ProductProviderModel extends Model {
    public id: number;
    public product_id: number;
    public provider_id: number;
}

ProductProviderModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    product_id: {type: DataTypes.INTEGER},
    provider_id: {type: DataTypes.INTEGER},
}, {
    sequelize: database,
    timestamps: true,
    tableName: 'product_provider'
});