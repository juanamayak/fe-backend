import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class LanguageModel extends Model {
    public id: number;
    public user_id: number;
    public code: string;
    public name: string;
    public status: number;
    public createdAt: string;
    public updatedAt: string;
}

LanguageModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    code: {
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
    tableName: 'languages'
});