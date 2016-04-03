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
                    if (bulletSprite.x < enemySprite.x-15 + enemySprite.width &&
                       bulletSprite.x + bulletSprite.width > enemySprite.x+15 &&
                       bulletSprite.y < enemySprite.y-15 + enemySprite.height &&
                       bulletSprite.y + bulletSprite.height > enemySprite.y+15){
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
                var playerSprite1 = player.main.playerObj1;
                var playerSprite2 = player.main.playerObj2;
                var enemySprite = enemies.main.enemyObjs[i].sprite;
                if (playerSprite1.x < enemySprite.x + enemySprite.width &&
                   playerSprite1.x + playerSprite1.width > enemySprite.x &&
                   playerSprite1.y < enemySprite.y + enemySprite.height &&
                   playerSprite1.y + playerSprite1.height > enemySprite.y &&
                   playerSprite2.x < enemySprite.x + enemySprite.width &&
                   playerSprite2.x + playerSprite2.width > enemySprite.x &&
                   playerSprite2.y < enemySprite.y + enemySprite.height &&
                   playerSprite2.y + playerSprite2.height > enemySprite.y){
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
            
            //If there are no more enemies, move to level complete state
            if(enemies.main.enemyObjs.length <= 0){
                UI.main.gameState = UI.main.GAME_STATE.LEVEL_COMPLETE;
                UI.main.create();
                enemies.main.level++;
            }
        }
    }
};