"use strict";
//File for handling all methods directly related to the game UI

// if app exists use the existing copy
// else create a new empty object literal
var UI = UI || {};
var player = player || {};
var enemies = enemies || {};

UI.main = {
    //Score
    score: 0,
    text: null,
    
    //Three hearts for player health
    heart1: undefined,
    heart2: undefined,
    heart3: undefined,
    
    //array to contain buttons
    buttonsToDrawArray: [], //an array of ints which draws buttons based on the int
    buttonsToDestroyArray: [], //an array of all buttons that have been drawn
    
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
        
        //background
        game.load.image('space', 'assets/background.jpg');
        
        //hearts
        game.load.image('fullHeart', 'assets/UI/Hearts/heart_sharp.png');
        game.load.image('emptyHeart', 'assets/UI/Hearts/heart_sharp_empty.png');
        
        //UI buttons
        game.load.spritesheet('playButton', 'assets/UI/playButton.png', 96, 32);
        game.load.spritesheet('nextLevelButton', 'assets/UI/nextLevelButton.png', 96, 32);
        game.load.spritesheet('mainMenuButton', 'assets/UI/mainMenuButton.png', 96, 32);
        game.load.spritesheet('replayLevelButton', 'assets/UI/replayLevelButton.png', 96, 32);
        game.load.spritesheet('unpauseButton', 'assets/UI/unpauseButton.png', 96, 32);
        
        //establish keys
        this.keyP = game.input.keyboard.addKey(Phaser.Keyboard.P);
    },
    
    create: function(){
        console.log("Gamestate: " + this.gameState);
        
        if(this.gameState != this.GAME_STATE.PAUSE && this.gameState != this.GAME_STATE.IN_LEVEL){
            //  A simple background for our game
            //game.add.sprite(0, 0, 'space');
        }
        
        //establish MAIN_MENU UI
        if(this.gameState == this.GAME_STATE.MAIN_MENU){
            this.buttonsToDrawArray.push(0);
        }
        
        //establish IN_LEVEL UI
        if(this.gameState == this.GAME_STATE.IN_LEVEL){
            
        }
        
        //establish PAUSE UI
        if(this.gameState == this.GAME_STATE.PAUSE){
            this.buttonsToDrawArray.push(1);
            this.buttonsToDrawArray.push(2);
        }
        
        //establish GAME_OVER UI
        if(this.gameState == this.GAME_STATE.GAME_OVER){
            this.buttonsToDrawArray.push(2);
            this.buttonsToDrawArray.push(0);
        }
        
        //establish LEVEL_COMPLETE UI
        if(this.gameState == this.GAME_STATE.LEVEL_COMPLETE){
            this.buttonsToDrawArray.push(3);
            this.buttonsToDrawArray.push(2);
        }
        
        for (var i = 0; i < this.buttonsToDrawArray.length; i++){
            switch (this.buttonsToDrawArray[i]){
                case 0: //this.UI_BUTTON_TYPE.PLAY_BUTTON:
                    var button = game.add.button(game.world.centerX - 48, game.world.centerY - (this.buttonsToDrawArray.length/2 * 40) + (i * 40), 'playButton', this.playGame, this, 2,1,0);
                    this.buttonsToDestroyArray.push(button);
                    break;
                case 1: //this.UI_BUTTON_TYPE.UNPAUSE_BUTTON:
                    var button = game.add.button(game.world.centerX - 48, game.world.centerY - (this.buttonsToDrawArray.length/2 * 40) + (i * 40), 'unpauseButton', this.unpause, this, 2,1,0);
                    this.buttonsToDestroyArray.push(button);
                    break;
                case 2: //this.UI_BUTTON_TYPE.MAIN_MENU_BUTTON:
                    var button = game.add.button(game.world.centerX - 48, game.world.centerY - (this.buttonsToDrawArray.length/2 * 40) + (i * 40), 'mainMenuButton', this.toMainMenu, this, 2,1,0);
                    this.buttonsToDestroyArray.push(button);
                    break;
                case 3: //this.UI_BUTTON_TYPE.NEXT_LEVEL_BUTTON:
                    var button = game.add.button(game.world.centerX - 48, game.world.centerY - (this.buttonsToDrawArray.length/2 * 40) + (i * 40), 'nextLevelButton', this.nextLevel, this, 2,1,0);
                    this.buttonsToDestroyArray.push(button);
                    break;
                default:
                    console.log("No Button");
                    break;
            }
        } 
        
        //Add a listener for the pause button (P)
        this.keyP.onDown.add(this.pauseToggle, this, 0);
    },
    
    update: function(){
        //print the game score to the top right
        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        if(this.text != null) this.text.destroy();
        this.text = game.add.text(game.width - 20, 10, "Score: " + this.score, style);
        this.text.x -= this.text.width;
        //put hearts in the top left if you are in a game state where they are relevant
        if (this.gameState == this.GAME_STATE.IN_LEVEL ||
            this.gameState == this.GAME_STATE.LEVEL_COMPLETE ||
            this.gameState == this.GAME_STATE.PAUSE ||
            this.gameState == this.GAME_STATE.GAME_OVER){
            switch (player.main.health){
                case 3:
                    this.heart1 = game.add.sprite(10, 10, 'fullHeart');
                    this.heart2 = game.add.sprite(50, 10, 'fullHeart');
                    this.heart3 = game.add.sprite(90, 10, 'fullHeart');
                    this.heart1.scale.set(2.5,2.5);
                    this.heart2.scale.set(2.5,2.5);
                    this.heart3.scale.set(2.5,2.5);
                    break;
                case 2:
                    this.heart1 = game.add.sprite(10, 10, 'fullHeart');
                    this.heart2 = game.add.sprite(50, 10, 'fullHeart');
                    this.heart3 = game.add.sprite(90, 10, 'emptyHeart');
                    this.heart1.scale.set(2.5,2.5);
                    this.heart2.scale.set(2.5,2.5);
                    this.heart3.scale.set(2.5,2.5);
                    break;
                case 1:
                    this.heart1 = game.add.sprite(10, 10, 'fullHeart');
                    this.heart2 = game.add.sprite(50, 10, 'emptyHeart');
                    this.heart3 = game.add.sprite(90, 10, 'emptyHeart');
                    this.heart1.scale.set(2.5,2.5);
                    this.heart2.scale.set(2.5,2.5);
                    this.heart3.scale.set(2.5,2.5);
                    break;
                default:
                    this.heart1 = game.add.sprite(10, 10, 'emptyHeart');
                    this.heart2 = game.add.sprite(50, 10, 'emptyHeart');
                    this.heart3 = game.add.sprite(90, 10, 'emptyHeart');
                    this.heart1.scale.set(2.5,2.5);
                    this.heart2.scale.set(2.5,2.5);
                    this.heart3.scale.set(2.5,2.5);
                    break;
            }
        }
                
    },
    
    //Begin playing the game from the main menu
    playGame: function() {
        //update the gamestate
        this.gameState = this.GAME_STATE.IN_LEVEL;
        //destroy all the buttons
        for (var i = 0; i < this.buttonsToDestroyArray.length; i++){
            this.buttonsToDestroyArray[i].destroy();
        }
        this.buttonsToDestroyArray = [];
        this.buttonsToDrawArray = [];
        //reset the player health
        player.main.health = player.main.STARTING_HEALTH;
        //rebuild the UI for the current gamestate
        this.create();
        //create the player objects
        player.main.create();
        //create the enemy objects
        enemies.main.create();
    },
    
    //Pause the game from in a level
    pause: function(){
        //update the gamestate
        this.gameState = this.GAME_STATE.PAUSE;
        //rebuild the UI for the current gamestate
        this.create();
    },
    
    //Unpause the game from the pause menu
    unpause: function(){
        //update the gamestate
        this.gameState = this.GAME_STATE.IN_LEVEL;
        //destroy all the buttons
        for (var i = 0; i < this.buttonsToDestroyArray.length; i++){
            this.buttonsToDestroyArray[i].destroy();
        }
        this.buttonsToDestroyArray = [];
        this.buttonsToDrawArray = [];
        //rebuild the UI for the current gamestate
        this.create();
    },
    
    //Return to the main menu from the pause menu
    toMainMenu: function(){
        //update the gamestate
        this.gameState = this.GAME_STATE.MAIN_MENU;
        //destroy all the buttons
        for (var i = 0; i < this.buttonsToDestroyArray.length; i++){
            this.buttonsToDestroyArray[i].destroy();
        }
        this.buttonsToDestroyArray = [];
        this.buttonsToDrawArray = [];
        //rebuild the UI for the current gamestate
        this.create();
    },
    
    //Move to the next level once you have completed a level
    nextLevel: function(){
        //update the gamestate
        this.gameState = this.GAME_STATE.IN_LEVEL;
        //destroy all the buttons
        for (var i = 0; i < this.buttonsToDestroyArray.length; i++){
            this.buttonsToDestroyArray[i].destroy();
        }
        this.buttonsToDestroyArray = [];
        this.buttonsToDrawArray = [];
        //rebuild the UI for the current gamestate
        this.create(); 
        player.main.create();
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
}