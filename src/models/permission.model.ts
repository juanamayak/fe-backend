import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class PermissionModel extends Model {
    public id: number;
    public role_id: number;
    public action: string;
    public module: string;
    public active: number;
}

PermissionModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    role_id: {type: DataTypes.INTEGER},
    action: {type: DataTypes.STRING},
    module: {type: DataTypes.STRING},
    active: {type: DataTypes.INTEGER}
}, {
    sequelize: database,
    timestamps: true,
    tableName: 'permissions'
});