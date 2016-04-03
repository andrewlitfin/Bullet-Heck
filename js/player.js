"use strict";
//File for handling all methods directly related to the player

// if app exists use the existing copy
// else create a new empty object literal
var player = player || {};

player.main = {
    //player and related attributes
    playerObj1 : undefined,
    playerObj2 : undefined,
    speed: 5,
    STARTING_HEALTH: 3,
    health: 3,
    
    //bullets
    bullets: [],
    bulletSpeed: 20,
    
    //keyboard inputs
    keyUp: undefined,
    keyDown: undefined,
    keyLeft: undefined,
    keyRight: undefined,
    keySpace: undefined,

    preload : function(){        
        //load images
        game.load.image('player', 'assets/player/ship.png');
        game.load.image('bullet', 'assets/player/bullet.png'); 
        
        //establish keys
        this.keyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.keyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },
    
    create : function(){
        //create the first player object and center it on the screen
        this.playerObj1 = game.add.sprite(game.width/2, game.height, 'player');
        this.playerObj1.scale.set(0.2,0.2);
        this.playerObj1.anchor.x = 0.5;
        this.playerObj1.anchor.y = 0.5;
        this.playerObj1.y -= this.playerObj1.height + 20;
        
        //create the second player object and center it on the screen
        this.playerObj2 = game.add.sprite(game.width/2, game.height, 'player');
        this.playerObj2.scale.set(0.2,0.2);
        this.playerObj2.anchor.x = 0.5;
        this.playerObj2.anchor.y = 0.5;
        this.playerObj2.y -= this.playerObj2.height + 20;
    },
        
    update : function(){
        //if the player is dead
        if (this.health <= 0){
            console.log("You are dead");
            return;
        }
        
        if (this.keyLeft.isDown){
            //keep the first player from going off the screen to the left
            if(this.playerObj1.x > this.playerObj1.width/2){
                this.playerObj1.x -= this.speed;
            }
            //keep the second player from going off the screen to the left
            if(this.playerObj2.x < game.width - this.playerObj2.width/2){
                this.playerObj2.x += this.speed;
            }
        }
        if (this.keyRight.isDown){
            //keep the first player from going off the screeen to the right
            if (this.playerObj1.x < game.width - this.playerObj1.width/2){
                this.playerObj1.x += this.speed;
            }
            //keep the second player from going off the screeen to the right
            if (this.playerObj2.x > this.playerObj2.width/2){
                this.playerObj2.x -= this.speed;
            }
        }
        if (this.keyUp.isDown){
            //keep the first player from going off the top of the screen
            if (this.playerObj1.y > this.playerObj1.height/2){
                this.playerObj1.y -= this.speed; 
            }
            //keep the second player from going off the top of the screen
            if (this.playerObj2.y > this.playerObj1.height/2){
                this.playerObj2.y -= this.speed; 
            }
        }
        if(this.keyDown.isDown){
            //keep the first player from going off the bottom of the screen
            if(this.playerObj1.y < game.height - this.playerObj1.height/2){
                this.playerObj1.y += this.speed;
            }
            //keep the second player from going off the bottom of the screen
            if(this.playerObj2.y < game.height - this.playerObj2.height/2){
                this.playerObj2.y += this.speed;
            }
        }
        
        //rotate the players to face the center of the screen
        this.playerObj1.rotation = 1 * (game.math.angleBetween(game.width/2, game.height/2, this.playerObj1.x, this.playerObj1.y) - Math.PI/2);
        this.playerObj2.rotation = 1 * (game.math.angleBetween(this.playerObj2.x, this.playerObj2.y, game.width/2, game.height/2) + Math.PI/2);
        
        if(this.keySpace.isDown){
            this.fireBullet();
        }
        
        //update the bullets
        for (var i = 0; i < this.bullets.length; i++){
            //move the bullets every frame
            if (this.bullets[i] != null){
                this.bullets[i].y -= this.bulletSpeed;
            }
            //destroy the bullets when they go off screen
            if (this.bullets[i] != null){
                if (this.bullets[i].y < -10){
                    this.bullets[i].destroy();
                    this.bullets.splice(i, 1);
                    i--;
                }
            }
        }
    },
    
    fireBullet : function(){
        //create a bullet for the first ship
        this.bullets.push(game.add.sprite(this.playerObj1.x, this.playerObj1.y, 'bullet'));
        this.bullets[this.bullets.length-1].x -= this.bullets[this.bullets.length-1].width/2;
        //create a bullet for the second ship
        this.bullets.push(game.add.sprite(this.playerObj2.x, this.playerObj2.y, 'bullet'));
        this.bullets[this.bullets.length-1].x -= this.bullets[this.bullets.length-1].width/2;
    },
}