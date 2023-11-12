import {Op} from "sequelize";
import {ServiceError} from "../helpers/service-error.js";
import orm from '../orm/models/index.js';
const { User } = orm;


export const changeUserBalance = async (userId, amount) => {
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
                throw new ServiceError(404, "User not found.")
            }
            throw new ServiceError(400, "User does not have enough balance.")
        }
    } catch (error) {
        console.error(error);
        if (error instanceof ServiceError) {
            throw error;
        }
        throw new ServiceError()
    }
}