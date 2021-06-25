const mongoose = require('mongoose')
var dboptions = { useNewUrlParser: true, useUnifiedTopology: true }
const config = require("../config/config")

module.exports = {
    connect:function(){
        mongoose.connect(config.mongoConnectionString, dboptions);
        var db=mongoose.connection

        db.on('connected', function(){
            console.log("Database connected");
        });

        db.on('error', function (error) {
            console.error('Error in MongoDb connection: ' + error);
        });
            
        db.on('disconnected', function () {
            console.log('MongoDB disconnected!');
        });
    }
}