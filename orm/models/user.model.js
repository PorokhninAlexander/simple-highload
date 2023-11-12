export default (sequelize, DataTypes) => {
    return sequelize.define('User', {
            balance: DataTypes.FLOAT,
        }, {
            timestamps: false,
            tableName: 'users'
        }
    );
};
