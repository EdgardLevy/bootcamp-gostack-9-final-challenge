module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('users', 'admin', {
        type: Sequelize.BOOLEAN,
        default: false,
      })
      .then(() => {
        return queryInterface.sequelize.query(
          'Update users set admin = true where admin is null'
        );
      });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'admin');
  },
};
