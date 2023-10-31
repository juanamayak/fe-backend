import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class CityModel extends Model {
    public id: number;
    public country_id: number;
    public country_code: string;
    public state_id: number;
    public state_code: string;
    public name: string;
    public latitude: string;
    public longitude: string;
    public flag: number;
    public wikiDataId: string;
    public createdAt: string;
    public updatedAt: string;
}

CityModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    country_id: {
        type: DataTypes.INTEGER
    },
    country_code: {
        type: DataTypes.STRING
    },
    state_id: {
        type: DataTypes.INTEGER
    },
    state_code: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    latitude: {
        type: DataTypes.DECIMAL
    },
    longitude: {
        type: DataTypes.DECIMAL
    },
    flag: {
        type: DataTypes.INTEGER
    },
    wikiDataId: {
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
    tableName: 'cities'
});