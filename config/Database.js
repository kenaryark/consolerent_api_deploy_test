import { Sequelize } from "sequelize";

const db = new Sequelize("consolerent", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
