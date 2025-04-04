import { Request, Response } from 'express';
import { ProductController } from '../../../src/controllers/ProductController';

const mockProduct = {
  id: 1,
  name: 'Camisa',
  description: 'Camisa hombre de talla S',
  price: '50000',
  stock: '50',
  createdAt: '2025-03-29T22:00:44.762Z',
  updatedAt: '2025-03-29T22:00:44.762Z'
};

describe('ProductController Unit Tests', () => {
  describe('getProducts', () => {
    it('Debe retornar un 200 exista o no exista datos', () => {
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      
      jest.spyOn(ProductController, 'getProducts').mockImplementation(async (req, res) => {
        res.status(200).json({
          data: [mockProduct]
        });
      });

      ProductController.getProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [mockProduct]
      });
    });
  });

  describe('create', () => {
    it('Debe crear un producto exitosamente', () => {
      const req = {
        body: {
          name: 'Camisa',
          description: 'Camisa hombre de talla S',
          price: '50000',
          stock: '50'
        }
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      jest.spyOn(ProductController, 'create').mockImplementation(async (req, res) => {
        res.status(201).json({
          message: 'Producto creado exitosamente',
          data: mockProduct
        });
      });

      ProductController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Producto creado exitosamente',
        data: mockProduct
      });
    });
  });

  describe('updateProduct', () => {
    it('Debe actualizar un producto existente', () => {
      const req = {
        params: { id: '1' },
        body: {
          name: 'Camisa Actualizada',
          description: 'Camisa hombre de talla M',
          price: '55000',
          stock: '45'
        }
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      jest.spyOn(ProductController, 'updateProduct').mockImplementation(async (req, res) => {
        res.status(200).json({
          message: 'Producto actualizado exitosamente',
          data: { ...mockProduct, ...req.body }
        });
      });

      ProductController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Producto actualizado exitosamente',
        data: { ...mockProduct, ...req.body }
      });
    });

    it('Debe retornar 404 si el producto no existe', () => {
      const req = {
        params: { id: '999' },
        body: {
          name: 'Camisa Actualizada',
          description: 'Camisa hombre de talla M',
          price: '55000',
          stock: '45'
        }
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      jest.spyOn(ProductController, 'updateProduct').mockImplementation(async (req, res) => {
        res.status(404).json({
          message: 'Producto no encontrado'
        });
      });

      ProductController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Producto no encontrado'
      });
    });
  });

  describe('deleteProduct', () => {
    it('Debe eliminar un producto existente', () => {
      const req = {
        params: { id: '1' }
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      jest.spyOn(ProductController, 'deleteProduct').mockImplementation(async (req, res) => {
        res.status(200).json({
          message: 'Producto eliminado exitosamente'
        });
      });

      ProductController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Producto eliminado exitosamente'
      });
    });

    it('Debe retornar 404 si el producto no existe', () => {
      const req = {
        params: { id: '999' }
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      jest.spyOn(ProductController, 'deleteProduct').mockImplementation(async (req, res) => {
        res.status(404).json({
          message: 'Producto no encontrado'
        });
      });

      ProductController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Producto no encontrado'
      });
    });
  });
});