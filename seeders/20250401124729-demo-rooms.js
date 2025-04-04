'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const rooms = [];

    // Create 5 rooms for each of 5 hotels (hotelId: 1-5)
    for (let hotelId = 1; hotelId <= 5; hotelId++) {
      for (let i = 1; i <= 5; i++) {
        rooms.push({
          hotelId,
          roomNumber: `R${hotelId}${i}`,
          type: ['Single', 'Double', 'Suite'][i % 3],
          price: (50 + i * 10),
          status: 'Available',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    await queryInterface.bulkInsert('rooms', rooms, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('rooms', null, {});
  }
};
