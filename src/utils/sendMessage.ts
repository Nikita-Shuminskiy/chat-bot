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
        *ID пользователя*: ${msg.from?.id}
        *Имя Фамилия*: ${msg?.from?.first_name} ${msg?.from?.last_name || ''}
        *Тг/ник*: ${msg?.from?.username ? `@${msg?.from?.username}` : 'нет'}
        *Сообщение*: ${msg.text?.trim() ?? msg.caption?.trim()}
    `
    return message
}
