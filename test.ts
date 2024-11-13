import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config()
const app = express();
const CHANNEL_SUPPORT_ID = "-1002350349977";
const TOKEN_BOT = "7385212378:AAGIpAe4vMYUtxL1Q7CsqYfZbElt-g8-3tY";


app.use(express.json());
app.use(cors());

const bot = new TelegramBot(TOKEN_BOT, {polling: true});

/*bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});
bot.getChat(CHANNEL_SUPPORT_ID)
    .then(chat => {
        console.log(`ID канала поддержки: ${chat.id}`)
    })
    .catch(error => {
        console.error('Ошибка при получении ID канала:', error)
    })*/

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, 'Добро пожаловать! Выберите "Написать в поддержку", чтобы связаться с нами.', {
        reply_markup: {
            keyboard: [[{text: 'Написать в поддержку'}, {text: 'TEST SEND MESSAGE'}]],
            resize_keyboard: true,
            one_time_keyboard: true,
        },
    });
});


// Обработка всех сообщений от пользователя
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text?.trim() ?? ''
    const photo = Array.isArray(msg.photo) && msg.photo.length > 0 ? msg.photo[msg.photo.length - 1].file_id : null;

    if (messageText === 'Написать в поддержку') {
        await sendMessage(chatId, 'Пожалуйста, напишите ваш вопрос, и наша поддержка свяжется с вами в ближайшее время.');
    } else if (messageText && messageText !== '/start' || photo) {
        const message = `
<b>ID пользователя:</b> ${msg.from?.id}
<b>Имя Фамилия:</b> ${msg.from?.first_name} ${msg.from?.last_name || ''}
<b>Тг/ник:</b> ${msg.from?.username ? `@${msg.from?.username}` : 'нет'}
<b>Сообщение:</b> ${messageText}
`;
        try {
            await sendMessage(CHANNEL_SUPPORT_ID, message, photo);
            await sendMessage(chatId, 'Ваше сообщение отправлено в поддержку.');
        } catch (error) {
            console.error('Ошибка при отправке сообщения в поддержку:', messageText);
            await sendMessage(chatId, 'Произошла ошибка при отправке вашего сообщения в поддержку.');
        }
    }
});

function extractUserIdFromText(text) {
    const match = text?.match(/ID\s+(\d+):/);
    return match ? match[1] : null;
}

//  reply_to_message
function extractUserIdFromReply(replyText) {
    const match = replyText?.match(/ID пользователя:\s+(\d+)/);
    return match ? match[1] : null;
}

bot.on('channel_post', async (msg) => {
    const text = msg.text?.trim();
    const replyToMessageText = msg.reply_to_message?.text;

    const photo = Array.isArray(msg.photo) && msg.photo.length > 0 ? msg.photo[msg.photo.length - 1].file_id : null;

    let userId = extractUserIdFromText(text);

    // Если ID пользователя не был найден в тексте, проверяем reply_to_message
    if (!userId && replyToMessageText) {
        userId = extractUserIdFromReply(replyToMessageText);
    }

    if (userId) {
        const responseText = text?.replace(/ID\s+\d+:\s*/, '').trim(); // Убираем "ID <user_id>:" из текста ответа
        await sendMessage(userId, 'Ответ поддержки');
        await sendMessage(userId, responseText || ' ', photo);
        await sendMessage(CHANNEL_SUPPORT_ID, `--- Сообщение доставленно пользователю ${userId} ---`);
    } else {
        console.error('Не удалось определить ID пользователя для ответа.');
    }
});


async function sendMessage(userId, text, photo) {
    console.log(text)
    try {
        if (photo) {
            await bot.sendPhoto(userId, photo, {caption: text});
        } else {
            await bot.sendMessage(userId, text, {parse_mode: 'HTML'});
        }
        console.log(`Сообщение отправлено пользователю с ID ${userId}`);
    } catch (error) {
        console.error('Ошибка при отправке сообщения пользователю:', error);
        await bot.sendMessage(CHANNEL_SUPPORT_ID, `Ошибка при отправке ответа пользователю с ID ${userId}: ${error.message}`);
    }
}

app.listen(process.env.PORT || 3000, (error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
});

app.get("/", (request, response) => {
    response.status(200).send("Hello World");
});
