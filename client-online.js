/*: 
*
* MultiLobby
*
* @plugindesc Online functions
* @author Yuuta Kirishima / Dexter / Persia Indie Studios
*
* @param host
* @desc server URL
* @default http://uniforce.herokuapp.com
*
*
*/
var parameters = PluginManager.parameters("MultiLobby");
var HOST = String(parameters['host']);
var MultiLobby = MultiLobby || {};
(function() {

    MultiLobby.socket = io.connect(HOST);
    MultiLobby.socket.on('connect_error', function(){
        throw new Error('Could not connect to Uniforce servers, please try again later.');
    })
    MultiLobby.socket.emit('player-connected');
    var online_players = 0;
    MultiLobby.socket.on('online-players', function(val){
        online_players = val;
    })
    MultiLobby.getPlayersOnline = function() {
        return online_players;
    }
    /*
    //
    // Chat
    //
    */
    MultiLobby.chat = MultiLobby.chat || {}
    MultiLobby.chat.message = '';
    MultiLobby.chat.messageCount = 0;
    MultiLobby.chat.newMessage = false;
    MultiLobby.chat.startY = 0;
    MultiLobby.chat.Window = function() {
        this.initialize.apply(this, arguments);
    }

    MultiLobby.chat.Window.prototype = Object.create(Window_Base.prototype);
    MultiLobby.chat.Window.prototype.constructor = MultiLobby.chat.Window.prototype.initialize = function(x, y){
        Window_Base.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
        this.refresh();
    }
    var __Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
            __Scene_Map_start.call(this);
        console.log(this.chatWindow);
        if(this.chatWindow == undefined || null){
            this.chatWindow = new MultiLobby.chat.Window(0, 425);
            this.addWindow(this.chatWindow);
        } else {

        }

    };
    MultiLobby.socket.on('got-new-message', function(message){
        MultiLobby.chat.message = message;
        MultiLobby.chat.newMessage = true;
    })
    var _Scene_Map_Update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_Update.call(this)
       var theWindow = this.chatWindow;
       if(MultiLobby.chat.newMessage){
            theWindow.refresh(GameJolt.getUserName() +': ' + MultiLobby.chat.message);
            MultiLobby.chat.newMessage = false;
            MultiLobby.chat.messageCount++
            MultiLobby.chat.startY = MultiLobby.chat.startY + 25;
       }
    };

    MultiLobby.chat.Window.prototype.refresh = function(chatMessage) {
        if(MultiLobby.chat.messageCount === 7){
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
    MultiLobby.dailyQuest.recievedBonus = function() {
        MultiLobby.socket.emit('recieved-bonus?');
    }
    MultiLobby.socket.on('bonus-recieved-2', function(bool){
        if(bool){

        } else {
            console.log('mission expired while not online');
        }
    })
    MultiLobby.dailyQuest.expire = function(){
        MultiLobby.socket.emit('check-expire');
    }
    MultiLobby.socket.on('mission-expired', function(bool){
        if(bool){
            console.log('Mission expired.')
            Galv.QUEST.status(id)
            MultiLobby.socket.emit('bonus-recieved');
        }
    })
    setInterval(function() {
        MultiLobby.dailyQuest.expire();
      }, 5000);

      var ___Scene_Map_start = Scene_Map.prototype.start;
      Scene_Map.prototype.start = function() {
        ___Scene_Map_start.call(this);
        MultiLobby.dailyQuest.recievedBonus();
    };
})();
