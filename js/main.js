"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var bulletHeck = bulletHeck || {};
var player = player || {};
var enemies = enemies || {};
var UI = UI || {};

bulletHeck.main = { 
    background: undefined,
    // sound effect audio
    sfx: undefined,
    
    //preload function for calling via phaser
    preload : function() {
        //background
        game.load.image('space', 'assets/background.jpg');
        
        // sfx audio (loaded here because collisions are triggers)
        game.load.audio('sfx', 'assets/audio/fx_mixdown.mp3');
        
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
        
        // Set up the audio sprite
        this.sfx = game.add.audio('sfx');
        this.sfx.allowMultiple = true;
        this.sfx.volume = 0.1;
        // define audio markers
        this.sfx.addMarker('alien death', 1, 1.0, 0.02, false);
        this.sfx.addMarker('boss hit', 3, 0.5,    0.02, false);
        this.sfx.addMarker('escape', 4, 3.2,      0.02, false);
        this.sfx.addMarker('meow', 8, 0.5,        0.02, false);
        this.sfx.addMarker('numkey', 9, 0.1,      0.02, false);
        this.sfx.addMarker('ping', 10, 1.0,       0.02, false);
        this.sfx.addMarker('death', 12, 4.2,      0.02, false);
        this.sfx.addMarker('shot', 17, 1.0,       0.02, false);
        this.sfx.addMarker('squit', 19, 0.3,      0.02, false);
        
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
            var countEnemiesAlive = enemies.main.type1EnemyObjs.countLiving() +
                enemies.main.type2EnemyObjs.countLiving() + 
                enemies.main.type3EnemyObjs.countLiving();
            
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
        bulletHeck.main.sfx.play('numkey');
        
        // As the enemy takes damage they slowly turn red
        var tintOffset = Math.floor((25 - enemyObj.health)/25 * 0xff);
        enemyObj.tint = 0xffffff - (tintOffset << 8) - tintOffset;
        
        if (enemyObj.health <= 0) {
            var explosion = enemies.main.explosions.getFirstExists(false);
            explosion.reset(enemyObj.body.x, enemyObj.body.y);
            explosion.play('kaboom', 30, false, true);
            
            bulletHeck.main.sfx.play('alien death');
        }
    },
    
    //Handle Collisions between player and enemies
    playerToEnemyCollision: function(playerObj, enemyObj){
        var explosion = enemies.main.explosions.getFirstExists(false);
        explosion.reset(enemyObj.body.x, enemyObj.body.y);
        explosion.play('kaboom', 30, false, true);
        
        bulletHeck.main.sfx.play('alien death');
        bulletHeck.main.sfx.play('boss hit');
        
        player.main.health--;
        enemyObj.health = 0;
        
        if (player.main.health <= 0) {
            var explosion = enemies.main.explosions.getFirstExists(false);
            explosion.reset(playerObj.body.x, playerObj.body.y);
            explosion.play('kaboom', 30, false, true);
            
            bulletHeck.main.sfx.play('death');
        }
    },
};