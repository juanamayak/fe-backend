import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class ImageModel extends Model {
    public id: number;
    public path: string;
    public name: string;
    public media_type: string;
    public imageable_type: string;
    public imageable_id: number;
    public createdAt: string;
    public updatedAt: string;
}

ImageModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    path: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    media_type: {
        type: DataTypes.STRING
    },
    imageable_type: {
        type: DataTypes.STRING
    },
    imageable_id: {
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
    tableName: 'images'
});