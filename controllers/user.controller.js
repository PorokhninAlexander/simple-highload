import Router from 'express';
import {changeUserBalance} from "../services/user.service.js";
import {isId, isNumber} from "../helpers/validators.js";

const router = Router();

router.put('/balance/change/', async (req, res) => {
    const { userId, amount } = req.body;
    if (!isId(userId)) {
        res.status(400).json({error: "Invalid user id."});
        return;
    }
    if (!isNumber(amount)) {
        res.status(400).json({error: "Invalid amount."});
        return;
    }
    try {
        await changeUserBalance(userId, amount);
        res.sendStatus(200);
    } catch ({status, message}) {
        res.status(status).json({error: message});
    }

});

export default router;