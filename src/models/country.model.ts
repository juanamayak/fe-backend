import {Model, DataTypes} from 'sequelize'
import {database} from '../config/database'

export class CountryModel extends Model {
    public id: number;
    public uuid: string;
    public name: string;
    public iso3: string;
    public iso2: string;
    public phonecode: string;
    public capital: string;
    public currency: string;
    public currency_symbol: string;
    public tld: string;
    public native: string;
    public region: string;
    public subregion: string;
    public timezones: string;
    public translations: string;
    public latitude: string;
    public longitude: string;
    public emoji: string;
    public emojiU: string;
    public flag: number;
    public wikiDataId: string;
    public createdAt: string;
    public updatedAt: string;
}

CountryModel.init({
    id: {type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true},
    uuid: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    iso3: {type: DataTypes.STRING},
    iso2: {type: DataTypes.STRING},
    phonecode: {type: DataTypes.STRING},
    capital: {type: DataTypes.STRING},
    currency: {type: DataTypes.STRING},
    currency_symbol: {type: DataTypes.STRING},
    tld: {type: DataTypes.STRING},
    native: {type: DataTypes.STRING},
    region: {type: DataTypes.STRING},
    subregion: {type: DataTypes.STRING},
    timezones: {type: DataTypes.STRING},
    translations: {type: DataTypes.STRING},
    latitude: {type: DataTypes.DECIMAL},
    longitude: {type: DataTypes.DECIMAL},
    emoji: {type: DataTypes.STRING},
    emojiU: {type: DataTypes.STRING},
    flag: {type: DataTypes.INTEGER},
    wikiDataId: {type: DataTypes.STRING},
    createdAt: {type: DataTypes.DATE, allowNull: true},
    updatedAt: {type: DataTypes.DATE, allowNull: true}
}, {
    sequelize: database,
    timestamps: true,
    tableName: 'countries'
});