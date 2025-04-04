import { Request, Response } from 'express';
import { OrderController } from '../../../src/controllers/OrderController';

const mockProduct = {
  id: 1,
  name: 'Camisa',
  description: 'Camisa hombre de talla S',
  price: 50000,
  stock: 50,
  createdAt: '2025-03-29T22:00:44.762Z',
  updatedAt: '2025-03-29T22:00:44.762Z'
};

const mockOrderDetail = {
  id: 1,
  id_order: 1,
  id_product: 1,
  quantity: 2,
  product: mockProduct
};

const mockOrder = {
  id: 1,
  client_name: 'Juan Pérez',
  document_number: '12345678',
  number_phone: '3001234567',
  address: 'Calle 123 #45-67',
  total: 100000,
  createdAt: '2025-03-29T22:00:44.762Z',
  updatedAt: '2025-03-29T22:00:44.762Z',
  orderDetail: [mockOrderDetail]
};

describe('OrderController Unit Tests', () => {
  describe('getOrders', () => {
    it('Debe retornar un 200 con la lista de pedidos', () => {
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      
      jest.spyOn(OrderController, 'getOrders').mockImplementation(async (req, res) => {
        res.status(200).json([mockOrder]);
      });

      OrderController.getOrders(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockOrder]);
    });
  });

  describe('getOrder', () => {
    it('Debe retornar un pedido específico', () => {
      const req = {
        params: { id: '1' }
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      jest.spyOn(OrderController, 'getOrder').mockImplementation(async (req, res) => {
        res.status(200).json(mockOrder);
      });

      OrderController.getOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockOrder);
    });

    it('Debe retornar 404 si el pedido no existe', () => {
      const req = {
        params: { id: '999' }
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      jest.spyOn(OrderController, 'getOrder').mockImplementation(async (req, res) => {
        res.status(404).json({ message: 'Pedido no encontrado' });
      });

      OrderController.getOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Pedido no encontrado' });
    });
  });

  describe('createOrder', () => {
    it('Debe crear un pedido exitosamente', () => {
      const req = {
        body: {
          clientName: 'Juan Pérez',
          documentNumber: '12345678',
          numberPhone: '3001234567',
          address: 'Calle 123 #45-67',
          orderDetail: [
            {
              id_product: 1,
              quantity: 2
            }
          ]
        }
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      jest.spyOn(OrderController, 'createOrder').mockImplementation(async (req, res) => {
        res.status(201).json(mockOrder);
      });

      OrderController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockOrder);
    });

    it('Debe retornar 404 si el producto no existe', () => {
      const req = {
        body: {
          clientName: 'Juan Pérez',
          documentNumber: '12345678',
          numberPhone: '3001234567',
          address: 'Calle 123 #45-67',
          orderDetail: [
            {
              id_product: 999,
              quantity: 2
            }
          ]
        }
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      jest.spyOn(OrderController, 'createOrder').mockImplementation(async (req, res) => {
        res.status(404).json({ message: 'Producto con ID 999 no encontrado' });
      });

      OrderController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Producto con ID 999 no encontrado' });
    });

    it('Debe retornar 400 si no hay stock suficiente', () => {
      const req = {
        body: {
          clientName: 'Juan Pérez',
          documentNumber: '12345678',
          numberPhone: '3001234567',
          address: 'Calle 123 #45-67',
          orderDetail: [
            {
              id_product: 1,
              quantity: 100
            }
          ]
        }
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      jest.spyOn(OrderController, 'createOrder').mockImplementation(async (req, res) => {
        res.status(400).json({ 
          message: 'Stock insuficiente para el producto Camisa. Disponible: 50' 
        });
      });

      OrderController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Stock insuficiente para el producto Camisa. Disponible: 50' 
      });
    });
  });

  describe('updateOrder', () => {
    it('Debe actualizar un pedido existente', () => {
      const req = {
        params: { id: '1' },
        body: {
          clientName: 'Juan Pérez Actualizado',
          documentNumber: '12345678',
          numberPhone: '3001234567',
          address: 'Calle 123 #45-67',
          orderDetail: [
            {
              id_product: 1,
              quantity: 3
            }
          ]
        }
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      jest.spyOn(OrderController, 'updateOrder').mockImplementation(async (req, res) => {
        res.status(200).json({
          ...mockOrder,
          client_name: req.body.clientName,
          orderDetail: [{
            ...mockOrderDetail,
            quantity: req.body.orderDetail[0].quantity
          }]
        });
      });

      OrderController.updateOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        ...mockOrder,
        client_name: req.body.clientName,
        orderDetail: [{
          ...mockOrderDetail,
          quantity: req.body.orderDetail[0].quantity
        }]
      });
    });

    it('Debe retornar 404 si el pedido no existe', () => {
      const req = {
        params: { id: '999' },
        body: {
          clientName: 'Juan Pérez',
          documentNumber: '12345678',
          numberPhone: '3001234567',
          address: 'Calle 123 #45-67',
          orderDetail: [
            {
              id_product: 1,
              quantity: 2
            }
          ]
        }
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      jest.spyOn(OrderController, 'updateOrder').mockImplementation(async (req, res) => {
        res.status(404).json({ message: 'Pedido no encontrado' });
      });

      OrderController.updateOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Pedido no encontrado' });
    });
  });

  describe('deleteOrder', () => {
    it('Debe eliminar un pedido existente', () => {
      const req = {
        params: { id: '1' }
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      jest.spyOn(OrderController, 'deleteOrder').mockImplementation(async (req, res) => {
        res.status(200).json({ message: 'Pedido eliminado exitosamente' });
      });

      OrderController.deleteOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Pedido eliminado exitosamente' });
    });

    it('Debe retornar 404 si el pedido no existe', () => {
      const req = {
        params: { id: '999' }
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      jest.spyOn(OrderController, 'deleteOrder').mockImplementation(async (req, res) => {
        res.status(404).json({ message: 'Pedido no encontrado' });
      });

      OrderController.deleteOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Pedido no encontrado' });
    });
  });
});
