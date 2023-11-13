import {Op} from "sequelize";
import {ServiceErrorException} from "../helpers/service-error.helper.js";
import orm from '../orm/models/index.js';
import updateWithGettingCount from "../helpers/update-with-getting-count.helper.js";
import CronTaskStatuses from "../constants/cron-task-statuses.js";
import * as sequelize from "sequelize";
const { CronTask } = orm;

const getTaskForRunning = async (serverName) => {
    try {
        let task = await CronTask.findOne({
            where: {
                status: CronTaskStatuses.AWAITING,
                start_at: {
                    [Op.lte]: new Date(),
                },
                // remove this condition if need to run tasks with equal names on different servers
                name: {[Op.notIn]: sequelize.literal(`(SELECT name FROM ${process.env.DB_SCHEMA}.cron_tasks WHERE status = '${CronTaskStatuses.RUNNING}')`)}
            },
            order: [
                ['start_at', 'ASC']
            ]
        });
        if (!task) {
            return null;
        }
        const isSelected = await selectCronTask(task.id, serverName);
        if (!isSelected) {
            task = await getTaskForRunning(serverName)
        }
        return task;
    } catch (error) {
        console.error(error);
        throw new ServiceErrorException()
    }
};

const getRunningTasks = () => {
    return CronTask.findAll({where: {status: CronTaskStatuses.RUNNING}})
}

const selectCronTask = async (id, runner) => {
    const updatedCount = await updateWithGettingCount(
        CronTask,
        {
            id,
            status: CronTaskStatuses.AWAITING
        },
        {
            status: CronTaskStatuses.RUNNING,
            runner,
            ran_at: new Date()
        }
    )

    return Boolean(updatedCount);
}

const rescheduleCronTask = async (task) => {
    if (!task.interval) {
        return;
    }
    await CronTask.create({
        status: CronTaskStatuses.AWAITING,
        start_at: new Date(new Date().getTime() + task.interval),
        name: task.name,
        interval: task.interval,
    })
}

const failCronTask = async (task, errorMsg) => {
    await CronTask.update({
        status: CronTaskStatuses.FAILED,
        error_msg: errorMsg
    }, {
        where: {
            id: task.id,
        }
    })
}

const completeCronTask = async (task) => {
    // we can store completed task in an another table (example cron_logs)
    // because it's not good if we will have very big table with indexes and not used data
    await CronTask.update({
        status: CronTaskStatuses.ENDED,
    }, {
        where: {
            id: task.id,
        }
    })
}

export {
    getTaskForRunning,
    rescheduleCronTask,
    failCronTask,
    completeCronTask,
    getRunningTasks
}