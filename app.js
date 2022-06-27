const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));


app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const fname = req.body.fName;
  const lname = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
    {
      email_address: email,
      status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us.api.mailchimp.com/3.0/lists/listName"
  const options = {
    method: "POST",
    auth: "APIKey"
  };

  const request = https.request(url, options, function(response){
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function(req, res){
  console.log("The server started at port 3000");
});

// Mailchimp API Key
// 988fa6cc6f415e456a94c6a1ca2a5461-us17

// Mailchimp autidence ID
// 3549732078
