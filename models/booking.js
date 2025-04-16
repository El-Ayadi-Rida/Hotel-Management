const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define("Booking", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      references: { model: "users", key: "id" },
      onDelete: "CASCADE"
    },
    roomId: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      references: { model: "rooms", key: "id" },
      onDelete: "CASCADE"
    },
    checkInDate: { type: DataTypes.DATE, allowNull: false },
    checkOutDate: { type: DataTypes.DATE, allowNull: false },
    status: { 
      type: DataTypes.ENUM("Pending", "Confirmed", "Cancelled"), 
      defaultValue: "Pending" 
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    config: {
      type: DataTypes.JSON, // For nested info: adults, children, pets
      allowNull: false
    }
    
  }, {
    timestamps: true,
    tableName: "bookings"
  });

  // // ✅ Define Associations
  Booking.associate = (models) => {
    Booking.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Booking.belongsTo(models.Room, { foreignKey: 'roomId', as: 'room' }); // ✅ must exist
  };
    
    

  return Booking ;
}