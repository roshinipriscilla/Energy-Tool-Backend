const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const routes = require('./routes');
var mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const uri1 = "mongodb+srv://testConnection:testConnection@igse-energytool.lfftjpy.mongodb.net/?retryWrites=true&w=majority"
const uri = "mongodb+srv://gowtham:gowtham123@igse.gquuanq.mongodb.net/?retryWrites=true&w=majority"
mongoose.Promise = global.Promise;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
  })
  .then(() =>{
     console.log(new Date() + "[DB_CONNECTED]")})
  .catch((err) => console.log(new Date() + `[DB_CONNECTION_ERROR] ${err}`));

routes(app);
app.listen(4000, () => {
    console.log(`TCP Server is running on 4000`);
});