// if app exists use the existing copy
// else create a new empty object literal
var bulletHeck = bulletHeck || {};
var player = player || {};

bulletHeck.main = {
    //variables go here
    
    //preload function for calling via phaser
    preload : function() {
        game.load.image('space', 'assets/background.jpg');
        
        //preload the player
        player.main.preload();
    },
    
    //create function for calling via phaser
    create : function() {
        //  A simple background for our game
        game.add.sprite(0, 0, 'space');
        
        //create the player
        player.main.create();
    },
    
    //update function for calling via phaser
    update : function() {
        //update the player
        player.main.update();
    },
}