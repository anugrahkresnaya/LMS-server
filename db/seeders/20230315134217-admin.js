'use strict'

const bcrypt = require('bcryptjs')
const { Role } = require('../../app/models')

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
    const password = 'thisisadmin123'
    const encryptedPassword = bcrypt.hashSync(password, 10)
    const timestamp = new Date()

    const role = await Role.findOne({
      where: {
        name: 'ADMIN',
      },
    })

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'admin',
          email: 'adminlms@gmail.com',
          encryptedPassword,
          roleId: role.id,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {})
  },
}
