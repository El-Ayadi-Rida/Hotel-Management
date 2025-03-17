module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("hotels", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      location: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      adminId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" } },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("hotels");
  }
};
