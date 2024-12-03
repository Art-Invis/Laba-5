// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./db'); 
require('dotenv').config();

const app = express();
const PORT = 3001;
const SECRET_KEY = process.env.SECRET_KEY;

console.log('Секретний ключ:', SECRET_KEY); // Перевірка, чи ключ завантажено

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'build')));

app.use('/api', require('./routes'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер працює на http://localhost:${PORT}`);
});
