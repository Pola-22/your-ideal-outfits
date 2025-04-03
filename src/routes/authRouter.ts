import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/auth';
import { handleInputErrors } from '../middlewares/validation';
import { AuthController } from '../controllers/AuthController';

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

// router.get('/user',
//     authenticate,
//     AuthController.user
// );

export default router;