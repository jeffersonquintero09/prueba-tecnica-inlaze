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
exports.getMyMessages = exports.getAllMessages = exports.createMessage = void 0;
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../db"));
const joi_1 = __importDefault(require("joi"));
const messageSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    content: joi_1.default.string().required(),
});
const createMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = messageSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message, status: false });
        }
        const { title, content } = req.body;
        const userId = req.user.id;
        const id = (0, uuid_1.v4)();
        const result = yield db_1.default.query('INSERT INTO messages(id, user_id, title, content, comments, reactions, created_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [id, userId, title, content, [], [], new Date()]);
        const message = result.rows[0];
        res.json(message);
    }
    catch (err) {
        next(err);
    }
});
exports.createMessage = createMessage;
const getAllMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query('SELECT * FROM messages');
        const messages = result.rows;
        res.json(messages);
    }
    catch (err) {
        next(err);
    }
});
exports.getAllMessages = getAllMessages;
const getMyMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const result = yield db_1.default.query('SELECT * FROM messages WHERE user_id = $1', [userId]);
        const messages = result.rows;
        res.json(messages);
    }
    catch (err) {
        next(err);
    }
});
exports.getMyMessages = getMyMessages;
