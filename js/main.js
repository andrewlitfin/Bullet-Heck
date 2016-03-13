var bulletHeck = bulletHeck || {};

bulletHeck.main = {
    preload : function() {
        game.load.image('sky', 'assets/sky.png');
    },

    create : function() {
        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');
    },

    update : function() {
    },
}