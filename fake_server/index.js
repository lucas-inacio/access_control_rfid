const express = require('express');
const app = express();

const basePath = 'D:/access_control_rfid/rfid_uart_esp01/data/';

app.post("/addTag", (req, res) => {
    res.send('OK');
});

app.post("/removeTag", (req, res) => {
    res.send('OK');
});

app.post("/removePending", (req, res) => {
    res.send('OK');
});

app.post("/approved", (req, res) => {
    res.sendFile(basePath + 'approved.csv');
});

app.post("/pending", (req, res) => {
    res.sendFile(basePath + 'pending.csv');
});

app.use(express.static(basePath));

app.get("/*", (req, res) => {
    res.sendFile(basePath + 'public/index.html');
});

app.listen(3000, () => console.log('Listening'));