//jshint esversion:6
// require("dotenv").config()
const express = require("express");
const bodyparser = require("body-parser")
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
// var fs = require('fs');

var md5 = require('md5');


const app = express();

app.set("view engine", "ejs")
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));

mongoose.connect("mongodb://0.0.0.0:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// console.log(process.env.SECRETKEY);
// userSchema.plugin(encrypt, { secret: process.env.SECRETKEY, encryptedFields: ["password"] });
const User = new mongoose.model("users", userSchema)


app.get("/", function (req, res) {
    res.render("home")
});

app.get("/login", function (req, res) {
    res.render("login")
})

app.get("/register", function (req, res) {
    res.render("register")
})

app.post("/register", function (req, res) {
    const newUser = User({

        email: req.body.username,
        password: md5(req.body.password)
    });
    console.log(newUser);
    newUser.save()
        .then(() => {
            res.render("secrets")
        })
        .catch((err) => {
            console.log(err);

        })
})

app.post("/login", (async (req, res) => {
    userName = req.body.username;
    Password = md5(req.body.password);
    try {
        const founditems = await User.findOne({ email: userName });
        if (founditems.email === userName) {
            if (founditems.password === Password) {
                console.log(founditems);
                res.render("secrets")
            }
            else {
                res.send("Password is incorrect")
            }
        }
        else {
            res.send("enter Valid Email Id and Password")
        }
    }
    catch (err) {
        res.send("enter valid user name and password")
    }
    // User.findOne({ email: userName })
    //     .then((founditems) => {
    //         if (founditems === userName) {
    //             res.render("secrets")
    //         }
    //     })
    //     .catch((err) => {
    //         res.send("enter valid user name and password")
    //         console.log(err)

    //     })
}))

app.listen("3000", (() => {
    console.log("server is started successfully in port 3000")
}))