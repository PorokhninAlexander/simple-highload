import Router from 'express';
import {getRunningTasks} from "../services/cron.service.js";
import {getTaskInfo} from "../helpers/cron.helper.js";

const router = Router();

router.get('/running-tasks', async (req, res) => {
    const tasks = await getRunningTasks();
    res.status(200).json(tasks.map(task => getTaskInfo(task)));
});

export default router;