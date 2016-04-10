"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var bulletHeck = bulletHeck || {};
var player = player || {};
var enemies = enemies || {};
var UI = UI || {};

bulletHeck.main = { 
    background: undefined,    
    
    //preload function for calling via phaser
    preload : function() {
        //background
        game.load.image('space', 'assets/background.jpg');
        
        //preload UI
        UI.main.preload();

        //preload the player
        player.main.preload();
        
        // preload enemies
        enemies.main.preload();
    },
    
    //create function for calling via phaser
    create : function() {
        this.background = game.add.tileSprite(0, 0, game.width, game.height, 'space');
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //create UI
        UI.main.create();
        
        //DO NOT CREATE ANYTHING ELSE HERE. ALL CREATION WILL BE HANDLED THROUGH UI BUTTON PRESSES.
    },
    
    //update function for calling via phaser
    update : function() {
        //update background
        this.background.tilePosition.y += 1.1;
        
        //update UI
        UI.main.update();
        
        if (UI.main.gameState == UI.main.GAME_STATE.IN_LEVEL){
            //update the player
            player.main.update();

            // update enemies
            enemies.main.update();
            
            //CHECK FOR COLLISONS//
            //Player Bullet on Enemy
/*
            for (var i = 0; i < player.main.bullets.length; i++){
                for (var j = 0; j < enemies.main.enemyObjs.length; j++){
                    var bulletSprite = player.main.bullets[i].bulletSprite;
                    var enemySprite = enemies.main.enemyObjs[j].sprite;
                    if (bulletSprite.x < enemySprite.x-15 + enemySprite.width &&
                       bulletSprite.x + bulletSprite.width > enemySprite.x+15 &&
                       bulletSprite.y < enemySprite.y-15 + enemySprite.height &&
                       bulletSprite.y + bulletSprite.height > enemySprite.y+15){
                        //HANDLE COLLISION HERE
                        enemies.main.enemyObjs[j].health--;
                        player.main.bullets[i].bulletSprite.destroy();
                        player.main.bullets.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
*/
            
            //Enemy Bullet on Player
            //TODO
            
            //Enemy on Player
/*
            for (var i = 0; i < enemies.main.enemyObjs.length; i++){
                var playerSprite1 = player.main.playerObj1;
                var playerSprite2 = player.main.playerObj2;
                var enemySprite = enemies.main.enemyObjs[i].sprite;
                if (this.AABBCollision(playerSprite1.x - playerSprite2.width/2,
                                       playerSprite1.y - playerSprite2.height/2,
                                       playerSprite1.width,
                                       playerSprite1.height,
                                       enemySprite.x,
                                       enemySprite.y,
                                       enemySprite.width,
                                       enemySprite.height)) {
                    //HANDLE COLLISION HERE
                    enemies.main.enemyObjs[i].health = 0;
                    player.main.health--;
                }
                if (this.AABBCollision(playerSprite2.x - playerSprite2.width/2,
                                       playerSprite2.y - playerSprite2.height/2,
                                       playerSprite2.width,
                                       playerSprite2.height,
                                       enemySprite.x,
                                       enemySprite.y,
                                       enemySprite.width,
                                       enemySprite.height)) {
                   //HANDLE COLLISION HERE
                    enemies.main.enemyObjs[i].health = 0;
                    player.main.health--; 
                }
            }
*/
            
            //If the player is dead, move to game over state
            if (player.main.health <= 0){
                UI.main.gameState = UI.main.GAME_STATE.GAME_OVER;
                UI.main.create();
            }
            
/*
            //If there are no more enemies, move to level complete state
            if(enemies.main.enemyObjs.length <= 0){
                UI.main.gameState = UI.main.GAME_STATE.LEVEL_COMPLETE;
                UI.main.create();
                enemies.main.level++;
            }
*/
        }
    },

    // Helper function to check if two AABBs are colliding
    // AABB layout:
    //   x, y, width, height
    //   where (x, y) is the UPPER LEFT corner of the AABB
    // AABB1 = {x1, y1, width1, height1}
    // AABB2 = {x2, y2, width2, height2}
    // returns TRUE if the two AABBs are colliding and false otherwise
    AABBCollision : function(x1, y1, width1, height1, x2, y2, width2, height2) {
        if (x1 > x2 + width2 || /* if AABB1 is to the right of AABB2 */
            x1 + width1 < x2 || /* or AABB1 is to the left of AABB2 */
            y1 > y2 + height2 || /* or AABB1 is below AABB2 */
            y1 + height2 < y2 /* or AABB1 is above AABB2 */) {
            // then there's no collision
            return false;
        }
        return true;
    }
};