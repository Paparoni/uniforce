/*:
 *
 * Bazaar by Yuuta Kirishima (C)opyright 2018
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
Scene_Shop.prototype.doBuy = function(number) {
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
    console.log(this._item);
    $gameParty.loseGold(number * this.buyingPrice());
    $gameParty.gainItem(this._item, number);
    SceneManager.pop();
};

Bazaar = {
    on: false,

    sellItem: function(id) {
        if (id) {
            var bazaar_items = GameJolt.get_server("bazaar_items") || "1";
            console.log("%c Successfully got data from server ", 'background: #222; color: #bada55')
            var bazaar_items_array = JSON.parse("[" + bazaar_items + "]");
            bazaar_items_array.push(id);
            GameJolt.send_server("bazaar_items", bazaar_items_array.toString());
            $gameParty.gainItem($dataItems[id], -1);
            var refund_amount = Math.round($dataItems[id].price * refund);
            $gameParty.gainGold(refund_amount);
        }
    },

    sellWeapon: function(id) {
        if (id) {
            var bazaar_weapons = GameJolt.get_server("bazaar_weapons") || "";
            console.log("%c Successfully got data from server ", 'background: #222; color: #bada55')
            var bazaar_weapons_array = JSON.parse("[" + bazaar_weapons + "]");
            bazaar_weapons_array.push(id);
            GameJolt.send_server("bazaar_weapons", bazaar_weapons_array.toString());
            $gameParty.gainItem($dataWeapons[id], -1);
            var refund_amount = Math.round($dataWeapons[id].price * refund);
            $gameParty.gainGold(refund_amount);
        }
    },

    sellArmor: function(id) {
        if (id) {
            var bazaar_armors = GameJolt.get_server("bazaar_armors") || "";
            console.log("%c Successfully got data from server ", 'background: #222; color: #bada55')
            var bazaar_armors_array = JSON.parse("[" + bazaar_armors + "]");
            bazaar_armors_array.push(id);
            GameJolt.send_server("bazaar_armors", bazaar_armors_array.toString());
            $gameParty.gainItem($dataArmors[id], -1);
            var refund_amount = Math.round($dataArmors[id].price * refund);
            $gameParty.gainGold(refund_amount);
        }
    },

    itemsShop: function() {
        Bazaar.on = true;
        var bazaar_items = GameJolt.get_server("bazaar_items") || "1";
        var bazaar_items_array = JSON.parse("[" + bazaar_items.toString() + "]");
        var finalBazaar = [];
        for (var x = 1; x < $dataItems.length; x++) {
            if (bazaar_items_array.contains($dataItems[x].id)) {
                finalBazaar.push([0, $dataItems[x].id, 0]);
            }
        }
        SceneManager.push(Scene_Shop);
        SceneManager.prepareNextScene(finalBazaar);
    },

    weaponsShop: function() {
        Bazaar.on = true;
        var bazaar_weapons = GameJolt.get_server("bazaar_weapons") || "";
        var bazaar_weapons_array = JSON.parse("[" + bazaar_weapons.toString() + "]");
        var finalBazaar = [];
        for (var x = 1; x < $dataWeapons.length; x++) {
            if (bazaar_weapons_array.contains($dataWeapons[x].id)) {
                finalBazaar.push([1, $dataWeapons[x].id, 0]);
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
        for (var x = 1; x < $dataArmors.length; x++) {
            if (bazaar_armors_array.contains($dataArmors[x].id)) {
                finalBazaar.push([2, $dataArmors[x].id, 0]);
            }
        }
        SceneManager.push(Scene_Shop);
        SceneManager.prepareNextScene(finalBazaar);
    },


}
Bazaar.alias = {};

Bazaar.alias.pluginCommand = Game_Interpreter.prototype.pluginCommand;

Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Bazaar.alias.pluginCommand.call(this, command, args);

    if (command == "BazaarOpen") {
        Bazaar.itemsShop();
    }

}
