import { Pool, PoolClient, QueryResult } from 'pg';
import { config } from 'dotenv';


config();

// Configuración de la base de datos
const pool: Pool = new Pool({
    user: process.env.POSTGRES_USER || 'root',
    host: process.env.DATABASE_HOST || '127.0.0.1',
    database: process.env.POSTGRES_DB || 'inlaze',
    password: process.env.POSTGRES_PASSWORD || 'root',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  });

// Manejador de errores de la conexión a la base de datos
pool.on('error', (err: Error, client: PoolClient) => {
  console.error('Error in database connection', err);
});

// Verificar la conexión a la base de datos
pool.connect((err: Error, client: PoolClient, done: () => void) => {
  if (err) throw err;
  console.log('Connected to database');
  done();
});

export default pool;