"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var bulletHeck = bulletHeck || {};
var player = player || {};
var enemies = enemies || {};
var UI = UI || {};

bulletHeck.main = {    
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
            //update the player
            player.main.update();

            // update enemies
            enemies.main.update();
            
            //CHECK FOR COLLISONS//
            //Player Bullet on Enemy
            for (var i = 0; i < player.main.bullets.length; i++){
                for (var j = 0; j < enemies.main.enemyObjs.length; j++){
                    var bulletSprite = player.main.bullets[i];
                    var enemySprite = enemies.main.enemyObjs[j].sprite;
                    if (bulletSprite.x < 
                        enemySprite.x + enemySprite.width &&
                       bulletSprite.x + bulletSprite.width > enemySprite.x &&
                       bulletSprite.y < enemySprite.y + enemySprite.height &&
                       bulletSprite.y + bulletSprite.height > enemySprite.y){
                        //HANDLE COLLISION HERE
                        enemies.main.enemyObjs[j].health--;
                        player.main.bullets[i].destroy();
                        player.main.bullets.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
            
            //Enemy Bullet on Player
            //TODO
            
            //Enemy on Player
            for (var i = 0; i < enemies.main.enemyObjs.length; i++){
                var playerSprite = player.main.playerObj;
                var enemySprite = enemies.main.enemyObjs[i].sprite;
                if (playerSprite.x < enemySprite.x + enemySprite.width &&
                   playerSprite.x + playerSprite.width > enemySprite.x &&
                   playerSprite.y < enemySprite.y + enemySprite.height &&
                   playerSprite.y + playerSprite.height > enemySprite.y){
                    //HANDLE COLLISION HERE
                    enemies.main.enemyObjs[i].health = 0;
                    player.main.health--;
                }
            }
            
            //If the player is dead, move to game over state
            if (player.main.health <= 0){
                UI.main.gameState = UI.main.GAME_STATE.GAME_OVER;
                UI.main.create();
            }
        }
    }
};