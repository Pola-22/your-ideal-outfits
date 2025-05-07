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

            const order = await Order.create({
                client_name: clientName,
                document_number: documentNumber,
                number_phone: numberPhone,
                address,
                total
            });

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

            const createdOrder = await Order.findByPk(order.id, {
                include: [{
                    model: OrderDetail,
                    include: [Product]
                }]
            });

            res.status(201).json(createdOrder);
        } catch (error) {
            res.status(500).json({ message: 'Hubo un Error inesperado', error: error });
        }
    }

    static updateOrder = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { clientName, documentNumber, numberPhone, address, orderDetail } = req.body;

            const order = await Order.findByPk(id, {
                include: [OrderDetail]
            });

            if (!order) {
                res.status(404).json({ message: 'Pedido no encontrado' });
                return;
            }

            for (const detail of order.orderDetail) {
                const product = await Product.findByPk(detail.id_product);
                if (product) {
                    await product.update({
                        stock: product.stock + detail.quantity
                    });
                }
            }

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

            await order.update({
                client_name: clientName,
                document_number: documentNumber,
                number_phone: numberPhone,
                address,
                total
            });

            await OrderDetail.destroy({
                where: { id_order: order.id }
            });

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

            for (const detail of order.orderDetail) {
                const product = await Product.findByPk(detail.id_product);
                if (product) {
                    await product.update({
                        stock: product.stock + detail.quantity
                    });
                }
            }

            await order.destroy();

            res.status(200).json({ message: 'Pedido eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Hubo un Error inesperado' });
        }
    }
}