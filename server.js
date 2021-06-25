require('dotenv').config()


const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./backend/config/config')
const dbconnectLib = require('./backend/lib/dbConnect')
var users = require('./backend/models/userModel')
var addressLib = require('./backend/lib/addressLib')
mongoose.set('useCreateIndex', true);
const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static(__dirname+"/frontend"))

var cookieParser = require("cookie-parser")
var session = require("express-session")
const MongoStore = require('connect-mongo')


dbconnectLib.connect()

app.use(session({
    secret: "this is secret!!!!",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 *1000
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO })

}))



const PORT = process.env.PORT || 3000;


app.use(cookieParser());
app.post('/api/login', function(req, res) {
    users.find(req.body, function(err, data) {
        if (err) { res.status(400).json({ msg: "Failed" }); } else if (data.length == 1) {
            req.session.userid = data[0]._id
            req.session.username = data[0].username
            //TODO:  Move to single object in session
            //req.session.user = {userid: data[0]._id, username: data[0].username}
            console.log(req.session)
            res.redirect("/home");

        } else {

            res.redirect("/login");

        }
    });
})


var isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userid)
        next();
    else
        return res.redirect("/");
}


var isNotAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.userid)
        next();
    else
        return res.redirect("/");
}

app.get("/home", isAuthenticated, (req, res) => {
    res.sendFile(__dirname + "/frontend/html/home.html")
})
app.get("/addresses", isAuthenticated, (req, res) => {
    res.sendFile(__dirname + "/frontend/html/addresses.html")
})

app.get("/getdetails", (req, res) => {
    if(req.session && req.session.username){

        res.json({
            username: req.session.username
        });
    }
    else{
        res.json({
            username: undefined
        })
    }
})

app.get("/api/logout", isAuthenticated, (req, res) => {
    req.session.destroy(err => {
        if (err)
            return res.status(404).json({
                err: "error"
            })
    })
    console.log(req.session)

    return res.status(200).json({
        message: "succcessful signout"
    })

})


app.post('/api/register', function(req, res) {
    users.find({ email: req.body.email }, function(err, data) {
        if (err) { res.status(400).json({ msg: "Failed" }); } else { //console.log(data);
            if (data.length > 0)
                res.status(200).json({ msg: "Saved Successful", result: data });
            else {

                var add = new users(req.body);
                add.save(function(err, record) {
                    if (err) {
                        res.redirect("/register");
                    } else {
                        res.redirect("/login");
                    }
                });
            }
        }
    });
})

app.post("/api/addresses", isAuthenticated, addressLib.addAddressForUser);
app.get("/api/addresses", isAuthenticated, addressLib.getAllAddressOfAUser);
app.delete("/api/addresses/:idd", isAuthenticated, addressLib.deleteAddressForUser);
app.put("/api/addresses/:idd", isAuthenticated, addressLib.updateAddressForUser);


app.get("/", function(req, res){
    let i = __dirname + "/frontend/html/home.html";
    res.sendFile(i);
});

app.get("/login", function(req, res){
    let i = __dirname + "/frontend/html/login.html";
    res.sendFile(i);
});

app.get("/register", function(req, res){
    let i = __dirname + "/frontend/html/register.html";
    res.sendFile(i);
});

app.get("/p1", isAuthenticated, function(req, res){
    let i = __dirname + "/frontend/html/p1.html";
    res.sendFile(i); 
});

app.get("/p2", isAuthenticated, function(req, res){
    let i = __dirname + "/frontend/html/p2.html";
    res.sendFile(i);
});

app.get("/p3", isAuthenticated, function(req, res){
    let i = __dirname + "/frontend/html/p3.html";
    res.sendFile(i);
});

app.get("/cart", isAuthenticated, function(req, res){
    let i = __dirname + "/frontend/html/cart.html";
    res.sendFile(i);
});


app.get("/payment", function(req, res){
    let i = __dirname + "/frontend/html/payment.html";
    res.sendFile(i);
});



app.listen(PORT, function(){
    console.log("Server Starting running on http://localhost:"+PORT);
});

