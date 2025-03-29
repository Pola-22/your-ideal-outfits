import type { Request, Response } from 'express';
import Product from '../models/Product';

export class ProductController {

    static getProducts = async (_req: Request, res: Response): Promise<void> => {
        try {
            const products = await Product.findAll();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: 'Hubo un Error inesperado' });
        }
    } 
    
    static getProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);
            
            if (!product) {
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
            const { name, description, price, stock } = req.body;
            
            const newProduct = await Product.create({
                name,
                description,
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
            const { name, description, price, stock } = req.body;

            const product = await Product.findByPk(id);
            
            if (!product) {
                res.status(404).json({ message: 'Producto no encontrado' });
                return;
            }

            await product.update({
                name,
                description,
                price,
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

            await product.destroy();

            res.status(200).json({ 
                message: 'Producto eliminado exitosamente' 
            });
        } catch (error) {
            res.status(500).json({ message: 'Hubo un Error inesperado' });
        }
    }
}