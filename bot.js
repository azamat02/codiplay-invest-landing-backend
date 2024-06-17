import {Telegraf} from "telegraf";
import {config} from "dotenv";
config()

export async function sendToTelegramChat(data, channel) {
    const bot = new Telegraf(process.env.BOT_TOKEN);
    const adil_chat_id = -1002232764096
    const codiplay_landing_chat_id = -1001809748130

    const adil_text = `
    \n
    Новая заявка с лендинга!
    \n\n
    Гости: ${data.names}
    \n
    Количество гостей: ${data.guestsNum}
    \n
    Участие: ${data.attendance}
    \n
    Дата отправки: ${data.date}
    `

    const codiplay_landing_text = `
    \n
    New request from codiplay landing!
    \n\n
    Name: ${data.firstName + ' ' + data.lastName}
    \n
    Email: ${data.email}
    \n
    Phone number: ${data.phone}
    \n
    Country: ${data.country}
    \n
    Role: ${data.role}
    \n
    Message: ${data.message}
    \n
    Send date: ${data.date}
    `

    if (channel === 'wedding_adil') {
        await bot.telegram.sendPhoto(
            adil_chat_id,
            {source: "new_request.png"},
            {caption: adil_text});
    } else if (channel === 'codiplay_landing') {
        await bot.telegram.sendPhoto(codiplay_landing_chat_id,
            {source: "new_request.png"},
            {caption: codiplay_landing_text});
    }
}
