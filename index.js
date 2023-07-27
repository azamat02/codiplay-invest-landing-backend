const express = require('express')
const app = express()
const port = 80
const cors = require('cors')
const { appendValues } = require('./appendDataToSheets')
const bodyParser = require('body-parser')
const { sendToTelegramChat } = require('./bot')
require ('dotenv').config()

app.use(cors())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/

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
        const result = await appendValues(sheetId, "A:E", "USER_ENTERED", [[...req.body.data, date]])
        const userData = {  name: req.body.data[0],
            phone: req.body.data[1],
            role: req.body.data[2], date: date}
        console.log('New application request for camp!')
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})