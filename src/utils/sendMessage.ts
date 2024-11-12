import TelegramBot from 'node-telegram-bot-api';
import {BotMessage} from "../types/bot";

export async function sendMessage(bot: TelegramBot, userId: string | number, text: string, photo?: string | null) {
    try {
        if (photo) {
            await bot.sendPhoto(userId, photo, {caption: text});
        } else {
            await bot.sendMessage(userId, text, {parse_mode: 'HTML'});
        }
    } catch (error) {
        console.error(`Ошибка при отправке сообщения пользователю с ID ${userId}:`, error);
    }
}

export const formattingToSendMessage = (msg:BotMessage) => {
    const message = `
<i>ID пользователя:</i> <b>${msg.from?.id}</b>
<i>Имя Фамилия:</i> <b>${msg?.from?.first_name} ${msg?.from?.last_name || ''}</b>
<i>Тг/ник:</i> <b>${msg?.from?.username ? `@${msg?.from?.username}` : 'нет'}</b>
<i>Сообщение:</i> <b>${msg.text?.trim() ?? msg.caption?.trim()}</b>
    `
    return message
}
