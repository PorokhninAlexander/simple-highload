import dbConfig from "../../config/db.config.js";

import Sequelize from "sequelize";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const db = {};

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    schema: dbConfig.schema,
    logging: 0,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const files = (fs.readdirSync(__dirname))
    .filter((file) => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js'
        );
    })
for (let file of files) {
    const model = (await import(path.join(__dirname, file))).default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;