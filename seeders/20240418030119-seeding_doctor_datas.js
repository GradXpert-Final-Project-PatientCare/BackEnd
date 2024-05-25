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
          nama: "Dr. Andi Subrata",
          spesialis: "Sp. Jiwa",
          alamatPraktek: "Jl. Merdeka No. 10, Jakarta",
          telepon: "08123456789",
          email: "andi.subrata@gmail.com",
          experience: 1,
          image_url:
            "https://images.unsplash.com/photo-1612531386530-97286d97c2d2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Dr. Budi Hartono",
          spesialis: "Sp. Anak",
          alamatPraktek: "Jl. Sudirman No. 15, Bandung",
          telepon: "08123456780",
          email: "budi.hartono@gmail.com",
          experience: 2,
          image_url:
            "https://images.unsplash.com/photo-1537368910025-700350fe46c7",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Dr. Chandra Wijaya",
          spesialis: "Sp. Kandungan",
          alamatPraktek: "Jl. Diponegoro No. 22, Surabaya",
          telepon: "08123456781",
          email: "chandra.wijaya@gmail.com",
          experience: 3,
          image_url:
            "https://images.unsplash.com/photo-1622253692010-333f2da6031d",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Dr. Dian Pertiwi",
          spesialis: "Sp. Penyakit Dalam",
          alamatPraktek: "Jl. Kartini No. 30, Medan",
          telepon: "08123456782",
          email: "dian.pertiwi@gmail.com",
          experience: 4,
          image_url:
            "https://images.unsplash.com/photo-1623854767276-5025b88735d3",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Dr. Eka Pratama",
          spesialis: "Sp. Bedah",
          alamatPraktek: "Jl. Ahmad Yani No. 50, Makassar",
          telepon: "08123456783",
          email: "eka.pratama@gmail.com",
          experience: 5,
          image_url:
            "https://images.unsplash.com/photo-1651008376811-b90baee60c1f",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Dr. Fajar Susilo",
          spesialis: "Sp. Saraf",
          alamatPraktek: "Jl. Pemuda No. 5, Yogyakarta",
          telepon: "08123456784",
          email: "fajar.susilo@gmail.com",
          experience: 6,
          image_url:
            "https://images.unsplash.com/photo-1622902046580-2b47f47f5471",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Dr. Gusti Ananda",
          spesialis: "Sp. Mata",
          alamatPraktek: "Jl. Kenari No. 18, Denpasar",
          telepon: "08123456785",
          email: "gusti.ananda@gmail.com",
          experience: 7,
          image_url:
            "https://img.freepik.com/free-photo/smiling-asian-male-doctor-pointing-upwards_1262-18321.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Dr. Herman Setiawan",
          spesialis: "Sp. Gigi",
          alamatPraktek: "Jl. Sultan Agung No. 20, Semarang",
          telepon: "08123456786",
          email: "herman.setiawan@gmail.com",
          experience: 8,
          image_url:
            "https://img.freepik.com/free-photo/doctor-isolated-white-background_1368-5787.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Dr. Iwan Santoso",
          spesialis: "Sp. Jantung",
          alamatPraktek: "Jl. Jendral Sudirman No. 45, Palembang",
          telepon: "08123456787",
          email: "iwan.santoso@gmail.com",
          experience: 9,
          image_url:
            "https://plus.unsplash.com/premium_photo-1661764878654-3d0fc2eefcca",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Dr. Joko Prasetyo",
          spesialis: "Sp. Kulit",
          alamatPraktek: "Jl. Melati No. 12, Malang",
          telepon: "08123456788",
          email: "joko.prasetyo@gmail.com",
          experience: 10,
          image_url:
            "https://img.freepik.com/free-photo/smiling-doctor-with-strethoscope-isolated-grey_651396-974.jpg",
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
    await queryInterface.bulkDelete("Doctors", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
