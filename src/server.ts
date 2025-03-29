import express from 'express';
import { instaceDB } from './config/db';
import authRouter from './routes/authRouter';
import productRouter from './routes/productRouter'
import orderRouter from './routes/orderRouter'


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
app.use('/api', productRouter);
app.use('/api', orderRouter);

export default app;