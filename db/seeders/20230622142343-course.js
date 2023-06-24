'use strict';

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

    const timestamp = new Date()

    await queryInterface.bulkInsert(
      'Courses',
      [
        {
          title: 'Kursus Gratis',
          slug: 'kursus-gratis',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a ipsum eu tortor aliquam aliquam quis eu metus. Etiam tempor augue dui, sed sollicitudin justo hendrerit eu. Phasellus luctus interdum dolor, eu molestie dolor vulputate et. Nam gravida mi ut lorem varius posuere. Morbi porttitor dui in viverra laoreet.',
          price: 0,
          image: 'https://storage.googleapis.com/oceanz-bucket/1687362796885_course.jpg',
          pdf: 'https://storage.googleapis.com/oceanz-bucket/1687362798345_Moona hoshinova 3D dance.mp4',
          video: 'https://storage.googleapis.com/oceanz-bucket/1687362816701_GK2.pdf',
          instructorId: 3,
          paid: false,
          createdAt: timestamp,
          updatedAt: timestamp
        },
        {
          title: 'Kursus Berbayar',
          slug: 'kursus-berbayar',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a ipsum eu tortor aliquam aliquam quis eu metus. Etiam tempor augue dui, sed sollicitudin justo hendrerit eu. Phasellus luctus interdum dolor, eu molestie dolor vulputate et. Nam gravida mi ut lorem varius posuere. Morbi porttitor dui in viverra laoreet.',
          price: 10000,
          image: 'https://storage.googleapis.com/oceanz-bucket/1687362221277_course.jpg',
          pdf: 'https://storage.googleapis.com/oceanz-bucket/1687362222927_I Love You 3000 - Moona Hoshinova ft. Kobo Kanaeru.mp4',
          video: 'https://storage.googleapis.com/oceanz-bucket/1687362816701_GK2.pdf',
          instructorId: 2,
          paid: true,
          createdAt: timestamp,
          updatedAt: timestamp
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
    await queryInterface.bulkDelete('Courses', null, {})
  }
};
