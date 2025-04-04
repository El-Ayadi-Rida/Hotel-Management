module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('rooms', 'adults', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 2
    });
    await queryInterface.addColumn('rooms', 'children', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('rooms', 'pets', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('rooms', 'adults');
    await queryInterface.removeColumn('rooms', 'children');
    await queryInterface.removeColumn('rooms', 'pets');
  }
};
