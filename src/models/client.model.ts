import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class ClientModel extends Model {
    public id: number;
    public country_id: number;
    public state_id: number;
    public city_id: number;
    public uuid: string;
    public greeting: string;
    public name: string;
    public lastname: string;
    public email: string;
    public password: string;
    public birthday: string;
    public cellphone: number;
    public newsletter: string;
    public terms_and_conditions: number;
    public facebook_id: string;
    public facebook_token: string;
    public verification_code: number;
    public account_verified: string;
    public status: number;
    public createdAt: string;
    public updatedAt: string;
}

ClientModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
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
    greeting: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    lastname: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    birthday: {
        type: DataTypes.STRING
    },
    cellphone: {
        type: DataTypes.INTEGER
    },
    newsletter: {
        type: DataTypes.STRING
    },
    terms_and_conditions: {
        type: DataTypes.STRING
    },
    verification_code: {
        type: DataTypes.STRING
    },
    facebook_id: {
        type: DataTypes.STRING
    },
    facebook_token: {
        type: DataTypes.TEXT
    },
    account_verified: {
        type: DataTypes.STRING,
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
    tableName: 'clients'
});