import { Request, Response, NextFunction } from 'express';
import { getAllUsers, addUser } from '../services/userService';
import { User } from '../models/user';

// Получение всех пользователей
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users: User[] = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// Создание нового пользователя
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData: User = req.body;
        const newUser: User = await addUser(userData);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};
