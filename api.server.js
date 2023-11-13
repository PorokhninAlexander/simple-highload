import express from "express";
import routers from "./constants/routers.js";
import userController from "./controllers/user.controller.js";
import cronController from "./controllers/cron.controller.js";

const app = express()
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(routers.user, userController)
app.use(routers.cron, cronController)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})