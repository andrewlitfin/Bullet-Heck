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
    
    //Array of bullets that will be populated by bullet objects:
    //  Bullet Object Layout
    //      bullet = {
    //          bulletSprite: the sprite for the bullet,
    //          bulletVel: the velocity of the bullet,
    //      },
    bullets: undefined,
    bulletSpeed: 600, //the speed of our bullets
    bulletTime: 0, // a way to space out the firing of bullets
    bulletTimeDelay: 60, // delay between bullets firing (ms)
    
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
        // create the bullets group
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        
        // create all the bullets we will need
        this.bullets.createMultiple(150, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        
        //create the first player object and center it on the screen
        if (this.playerObj1) this.playerObj1.destroy();
        this.playerObj1 = game.add.sprite(game.width/2, game.height, 'player');
        this.playerObj1.scale.set(0.2,0.2);
        this.playerObj1.anchor.set(0.5);
        this.playerObj1.y -= this.playerObj1.height + 20;
        
        //create the second player object and center it on the screen
        if (this.playerObj2) this.playerObj2.destroy();
        this.playerObj2 = game.add.sprite(game.width/2, game.height, 'player');
        this.playerObj2.scale.set(0.2,0.2);
        this.playerObj2.anchor.set(0.5);
        this.playerObj2.y -= this.playerObj2.height + 20;
    },
        
    update : function(){
        //if the player is dead
        if (this.health <= 0){
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
        this.playerObj1.rotation = (game.math.angleBetween(game.width/2, game.height/2, this.playerObj1.x, this.playerObj1.y) - Math.PI/2);
        this.playerObj2.rotation = (game.math.angleBetween(this.playerObj2.x, this.playerObj2.y, game.width/2, game.height/2) + Math.PI/2);
        
        if(this.keySpace.isDown){
            this.fireBullet();
        }
        
        //the bullets will update on their own (Phaser)
    },
    
    fireBullet : function(){
        // if enough time has passed between the previous bullet firing and now
        if (game.time.now > this.bulletTime)
            {
                // check if there's an available "dead" bullet
                var bullet1 = this.bullets.getFirstExists(false);
                if (bullet1)
                    {
                        // reset the bullet to be "alive" at the new position
                        bullet1.reset(this.playerObj1.x, this.playerObj1.y);
                       
                       // give the bullet the appropriate velocity, based on playerobject rotation and bulletSpeed
                        game.physics.arcade.velocityFromRotation(this.playerObj1.rotation - Math.PI/2, this.bulletSpeed, bullet1.body.velocity);
                        
                        // reset the timer
                        this.bulletTime = game.time.now + this.bulletTimeDelay;
                    }
                var bullet2 = this.bullets.getFirstExists(false);
                if (bullet2)
                    {
                        bullet2.reset(this.playerObj2.x, this.playerObj2.y);
                        game.physics.arcade.velocityFromRotation(this.playerObj2.rotation - Math.PI/2, this.bulletSpeed, bullet2.body.velocity);
                        
                        this.bulletTime = game.time.now + this.bulletTimeDelay
                    }
            }
    },
}