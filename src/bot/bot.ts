import TelegramBot from 'node-telegram-bot-api';
import {extractUserIdFromReply, extractUserIdFromText} from './utils';
import {formattingToSendMessage, sendMessage} from '../utils/sendMessage';
import {BotMessage} from '../types/bot';
import commonApi from "../api/api";


const CHANNEL_SUPPORT_ID = process.env.CHANNEL_SUPPORT_ID ?? 0;
const TOKEN_BOT = process.env.TOKEN_BOT ?? '';

export const bot = new TelegramBot(TOKEN_BOT, {polling: true});

const sessions: { [key: string]: { stage: string, attempts?: number } } = {};

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        const { data } = await commonApi.getNick();

        if (data?.nickname) {
            await bot.sendMessage(chatId, `Добро пожаловать ${data.nickname} ! Выберите "Написать в поддержку", чтобы связаться с нами.`, {
                reply_markup: {
                    keyboard: [[{ text: 'Написать в поддержку' }]],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            });
        } else {
            await bot.sendMessage(chatId, 'Вы не залогинены. Пожалуйста, введите ваш номер телефона для авторизациив формате 7 *** *** ** **');
            sessions[chatId] = { stage: 'awaiting_phone' };
        }

    } catch (error) {
        console.error('Error checking login status', error);
    }
});

/*bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text?.trim() ?? '';

    const session = sessions[chatId];

    if (!session) return;

    try {
        if (session.stage === 'awaiting_phone') {
            // Ожидаем номер телефона
            const phone = Number(text.replace(/\D/g, ''))
            console.log(phone)
            await commonApi.sendAuthPhone({ phone });
            await bot.sendMessage(chatId, 'Код отправлен. Введите код из СМС.');
            sessions[chatId] = { stage: 'awaiting_code', attempts: 3 }; // Обновляем стадию на ожидание кода, добавляем количество попыток
        } else if (session.stage === 'awaiting_code') {
            // Ожидаем код СМС
            const code = parseInt(text, 10);

            const response = await commonApi.sendAuthCode({ code });

            if (response.data) {
                await bot.sendMessage(chatId, 'Вы успешно авторизованы! Выберите "Написать в поддержку", чтобы связаться с нами.', {
                    reply_markup: {
                        keyboard: [[{ text: 'Написать в поддержку' }]],
                        resize_keyboard: true,
                        one_time_keyboard: true,
                    },
                });
                delete sessions[chatId]; // Удаляем сессию после успешной авторизации
            } else {
                // Если код неверный
                session.attempts! -= 1;

                if (session.attempts! > 0) {
                    await bot.sendMessage(chatId, `Код неверный. У вас осталось ${session.attempts} попыток. Введите код ещё раз.`);
                } else {
                    // Если попытки закончились
                    await bot.sendMessage(chatId, 'Превышено количество попыток. Пожалуйста, введите ваш номер телефона снова.');
                    sessions[chatId] = { stage: 'awaiting_phone' }; // Сбрасываем на ввод номера телефона
                }
            }
        }
    } catch (error) {
        console.error('Authorization error:', error);
        await bot.sendMessage(chatId, 'Произошла ошибка при авторизации. Попробуйте еще раз позже.');
        delete sessions[chatId]; // Очистка сессии при ошибке
    }
});*/


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

