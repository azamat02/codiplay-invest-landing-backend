import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {createRecord, db, getRecordByColumn, updateRecordIfNotUsed} from "./config.js";
import {sendToTelegramChat} from "./bot.js";
import {appendValues} from "./appendDataToSheets.js";
import {config} from 'dotenv'
import {Markup, Telegraf} from "telegraf";
import {collection, doc, query, setDoc, where} from "firebase/firestore";
const bot = new Telegraf(process.env.BOT_TOKEN);

config()

const app = express()
const port = 80

app.use(cors())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/

export function generateUniqueCode() {
    return Math.random().toString().slice(2, 12);
}
bot.start((ctx) => {
    ctx.reply('Welcome! Click the button below to generate a code.', Markup
        .keyboard([['Generate code']])
        .oneTime()
        .resize()
    );
});

let awaitingEmail = {};

bot.hears('Generate code', (ctx) => {
    ctx.reply('Please enter your email:');
    awaitingEmail[ctx.from.id] = true; // Mark user as awaiting email input
});

bot.on('text', async (ctx) => {
    if (awaitingEmail[ctx.from.id]) {
        const email = ctx.message.text;
        const code = generateUniqueCode();
        await createRecord(email, code);
        ctx.reply(`Your code: ${code}\nCreated at: ${new Date().toLocaleString()}`, Markup
            .keyboard([['Generate code']])
            .oneTime()
            .resize());
        delete awaitingEmail[ctx.from.id]; // Remove user from awaiting email list
    }
});

app.get('/check/:code', (req, res) => {
    const { code } = req.params;

    getRecordByColumn("codes", "code", code).then((records) => {
        if (records.length > 0) {
            const record = records[0]; // Assuming 'code' values are unique, so we take the first record

            // Check if the code has not been used
            if (!record.used) {
                res.json({ access: true });
            } else {
                // Code exists but has been marked as used
                res.json({ access: false, message: "Code has already been used" });
            }
        } else {
            // No record found for the provided code
            res.json({ access: false, message: "Code not found" });
        }
    }).catch(err => {
        console.error(err);
        res.status(500).json({ message: "Firebase error" });
    });
});

app.post('/update-code', async (req, res) => {
    const { code, result } = req.body;

    const updateResult = await updateRecordIfNotUsed(code, result);

    if (updateResult.success) {
        res.json({ message: updateResult.message });
    } else {
        res.status(404).json({ message: updateResult.message });
    }
});

app.post('/append', async (req, res) => {
    if (req.body.data) {
        const sheetId = process.env.SHEET_ID
        const result = await appendValues(sheetId, "A:C", "USER_ENTERED", [req.body.data])
        const userData = {name: req.body.data[0], phone: req.body.data[1], date: req.body.data[2]}
        console.log('Added new request!')
        console.log(userData)
        sendToTelegramChat(userData, 'invest')

        if (result.status === 200) {
            res.status(201)
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "created" }, null, 3));
        } else {
            res.status(500)
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "google sheets api error" }, null, 3));
        }
    }
    else {
        res.status(400)
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: "data not provided in request body" }, null, 3));
    }
})

app.post('/append_sandu', async (req, res) => {
    const date = new Date().toLocaleString('ru-RU', {timeZone: 'Asia/Almaty', month: 'long', day: 'numeric', year: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit'})

    if (req.body.data) {
        const sheetId = process.env.SANDU_SHEET_ID
        const result = await appendValues(sheetId, "A:D", "USER_ENTERED", [req.body.data])
        const userData = {name: req.body.data[0], phone: req.body.data[1], email: req.body.data[2], date: date}
        console.log('Added new request to Sandu!')
        console.log(userData)
        sendToTelegramChat(userData, 'sandu')

        if (result.status === 200) {
            res.status(201)
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "created" }, null, 3));
        } else {
            res.status(500)
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "google sheets api error" }, null, 3));
        }
    }
    else {
        res.status(400)
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: "data not provided in request body" }, null, 3));
    }
})

app.post('/append_invite', async (req, res) => {
    const date = new Date().toLocaleString('ru-RU', {timeZone: 'Asia/Almaty', month: 'long', day: 'numeric', year: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit'})

    if (req.body.data) {
        const sheetId = process.env.INVITE_SHEET_ID
        const result = await appendValues(sheetId, "A:C", "USER_ENTERED", [req.body.data])
        const userData = {name: req.body.data[0], school: req.body.data[1], date: date}
        console.log('Added new request to Invite!')
        sendToTelegramChat(userData, 'invite')

        if (result.status === 200) {
            res.status(201)
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "created" }, null, 3));
        } else {
            res.status(500)
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "google sheets api error" }, null, 3));
        }
    }
    else {
        res.status(400)
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: "data not provided in request body" }, null, 3));
    }
})

