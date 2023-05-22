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
sequelize = new Sequelize(config.database, config.username, config.password, {
  dialect: "mysql",
  dialectOptions: {
    authSwitchHandler: (data, callback) => {
      if (data.pluginName === "mysql_clear_password") {
        // Use the mysql_clear_password authentication plugin
        callback(null, Buffer.from(password + "\0"));
      } else {
        callback(new Error("Unsupported authentication plugin"));
      }
    },
  },
});

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
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
