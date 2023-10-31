import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class CategoryModel extends Model {
    public id: number;
    public category_id: number;
    public product_id: number;
}

CategoryModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    category_id: {
        type: DataTypes.INTEGER
    },
    product_id: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize: database,
    timestamps: true,
    tableName: 'category_product'
});