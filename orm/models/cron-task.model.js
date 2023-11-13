export default (sequelize, DataTypes) => {
    return sequelize.define('CronTask', {
            name: DataTypes.STRING,
            interval: DataTypes.INTEGER,
            status: DataTypes.ENUM('awaiting', 'running', 'ended'),
            start_at: DataTypes.DATE,
            ran_at: DataTypes.DATE,
            runner: DataTypes.STRING,
            error_msg: DataTypes.STRING,
        }, {
            timestamps: false,
            tableName: 'cron_tasks',
            indexes: [
                {
                    name: 'fast_choose',
                    fields: ['status', 'start_at'],
                }
            ]
        }
    );
};
