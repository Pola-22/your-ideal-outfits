import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv';

dotenv.config();

const uriConnect = process.env.URI_CONECT_DB || "postgres://user:pass@localhost:5432/database";

export const instaceDB = new Sequelize(uriConnect, {
    models: [__dirname + '/../models//*']
});