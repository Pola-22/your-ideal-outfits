import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middlewares/auth';
import { handleInputErrors } from '../middlewares/validation';
import { ProductController } from '../controllers/ProductController';

const router = Router();

router.get('/product', ProductController.getProducts);

router.get('/product/:id',
    param('id')
        .notEmpty().withMessage('ID del producto es requerido').bail()
        .isNumeric().withMessage('ID del producto no válido'),
    handleInputErrors,
    ProductController.getProduct
);

router.use(authenticate);

router.post('/product', 
    body('name')
        .notEmpty().withMessage('Nombre del producto es requerido').bail()
        .isLength({ max: 100 }).withMessage('Nombre del producto debe ser máximo 100 caracteres'),
    body('description')
        .notEmpty().withMessage('Descripción del producto es requerido').bail()
        .isLength({ max: 500 }).withMessage('Nombre del producto debe ser máximo 500 caracteres'),
    body('price')
        .notEmpty().withMessage('Precios del producto es requerido').bail()
        .isNumeric().withMessage('Precio del producto no válido'),
    body('stock')
        .notEmpty().withMessage('Inventario del producto es requerido').bail()
        .isNumeric().withMessage('Inventario del producto no válido'),
    handleInputErrors,
    ProductController.create
);

router.put('/product/:id', 
    param('id')
        .notEmpty().withMessage('ID del producto es requerido').bail()
        .isNumeric().withMessage('ID del producto no válido'),
    body('name')
        .notEmpty().withMessage('Nombre del producto es requerido').bail()
        .isLength({ max: 100 }).withMessage('Nombre del producto debe ser máximo 100 caracteres'),
    body('description')
        .notEmpty().withMessage('Descripción del producto es requerido').bail()
        .isLength({ max: 500 }).withMessage('Nombre del producto debe ser máximo 500 caracteres'),
    body('price')
        .notEmpty().withMessage('Precios del producto es requerido').bail()
        .isNumeric().withMessage('Precio del producto no válido'),
    body('stock')
        .notEmpty().withMessage('Inventario del producto es requerido').bail()
        .isNumeric().withMessage('Inventario del producto no válido'),
    handleInputErrors,
    ProductController.updateProduct
);

router.delete('/product/:id',
    param('id')
        .notEmpty().withMessage('ID del producto es requerido').bail()
        .isNumeric().withMessage('ID del producto no válido'),
    handleInputErrors,
    ProductController.deleteProduct
);

export default router;