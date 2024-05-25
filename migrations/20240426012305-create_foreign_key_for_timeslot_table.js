"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint("Timeslots", {
      fields: ["ScheduleId"],
      type: "foreign key",
      name: "schedule_fk",
      references: {
        table: "Schedules",
        field: "id",
      },
      onDelete: "restrict",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint("Timeslots", "schedule_fk");
  },
};
