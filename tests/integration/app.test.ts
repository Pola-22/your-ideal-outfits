import request from 'supertest';
import server from '../../src/server';

let jwt_token: string;
async function authenticateUser() {
    const dataUserLogin = {
        email:"correo@correo.com",
        password:"password"
    }
    const response = await request(server)
        .post('/api/auth/login')
        .send(dataUserLogin);

    jwt_token = response.body.token;
    expect (response.status).toBe(200);
}

describe ('Products', () => {
    let productId: Number;

    beforeAll(async () => {
        await authenticateUser();
    })

    it('Consultar productos, retorna 200', async () => {
        const response = await request(server)
            .get('/api/products')

        expect (response.body).toHaveLength(0);
        expect (response.status).toBe(200);
        expect (response.status).not.toBe(400);
        expect (response.status).not.toBe(401);
    })

    it('Crear producto, retorna 401, cuando el usuario no está autenticado', async () => {
        const productData = {
            "name": "La camisa negra",
            "description": "Camisa hombre de talla S",
            "price": 35000,
            "stock": 250
        }

        const response = await request(server)
            .post('/api/products')
            .send(productData)

        expect (response.status).toBe(401);
        expect (response.status).not.toBe(201);
        expect (response.body).toEqual({message:'No autorizado'});
    })
    
    it('Crear producto, Retorna 201, cuando el usuario está autenticado', async () => {
        const productData = {
            "name": "La camisa negra",
            "description": "Camisa hombre de talla S",
            "price": 35000,
            "stock": 250
        }

        const response = await request(server)
            .post('/api/products')
            .auth(jwt_token, {type: 'bearer'})
            .send(productData)

        productId = response.body.data.id;

        expect (response.status).toBe(201);
        expect (response.body.message).toBe('Producto creado exitosamente');
    })

    it('Actualizar producto, Retorna 200, cuando el usuario está autenticado', async () => {
        const productUpdateData = {
            "name": "La camisa roja",
            "description": "Camisa hombre de talla M",
            "price": 30000,
            "stock": 50
        }

        const response = await request(server)
            .put(`/api/products/${productId}`)
            .auth(jwt_token, {type: 'bearer'})
            .send(productUpdateData)

        expect (response.status).toBe(200);
        expect (response.body.message).toBe('Producto actualizado exitosamente');
        expect (response.body.data.name).toBe('La camisa roja');
        expect (response.body.data.description).toBe('Camisa hombre de talla M');
        expect (response.body.data.price).toBe(30000);
        expect (response.body.data.stock).toBe(50);
    })

    it('Eliminar producto, Retorna 200, cuando el usuario está autenticado', async () => {

        const response = await request(server)
            .delete(`/api/products/${productId}`)
            .auth(jwt_token, {type: 'bearer'})

        expect (response.status).toBe(200);
        expect (response.status).not.toBe(400);
        expect (response.status).not.toBe(401);
        expect (response.body.message).toBe('Producto eliminado exitosamente');
    })
})

async function getProduct(productId: Number){
    const response = await request(server)
            .get(`/api/products/${productId}`)

    expect (response.status).toBe(200);
    return Number(response.body.stock);
}

describe ('Orders', () => {

    let productId: Number;

    beforeAll(async () => {
        await authenticateUser();
    })

    it('Consultar ordenes, retorna 200 con el usuario autenticado', async () => {
        const response = await request(server)
            .get('/api/orders')
            .auth(jwt_token, {type: 'bearer'})

        expect (response.body).toHaveLength(0);
        expect (response.status).toBe(200);
        expect (response.status).not.toBe(400);
        expect (response.status).not.toBe(401);
    })

    it('Crear orden, retorna 201', async () => {
        const productForOrder = {
            "name": "La camisa negra",
            "description": "Camisa hombre de talla S",
            "price": 35000,
            "stock": 10
        }
        
        const responseProduct = await request(server)
            .post('/api/products')
            .auth(jwt_token, {type: 'bearer'})
            .send(productForOrder)
        productId = responseProduct.body.data.id;
        expect (responseProduct.status).toBe(201);
        expect (responseProduct.body.message).toBe('Producto creado exitosamente');

        const orderData = {
            "clientName": "Pepito Perez",
            "documentNumber": "123456788",
            "numberPhone": "3143567899",
            "address": "CRR 56 #56",
            "orderDetail": [
                {
                    "id_product": productId,
                    "quantity": 1
                }
            ]
        }

        const response = await request(server)
            .post('/api/orders')
            .send(orderData)

        const stockProduct = await getProduct(productId);

        expect (response.status).toBe(201);
        expect (stockProduct).toEqual(9);
    })
})