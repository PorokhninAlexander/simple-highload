import express from "express";
import http from "http";
import { startSchedulesRunning } from './cron/scheduler.cron.js';
import cluster from 'cluster';
import os from 'os'

if (cluster.isMaster) {
    const cpusCount = os.cpus().length;
    const defaultForksCount = 5;

    const forksCount = cpusCount < defaultForksCount ? cpusCount : defaultForksCount;

    for (let i = 0; i < forksCount; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    const app = express();
    const server = http.Server(app);
    const PORT = Number(process.env.PORT) || 3000;

    server.listen(PORT, () => {
        console.info(`Cron api running on port ${PORT}`, new Date().toISOString());
        startSchedulesRunning(process.pid);
    }).on('error', (err) => console.error(`Error starting server: ${err}`));

    console.log(`Worker ${process.pid} started`);
}