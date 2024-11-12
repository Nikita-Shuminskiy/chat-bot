import TelegramBot from 'node-telegram-bot-api';
import {extractUserIdFromReply, extractUserIdFromText} from './utils';
import {formattingToSendMessage, sendMessage} from '../utils/sendMessage';
import {BotMessage} from '../types/bot';
import commonApi from "../api/api";


const CHANNEL_SUPPORT_ID = process.env.CHANNEL_SUPPORT_ID ?? 0;
const TOKEN_BOT = process.env.TOKEN_BOT ?? '';

export const bot = new TelegramBot(TOKEN_BOT, {polling: true});

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        const {data} = await commonApi.getNick();
        if (data?.nickname) {
            await bot.sendMessage(chatId, `Добро пожаловать ${data.nickname} ! Выберите "Написать в поддержку", чтобы связаться с нами.`, {
                reply_markup: {
                    keyboard: [[{text: 'Написать в поддержку'}]],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            });
        } else {
            await bot.sendMessage(chatId, 'Вы не залогинены. Пожалуйста, зарегистрируйтесь по ссылке: https://clickcontent.ru/');
            await bot.sendMessage(chatId, 'После регистрации напишите сюда, чтобы продолжить.');
        }
    } catch (error) {
        console.error('Error checking login status', error);
    }
});

bot.on('message', async (msg: BotMessage) => {
    const chatId = msg.chat.id;
    const messageText = msg.text?.trim() ?? '';

    const photos = msg.photo ? [msg.photo[msg.photo.length - 1].file_id] : [];

    if (photos.length > 0) {
        const media: any = photos.map(photo => ({
            type: "photo",
            media: photo,
            caption: formattingToSendMessage(msg),
            parse_mode: 'Markdown',
        }));

        await bot.sendMediaGroup(CHANNEL_SUPPORT_ID, media);
        return
    }

    if (messageText === 'Написать в поддержку') {
        await sendMessage(bot, chatId, 'Пожалуйста, напишите ваш вопрос, и наша поддержка свяжется с вами в ближайшее время.');
    } else if (messageText && messageText !== '/start') {

        await bot.sendMessage(CHANNEL_SUPPORT_ID, formattingToSendMessage(msg), {parse_mode: 'Markdown'});
        await bot.sendMessage(chatId, 'Ваше сообщение отправлено в поддержку.');
    }
});

bot.on('channel_post', async (msg) => {
    const text = msg?.text?.trim();
    const replyToMessageText = msg.reply_to_message?.text ?? msg.reply_to_message?.caption

    const photo = Array.isArray(msg.photo) && msg.photo.length > 0 ? msg.photo[msg.photo.length - 1].file_id : null;

    let userId = extractUserIdFromText(text);

    if (!userId && replyToMessageText) {
        userId = extractUserIdFromReply(replyToMessageText);
    }

    if (userId) {
        const responseText = text?.replace(/ID\s+\d+:\s*/, '').trim(); // Убираем "ID <user_id>:" из текста ответа
        await bot.sendMessage(userId, 'Ответ поддержки');
        if (photo) {
            await bot.sendPhoto(userId, photo, {caption: responseText});
        }
        if (responseText) {
            await bot.sendMessage(userId, responseText || ' ');
        }
        await bot.sendMessage(CHANNEL_SUPPORT_ID, `--- Сообщение доставленно пользователю ${userId} ---`);
    } else {
        console.error('Не удалось определить ID пользователя для ответа.');
    }
});

