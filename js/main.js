var bulletHeck = bulletHeck || {};

bulletHeck.main = {
    //variables go here
    
    //preload function for calling via phaser
    preload : function() {
        game.load.image('sky', 'assets/sky.png');
    },
    
    //create function for calling via phaser
    create : function() {
        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');
    },
    
    //update function for calling via phaser
    update : function() {
    },
}