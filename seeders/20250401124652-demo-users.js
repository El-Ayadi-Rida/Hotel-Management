'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await bcrypt.hash('123456', 10);

    const users = [];
    for (let i = 1; i <= 10; i++) {
      users.push({
        username: `customer${i}`,
        email: `customer${i}@example.com`,
        password,
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('users', users, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
