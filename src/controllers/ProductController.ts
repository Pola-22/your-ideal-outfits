import type { Request, Response } from 'express';
import Product from '../models/Product';

export class ProductController {

    static getProducts = async (_req: Request, res: Response): Promise<void> => {
        try {
            const products = await Product.findAll({
                where: {
                    isActive: true
                }
            });
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: 'Hubo un Error inesperado', er: error });
        }
    } 
    
    static getProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);
            
            if (!product || !product.isActive) {
                res.status(404).json({ message: 'Producto no encontrado' });
                return;
            }

            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: 'Hubo un Error inesperado' });
        }
    }

    static create = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, description, price, stock, img } = req.body;
            
            const newProduct = await Product.create({
                name,
                description,
                img,
                price,
                stock
            });

            res.status(201).json({ 
                message: 'Producto creado exitosamente',
                data: newProduct 
            });
        } catch (error) {
            res.status(500).json({ message: 'Hubo un Error inesperado' });
        }
    }

    static updateProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { name, description, price, stock, img } = req.body;

            const product = await Product.findByPk(id);
            
            if (!product) {
                res.status(404).json({ message: 'Producto no encontrado' });
                return;
            }

            await product.update({
                name,
                description,
                price,
                img,
                stock
            });

            res.status(200).json({ 
                message: 'Producto actualizado exitosamente',
                data: product 
            });
        } catch (error) {
            res.status(500).json({ message: 'Hubo un Error inesperado' });
        }
    }

    static deleteProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);
            
            if (!product) {
                res.status(404).json({ message: 'Producto no encontrado' });
                return;
            }

            product.isActive = false;
            product.stock = 0;
            await product.save();

            res.status(200).json({ 
                message: 'Producto eliminado exitosamente' 
            });
        } catch (error) {
            res.status(500).json({ message: 'Hubo un Error inesperado' });
        }
    }
}