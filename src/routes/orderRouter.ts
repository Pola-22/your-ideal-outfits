import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middlewares/auth';
import { handleInputErrors } from '../middlewares/validation';
import { OrderController } from '../controllers/OrderController';
import OrderDetail from '../models/OrderDetail';

const router = Router();

router.post('/', 
    body('clientName')
        .notEmpty().withMessage('Nombre del cliente es requerido').bail()
        .isLength({ max: 200 }).withMessage('Nombre del cliente debe ser máximo 200 caracteres'),
    body('documentNumber')
        .notEmpty().withMessage('Número documento de identidad es requerido').bail()
        .isNumeric().withMessage('Número documento de identidad no válido').bail()
        .isLength({ min: 7, max: 100 }).withMessage('Número documento de identidad no válido'),
    body('numberPhone')
        .notEmpty().withMessage('Número de teléfono es requerido').bail()
        .isNumeric().withMessage('Número de teléfono no válido').bail()
        .isLength({ min: 10, max: 20 }).withMessage('Número de teléfono no válido'),
    body('address')
        .notEmpty().withMessage('La dirección es requerida').bail()
        .isLength({ max: 500 }).withMessage('La dirección debe ser máximo 500 caracteres'),
    body('orderDetail')
        .notEmpty().withMessage('El detalle del pedido es requerido').bail()
        .isArray().withMessage('El detalle del pedido debe ser un array').bail()
        .custom((value) => {
            if (!value.every((item: OrderDetail) => 
                typeof item.id_product === 'number' && 
                typeof item.quantity === 'number' && item.quantity > 0
            )) {
                throw new Error('Formato inválido en el detalle del pedido');
            }
            return true;
        }),
    handleInputErrors,
    OrderController.createOrder
);

router.use(authenticate);

router.get('/', OrderController.getOrders);

router.get('/:id',
    param('id')
        .notEmpty().withMessage('ID del pedido es requerido').bail()
        .isNumeric().withMessage('ID del pedido no válido'),
    handleInputErrors,
    OrderController.getOrder
);

router.put('/:id', 
    param('id')
        .notEmpty().withMessage('ID del pedido es requerido').bail()
        .isNumeric().withMessage('ID del pedido no válido'),
    body('clientName')
        .notEmpty().withMessage('Nombre del cliente es requerido').bail()
        .isLength({ max: 200 }).withMessage('Nombre del cliente debe ser máximo 200 caracteres'),
    body('documentNumber')
        .notEmpty().withMessage('Número documento de identidad es requerido').bail()
        .isNumeric().withMessage('Número documento de identidad no válido').bail()
        .isLength({ min: 7, max: 100 }).withMessage('Número documento de identidad no válido'),
    body('numberPhone')
        .notEmpty().withMessage('Número de teléfono es requerido').bail()
        .isNumeric().withMessage('Número de teléfono no válido').bail()
        .isLength({ min: 10, max: 20 }).withMessage('Número de teléfono no válido'),
    body('address')
        .notEmpty().withMessage('La dirección es requerida').bail()
        .isLength({ max: 500 }).withMessage('La dirección debe ser máximo 500 caracteres'),
    body('orderDetail')
        .notEmpty().withMessage('El detalle del pedido es requerido').bail()
        .isArray().withMessage('El detalle del pedido debe ser un array').bail()
        .custom((value) => {
            if (!value.every((item: OrderDetail) => 
                typeof item.id_product === 'number' && 
                typeof item.quantity === 'number' && item.quantity > 0
            )) {
                throw new Error('Formato inválido en el detalle del pedido');
            }
            return true;
        }),
    handleInputErrors,
    OrderController.updateOrder
);

router.delete('/:id',
    param('id')
        .notEmpty().withMessage('ID del pedido es requerido').bail()
        .isNumeric().withMessage('ID del pedido no válido'),
    handleInputErrors,
    OrderController.deleteOrder
);

export default router;