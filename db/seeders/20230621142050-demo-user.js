'use strict';

const bcrypt = require('bcryptjs')
const { Role } = require('../../app/models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const password = 'anugrah123'
    const encryptedPassword = bcrypt.hashSync(password, 10)
    const timestamp = new Date()

    const role = await Role.findOne({
      where: {
        name: 'USER',
      },
    })

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'Anugrah',
          lastName: 'Kresnaya',
          email: 'anugrahkresnaya.ak@gmail.com',
          encryptedPassword,
          gender: 'male',
          photoProfile: 'https://ik.imagekit.io/kaze/Anugrah_Kresnaya_-_Fullstack_Web_Development_-_Batch_3_BN6GQfxw0.png',
          dateOfBirth: '2001-12-17 07:00:00.000 +0700',
          phoneNumber: '087771232122',
          roleId: role.id,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          firstName: 'Kazuha',
          lastName: '',
          email: 'kazuha@gmail.com',
          encryptedPassword,
          gender: 'female',
          photoProfile: 'https://ik.imagekit.io/kaze/kazuha.jpg?updatedAt=1687357619801',
          dateOfBirth: '2001-12-17 07:00:00.000 +0700',
          phoneNumber: '087771232121',
          roleId: role.id,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          firstName: 'Night',
          lastName: 'Ouroboros',
          email: 'nightouroboros@gmail.com',
          encryptedPassword,
          gender: 'male',
          photoProfile: '',
          dateOfBirth: '2001-12-17 07:00:00.000 +0700',
          phoneNumber: '087771232121',
          roleId: role.id,
          createdAt: timestamp,
          updatedAt: timestamp,
        }
      ],
      {}
    )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {})
  }
};
