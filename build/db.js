"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// Configuración de la base de datos
const pool = new pg_1.Pool({
    user: process.env.POSTGRES_USER || 'root',
    host: process.env.DATABASE_HOST || '127.0.0.1',
    database: process.env.POSTGRES_DB || 'inlaze',
    password: process.env.POSTGRES_PASSWORD || 'root',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
});
// Manejador de errores de la conexión a la base de datos
pool.on('error', (err, client) => {
    console.error('Error in database connection', err);
});
// Verificar la conexión a la base de datos
pool.connect((err, client, done) => {
    if (err)
        throw err;
    console.log('Connected to database');
    done();
});
exports.default = pool;
