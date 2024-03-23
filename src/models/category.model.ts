import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class CategoryModel extends Model {
    public id: number;
    public user_id: number;
    public uuid: string;
    public name: string;
    public status: number;
    public createdAt: string;
    public updatedAt: string;
}

CategoryModel.init({
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
    name: {
        type: DataTypes.STRING
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
    tableName: 'categories'
});