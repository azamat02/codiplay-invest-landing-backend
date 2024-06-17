import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {sendToTelegramChat} from "./bot.js";
import {appendValues} from "./appendDataToSheets.js";
import {config} from 'dotenv'
import {Telegraf} from "telegraf";

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

app.post('/append_wedding_data_adil', async (req, res) => {
    if (req.body.data) {
        const date = new Date().toLocaleString('ru-RU', {timeZone: 'Asia/Almaty', month: 'long', day: 'numeric', year: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit'})
        const sheetId = process.env.WEDDING_SHEET_ID_2
        const userData = { names: req.body.data[0], guestsNum: req.body.data[1], attendance: req.body.data[2] ? 'Придут' : 'Не придут', date: date}
        const result = await appendValues(sheetId, "A:I", "USER_ENTERED", [[...Object.values(userData)]])
        console.log('New application request for wedding!')
        console.log(req.body)
        console.log(userData)
        await sendToTelegramChat(userData, 'wedding_adil')

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

app.post('/codiplay_landing_request', async (req, res) => {
    if (req.body.data) {
        const date = new Date().toLocaleString('ru-RU', {timeZone: 'Asia/Almaty', month: 'long', day: 'numeric', year: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit'})
        const sheetId = process.env.CODIPLAY_LANDING_CONTACT_US
        const userData = {
            firstName: req.body.data[0],
            lastName: req.body.data[1],
            email: req.body.data[2],
            phone: req.body.data[3],
            country: req.body.data[4],
            role: req.body.data[5],
            message: req.body.data[6],
            date: date
        }
        const result = await appendValues(sheetId, "A:H", "USER_ENTERED", [[...Object.values(userData)]])
        console.log('New application contact request for codiplay landing')
        console.log(req.body)
        console.log(userData)
        await sendToTelegramChat(userData, 'codiplay_landing')

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

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})