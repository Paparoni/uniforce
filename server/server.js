var start = new Date().getSeconds()
const app = require("express")();
const later = require("later");
const server = app.listen(3000, function() {
    var end = new Date().getSeconds()
    var final = (end - start)
    var plrl;
    (final != 1) ? plrl = "s" : plrl = ""
    console.log("Server Online!")
    console.log("Server loaded in "+final+" second"+ plrl + ".");
})
// https://stackoverflow.com/questions/18536726/javascript-to-display-the-current-date-and-time/18536804
// Didn't feel like writing my own date and time function, very tedious.

function formatAMPM() {
var d = new Date(),
    minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    ampm = d.getHours() >= 12 ? 'pm' : 'am',
    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
return days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()+' '+hours+':'+minutes+ampm;
}

app.get('/', (req, res) => res.send(`Server started at ${formatAMPM()}`))

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const cors = require('cors')
const adapter = new FileSync('db.json')
const db = low(adapter)

var upload = require('express-fileupload')

app.use(upload()).use(cors);
db.defaults({
        dailys: [],
        user: {}
    })
    .write()

const io = require("socket.io")(server),
      dl  = require('delivery'),
      fs  = require('fs');

var totalPlayers = 0;
var recieved_bonusCounter = 0;
var data = 0;
var the_date = new Date().getHours();

function updateDailyQuest() {
    console.log('test')
}

app.get("/save", function(req, res){
    if(req.files){
        console.log(req.files)
    }
})
io.on('connection', function(client) {
    totalPlayers++
    console.log(client.id + ' Connected!')

    client.on('hi', function() {
        console.log('hi');
    })

    client.on('player-connected', function(name) {
        console.log(name+"connected");
        client.emit('online-players', totalPlayers);
    })
    client.on('new-chat', function(message) {
        console.log(message);
        io.emit('got-new-message', message);
    })
    client.on('disconnect', function() {
        totalPlayers--
    })

    // Daily Quest Begin
    client.on('daily-start', function(data) {
        if (db.get('dailys').find({username: data.username}).value()) {
            db.get('dailys')
                .find({
                    username: data.username
                })
                .assign({
                    time: data.time
                })
                .write();
        } else {
        db.get('dailys')
            .push(data)
            .write();
        }
    });

    client.on('daily-check', function(data) {
        var usertime = Date.parse(db.get('dailys').find({
            username: data.username
        }).value().time);
        var currentTime = new Date();
        var day = 24 * 60 * 60 * 1000;
        var daysPassed = Math.round(Math.abs((usertime.getTime() - currentTime.getTime()) / (day)));

        if (daysPassed <= 1) {
            client.emit('daily-checked', true);
        } else {
            client.emit('daily-checked', false);
        }

    })

    client.on('get-daily-quest-id', function(){
        client.emit('daily-quest-id', 2);
    })


})
