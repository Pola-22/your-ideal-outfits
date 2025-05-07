import { Router } from 'express';
import { body } from 'express-validator';
import { handleInputErrors } from '../middlewares/validation';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/login', 
    body('email')
        .notEmpty().withMessage('El correo es requerido').bail()
        .isEmail().withMessage('El correo no es válido'),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida').bail()
        .isLength({ min: 6, max: 50 }).withMessage('Contraseña no válida'),
    handleInputErrors,
    AuthController.login
);

router.use(authenticate);

router.post('/logout', AuthController.logout);

export default router;