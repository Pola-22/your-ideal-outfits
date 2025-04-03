# Your Ideal Outfits Backend

Pagina para la gestion de inventario de productos y prendas de vestir mujer.

## Requisitos Previos

- Node.js (v18 o superior recomendado)
- npm (viene con Node.js) o yarn
- Base de datos PostgreSQL

## Instalación

1.  Clona el repositorio:
    ```bash
    git clone <your-repository-url>
    cd your-ideal-backend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
    o
    ```bash
    yarn install
    ```

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables de entorno. Asegúrate de reemplazar los valores de ejemplo con tus propias configuraciones.

```dotenv
# URI de conexión a la base de datos
# Ejemplo: postgres://usuario:contraseña@localhost:5432/basededatos
URI_CONECT_DB=tu_uri_de_conexion_a_la_bd

# Secreto para la generación de tokens JWT
JWT_SECRET=tu_secreto_jwt_super_seguro

# Puerto para el servidor (opcional, por defecto es 3000)
# PORT=3000
```

## Ejecutar el Proyecto

### Modo Desarrollo

Para ejecutar el proyecto en modo desarrollo con recarga automática:

```bash
npm run dev
```

El servidor se iniciará normalmente en el puerto 3000 (o el puerto especificado en `.env`).

### Modo Producción

1.  Compila el proyecto:
    ```bash
    npm run build
    ```
    Esto compilará el código TypeScript a JavaScript en el directorio `dist`.

2.  Inicia el servidor de producción:
    ```bash
    npm start
    ```

## Ejecutar Pruebas

Para ejecutar la suite de pruebas:

```bash
npm run test
```

Para ejecutar las pruebas unitarias con reporte de cobertura:

```bash
npm run test:unit
```

## Scripts Disponibles

-   `npm run dev`: Inicia la aplicación en modo desarrollo usando `ts-node` con `--watch`.
-   `npm run test`: Ejecuta la suite de pruebas con Jest.
-   `npm run test:unit`: Ejecuta las pruebas unitarias y genera un reporte de cobertura.
-   `npm run build`: Compila el código TypeScript a JavaScript.
-   `npm start`: Inicia la aplicación compilada desde el directorio `dist`. 