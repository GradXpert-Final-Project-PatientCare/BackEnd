"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Doctors",
      [
        {
          nama: "Dokter 1",
          spesialis: "Sp. Jiwa",
          alamatPraktek: "Jl. Test 1",
          telepon: "08123456789",
          email: "test1@gmail.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Dokter 2",
          spesialis: "Sp. Mata",
          alamatPraktek: "Jl. Test 2",
          telepon: "08987654321",
          email: "test2@gmail.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Dokter 3",
          spesialis: "Sp. THT",
          alamatPraktek: "Jl. Test 3",
          telepon: "08192837465",
          email: "test3@gmail.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Doctors', null,{ truncate: true, cascade: true,restartIdentity:true });
  },
};
