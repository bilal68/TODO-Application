const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const mysql = require("mysql2");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
// eslint-disable-next-line import/no-dynamic-require
const config = require(`${__dirname}/../config/config.js`)[env];
const db = {};

initialize();
let sequelize;
async function initialize() {
  // create db if it doesn't already exist
  const { host, username, password, database, dialect } = config;
  const connection = await mysql.createConnection({
    host,
    user: username,
    password,
  });
 await connection
    .promise()
    .query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
}
// Connect to DB
sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
sequelize.sync({ force: false, alter: true }); //use to create model directly

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
