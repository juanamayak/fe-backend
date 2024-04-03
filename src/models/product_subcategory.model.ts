import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class ProductSubcategoryModel extends Model {
    public id: number;
    public subcategory_id: number;
    public product_id: number;
}

ProductSubcategoryModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    subcategory_id: {type: DataTypes.INTEGER},
    product_id: {type: DataTypes.INTEGER},
}, {
    sequelize: database,
    timestamps: false,
    tableName: 'product_subcategory'
});