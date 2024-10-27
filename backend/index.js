require('dotenv').config();
const  mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/Diamond");
const express  = require('express');
const app = express();
const cors = require('cors')
app.use(express.json())
app.use(express.static('public'));


const authRoute = require('./routes/authRoute');
app.use(cors())


app.use('/api', authRoute);


const port = process.env.SERVER_PORT | 3000;
// console.log(process.env.SERVER_PORT);
app.listen(port , ()=>{ 
    console.log("server is runing on port : " + port);
});