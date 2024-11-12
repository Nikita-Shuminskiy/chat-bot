import { Request, Response, NextFunction } from 'express';
import {getAllUsers, addUser, saveChatIdService} from '../services/userService';
import { User } from '../models/user';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users: User[] = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData: User = req.body;
        const newUser: User = await addUser(userData);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

export const saveChatId = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.res, 'saveChatId')

    try {
        const newUser = await saveChatIdService(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

export const getChatId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json(13131);
    } catch (error) {
        next(error);
    }
}

