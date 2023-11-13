import {Op} from "sequelize";
import {ServiceErrorException} from "../helpers/service-error.helper.js";
import orm from '../orm/models/index.js';
import {delay, getRandomInt} from "../helpers/utils.helper.js";
import Timings from "../constants/timings.js";
const { User } = orm;


const changeUserBalance = async (userId, amount) => {
    try {
        const [[, updatedCount]] = await User.decrement('balance', {
            by: amount,
            where: {
                id: userId,
                balance: {[Op.gte]: amount}
            }
        });

        if (!updatedCount) {
            const user = await User.findOne({
                where: {
                    id: userId,
                }
            });
            if (!user) {
                throw new ServiceErrorException(404, "User not found.")
            }
            throw new ServiceErrorException(400, "User does not have enough balance.")
        }
    } catch (error) {
        console.error(error);
        if (error instanceof ServiceErrorException) {
            throw error;
        }
        throw new ServiceErrorException()
    }
}

const getUserBalanceWithRandomDelay = async () => {
    await delay(getRandomInt(Timings.minToMs * 2, Timings.minToMs * 3));
    return (await User.findOne({}))?.balance
}
const checkUserWithRandomDelayAndError = async () => {
    await delay(getRandomInt(Timings.minToMs * 2, Timings.minToMs * 3));
    const user = await User.findOne({});
    if(user) {
        throw new ServiceErrorException(404, "User exist.")
    }
}

export {
    changeUserBalance,
    getUserBalanceWithRandomDelay,
    checkUserWithRandomDelayAndError
}