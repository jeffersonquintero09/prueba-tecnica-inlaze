"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//import helmet from 'helmet';
//import cors from 'cors';
//import pool from './db'
const auth_controller_1 = require("./controllers/auth.controller");
const message_controller_1 = require("./controllers/message.controller");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
//app.use(helmet());
//app.use(cors());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
};
app.use(authenticateJWT);
app.get('/', (req, res, next) => {
    res.send('Express server with TypeScript');
});
// Rutas del módulo de autenticación
app.post('/wires/auth/signup', auth_controller_1.signup);
app.post('/wires/auth/signin', auth_controller_1.signin);
// Rutas del módulo de mensajes
app.post('/wires/messages', authenticateJWT, message_controller_1.createMessage);
app.get('/wires/messages', authenticateJWT, message_controller_1.getAllMessages);
app.get('/wires/messages/mine', authenticateJWT, message_controller_1.getMyMessages);
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
