"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const joi_1 = __importDefault(require("joi"));
// Define el esquema de validación de datos para la solicitud de registro
const signupSchema = joi_1.default.object({
    username: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    fullname: joi_1.default.string().required(),
});
// Define el esquema de validación de datos para el inicio de sesión
const signinSchema = joi_1.default.object({
    username: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validar los datos de entrada de la solicitud
        const { error, value } = signupSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message, status: false });
        }
        const id = (0, uuid_1.v4)();
        const { username, email, password, fullname } = value;
        const result = yield db_1.default.query('INSERT INTO users(id, username, email, password, fullname, created_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', [id, username, email, password, fullname, new Date()]);
        const user = result.rows[0];
        delete user.password;
        res.json(user);
    }
    catch (err) {
        next(err);
    }
});
exports.signup = signup;
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = signinSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message, status: false });
        }
        const { username, password } = req.body;
        const result = yield db_1.default.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials', status: false });
        }
        const token = jsonwebtoken_1.default.sign({ username: user.username, userId: user.id }, process.env.JWT_SECRET || 'secret');
        res.json({ access_token: token, expires_in: process.env.JWT_EXPIRES_IN, message: 'Successfully logged in', status: true });
    }
    catch (err) {
        next(err);
    }
});
exports.signin = signin;
