import type { Request, Response } from 'express';
import Order from '../models/Order';
import OrderDetail from '../models/OrderDetail';
import Product from '../models/Product';

export class OrderController {
    static getOrders = async (req: Request, res: Response): Promise<void> => {
        try {
            const orders = await Order.findAll({
                include: [{
                    model: OrderDetail,
                    include: [Product]
                }]
            });
            
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Hubo un Error inesperado' });
        }
    } 
    
    static getOrder = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const order = await Order.findByPk(id, {
                include: [{
                    model: OrderDetail,
                    include: [Product]
                }]
            });

            if (!order) {
                res.status(404).json({ message: 'Pedido no encontrado' });
                return;
            }

            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ message: 'Hubo un Error inesperado' });
        }
    } 

    static createOrder = async (req: Request, res: Response): Promise<void> => {
        try {
            const { clientName, documentNumber, numberPhone, address, orderDetail } = req.body;

            // Calcular el total del pedido y verificar stock
            let total = 0;
            for (const detail of orderDetail) {
                const product = await Product.findByPk(detail.id_product);
                if (!product) {
                    res.status(404).json({ message: `Producto con ID ${detail.id_product} no encontrado` });
                    return;
                }
                if (product.stock < detail.quantity) {
                    res.status(400).json({ 
                        message: `Stock insuficiente para el producto ${product.name}. Disponible: ${product.stock}` 
                    });
                    return;
                }
                total += product.price * detail.quantity;
            }

            // Crear el pedido
            const order = await Order.create({
                client_name: clientName,
                document_number: documentNumber,
                number_phone: numberPhone,
                address,
                total
            });

            // Crear los detalles del pedido y actualizar stock
            for (const detail of orderDetail) {
                await OrderDetail.create({
                    id_order: order.id,
                    id_product: detail.id_product,
                    quantity: detail.quantity
                });

                // Actualizar stock del producto
                const product = await Product.findByPk(detail.id_product);
                await product?.update({
                    stock: product.stock - detail.quantity
                });
            }

            // Obtener el pedido completo con sus detalles
            const createdOrder = await Order.findByPk(order.id, {
                include: [{
                    model: OrderDetail,
                    include: [Product]
                }]
            });

            res.status(201).json(createdOrder);
        } catch (error) {
            res.status(500).json({ message: 'Hubo un Error inesperado' });
        }
    }

    static updateOrder = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { clientName, documentNumber, numberPhone, address, orderDetail } = req.body;

            // Verificar si existe el pedido
            const order = await Order.findByPk(id, {
                include: [OrderDetail]
            });

            if (!order) {
                res.status(404).json({ message: 'Pedido no encontrado' });
                return;
            }

            // Restaurar el stock de los productos del pedido actual
            for (const detail of order.orderDetail) {
                const product = await Product.findByPk(detail.id_product);
                if (product) {
                    await product.update({
                        stock: product.stock + detail.quantity
                    });
                }
            }

            // Calcular nuevo total y verificar stock para los nuevos detalles
            let total = 0;
            for (const detail of orderDetail) {
                const product = await Product.findByPk(detail.id_product);
                if (!product) {
                    res.status(404).json({ message: `Producto con ID ${detail.id_product} no encontrado` });
                    return;
                }
                if (product.stock < detail.quantity) {
                    res.status(400).json({ 
                        message: `Stock insuficiente para el producto ${product.name}. Disponible: ${product.stock}` 
                    });
                    return;
                }
                total += product.price * detail.quantity;
            }

            // Actualizar el pedido
            await order.update({
                client_name: clientName,
                document_number: documentNumber,
                number_phone: numberPhone,
                address,
                total
            });

            // Eliminar detalles antiguos
            await OrderDetail.destroy({
                where: { id_order: order.id }
            });

            // Crear nuevos detalles y actualizar stock
            for (const detail of orderDetail) {
                await OrderDetail.create({
                    id_order: order.id,
                    id_product: detail.id_product,
                    quantity: detail.quantity
                });

                const product = await Product.findByPk(detail.id_product);
                await product?.update({
                    stock: product.stock - detail.quantity
                });
            }

            // Obtener el pedido actualizado
            const updatedOrder = await Order.findByPk(id, {
                include: [{
                    model: OrderDetail,
                    include: [Product]
                }]
            });

            res.status(200).json(updatedOrder);
        } catch (error) {
            res.status(500).json({ message: 'Hubo un Error inesperado' });
        }
    }

    static deleteOrder = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const order = await Order.findByPk(id, {
                include: [OrderDetail]
            });

            if (!order) {
                res.status(404).json({ message: 'Pedido no encontrado' });
                return;
            }

            // Restaurar el stock de los productos
            for (const detail of order.orderDetail) {
                const product = await Product.findByPk(detail.id_product);
                if (product) {
                    await product.update({
                        stock: product.stock + detail.quantity
                    });
                }
            }

            // Eliminar el pedido (los detalles se eliminarán en cascada)
            await order.destroy();

            res.status(200).json({ message: 'Pedido eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Hubo un Error inesperado' });
        }
    }
}