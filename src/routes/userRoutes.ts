import { Router } from 'express';
import {createUser, getChatId, getUsers, saveChatId} from "../controller/userController";


const router: Router = Router({strict: false});

router.get('/', getUsers);


router.post('/', createUser);

router.post('/sendChatId', saveChatId);

router.get('/getChatId', getChatId);

export default router;
