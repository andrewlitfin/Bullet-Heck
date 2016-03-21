"use strict";
//File for handling all methods directly related to the game UI

// if app exists use the existing copy
// else create a new empty object literal
var UI = UI || {};
var player = player || {};
var enemies = enemies || {};

UI.main = {
    //buttons: GAME_STATE_functionButton
    MAIN_MENU_playButton: undefined,
    IN_LEVEL_pauseButton: undefined,
    PAUSE_unpauseButton: undefined,
    PAUSE_toMainMenuButton: undefined,
    GAME_OVER_replayPrevLevelButton: undefined,
    LEVEL_COMPLETE_nextLevelButton: undefined,
    
    gameState: undefined,
    
    //keyboard inputs
    keyP: undefined,
    
    GAME_STATE: Object.freeze({ //fake enumeration for game state
        MAIN_MENU: 0,
        IN_LEVEL: 1,
        PAUSE: 2,
        GAME_OVER: 3,
        LEVEL_COMPLETE: 4,  
    }),
    
    preload: function(){
        this.gameState = this.GAME_STATE.MAIN_MENU;
        
        game.load.image('space', 'assets/background.jpg');
        
        game.load.spritesheet('playButton', 'assets/UI/playButton.png', 96, 32);
        game.load.spritesheet('nextLevelButton', 'assets/UI/nextLevelButton.png', 96, 32);
        game.load.spritesheet('mainMenuButton', 'assets/UI/mainMenuButton.png', 96, 32);
        game.load.spritesheet('replayLevelButton', 'assets/UI/replayLevelButton.png', 96, 32);
        game.load.spritesheet('unpauseButton', 'assets/UI/unpauseButton.png', 96, 32);
        
        //establish keys
        this.keyP = game.input.keyboard.addKey(Phaser.Keyboard.P);
    },
    
    create: function(){
        if(this.gameState != this.GAME_STATE.PAUSE && this.gameState != this.GAME_STATE.IN_LEVEL){
            //  A simple background for our game
            game.add.sprite(0, 0, 'space');
        }
        
        //establish MAIN_MENU UI
        if(this.gameState == this.GAME_STATE.MAIN_MENU){
            this.MAIN_MENU_playButton = game.add.button(game.world.centerX - 48, game.world.centerY, 'playButton', this.playGame, this, 2,1,0);
        }
        
        //establish IN_LEVEL UI
        if(this.gameState == this.GAME_STATE.IN_LEVEL){
        }
        
        //establish PAUSE UI
        if(this.gameState == this.GAME_STATE.PAUSE){
            this.PAUSE_unpauseButton = game.add.button(game.world.centerX - 48, game.world.centerY - 32, 'unpauseButton', this.unpause, this, 2,1,0);
            this.PAUSE_toMainMenuButton = game.add.button(game.world.centerX - 48, game.world.centerY + 32, 'mainMenuButton', this.toMainMenu, this, 2,1,0);
        }
        
        //establish GAME_OVER UI
        if(this.gameState == this.GAME_STATE.GAME_OVER){
            this.GAME_OVER_replayPrevLevelButton = game.add.button(game.world.centerX - 48, game.world.centerY, 'replayLevelButton', this.replayPrevLevel, this, 2,1,0);
        }
        
        //establish LEVEL_COMPLETE UI
        if(this.gameState == this.GAME_STATE.LEVEL_COMPLETE){
            this.LEVEL_COMPLETE_nextLevelButton = game.add.button(game.world.centerX - 48, game.world.centerY, 'nextLevelButton', this.nextLevel, this, 2,1,0);
        }
        
        //Add a listener for the pause button (P)
        this.keyP.onDown.add(this.pauseToggle, this, 0);
    },
    
    update: function(){
    },
    
    //Begin playing the game from the main menu
    playGame: function() {
        this.gameState = this.GAME_STATE.IN_LEVEL;
        this.MAIN_MENU_playButton.destroy();
        //rebuild the UI for the current gamestate
        this.create();
        //create the player objects
        player.main.create();
        //create the enemy objects
        enemies.main.create();
    },
    
    //Toggle the game state for purposes of pausing and unpausing
    pauseToggle: function() {
        //if the game is paused
        if (this.gameState == this.GAME_STATE.PAUSE){
            //unpause it
            this.unpause();
            return;
        }
        //if the game is not paused
        if(this.gameState == this.GAME_STATE.IN_LEVEL){
            //pause it
            this.pause();
            return;
        }
        
    },
    
    //Pause the game from in a level
    pause: function(){
        this.gameState = this.GAME_STATE.PAUSE;
        //rebuild the UI for the current gamestate
        this.create();
    },
    
    //Unpause the game from the pause menu
    unpause: function(){
        this.gameState = this.GAME_STATE.IN_LEVEL;
        this.PAUSE_unpauseButton.destroy();
        this.PAUSE_toMainMenuButton.destroy();
        //rebuild the UI for the current gamestate
        this.create();
    },
    
    //Return to the main menu from the pause menu
    toMainMenu: function(){
        this.gameState = this.GAME_STATE.MAIN_MENU;
        this.PAUSE_unpauseButton.destroy();
        this.PAUSE_toMainMenuButton.destroy();
        //rebuild the UI for the current gamestate
        this.create();
    },
    
    //Restart the previous level when the replayPrevLevel button is pressed
    replayPrevLevel: function(){
        this.gameState = this.GAME_STATE.IN_LEVEL;
        this.GAME_OVER_replayPrevLevelButton.destroy();
        //rebuild the UI for the current gamestate
        this.create();
    },
    
    //Move to the next level once you have completed a level
    nextLevel: function(){
        this.gameState = this.GAME_STATE.IN_LEVEL;
        this.LEVEL_COMPLETE_nextLevelButton.destroy();
        //rebuild the UI for the current gamestate
        this.create();  
    },
}