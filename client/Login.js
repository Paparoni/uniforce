/* Copyright © - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Antwaun Tune <aj.yaboy@outlook.com>, August 2018
 */

/*
 *
 * This just makes sure the player is logged in to GameJolt when they start the game
 *
 */

(function() {
    var __Scene_Title_Draw = Scene_Title.prototype.drawGameTitle;
    Scene_Title.prototype.drawGameTitle = function() {
        if (GameJolt.isLoggedIn()) {
            __Scene_Title_Draw.call(this);
        } else {
            GameJolt.loginRedirect();
        }
    };
    var _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        if (GameJolt.isLoggedIn()) {
            _Scene_Map_start.call(this);
        } else {
            $gameMessage.setPositionType(2);
            $gameMessage.add('User not logged in returning to main menu.')
            setTimeout(function () {
                SceneManager.goto(Scene_Title);
        }, 3000);
            
        }
    };

})();
