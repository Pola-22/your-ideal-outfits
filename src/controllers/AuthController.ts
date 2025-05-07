import type { Request, Response } from 'express';
import User from '../models/User';
import { checkPassword } from '../utils/auth';
import { generateJwt } from '../utils/jwt';

export class AuthController{
    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                res.status(404).json({ message: 'Usuario no existe' });
                return;
            }

            const checkPasswordResult = await checkPassword(password, user.password);
            if (!checkPasswordResult) {
                res.status(401).json({ message: 'Contraseña incorrecta' });
                return;
            }

            const token = generateJwt(user.id);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/'
            })

            res.status(200).json({ token: token });
        } catch (error) {
            res.status(500).json({ message: 'Hubo un Error inesperado' });
        }
    }
    
    static logout = async (req: Request, res: Response) => {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/'
            });

            res.status(200).json({ message: 'Sesión cerrada exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al cerrar la sesión' });
        }
    }
}