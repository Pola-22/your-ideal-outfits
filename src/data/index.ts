import { exit } from 'node:process';
import { instaceDB } from '../config/db';

const clearData = async () => {
    try {
        await instaceDB.authenticate(); 
        const models = instaceDB.models;

        for (const modelName in models) {
            if (modelName !== 'User') { 
                console.log(`Eliminando datos de la tabla: ${modelName}`);
                await models[modelName].destroy({
                    where: {},
                    truncate: true,
                    cascade: true
                });
            } else {
                console.log(`Omitiendo la tabla: ${modelName}`);
            }
        }

        console.log('Datos eliminados correctamente (excepto usuarios).');
        exit(0);
    } catch (error) {
        console.error('Error al limpiar datos:', error);
        exit(1);
    }
}

if(process.argv[2] === '--clear'){
    clearData();
}