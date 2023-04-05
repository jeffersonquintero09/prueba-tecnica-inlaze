import { config } from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
//import helmet from 'helmet';
//import cors from 'cors';
//import pool from './db'

import { signup, signin } from './controllers/auth.controller';
import { createMessage, getAllMessages, getMyMessages } from './controllers/message.controller';


config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

//app.use(helmet());
//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


declare global {
    namespace Express {
      interface Request {
        user?: any;
      }
    }
  }

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

app.use(authenticateJWT);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Express server with TypeScript');
});

// Rutas del módulo de autenticación
app.post('/wires/auth/signup', signup);
app.post('/wires/auth/signin', signin);

// Rutas del módulo de mensajes
app.post('/wires/messages', authenticateJWT, createMessage);
app.get('/wires/messages', authenticateJWT, getAllMessages);
app.get('/wires/messages/mine', authenticateJWT, getMyMessages);



app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});