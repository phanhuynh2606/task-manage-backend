const express = require("express");
var bodyParser = require("body-parser");
require("dotenv").config();
const database = require("./config/database");
var cors = require("cors");
//Routers V1
const routersVer1 = require("./api/v1/routes/index.route");
database.connect();
const app = express();
const port = process.env.PORT;

// use Cors
// var corsOptions = {
//   origin: "http://example.com",
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// app.use(cors(corsOptions));

app.use(cors());

// parse application/json
app.use(bodyParser.json())

//Routes V1
routersVer1(app);

app.listen(port, () =>{
   console.log(`App listening on port ${port}`);
})