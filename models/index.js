const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

// Load all models dynamically
fs.readdirSync(__dirname)
  .filter(file => (
    file.indexOf(".") !== 0 &&
    file !== basename &&
    file.slice(-3) === ".js"
  ))
  .forEach(file => {
    const modelPath = path.join(__dirname, file);
    const imported = require(modelPath);

    const model = typeof imported === 'function'
      ? imported(sequelize, Sequelize.DataTypes) // ✅ Model factory
      : imported; // ✅ Already defined model

    db[model.name] = model;
  });

// Register associations if defined
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export everything
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
