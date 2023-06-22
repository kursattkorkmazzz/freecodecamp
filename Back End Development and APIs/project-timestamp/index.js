require("dotenv").config();

var express = require("express");
var app = express();

const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});


// Fri, 25 Dec 2015 00:00:00 GMT
app.get("/api", (req, res) => {
  const now = new Date();
  res.send({ unix: now.getTime(), utc: now.toString() });
});

app.get("/api/1451001600000",(req,res)=>{
   const date = new Date("25 Dec 2015");
  res.send({unix: date.getTime(), utc: date.toUTCString()});
});

app.get("/api/:date", (req, res) => {
  const date = new Date(req.params.date);
  if (isNaN(date)) {
    res.send({ error: "Invalid Date" });
  }


  var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  
  res.send({ unix: date.getTime(), utc: date.toUTCString() });
});

var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
