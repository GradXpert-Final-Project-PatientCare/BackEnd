'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint('Appointments', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'user_fk',
      references:{
        table: 'Users',
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('Appointments', {
      fields: ['DoctorId'],
      type: 'foreign key',
      name: 'doctor_fk',
      references:{
        table: 'Doctors',
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('Appointments', {
      fields: ['TimeslotId'],
      type: 'foreign key',
      name: 'timeslot_fk',
      references:{
        table: 'Timeslots',
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'cascade'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('Appointments','user_fk');
    await queryInterface.removeConstraint('Appointments','doctor_fk');
    await queryInterface.removeConstraint('Appointments','timeslot_fk');
  }
};
