import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class CitySuggestionModel extends Model {
    public id: number;
    public client_id: number;
    public country_id: number;
    public state_id: number;
    public city_id: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;
}

CitySuggestionModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    client_id: {
        type: DataTypes.INTEGER
    },
    country_id: {
        type: DataTypes.INTEGER
    },
    state_id: {
        type: DataTypes.INTEGER
    },
    city_id: {
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING
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
    tableName: 'city_suggestions'
});