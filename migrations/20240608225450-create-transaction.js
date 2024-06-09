'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      DoctorId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      TimeslotId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      keterangan: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      token: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};