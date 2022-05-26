const cred = require(__dirname + "/credentials.js");
const express = require("express");
const request = require("request");
const https = require("https");
const body_parser = require("body-parser");
const app = express();
app.use(body_parser.urlencoded({ extended: true }));
app.use(express.static("public"));
const url = "https://us13.api.mailchimp.com/3.0/lists/" + cred.listId;
const options = {
  method: "POST",
  auth: cred.authKey,
};
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const email = req.body.email;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const data = JSON.stringify({
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  });
  const request = https.request(url, options, (resp) => {
    console.log(resp);
    if (resp.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/fail.html");
    }
  });
  console.log("helloi");
  request.write(data);
  request.end();
});

app.post("/fail", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on port 3000");
});
