import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { instaceDB } from './config/db';
import authRouter from './routes/authRouter';
import productRouter from './routes/productRouter';
import orderRouter from './routes/orderRouter';
import { corsOptions } from './config/cors';

export async function connectDB() {
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
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

export default app;