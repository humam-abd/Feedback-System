var express = require("express");
var app = express();
var session = require("express-session");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/fb");
var localStorage = require("node-localstorage");
var store = require('store');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({ secret: 'itisnow' }));
app.use(cookieParser());

var feed = mongoose.Schema({
    feedb: String,
    questID: String,
    userID: Number
});

var feedback = mongoose.model("FeedBack", feed);

app.post("/posted", function (req, res) {
    res.redirect("/main");
    console.log(req.body)
    if (req.body.fds != "") {
        console.log("Saving fb");
        var myFeed = new feedback({
            feedb: req.body.fds,
            questID: req.body.qIDs,
            userID: store.get("user").ID
        });

        myFeed.save(function (err, response) {
            if (err) {
                console.log("Error saving feedback");
            }
            console.log("Feedback Accepted");
        });
    }
    else {
        console.log("Error saving feedback");
    }
})

var quest = mongoose.Schema({
    questn: String
});

var question = mongoose.model("Question", quest);

app.post("/added", function (req, res) {
    res.redirect("/quest");
    if (req.body.questn != "") {
        console.log("Question is now being added");
        var myQuest = new question({
            questn: req.body.questn
        });

        myQuest.save(function (err, result) {
            if (err) {
                console.log("Cannot add Question");
            }
            console.log("Question Added");
        });
    }
    else {
        console.log("Question not added");
    }
})
app.get("/", function (req, res) {
    ses = req.session
    if (ses.login == 1) {
        res.redirect("/quest");
    }
    else if (ses.login == 2) {
        res.redirect("/main");
    }
    else {
        res.sendFile(__dirname + "/index.html");
    }
})

app.get("/adlogin", function (req, res) {
    res.sendFile(__dirname + "/" + "adlogin.html");
})
app.get("/uslogin", function (req, res) {
    res.sendFile(__dirname + "/" + "uslogin.html");
})
app.get("/main", function (req, res) {
    ses = req.session;
    if ((ses.login == 1) || (ses.login == 2)) {
        res.sendFile(__dirname + "/main.html");
    }
    else {
        res.sendFile(__dirname + "/main.html");
    }
})
app.post("/main", function (req, res) {
    ses = req.session;
    if (req.body.ususer.length == 10 || req.body.ususer.length == 12) {
        store.set("user", { ID: req.body.ususer });
        console.log("user ID is ", store.get("user").ID);
        ses.login = 2;
        res.sendFile(__dirname + "/main.html");
    }
    else {
        res.redirect("/uslogin");
    }
})
app.get("/quest", function (req, res) {
    ses = req.session;
    if (ses.login == 1) {
        res.sendFile(__dirname + "/quest.html");
    }
    else {
        res.redirect("/adlogin");
    }
})
app.post("/quest", function (req, res) {
    ses = req.session;
    if (req.body.aduser == "admin" && req.body.adpass == "admin") {
        ses.login = 1;
        res.sendFile(__dirname + "/quest.html");
    }
    else {
        res.redirect("/adlogin");
    }
})
app.get("/logout", function (req, res) {
    ses = req.session;
    store.remove("user");
    ses.login = 0;
    console.log("Logged Out");
    res.redirect("/");
})

app.get("/report", function (req, res) {
    ses = req.session;
    if (ses.login == 1) {
        res.sendFile(__dirname + "/report.html");
    }
    else {
        res.redirect("/main");
    }
})
app.get("/allq", function (req, res) {
    question.find({}, function (err, result) {
        if (err) {
            console.log("Error finding data");
        }
        let qst = {
            quests: result,
            adSession: req.session
        }
        res.send(qst);
    })
})
app.get("/allf", function (req, res) {
    feedback.find({}, function (err, result) {
        if (err) {
            console.log("Error in finding feedback");
        }
        let fdb = {
            feeds: result,
            usSession: req.session
        }
        res.send(fdb);
    })
})
var server = app.listen(8081, function () {
    console.log("Server is running...");
})
