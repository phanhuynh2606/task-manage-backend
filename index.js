const express = require("express");
var bodyParser = require("body-parser");
require("dotenv").config();
const database = require("./config/database");
//Routers V1
const routersVer1 = require("./api/v1/routes/index.route");
database.connect();
const app = express();
const port = process.env.PORT;

// parse application/json
app.use(bodyParser.json())

//Routes V1
routersVer1(app);

app.listen(port, () =>{
   console.log(`App listening on port ${port}`);
})