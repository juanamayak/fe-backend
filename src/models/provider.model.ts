import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class ProviderModel extends Model {
    public id: number;
    public user_id: number;
    public country_id: number;
    public state_id: number;
    public city_id: number;
    public uuid: string;
    public name: string;
    public address: string;
    public colony: string;
    public zip: string;
    public responsable_name: string;
    public responsable_lastname: string;
    public responsable_email: string;
    public responsable_cellphone: string;
    public status: number;
    public createdAt: string;
    public updatedAt: string;
}

ProviderModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {type: DataTypes.INTEGER},
    country_id: {type: DataTypes.INTEGER},
    state_id: {type: DataTypes.INTEGER},
    city_id: {type: DataTypes.INTEGER},
    uuid: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    address: {type: DataTypes.STRING},
    colony: {type: DataTypes.STRING},
    zip: {type: DataTypes.STRING},
    responsable_name: {type: DataTypes.STRING},
    responsable_lastname: {type: DataTypes.STRING},
    responsable_email: {type: DataTypes.STRING},
    responsable_cellphone: {type: DataTypes.STRING},
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
    tableName: 'providers'
});