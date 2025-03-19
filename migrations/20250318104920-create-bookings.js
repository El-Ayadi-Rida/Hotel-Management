module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("bookings", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { 
        type: Sequelize.INTEGER, 
        allowNull: false, 
        references: { model: "users", key: "id" },
        onDelete: "CASCADE"
      },
      roomId: { 
        type: Sequelize.INTEGER, 
        allowNull: false, 
        references: { model: "rooms", key: "id" },
        onDelete: "CASCADE"
      },
      checkInDate: { type: Sequelize.DATE, allowNull: false },
      checkOutDate: { type: Sequelize.DATE, allowNull: false },
      status: { 
        type: Sequelize.ENUM("Pending", "Confirmed", "Cancelled"), 
        defaultValue: "Pending" 
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("bookings");
  }
};
