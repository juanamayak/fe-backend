import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class TranslateModel extends Model {
    public id: number;
    public languaje_id: number;
    public language_uuid: string;
    public name: string;
    public description: string;
    public translatable_type: string;
    public translatable_id: number;
    public createdAt: string;
    public updatedAt: string;
}

TranslateModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    languaje_id: {type: DataTypes.INTEGER},
    language_uuid: {type: DataTypes.STRING},
    category_id: {type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
    translatable_type: {type: DataTypes.STRING},
    translatable_id: {type: DataTypes.INTEGER},
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
    tableName: 'translates'
});