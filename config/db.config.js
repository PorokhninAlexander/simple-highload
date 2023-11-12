import dotenv from 'dotenv';
dotenv.config()

export default {
  "username": process.env.DB_USER,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_NAME,
  "schema": process.env.DB_SCHEMA,
  "host": process.env.DB_HOST,
  "dialect": "postgres",
  "port": process.env.DB_PORT,
  "pool": {
    min: 0,
    max: 10,
    acquire: 30000,
    idle: 10000
  }
}
