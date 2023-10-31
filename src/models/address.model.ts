import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class AddressModel extends Model {
    public id: number;
    public client_id: number;
    public country_id: number;
    public state_id: number;
    public city_id: number;
    public uuid: string;
    public name_receiver: string;
    public phone_receiver: string;
    public address: string;
    public colony: string;
    public references: string;
    public latitude: string;
    public longitude: string;
    public zip: number;
    public status: number;
    public createdAt: string;
    public updatedAt: string;
}

AddressModel.init({
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
    uuid: {
        type: DataTypes.STRING
    },
    name_receiver: {
        type: DataTypes.STRING
    },
    phone_receiver: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
    colony: {
        type: DataTypes.STRING
    },
    references: {
        type: DataTypes.STRING
    },
    latitude: {
        type: DataTypes.STRING
    },
    longitude: {
        type: DataTypes.STRING
    },
    zip: {
        type: DataTypes.INTEGER
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
    tableName: 'addresses',
    timestamps: true
});
