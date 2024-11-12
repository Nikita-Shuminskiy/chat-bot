import { Router } from 'express';
import {createUser, getUsers} from "../controller/userController";


const router: Router = Router();

// Получение списка пользователей
router.get('/', getUsers);

// Создание нового пользователя
router.post('/', createUser);

export default router;
