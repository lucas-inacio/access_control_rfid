const fs = require('fs');
const express = require('express');
const app = express();

const basePath = 'D:/access_control_rfid/rfid_uart_esp01/data/';


app.use(express.static(basePath));
app.use(express.text());

app.post("/addTag", (req, res) => {
    res.send('OK');
});

app.post("/removeTag", (req, res) => {
    let data = fs.readFileSync(__dirname + '/approved.csv');
    let value = data.toString();
    let newValue = value.replace(RegExp(`^${req.body},.+$\\r*\\n*`, 'm'), '');
    fs.writeFileSync(__dirname + '/approved.csv', newValue);
    res.send('OK');
});

app.post("/removePending", (req, res) => {
    let data = fs.readFileSync(__dirname + '/pending.csv');
    let value = data.toString();
    let newValue = value.replace(req.body + '\n', '');
    fs.writeFileSync(__dirname + '/pending.csv', newValue);
    res.send('OK');
});

app.post("/approved", (req, res) => {
    res.sendFile(__dirname + '/approved.csv');
});

app.post("/pending", (req, res) => {
    res.sendFile(__dirname + '/pending.csv');
});

app.get("/*", (req, res) => {
    res.sendFile(basePath + 'public/index.html');
});

app.listen(3000, () => console.log('Listening'));