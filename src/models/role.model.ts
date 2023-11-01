import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class RoleModel extends Model {
    public id: number;
    public name: string;
}

RoleModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    }
}, {
    sequelize: database,
    timestamps: true,
    tableName: 'roles'
});