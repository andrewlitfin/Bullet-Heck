"use strict";
//File for handling all methods directly related to the game UI

// if app exists use the existing copy
// else create a new empty object literal
var UI = UI || {};

UI.main = {
    GAME_STATE: Object.freeze({ //fake enumeration for game state
        BEGIN: 0,
        MAIN_MENU: 1,
        IN_LEVEL: 2,
        PAUSE: 3,
        GAME_OVER: 4,
        LEVEL_COMPLETE: 5,  
    }),
    
    preload: function(){
        game.load.spritesheet('playButton', 'assets/UI/buttons.png', 100, 100);
    },
    
    create: function(){
        
    },
    
    update: function(){
        
    },
}