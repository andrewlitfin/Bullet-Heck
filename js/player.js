//File for handling all methods directly related to the player

// if app exists use the existing copy
// else create a new empty object literal
var player = player || {};

player.main = {
    //player and related attributes
    playerObj : null,
    speed: 5,
    
    //bullets
    bullets: [null],
    bulletSpeed: 20,
    
    //keyboard inputs
    keyUp: null,
    keyDown: null,
    keyLeft: null,
    keyRight: null,
    keySpace: null,

    preload : function(){
        //load images
        game.load.image('player', 'assets/player/ship.png');
        game.load.image('bullet', 'assets/player/bullet.png')
        
        //establish keys
        keyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        keyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },
    
    create : function(){
        playerObj = game.add.sprite(game.width/2, game.height/2, 'player');
        playerObj.scale.set(0.2,0.2);       
    },
        
    update : function(){
        if (keyLeft.isDown){
            //keep the player from going off the screen to the left
            if(playerObj.x > 0){
                playerObj.x -= this.speed;
            }
        }
        if (keyRight.isDown){
            //keep the player from going off the screeen to the right
            if (playerObj.x < game.width - playerObj.width){
                playerObj.x += this.speed;
            }
        }
        if (keyUp.isDown){
            //keep the player from going off the top of the screen
            if (playerObj.y > 0){
                playerObj.y -= this.speed; 
            }
        }
        if(keyDown.isDown){
            //keep the player from going off the bottom of the screen
            if(playerObj.y < game.height - playerObj.height){
                playerObj.y += this.speed;
            }
        }
        if(keySpace.isDown){
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
        this.bullets.push(game.add.sprite(playerObj.x + playerObj.width/4, playerObj.y, 'bullet'));
    }
}