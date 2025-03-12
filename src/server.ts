import express from 'express';
import { instaceDB } from './config/db';
import authRouter from './routes/authRouter';


async function connectDB() {
    try {
        await instaceDB.authenticate();
        instaceDB.sync();
        console.log('Connection has been established successfully');
    } catch (error) {
        console.error('Error connect database');
    }
}

connectDB();
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

export default app;