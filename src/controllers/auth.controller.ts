import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import pool from '../db';
import Joi from 'joi';

// Define el esquema de validación de datos para la solicitud de registro
const signupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

// Define el esquema de validación de datos para el inicio de sesión
const signinSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validar los datos de entrada de la solicitud
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message, status: false });
    }

    const id = uuidv4();
    const { username, email, password, fullname } = value;
    const result = await pool.query(
      'INSERT INTO users(id, username, email, password, fullname, created_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, username, email, password, fullname, new Date()],
    );
    const user = result.rows[0];
    delete user.password;
    res.json(user);
  } catch (err) {
    next(err);
  }
};


export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = signinSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message, status: false });
    }
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials', status: false });
    }
    const token = jwt.sign({ username: user.username, userId: user.id }, process.env.JWT_SECRET || 'secret');
    res.json({ access_token: token, expires_in: process.env.JWT_EXPIRES_IN, message: 'Successfully logged in', status: true });

  } catch (err) {
    next(err);
  }
};