import schedule from 'node-schedule';
import {CronTimings} from "../constants/cron-timings.js";
import { getTaskForRunning} from "../services/cron.service.js";
import { runTask } from "../helpers/cron.helper.js";

export const startSchedulesRunning = (serverName) => {

    // Select task for running every minute
    // can be change if we want to run tasks more often
    schedule.scheduleJob(CronTimings.EVERY_ONE_MINUTE, async () => {
        const task = await getTaskForRunning(serverName)
        if (!task) {
            return;
        }
        await runTask(task, serverName);
    });
}