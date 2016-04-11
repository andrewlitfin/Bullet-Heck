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
        this.background.tilePosition.y += 1;
        
        //update UI
        UI.main.update();
        
        if (UI.main.gameState == UI.main.GAME_STATE.IN_LEVEL){
            //update the player
            player.main.update();

            // update enemies
            enemies.main.update();
            
            //CHECK FOR COLLISONS//
            //Player Bullet on Enemy
            game.physics.arcade.overlap(player.main.bullets, enemies.main.type1EnemyObjs, this.bulletToEnemyCollision);
            game.physics.arcade.overlap(player.main.bullets, enemies.main.type2EnemyObjs, this.bulletToEnemyCollision);
            game.physics.arcade.overlap(player.main.bullets, enemies.main.type3EnemyObjs, this.bulletToEnemyCollision);

            //Enemy on Player collision checking
            game.physics.arcade.overlap(player.main.playerObj1, enemies.main.type1EnemyObjs, this.playerToEnemyCollision);
            game.physics.arcade.overlap(player.main.playerObj1, enemies.main.type2EnemyObjs, this.playerToEnemyCollision);
            game.physics.arcade.overlap(player.main.playerObj1, enemies.main.type3EnemyObjs, this.playerToEnemyCollision);
            game.physics.arcade.overlap(player.main.playerObj2, enemies.main.type1EnemyObjs, this.playerToEnemyCollision);
            game.physics.arcade.overlap(player.main.playerObj2, enemies.main.type2EnemyObjs, this.playerToEnemyCollision);
            game.physics.arcade.overlap(player.main.playerObj2, enemies.main.type3EnemyObjs, this.playerToEnemyCollision);
            
            //If the player is dead, move to game over state
            if (player.main.health <= 0){
                UI.main.gameState = UI.main.GAME_STATE.GAME_OVER;
                UI.main.create();
                return;
            }
            
            //If there are no more enemies, move to level complete state
            var countEnemiesAlive = enemies.main.type1EnemyObjs.countLiving() + enemies.main.type2EnemyObjs.countLiving() + enemies
            .main.type3EnemyObjs.countLiving();
/*
            enemies.main.type1EnemyObjs.forEachAlive(function(eo) {countEnemiesAlive++;}, enemies.main);
            enemies.main.type2EnemyObjs.forEachAlive(function(eo) {countEnemiesAlive++;}, enemies.main);
            enemies.main.type3EnemyObjs.forEachAlive(function(eo) {countEnemiesAlive++;}, enemies.main);
*/
            
            if(countEnemiesAlive <= 0){
                UI.main.gameState = UI.main.GAME_STATE.LEVEL_COMPLETE;
                UI.main.create();
                enemies.main.level++;
                return;
            }
        }
    },
    
    //Handle Collisions between bullets and enemies
    bulletToEnemyCollision: function(bullet, enemyObj){
        bullet.kill();
        enemyObj.health--;
    },
    
    //Handle Collisions between player and enemies
    playerToEnemyCollision: function(playerObj, enemyObj){
        player.main.health--;
        enemyObj.health = 0;
    },
};