const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define("Room", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hotelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "hotels", key: "id" },
      onDelete: "CASCADE",
    },
    roomNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    type: { type: DataTypes.ENUM("Single", "Double", "Suite"), allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM("Available", "Booked"),
      allowNull: false,
      defaultValue: "Available",
    },
    pets: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    adults: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2
    },
    children: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    
  }, {
    timestamps: true, // Enable createdAt & updatedAt
    tableName: "rooms"
  });

  Room.associate = (models) => {
    Room.hasMany(models.Booking, { foreignKey: "roomId", as: "bookings" });
    Room.belongsTo(models.Hotel, { foreignKey: 'hotelId', as: 'hotel' }); // ✅
    Room.hasMany(models.Review, { foreignKey: 'roomId', as: 'reviews' });
  };



  return Room;
}
