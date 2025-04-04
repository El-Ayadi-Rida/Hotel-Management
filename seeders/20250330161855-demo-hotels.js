'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const hotels = [];

    for (let i = 1; i <= 20; i++) {
      hotels.push({
        name: `Hotel ${i}`,
        location: `City ${i}`,
        description: `Description for Hotel ${i}`,
        adminId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('hotels', hotels, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('hotels', null, {});
  }
};
