import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class UserModel extends Model {
    public id: number;
    public role_id: number;
    public uuid: string;
    public name: string;
    public lastname: string;
    public email: string;
    public password: string;
    public status: number;
    public createdAt: string;
    public updatedAt: string;
}

UserModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    role_id: {type: DataTypes.INTEGER},
    uuid: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    lastname: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING},
    status: {type: DataTypes.INTEGER},
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
    tableName: 'users'
});