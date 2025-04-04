'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const bookings = [];

    // Simulate bookings for users 1-5, rooms 1-10
    for (let i = 1; i <= 10; i++) {
      bookings.push({
        userId: (i % 5) + 1,
        roomId: (i % 10) + 1,
        checkInDate: new Date(),
        checkOutDate: new Date(new Date().getTime() + 2 * 86400000), // +2 days
        status: 'Confirmed',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('bookings', bookings, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('bookings', null, {});
  }
};
