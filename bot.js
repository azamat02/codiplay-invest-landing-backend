import {Telegraf} from "telegraf";
import {config} from "dotenv";
config()

export async function sendToTelegramChat(data, channel) {
    const bot = new Telegraf(process.env.BOT_TOKEN);
    const chatId = -1001809748130
    const campChatId = -1001895897735
    const weddingChatId = -1001972634856
    const sanduChatId = -1002060567702
    const inviteChatId = -1001549188610
    if (channel === 'school') {
        bot.telegram.sendPhoto(chatId, {source: "new_request.png"}, {caption: "#школы\nНовая заявка с лендинга!\n\nФИО: "+data.name+"\nНомер телефона: "+data.phone+"\nСсылка WhatsApp: https://wa.me/"+'7'+(data.phone).slice(1)+"\nСтрана: "+data.country+"\nОбласть: "+data.region+"\nРегион: "+data.area+"\nНаселенный пункт: "+data.city+"\nШкола: "+data.school+"\nДолжность: "+data.role+"\nДата отправки: "+data.date});
    } else if (channel === 'camp') {
        bot.telegram.sendPhoto(campChatId, {source: "new_request.png"}, {caption: "#лагерь\nНовая заявка с лендинга!\n\nФИО: "+data.name+"\nНомер телефона: "+data.phone+"\nСсылка WhatsApp: https://wa.me/"+'7'+(data.phone).slice(1)+"\nКто отправил заявку: "+data.role+"\nИсточник: "+data.utm_source+"\nКанал: "+data.utm_medium+"\nКампания: "+data.utm_campaign+"\nДата отправки: "+data.date});
    } else if (channel === 'wedding') {
        bot.telegram.sendPhoto(weddingChatId, {source: "new_request.png"}, {caption: "\nНовая заявка с сайта!\n\nИмена: "+data.names+"\nКоличество гостей: "+data.guestsNum+"\nПридут или нет?: "+(data.attendance ? 'Придут' : 'Не придут')+"\nДата отправки: "+data.date});
    } else if (channel === 'sandu') {
        bot.telegram.sendPhoto(sanduChatId, {source: "new_request.png"}, {caption: "\nНовая заявка с сайта!\n\nФИО: "+data.name+"\nНомер телефона: "+data.phone+"\n Почта: "+data.email+"\nСсылка WhatsApp: https://wa.me/"+'7'+(data.phone).slice(1)+"\nДата отправки: "+data.date});
    } else if (channel === 'invite') {
        bot.telegram.sendPhoto(inviteChatId, {source: "new_request.png"}, {caption: "\nНовая заявка с сайта!\n\nФИО: "+data.name+"\nНазвание школа: "+data.school+"\nДата отправки: "+data.date});
    }
    else {
        bot.telegram.sendPhoto(chatId, {source: "new_request.png"}, {caption: "#инвест\nНовая заявка с лендинга!\n\nФИО: "+data.name+"\nНомер телефона: "+data.phone+"\nДата отправки: "+data.date});
    }
}
