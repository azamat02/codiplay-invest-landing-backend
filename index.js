const express = require('express')
const app = express()
const port = 4000
const cors = require('cors')
const { appendValues } = require('./appendDataToSheets')
const bodyParser = require('body-parser')
require ('dotenv').config()

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/
app.use(cors())

app.post('/append', async (req, res) => {
    console.log(req.body)
    if (req.body.data) {
        const sheetId = process.env.SHEET_ID
        const result = await appendValues(sheetId, "A:C", "USER_ENTERED", [req.body.data])

        if (result.status === 200) {
            res.sendStatus("201")
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "created" }, null, 3));
        } else {
            res.sendStatus("500")
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "google sheets api error" }, null, 3));
        }
    }
    else {
        res.sendStatus("400")
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: "data not provided in request body" }, null, 3));
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})