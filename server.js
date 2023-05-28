require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const PORT = 5000;
const fileRoutes = require('./routes/files-routes');
const followRoutes = require('./routes/follow-routes');
const signupRoutes = require('./routes/signup-routes');
const cookieParser = require('cookie-parser')
const cors = require("cors");
const errorMiddleware = require('../APIfrendme/middlewares/error-middleware')
const app = express();

var fileupload = require("express-fileupload");
app.use(fileupload());

app.use(
    cors({
        'Access-Control-Allow-Origin': '*' ,
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',

        credentials: true,
        origin: process.env.CLIENT_URL
})
);

app.use(express.json());
app.use(cookieParser());
app.use(followRoutes);
app.use(signupRoutes);
app.use(errorMiddleware)
app.use(fileRoutes);
app.use(express.static('static'))


const URL = 'mongodb+srv://nikborzunov:nezabud14@cluster0.iy1brop.mongodb.net/frendme?retryWrites=true&w=majority';

mongoose
    .connect(URL, {  useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.log(`DB connection error: ${err}`))

app.listen(PORT, (err) => {
    err ? console.log(err) : console.log(`Listening port ${PORT}`)
});

