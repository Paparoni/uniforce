(function() {
    /*:
     * Copyright © - All Rights Reserved
     * Unauthorized copying of this file, via any medium is strictly prohibited
     * Proprietary and confidential
     * Written by Antwaun Tune <aj.yaboy@outlook.com>, August 2018
     *
     *
     * Modifies Scene_Shop.doBuy() class
     * @plugindesc Online shared shop system
     * @author PersiaIndie, Yuuta Kirishima, Dexter
     *
     * @param Refund Percentage
     * @desc the percentage of refund you get for selling an item in the bazaar
     *
     *
     */
    var parameters = PluginManager.parameters("Bazaar");
    var refund = parameters["Refund Percentage"];

    Array.prototype.extract = function(val) {
        var index = this.indexOf(val);
        this.splice(index, 1);
    }

    Array.prototype.contains = function(val) {
        return this.includes(val);
    };

    function getItemType(t) {
        if (DataManager.isWeapon(t)) {
            return 'w';
        } else if (DataManager.isArmor(t)) {
            return 'a';
        } else if (DataManager.isItem(t)) {
            return 'i'
        } else {
            throw new Error('Something went wrong...')
        }
    }

    Bazaar_alias = {};
    Bazaar_alias.doSell = Scene_Shop.prototype.doSell;
    Scene_Shop.prototype.doSell = function(number) {
        Bazaar_alias.doSell.call(this, number);
        let itemType = getItemType(this._item);
        let item = this._item
        let id = item.id;

        if(itemType == 'i'){
          var bazaar_items = GameJolt.get_server("bazaar_items") || "1";
          console.log("%c Successfully got data from server ", 'background: #222; color: #bada55')
          var bazaar_items_array = JSON.parse("[" + bazaar_items + "]");
          bazaar_items_array.push(id);
          GameJolt.send_server("bazaar_items", bazaar_items_array.toString());

        } else if (itemType == 'w') {
          var bazaar_weapons = GameJolt.get_server("bazaar_weapons") || "1";
          console.log("%c Successfully got data from server ", 'background: #222; color: #bada55')
          var bazaar_weapons_array = JSON.parse("[" + bazaar_weapons + "]");
          bazaar_weapons_array.push(id);
          GameJolt.send_server("bazaar_weapons", bazaar_weapons_array.toString());

        } else if(itemType == 'a'){
          var bazaar_armors = GameJolt.get_server("bazaar_armors") || "1";
          console.log("%c Successfully got data from server ", 'background: #222; color: #bada55')
          var bazaar_armors_array = JSON.parse("[" + bazaar_armors + "]");
          bazaar_armors_array.push(id);
          GameJolt.send_server("bazaar_armors", bazaar_armors_array.toString());
        }


    };

    Bazaar = {
        on: false,
        itemsShop: function() {
            Bazaar.on = true;
            console.log(GameJolt.get_server("bazaar_items"));
            var bazaar_items = GameJolt.get_server("bazaar_items") || "1";
            console.log("bazaar_items: " + GameJolt.get_server("bazaar_items"))
            var bazaar_items_array = JSON.parse("[" + bazaar_items.toString() + "]");
            var finalBazaar = [];
            for (var x = 1; x < $dataItems.length - 1; x++) {
                if (bazaar_items_array.contains($dataItems[x].id)) {
                    finalBazaar.push([0, $dataItems[x].id, 0]);
                }
            }
            console.log(finalBazaar);
            SceneManager.push(Scene_Shop);
            SceneManager.prepareNextScene(finalBazaar);
        },

        weaponsShop: function() {
            Bazaar.on = true;
            var bazaar_weapons = GameJolt.get_server("bazaar_weapons") || "";
            var bazaar_weapons_array = JSON.parse("[" + bazaar_weapons.toString() + "]");
            var finalBazaar = [];
            for (var x = 1; x < $dataWeapons.length - 1; x++) {
                if (bazaar_weapons_array.contains($dataWeapons[x].id)) {
                    var setId = $dataWeapons[x].id
                    finalBazaar.push([1, setId, 0]);
                    console.log(finalBazaar)
                }
            }
            SceneManager.push(Scene_Shop);
            SceneManager.prepareNextScene(finalBazaar);
        },

        armorsShop: function() {
            Bazaar.on = true;
            var bazaar_armors = GameJolt.get_server("bazaar_armors") || "";
            var bazaar_armors_array = JSON.parse("[" + bazaar_armors.toString() + "]");
            var finalBazaar = [];
            for (var x = 1; x < $dataArmors.length - 1; x++) {
                if (bazaar_armors_array.contains($dataArmors[x].id)) {
                    finalBazaar.push([2, $dataArmors[x].id, 0]);
                }
            }
            SceneManager.push(Scene_Shop);
            SceneManager.prepareNextScene(finalBazaar);
        },


    }
    Bazaar_alias.Scene_ShopdoBuy = Scene_Shop.prototype.doBuy;
    Scene_Shop.prototype.doBuy = function(number) {
        Bazaar_alias.Scene_ShopdoBuy.call(this, number);
        if (Bazaar.on == true) {
            if (this._item.itypeId == 1) {
                Bazaar.on = false;
                var bazaar_items = GameJolt.get_server("bazaar_items");
                console.log("%c Successfully got data from server ", 'background: #222; color: #bada55')
                var bazaar_items_array = JSON.parse("[" + bazaar_items + "]");
                bazaar_items_array.extract(this._item.id);
                GameJolt.send_server("bazaar_items", bazaar_items_array.toString());
            } else if (this._item.itypeId == 2) {
                Bazaar.on = false;
                var bazaar_weapons = GameJolt.get_server("bazaar_weapons");
                console.log("%c Successfully got data from server ", 'background: #222; color: #bada55')
                var bazaar_weapons_array = JSON.parse("[" + bazaar_weapons + "]");
                bazaar_weapons_array.extract(this._item.id);
                GameJolt.send_server("bazaar_weapons", bazaar_weapons_array.toString());
            } else if (this._item.itypeId == 3) {
                Bazaar.on = false;
                var bazaar_armors = GameJolt.get_server("bazaar_armors");
                console.log("%c Successfully got data from server ", 'background: #222; color: #bada55')
                var bazaar_armors_array = JSON.parse("[" + bazaar_armors + "]");
                bazaar_armors_array.extract(this._item.id);
                GameJolt.send_server("bazaar_armors", bazaar_armors_array.toString());
            }
        }

        SceneManager.pop();
    };
    Bazaar_alias.pluginCommand = Game_Interpreter.prototype.pluginCommand;

    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        Bazaar_alias.pluginCommand.call(this, command, args);

    }
})();
