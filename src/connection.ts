import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { Contact } from "./models/contacts";

dotenv.config();

const connection = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "",
  database: "contact_database",
  logging: true,
  models: [Contact],
});

export default connection;