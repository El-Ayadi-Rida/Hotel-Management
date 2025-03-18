const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const config = require("../config/config.json")["development"];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

// ✅ Manually Import Models (To Avoid Auto-loading Issues)
db.User = require("./user");
db.Hotel = require("./hotel");

// ✅ Associate Models
db.Hotel.belongsTo(db.User, { foreignKey: "adminId", as: "admin" });
db.User.hasMany(db.Hotel, { foreignKey: "adminId", as: "hotels" });

// ✅ Add Sequelize Instances
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