app.post('/append_school', async (req, res) => {
    if (req.body.data) {
        const sheetId = process.env.SCHOOLS_SHEET_ID
        const result = await appendValues(sheetId, "A:C", "USER_ENTERED", [req.body.data])
        const userData = {name: req.body.data[0], phone: req.body.data[1], date: req.body.data[2]}
        console.log('Added new for connecting school request!')
        console.log(userData)
        sendToTelegramChat(userData, 'school')

        if (result.status === 200) {
            res.status(201)
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "created" }, null, 3));
        } else {
            res.status(500)
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "google sheets api error" }, null, 3));
        }
    }
    else {
        res.status(400)
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: "data not provided in request body" }, null, 3));
    }
})

app.post('/append_school_v2', async (req, res) => {
    if (req.body.data) {
        const sheetId = process.env.SCHOOLS_SHEET_ID
        const result = await appendValues(sheetId, "A:G", "USER_ENTERED", [req.body.data])
        const userData = {  name: req.body.data[0], 
                            phone: req.body.data[1], 
                            region: req.body.data[2],
                            area: req.body.data[3],
                            city: req.body.data[4],
                            school: req.body.data[5],
                            role: req.body.data[6],
                            date: req.body.data[7]}
        console.log('Added new for connecting school request!')
        console.log(userData)
        sendToTelegramChat(userData, 'school')

        if (result.status === 200) {
            res.status(201)
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "created" }, null, 3));
        } else {
            res.status(500)
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "google sheets api error" }, null, 3));
        }
    }
    else {
        res.status(400)
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: "data not provided in request body" }, null, 3));
    }
})

app.post('/append_school_v3', async (req, res) => {
    if (req.body.data) {
        const sheetId = process.env.SCHOOLS_SHEET_ID
        const result = await appendValues(sheetId, "A:H", "USER_ENTERED", [req.body.data])
        const userData = {  name: req.body.data[0],
            phone: req.body.data[1],
            country: req.body.data[2],
            region: req.body.data[3],
            area: req.body.data[4],
            city: req.body.data[5],
            school: req.body.data[6],
            role: req.body.data[7],
            date: req.body.data[8]}
        console.log('Added new for connecting school request!')
        console.log(userData)
        sendToTelegramChat(userData, 'school')

        if (result.status === 200) {
            res.status(201)
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "created" }, null, 3));
        } else {
            res.status(500)
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "google sheets api error" }, null, 3));
        }
    }
    else {
        res.status(400)
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: "data not provided in request body" }, null, 3));
    }
})

app.post('/append_application_camp', async (req, res) => {
    if (req.body.data) {
        const date = new Date().toLocaleString('ru-RU', {timeZone: 'Asia/Almaty', month: 'long', day: 'numeric', year: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit'})
        const sheetId = process.env.CODICAMP_SHEET_ID
        const result = await appendValues(sheetId, "A:I", "USER_ENTERED", [[...req.body.data, date]])
        const userData = { name: req.body.data[0], phone: req.body.data[1], role: req.body.data[2], date: date,
                                utm_source: req.body.data[3], utm_medium: req.body.data[4], utm_campaign: req.body.data[5]}
        console.log('New application request for camp!')
        console.log(req.body)
        console.log(userData)
        await sendToTelegramChat(userData, 'camp')

        if (result.status === 200) {
            res.status(201)
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "created" }, null, 3));
        } else {
            res.status(500)
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "google sheets api error" }, null, 3));
        }
    }
    else {
        res.status(400)
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: "data not provided in request body" }, null, 3));
    }
})

app.post('/append_wedding_data', async (req, res) => {
    if (req.body.data) {
        const date = new Date().toLocaleString('ru-RU', {timeZone: 'Asia/Almaty', month: 'long', day: 'numeric', year: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit'})
        const sheetId = process.env.WEDDING_SHEET_ID
        const userData = { names: req.body.data[0], guestsNum: req.body.data[1], attendance: req.body.data[2] ? 'Придут' : 'Не придут', date: date}
        const result = await appendValues(sheetId, "A:I", "USER_ENTERED", [[...Object.values(userData)]])
        console.log('New application request for wedding!')
        console.log(req.body)
        console.log(userData)
        await sendToTelegramChat(userData, 'wedding')

        if (result.status === 200) {
            res.status(201)
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "created" }, null, 3));
        } else {
            res.status(500)
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "google sheets api error" }, null, 3));
        }
    }
    else {
        res.status(400)
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: "data not provided in request body" }, null, 3));
    }
})

bot.launch()
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})