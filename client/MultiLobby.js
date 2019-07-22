/*:
 *
 * MultiLobby
 *
 * @plugindesc Online features
 * @author Yuuta Kirishima / Dexter / Persia Indie Studios
 *
 *
 *
 * Copyright © - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Antwaun Tune <aj.yaboy@outlook.com>, August 2018
 */
var HOST = 'http://localhost:3000'
var MultiLobby = MultiLobby || {};
(function() {

    MultiLobby.socket = io.connect(HOST);
    MultiLobby.socket.on('connect_error', function() {
        throw new Error('Could not connect to Uniforce servers, please try again later.');
    })
    MultiLobby.socket.emit('player-connected', localStorage.getItem("StoredPlayerUserName"));
    var online_players = 0;
    var online_users;
    MultiLobby.socket.on('online-players', function(val) {
        online_players = val;
    })
    MultiLobby.socket.emit('get-online-players');

    MultiLobby.socket.on('online-users', function(data){
        online_users = data;
    })
    MultiLobby.getPlayers = function() {
        return online_users;
    }
    MultiLobby.getPlayersOnline = function() {
        return online_players;
    }

    /*
    * Cloud Save
    */
   var delivery = new Delivery(MultiLobby.socket);

    MultiLobby.cloudSave = function() {
        delivery.sendAsText({
            name: 'test.txt',
            path: ''
          });
    }
    delivery.on('send.success', function(fileUID){
        console.log('File Sent.');
    })
    /*
    //
    // Chat
    //
    */
    /*
    MultiLobby.chat = MultiLobby.chat || {}
    MultiLobby.chat.message = '';
    MultiLobby.chat.messageCount = 0;
    MultiLobby.chat.newMessage = false;
    MultiLobby.chat.startY = 0;
    MultiLobby.chat.Window = function() {
        this.initialize.apply(this, arguments);
    }

    MultiLobby.chat.Window.prototype = Object.create(Window_Base.prototype);
    MultiLobby.chat.Window.prototype.constructor = MultiLobby.chat.Window.prototype.initialize = function(x, y) {
        Window_Base.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
        this.refresh();
    }
    var __Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        __Scene_Map_start.call(this);
        if (this.chatWindow == undefined || null) {
            this.chatWindow = new MultiLobby.chat.Window(0, 425);
            this.addWindow(this.chatWindow);
        } else {

        }

    };
    MultiLobby.socket.on('got-new-message', function(message) {
        MultiLobby.chat.message = message;
        MultiLobby.chat.newMessage = true;
    })
    var _Scene_Map_Update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_Update.call(this)
        var theWindow = this.chatWindow;
        if (MultiLobby.chat.newMessage) {
            theWindow.refresh(GameJolt.getUserName() + ': ' + MultiLobby.chat.message);
            MultiLobby.chat.newMessage = false;
            MultiLobby.chat.messageCount++
                MultiLobby.chat.startY = MultiLobby.chat.startY + 25;
        }
    };

    MultiLobby.chat.Window.prototype.refresh = function(chatMessage) {
        if (MultiLobby.chat.messageCount === 7) {
            this.contents.clear();
            MultiLobby.chat.messageCount = 0;
            MultiLobby.chat.startY = 0;
        }
        this.contents.fontSize = 20;
        this.drawText(chatMessage, 0, MultiLobby.chat.startY, this.windowWidth(), 'left')
    }
    MultiLobby.chat.Window.prototype.windowWidth = function() {
        return 475;
    }

    MultiLobby.chat.Window.prototype.windowHeight = function() {
        return 200;
    }
    /*
    //
    // End of Chat
    //
    */

    /*
    //
    // Daily Quest
    //
    */
    MultiLobby.dailyQuest = MultiLobby.dailyQuest || {};
    MultiLobby.socket.emit('get-daily-quest-id');
    var dailyQuestId = 0;
    var DQstarted = false;
    var storedID;
    MultiLobby.socket.on('daily-quest-id', function(id){
        dailyQuestId = id;
    })
    MultiLobby.dailyQuest.start = function() {
    if(DQstarted == false){
        console.log('being called')
        var dailydata = {
            username: GameJolt.getUserName(),

            time: new Date()
        }
        Galv.QUEST.track(dailyQuestId);
        Galv.QUEST.activate(dailyQuestId);
        storedID = dailyQuestId;
        DQstarted = true;
        MultiLobby.socket.emit('daily-start', dailydata);
    }
    }

    MultiLobby.dailyQuest.check = function() {
        var newtimeData = {
            username: GameJolt.getUserName(),

            time: new Date()
        }
        MultiLobby.socket.emit('daily-check', newtimeData);
    }
    MultiLobby.socket.on('daily-checked', function(bool) {
        if(bool){
        DQstarted = false;
        } else {

        }
    })
})();
