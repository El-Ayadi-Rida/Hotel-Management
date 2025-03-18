module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("rooms", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      hotelId: { 
        type: Sequelize.INTEGER, 
        allowNull: false, 
        references: { model: "hotels", key: "id" },
        onDelete: "CASCADE",
      },
      roomNumber: { type: Sequelize.STRING, allowNull: false, unique: true },
      type: { type: Sequelize.ENUM("Single", "Double", "Suite"), allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      status: { type: Sequelize.ENUM("Available", "Booked"), defaultValue: "Available" },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("rooms");
  }
};
