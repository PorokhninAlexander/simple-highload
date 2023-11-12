'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable({tableName: 'users', schema: process.env.DB_SCHEMA}, {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            balance: {
                type: Sequelize.DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
        })
        await queryInterface.sequelize.query(`
            INSERT INTO ${process.env.DB_SCHEMA}.users (balance) VALUES (10000);
        `)

    },

    down: async (queryInterface, _Sequelize) => {
        await queryInterface.dropTable({tableName: 'users', schema: process.env.DB_SCHEMA});
    }
};