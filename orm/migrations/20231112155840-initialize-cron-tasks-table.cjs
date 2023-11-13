'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const schema = process.env.DB_SCHEMA;
    const tableName = 'cron_tasks';
    await queryInterface.createTable({tableName, schema}, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      interval: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.DataTypes.ENUM('awaiting', 'running', 'ended', 'failed'),
        allowNull: false,
        defaultValue: 'awaiting',
      },
      start_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      ran_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      runner: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      error_msg: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      }
    })
    await queryInterface.sequelize.query(`CREATE INDEX "fast_choose" ON ${schema}.${tableName} (status, start_at)`);

    // generate 10 test tasks
    for (let i = 1; i <= 10; i++) {
      const name = `task_${i}`;
      await queryInterface.sequelize.query({ query: `INSERT INTO ${schema}.${tableName} (name, interval, start_at) VALUES (?, 10000, NOW())`, values: [name]});
    }
  },

  async down (queryInterface, Sequelize) {
    const schema = process.env.DB_SCHEMA;
    const tableName = 'cron_tasks';

    await queryInterface.sequelize.query('DROP INDEX fast_choose');
    await queryInterface.dropTable({tableName, schema});
  }
};