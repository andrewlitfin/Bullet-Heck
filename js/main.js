"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var bulletHeck = bulletHeck || {};
var player = player || {};
var enemies = enemies || {};
var UI = UI || {};

bulletHeck.main = {
    //variables go here
    
    //preload function for calling via phaser
    preload : function() {     
        //preload UI
        UI.main.preload();

        //preload the player
        player.main.preload();
        
        // preload enemies
        enemies.main.preload();
    },
    
    //create function for calling via phaser
    create : function() {        
        //create UI
        UI.main.create();
        
        //DO NOT CREATE ANYTHING ELSE HERE. ALL CREATION WILL BE HANDLED THROUGH UI BUTTON PRESSES.
    },
    
    //update function for calling via phaser
    update : function() {
        //update UI
        UI.main.update();
        
        if (UI.main.gameState == UI.main.GAME_STATE.IN_LEVEL){
            console.log("IN LEVEL UPDATE");
            //update the player
            player.main.update();

            // update enemies
            enemies.main.update();
        }
    }
};