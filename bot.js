async function sendToTelegramChat(data, channel) {
    const { Telegraf } = require('telegraf');
    require('dotenv').config()
    const bot = new Telegraf(process.env.BOT_TOKEN);
    const chatId = -1001809748130
    const campChatId = -1001895897735
    if (channel === 'school') {
        bot.telegram.sendPhoto(chatId, {source: "new_request.png"}, {caption: "#школы\nНовая заявка с лендинга!\n\nФИО: "+data.name+"\nНомер телефона: "+data.phone+"\nСсылка WhatsApp: https://wa.me/"+'7'+(data.phone).slice(1)+"\nСтрана: "+data.country+"\nОбласть: "+data.region+"\nРегион: "+data.area+"\nНаселенный пункт: "+data.city+"\nШкола: "+data.school+"\nДолжность: "+data.role+"\nДата отправки: "+data.date});
    } if (channel === 'camp') {
        bot.telegram.sendPhoto(campChatId, {source: "new_request.png"}, {caption: "#лагерь\nНовая заявка с лендинга!\n\nФИО: "+data.name+"\nНомер телефона: "+data.phone+"\nКто отправил заявку: "+data.role+"\nДата отправки: "+data.date});
    }
    else {
        bot.telegram.sendPhoto(chatId, {source: "new_request.png"}, {caption: "#инвест\nНовая заявка с лендинга!\n\nФИО: "+data.name+"\nНомер телефона: "+data.phone+"\nДата отправки: "+data.date});
    }
}

module.exports = {sendToTelegramChat}