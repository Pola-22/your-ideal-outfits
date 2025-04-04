import { createRequest, createResponse } from 'node-mocks-http';
import { AuthController } from '../../../src/controllers/AuthController';
import { checkPassword } from '../../../src/utils/auth';
import { generateJwt } from '../../../src/utils/jwt';
import User from '../../../src/models/User';

jest.mock('../../../src/utils/auth');
jest.mock('../../../src/utils/jwt');
jest.mock('../../../src/models/User', () => ({
  findOne: jest.fn(),
}));

describe('AuthController.login', () => {
  it('Should return 404 when user not found', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);  
      
      const req = createRequest({
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: 'test@test.com',
          password: 'password'
        }
      });
      const res = createResponse();

      await AuthController.login(req, res);

      const data = res._getJSONData();
      expect(res.statusCode).toBe(404);
      expect(data).toEqual({ message: 'Usuario no existe' });
  });

  it('Should return 401 when password is incorrect', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      password: 'password'
    });  
    
    const req = createRequest({
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: 'test@test.com',
        password: 'passwords'
      }
    });
    const res = createResponse();

    (checkPassword as jest.Mock).mockResolvedValue(false);

    await AuthController.login(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(401);
    expect(data).toEqual({ message: 'Contraseña incorrecta' });
  });

  it('Should return 200 when login is successful', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      password: 'password'
    });  
    
    const req = createRequest({
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: 'test@test.com',
        password: 'password'
      }
    });
    const res = createResponse();

    (checkPassword as jest.Mock).mockResolvedValue(true);
    (generateJwt as jest.Mock).mockReturnValue('token');

    await AuthController.login(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data).toEqual({ token: 'token' });
  });
});
