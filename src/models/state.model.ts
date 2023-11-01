import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class StateModel extends Model {
    public id: number;
    public country_id: number;
    public country_code: string;
    public uuid: string;
    public name: string;
    public fips_code: string;
    public iso2: string;
    public latitude: string;
    public longitude: string;
    public flag: number;
    public wikiDataId: string;
    public createdAt: string;
    public updatedAt: string;
}

StateModel.init({
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
    uuid: {
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
    tableName: 'states'
});