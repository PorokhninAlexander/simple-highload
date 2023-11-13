1. Create a PostgreSQL database.
2. Create a `.env` file in the root directory using the `.env.example` as a reference.
3. Run the command `npm install` to install the necessary node modules.
4. Run the command `npm run start:api` to start the API server.
5. Endpoint [PUT] user/balance/change BODY {userId: number, amount: number}
6. Run the command `npm run start:cron` to start the cron job.