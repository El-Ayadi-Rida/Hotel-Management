const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const config = require("../config/config.json")["development"];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

// ✅ Load Models
fs.readdirSync(__dirname)
  .filter((file) => file !== basename && file.endsWith(".js"))
  .forEach((file) => {
    const modelFile = require(path.join(__dirname, file)); 
    const model = modelFile(sequelize, Sequelize.DataTypes); // ✅ Instantiate Model
    db[model.name] = model;
  });

// ✅ Call Associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ✅ Attach Sequelize Instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
