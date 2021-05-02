const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});


app.post("/", function (req, res) {

  const query = req.body.cityName;
  const apiKey = "6886172494f8a76ae73504dd1d9274a6";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
  https.get(url, function (response) {
    // console.log(response.statusCode);

    response.on("data", function (data) {

      try {
        const weatherData = JSON.parse(data);
        const icon = weatherData.weather[0].icon;
        const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        res.setHeader("Content-Type", "text/html"); //stackoverflow
        res.write("<h3>The weather desciption is currently: " + weatherDescription + "</h3>");
        res.write("<h1>The temperature in " + query + " is " + temp + " degree Celsius.</h1>");
        res.write("<img src=" + imageUrl + " alt='icon'>");

        res.send();
      } catch {
        res.send("wrong city name, no such city found");

      }
    })

  });

});

app.listen(3000, function () {
  console.log("server is running on port 300");
});