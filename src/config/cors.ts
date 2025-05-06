import { CorsOptions } from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const whitelist = process.env.CORS_WHITELIST?.split(',') ?? [];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {

    if (!origin) return callback(null, true);

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy violation: origen ${origin} no permitido`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};