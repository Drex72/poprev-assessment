import { Sequelize } from "sequelize";
import { config } from "./config";
import * as pg from "pg";

const { dbHost, dbName, dbPassword, dbType, dbUser } = config?.db;

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbType,
  dialectModule: pg,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  sync: { alter: { drop: true } },
  ssl: true,
});
