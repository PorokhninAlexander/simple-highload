const express = require("express");
const {Sequelize, DataTypes, Op} = require("sequelize");

const app = express()
const port = process.env.PORT || 8080;

const sequelize= new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        schema: process.env.DB_SCHEMA,
        logging: false,
    }
);

const User = sequelize.define('User', {
        balance: DataTypes.FLOAT,
    }, {
        timestamps: false,
        tableName: 'users'
    }
);

app.use(express.json());

app.put('/user/decrement', async (req, res) => {
    const { userId, amount } = req.body;

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
                res.status(404).json({ error: "User not found." });
                return;
            }
            res.status(400).json({ error: "User does not have enough balance." });
            return;
        }

        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Something went wrong."});
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})