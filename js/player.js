"use strict";
//File for handling all methods directly related to the player

// if app exists use the existing copy
// else create a new empty object literal
var player = player || {};

player.main = {
    //player and related attributes
    playerObj : undefined,
    speed: 5,
    
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
        //create the player Object and center it on the screen
        this.playerObj = game.add.sprite(game.width/2, game.height, 'player');
        this.playerObj.scale.set(0.2,0.2);
        this.playerObj.x -= this.playerObj.width/2;
        this.playerObj.y -= this.playerObj.height + 20;
    },
        
    update : function(){
        if (this.keyLeft.isDown){
            //keep the player from going off the screen to the left
            if(this.playerObj.x > 0){
                this.playerObj.x -= this.speed;
            }
        }
        if (this.keyRight.isDown){
            //keep the player from going off the screeen to the right
            if (this.playerObj.x < game.width - this.playerObj.width){
                this.playerObj.x += this.speed;
            }
        }
        if (this.keyUp.isDown){
            //keep the player from going off the top of the screen
            if (this.playerObj.y > 0){
                this.playerObj.y -= this.speed; 
            }
        }
        if(this.keyDown.isDown){
            //keep the player from going off the bottom of the screen
            if(this.playerObj.y < game.height - this.playerObj.height){
                this.playerObj.y += this.speed;
            }
        }
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
        this.bullets.push(game.add.sprite(this.playerObj.x + this.playerObj.width/2, this.playerObj.y, 'bullet'));
        this.bullets[this.bullets.length-1].x -= this.bullets[this.bullets.length-1].width/2;
    },
}