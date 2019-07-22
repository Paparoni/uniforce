/* Copyright © - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Antwaun Tune <aj.yaboy@outlook.com>, August 2018
 * 
 * Handling Weapon Perk states
 */
var YT_States = YT_States || {};

Array.prototype.empty = function() {
    for (var i = 0; i < this.length; i++) {
        this.extract(this[i]);
    }
}
Game_Enemy.prototype.isEquipped = function(item) {
    return this.equips().contains(item);
}
YT_States.perkFilter = function(weaponId) {

    var battleMembers = []
    for (var x = 0; x < $gameParty.battleMembers().length; x++) {
        battleMembers.push($gameParty.battleMembers()[x]);
    }
    for (var y = 0; y < $gameTroop.members().length; y++) {
        battleMembers.push($gameTroop.members()[y]);
    }
    for (var i = 0; i < battleMembers.length; i++) {
        if (battleMembers[i].isEquipped($dataWeapons[weaponId])) {
            if (battleMembers[i].isActor()) {
                $gameVariables.setValue(3, $gameParty.battleMembers()[i]._actorId);

            } else if (battleMembers[i].isEnemy()) {
                $gameVariables.setValue(3, $gameTroop.members()[i].index());
            }
            return true;
        } else {
        }
    }
}
var deadTroop = [];
/*
var __Scene_Battlenitialize = Scene_Battle.prototype.initialize;
Scene_Battle.prototype.initialize = function() {
    __Scene_Battlenitialize.call(this);
    for(var i = 0; i < $gameTroop.members().length; i++) {
        deadTroop.push($gameTroop.members()[i]);
    }
}
*/
Game_Actor.prototype.markStruckActions = function(item, subject) {
    if (!item) return;
    this._lastStruckId = item.id;
    this.markLastStruckEnemy(subject);

};
Game_Actor.prototype.markLastStruckEnemy = function(subject) {
    if (subject && subject.isEnemy()) this._lastStruckEnemy = subject.enemy().id;
    if (subject && subject.isEnemy()) this._lastStruckEnemyIndex = subject.index();

};

YT_States.alias = {}
YT_States.alias.Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect

Game_Action.prototype.applyItemUserEffect = function(target) {
    YT_States.alias.Game_Action_applyItemUserEffect.call(this, target);
    if (target && target.isActor()) {
        target.markStruckActions(this.item(), this.subject(), this);
    }
};

YT_States.isEnemyDead = function() {
    console.log("called is enemy dead init")
    var deadBattleMembers = [];
    for (var x = 0; x < $gameTroop.deadMembers().length; x++) {
        deadBattleMembers.push($gameTroop.deadMembers()[x])
    }
    for (var y = 0; y < $gameParty.deadMembers().length; y++) {
        deadBattleMembers.push($gameParty.deadMembers()[y])
    }
    for (var i = 0; i < deadBattleMembers.length; i++) {
        console.log(deadBattleMembers[i].isEnemy())
        if (deadBattleMembers[i].isActor()) {
            $gameVariables.setValue(5, deadBattleMembers[i]._lastStruckEnemyIndex);
            $gameVariables.setValue(8, 2)
            deadBattleMembers.extract(deadBattleMembers[i]);
            return true;
        }

        if (deadBattleMembers[i].isEnemy()) {
            $gameVariables.setValue(5, deadBattleMembers[i]._lastStruckActor);
            $gameVariables.setValue(8, 1)
            deadBattleMembers.extract(deadBattleMembers[i]);
            console.log("WHY THE FUCK ISN\'T THIS WORKING?")
            return true;
        }


    }
}
YT_States.parseEnemy = function(id) {
    return $dataEnemies[id]
}
YT_States.replaceState = function(variable, state_id, new_state) {
    var enemy = $gameTroop.members()[$gameVariables.value(variable)];
    var actor = $gameActors.actor($gameVariables.value(variable));
    if (actor.isStateAffected(state_id)) {
        actor.removeState(state_id);
        actor.addState(new_state)
    } else if (enemy.isStateAffected(state_id)) {
        enemy.removeState(state_id)
        enemy.addState(new_state)

    }
}

YT_States.addState = function(variable, state, type) {
    var enemy = $gameTroop.members()[$gameVariables.value(variable)];
    var actor = $gameActors.actor($gameVariables.value(variable));

    // 2 is Enemy
    // 1 is Actor
    if (type == 2) {
        enemy.addState(state)
    } else if (type == 1) {
        actor.addState(state)
    } else {
        throw new Error("Type of target not defined")
    }

}

var runCommonEventTroopDeath = function(id) {

    var deadTroopCounter = 0;
    for (var i = 0; i < $gameTroop.members().length; i++) {
        if ($gameTroop.members()[i]._hp == 0) {
            deadTroopCounter++;
        }
        if (deadTroopCounter == $gameTroop.members().length) {
            $gameTemp.reserveCommonEvent(id);
        }
    }
}
var firstPhase = 0;
var UMhit = false;
