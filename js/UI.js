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
        
        game.load.spritesheet('button', 'assets/UI/buttons.png', 96, 32);
    },
    
    create: function(){
        //  A simple background for our game
        game.add.sprite(0, 0, 'space');
        
        //establish MAIN_MENU UI
        if(this.gameState == this.GAME_STATE.MAIN_MENU){
            this.MAIN_MENU_playButton = game.add.button(game.world.centerX - 48, game.world.centerY, 'button', this.playGame, this, 2,1,0);
        }
        
        //establish IN_LEVEL UI
        if(this.gameState == this.GAME_STATE.IN_LEVEL){
            this.IN_LEVEL_pauseButton = game.add.button(game.world.centerX - 48, 0, 'button', this.pause, this, 2,1,0);
        }
        
        //establish PAUSE UI
        if(this.gameState == this.GAME_STATE.PAUSE){
            this.PAUSE_unpauseButton = game.add.button(game.world.centerX - 48, game.world.centerY - 32, 'button', this.unpause, this, 2,1,0);
            this.PAUSE_toMainMenuButton = game.add.button(game.world.centerX - 48, game.world.centerY + 32, 'button', this.toMainMenu, this, 2,1,0);
        }
        
        //establish GAME_OVER UI
        if(this.gameState == this.GAME_STATE.GAME_OVER){
            this.GAME_OVER_replayPrevLevelButton = game.add.button(game.world.centerX - 48, game.world.centerY, 'button', this.replayPrevLevel, this, 2,1,0);
        }
        
        //establish LEVEL_COMPLETE UI
        if(this.gameState == this.GAME_STATE.LEVEL_COMPLETE){
            this.LEVEL_COMPLETE_nextLevelButton = game.add.button(game.world.centerX - 48, game.world.centerY, 'button', this.nextLevel, this, 2,1,0);
        }
    },
    
    update: function(){
        console.log(this.gameState);
    },
        
    playGame: function() {
        //Move the game state to the IN_LEVEL game state when the play button is clicked
        this.gameState = this.GAME_STATE.IN_LEVEL;
        this.MAIN_MENU_playButton.destroy();
        //rebuild the UI for the current gamestate
        this.create();
        //create the player objects
        player.main.create();
        //create the enemy objects
        enemies.main.create();
    },
    
    pause: function(){
        this.gameState = this.GAME_STATE.PAUSE;
        this.IN_LEVEL_pauseButton.destroy();
        //rebuild the UI for the current gamestate
        this.create();
    },
    
    unpause: function(){
        this.gameState = this.GAME_STATE.IN_LEVEL;
        this.PAUSE_unpauseButton.destroy();
        this.PAUSE_toMainMenuButton.destroy();
        //rebuild the UI for the current gamestate
        this.create();
        //create the player objects
        player.main.create();
        //create the enemy objects
        enemies.main.create();
    },
    
    toMainMenu: function(){
        this.gameState = this.GAME_STATE.MAIN_MENU;
        this.PAUSE_unpauseButton.destroy();
        this.PAUSE_toMainMenuButton.destroy();
        //rebuild the UI for the current gamestate
        this.create();
    },
    
    replayPrevLevel: function(){
        this.gameState = this.GAME_STATE.IN_LEVEL;
        this.GAME_OVER_replayPrevLevelButton.destroy();
        //rebuild the UI for the current gamestate
        this.create();
    },
    
    nextLevel: function(){
        this.gameState = this.GAME_STATE.IN_LEVEL;
        this.LEVEL_COMPLETE_nextLevelButton.destroy();
        //rebuild the UI for the current gamestate
        this.create();  
    },
}