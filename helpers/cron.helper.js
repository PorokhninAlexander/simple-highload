import { getUserBalanceWithRandomDelay, checkUserWithRandomDelayAndError } from '../services/user.service.js';
import { completeCronTask, failCronTask, rescheduleCronTask } from '../services/cron.service.js';

const tasks = {
    'task_1': () => getUserBalanceWithRandomDelay(),
    'task_2': () => getUserBalanceWithRandomDelay(),
    'task_3': () => getUserBalanceWithRandomDelay(),
    'task_4': () => getUserBalanceWithRandomDelay(),
    'task_5': () => getUserBalanceWithRandomDelay(),
    'task_6': () => getUserBalanceWithRandomDelay(),
    'task_7': () => getUserBalanceWithRandomDelay(),
    'task_8': () => getUserBalanceWithRandomDelay(),
    'task_9': () => getUserBalanceWithRandomDelay(),
    'task_10': () => checkUserWithRandomDelayAndError(),
}
const getFunctionByCronName = (name) => {
    return tasks[name];
}

const runTask = async (task, serverName) => {
    console.info(`Running task ${task.name} on the server #${serverName}`)
    const fn = getFunctionByCronName(task.name);
    try {
        await fn();
        await completeCronTask(task);
    } catch (error) {
        await failCronTask(task, error.message);
    }
    await rescheduleCronTask(task);
    console.info(`Task ${task.name} finished`)

}

const getTaskInfo = (task) => {
    return {
        name: task.name,
        runner: task.runner,
        timeSinceStart: new Date().getTime() - new Date(task.ran_at).getTime(),
    }
}

export {
    getFunctionByCronName,
    runTask,
    getTaskInfo
}