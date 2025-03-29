import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bearer = req.headers.authorization;

        if (!bearer) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const token = bearer.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: number };
        const user = await User.findByPk(decoded.id, {
            attributes: ['id', 'email']
        });

        if (!user) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token no válido' });
    }
}