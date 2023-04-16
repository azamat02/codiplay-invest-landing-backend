async function sendToTelegramChat(data) {
    const { Telegraf } = require('telegraf');
    require('dotenv').config()
    const bot = new Telegraf(process.env.BOT_TOKEN);
    const chatId = -1001809748130
    bot.telegram.sendPhoto(chatId, {source: "new_request.png"}, {caption: "Новая заявка с лендинга!\n\nФИО: "+data.name+"\nНомер телефона: "+data.phone+"\nДата отправки: "+data.date});
}

module.exports = {sendToTelegramChat}