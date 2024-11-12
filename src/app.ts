import express, {Application, Request, Response} from 'express';
import userRoutes from './routes/userRoutes';
import './bot/bot';
import cors from "cors";


const app: Application = express();
app.use(cors());

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

app.use('/api/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Telegram Bot Support!');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

export default app;
