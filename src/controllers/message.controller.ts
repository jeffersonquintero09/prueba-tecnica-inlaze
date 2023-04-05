import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import pool from '../db';
import Joi from 'joi';

const messageSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = messageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message, status: false });
    }
    const { title, content } = req.body;
    const userId = req.user.id;
    const id = uuidv4();
    const result = await pool.query(
      'INSERT INTO messages(id, user_id, title, content, comments, reactions, created_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id, userId, title, content, [], [], new Date()],
    );
    const message = result.rows[0];
    res.json(message);
  } catch (err) {
    next(err);
  }
};

export const getAllMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query('SELECT * FROM messages');
    const messages = result.rows;
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

export const getMyMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM messages WHERE user_id = $1', [userId]);
    const messages = result.rows;
    res.json(messages);
  } catch (err) {
    next(err);
  }
};
