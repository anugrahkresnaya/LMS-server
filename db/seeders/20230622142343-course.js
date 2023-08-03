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
          image: 'https://storage.googleapis.com/oceanz-bucket/1687667361654_course.jpg',
          video: 'https://storage.googleapis.com/oceanz-bucket/1687616319884_bali-ads.mp4',
          pdf: 'https://storage.googleapis.com/oceanz-bucket/1689850073269_materi-ajar-anugrah-kresnaya.pdf',
          instructorId: 3,
          paid: false,
          createdAt: timestamp,
          updatedAt: timestamp
        },
        {
          title: 'Visualisasi Data Statik ke Visualisasi Data Interaktif',
          slug: 'visualisasi-data-statik-ke-visualisasi-data-interaktif',
          description: 'Kursus ini adalah kursus yang akan membantu anda untuk memahami bagaimana cara mengubah visualisasi data statik ke visualisasi data interaktif. Kursus ini berupa tutorial yang akan menuntun anda secara bertahap. Kursus ini akan menggunakan bahasa pemrograman Python yang dimana menggunakan dua library paling populer, yaitu Bokeh dan Plotly. Dua library ini akan menghasilkan visualisasi data interaktif yang telah diolah dan dapat dieskplor oleh user secara lebih luas dan real-time.',
          price: 10000,
          image: 'https://storage.googleapis.com/oceanz-bucket/1687667361654_course.jpg',
          video: 'https://storage.googleapis.com/oceanz-bucket/1687667363371_video-materi-ajar-chapter-3-anugrah-kresnaya.mp4',
          pdf: 'https://storage.googleapis.com/oceanz-bucket/1687667639572_materi-ajar-anugrah-kresnaya.pdf',
          instructorId: 2,
          paid: true,
          createdAt: timestamp,
          updatedAt: timestamp
        },
        {
          title: 'Assessment Disposal by Golder',
          slug: 'assessment-disposal-by-golder',
          description: '',
          price: 66666,
          image: '',
          video: null,
          pdf: 'https://storage.googleapis.com/oceanz-bucket/1690057914094_final-report-basic-engineering-waste-dump-.pdf',
          instructorId: 4,
          paid: true,
          createdAt: timestamp,
          updatedAt: timestamp
        },
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
