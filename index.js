const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const authCheck = require('./src/authCheck');
const connectDB = require('./src/config/db');

//connectDB();

const app = express();

app.use('*', cors());
app.use(cookieParser());
app.use(express.json({ limit: '12MB' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/private', authCheck, express.static(path.join(__dirname, 'private')));

const filesRoute = require('./src/routes/files');
app.use('/files', cors(), filesRoute);

const cookiesRoute = require('./src/routes/cookies');
app.use('/cookies', cors(), cookiesRoute);

app.get('/', function (req, res) {
  res.send("Home")
});

app.listen(3001, () => {
    console.log(`Listening to 3001`);
});