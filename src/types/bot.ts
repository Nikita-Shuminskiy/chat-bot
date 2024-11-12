// src/types/bot.ts
import TelegramBot from 'node-telegram-bot-api';

export interface BotMessage extends TelegramBot.Message {
    photo?: TelegramBot.PhotoSize[];
}

export interface SendMessageOptions {
    parse_mode?: 'HTML' | 'Markdown';
    reply_markup?: TelegramBot.ReplyKeyboardMarkup;
}
