'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('bookings', 'config', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {} // ✅ Ensure it's not null
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('bookings', 'config');
  }
};
