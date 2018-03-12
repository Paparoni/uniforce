
/*:

Bazaar by Yuuta Kirishima (C)opyright 2018
@plugindesc Online shared shop system
@author PersiaIndie, Yuuta Kirishima, Dexter

@param Refund Percentage
@desc the percentage of refund you get for selling an item in the bazaar

*/

var parameters = PluginManager.parameters("Bazaar");
var refund = parameters["Refund Percentage"];

Array.prototype.extract = function(val) {
   var index = this.indexOf(val);
    this.splice(index, 1);
}
Scene_Shop.prototype.doBuy = function(number) {
    if (Bazaar.on == true){
        if(this._item.itypeId == 1){
            Bazaar.on = false;
            var bazaar_items = GameJolt.get_server("bazaar_items");
            console.log("%c Successfully got data from server ", 'background: #222; color: #bada55')
            var bazaar_items_array = JSON.parse("["+bazaar_items+"]");
            bazaar_items_array.extract(this._item.id);
            GameJolt.send_server("bazaar_items", bazaar_items_array.toString());
        } else if(this._item.itypeId == 2){

        } else if(this._item.itypeId == 3){

        }
    }
    console.log(this._item);
    $gameParty.loseGold(number * this.buyingPrice());
    $gameParty.gainItem(this._item, number);
    SceneManager.pop();
};

Bazaar = {
    on: false,

    sellItem: function(id){ 
        var bazaar_items = GameJolt.get_server("bazaar_items");
        console.log("%c Successfully got data from server ", 'background: #222; color: #bada55')
        var bazaar_items_array = JSON.parse("["+bazaar_items+"]");
        bazaar_items_array.push(id);
        GameJolt.send_server("bazaar_items", bazaar_items_array.toString());
        $gameParty.gainItem($dataItems[id], -1);
        var refund_amount = $dataItems[id].price * refund;
        $gameParty.gainGold(refund_amount);
    },

    sellWeapon: function(id){
        var bazaar_weapons = GameJolt.get_server("bazaar_weapons");
        console.log("%c Successfully got data from server ", 'background: #222; color: #bada55')
        var bazaar_weapons_array = JSON.parse("["+bazaar_weapons+"]");
        bazaar_weapons_array.push(id);
        GameJolt.send_server("bazaar_weapons", bazaar_weapons_array.toString());
        $gameParty.gainItem($dataWeapons[id], -1);
        var refund_amount = $dataWeapons[id].price * refund;
        $gameParty.gainGold(refund_amount);
    },

    sellArmor: function(id){
        var bazaar_armors = GameJolt.get_server("bazaar_armors");
        console.log("%c Successfully got data from server ", 'background: #222; color: #bada55')
        var bazaar_armors_array = JSON.parse("["+bazaar_armors+"]");
        bazaar_armors_array.push(id);
        GameJolt.send_server("bazaar_armors", bazaar_armors_array.toString());
        $gameParty.gainItem($dataArmors[id], -1);
        var refund_amount = $dataArmors[id].price * refund;
        $gameParty.gainGold(refund_amount);
    },

    itemsShop: function(){
        Bazaar.on = true;
       var bazaar_items = GameJolt.get_server("bazaar_items");
       console.log(bazaar_items);
       var bazaar_items_array = JSON.parse("["+bazaar_items.toString()+"]");
       console.log("Items in bazaar: "+bazaar_items_array);
       var finalBazaar = [];
       for (var i = 0; i < bazaar_items_array.length; i++)
       {
           console.log(i)
            finalBazaar[i] = new Array();
            finalBazaar[i].push(0);
            finalBazaar[i].push(bazaar_items_array[i]);
            finalBazaar[i].push(0);
       }
       console.log("Items in shop: "+finalBazaar);
       SceneManager.push(Scene_Shop);
       SceneManager.prepareNextScene(finalBazaar);
    }


}

