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
    scoreText: null,
    instructionsText: null,
    
    //Three hearts for player health
    heart1: undefined,
    heart2: undefined,
    heart3: undefined,
    
    //array to contain buttons
    buttonsToDrawArray: [], //an array of ints which draws buttons based on the int
    buttonsToDestroyArray: [], //an array of all buttons that have been drawn
    
    //audio
    gameplayLoop: undefined,
    menuLoop: undefined,
    gameplayMusic: undefined,
    menuMusic: undefined,
    
    //gamestate variables
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
        
        //hearts
        game.load.image('fullHeart', 'assets/UI/Hearts/heart_sharp.png');
        game.load.image('emptyHeart', 'assets/UI/Hearts/heart_sharp_empty.png');
        
        //UI buttons
        game.load.spritesheet('playButton', 'assets/UI/playButton.png', 96, 32);
        game.load.spritesheet('nextLevelButton', 'assets/UI/nextLevelButton.png', 96, 32);
        game.load.spritesheet('mainMenuButton', 'assets/UI/mainMenuButton.png', 96, 32);
        game.load.spritesheet('replayLevelButton', 'assets/UI/replayLevelButton.png', 96, 32);
        game.load.spritesheet('unpauseButton', 'assets/UI/unpauseButton.png', 96, 32);
        
        //audio
        this.gameplayLoop = game.load.audio('gameplayLoop', 'assets/audio/gameplay_loop.mp3');
        this.menuLoop = game.load.audio('menuLoop', 'assets/audio/menu_loop.mp3');
        this.gameplayMusic = new Phaser.Sound(game, 'gameplayLoop', 0.01, true);
        this.menuMusic = new Phaser.Sound(game, 'menuLoop', 0.01, true);
    },
    
    create: function(){
        switch(this.gameState){
            case this.GAME_STATE.MAIN_MENU: //establish MAIN_MENU UI
                //pause other music
                if (this.menuMusic){
                    this.menuMusic.pause();
                }
                if (this.gameplayMusic){
                    this.gameplayMusic.pause();
                }
                
                //play new music
                this.menuMusic.play();

                //draw UI
                this.buttonsToDrawArray.push(0);
                
                //Add instructions text
                var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle", align: "center" };
                this.instructionsText = game.add.text(game.width/2, 80, "Arrow Keys to Move\nSpace Bar to Fire\nPress Play to Begin", style);
                this.instructionsText.x -= this.instructionsText.width/2;
                
                break;
            case this.GAME_STATE.IN_LEVEL: //establish IN_LEVEL UI
                //pause other music
                if (this.menuMusic){
                    this.menuMusic.pause();
                }
                if (this.gameplayMusic){
                    this.gameplayMusic.pause();
                }
                
                //play new music
                this.gameplayMusic.play();
                
                break;
            case this.GAME_STATE.PAUSE: //establish PAUSE UI
                this.buttonsToDrawArray.push(1);
                this.buttonsToDrawArray.push(2);
                break;
            case this.GAME_STATE.GAME_OVER: //establish GAME_OVER UI
                this.buttonsToDrawArray.push(2);
            this.buttonsToDrawArray.push(0);
                //destroy all the enemies
                enemies.main.type1EnemyObjs.forEachAlive(function(eo) {
                    eo.kill();
                }, enemies.main);
                enemies.main.type2EnemyObjs.forEachAlive(function(eo) {
                    eo.kill();
                }, enemies.main);
                enemies.main.type3EnemyObjs.forEachAlive(function(eo) {
                    eo.kill();
                }, enemies.main);
                break;
            case this.GAME_STATE.LEVEL_COMPLETE:
                this.buttonsToDrawArray.push(3);
                this.buttonsToDrawArray.push(2);
                break;
            default:
                console.log("Not in a proper game state");
                break;
        }        
        
        //draw the buttons onto the screen based on the buttons loaded in on the game state change
        for (var i = 0; i < this.buttonsToDrawArray.length; i++){
            switch (this.buttonsToDrawArray[i]){
                case 0: //this.UI_BUTTON_TYPE.PLAY_BUTTON:
                    var button = game.add.button(game.world.centerX - 48, game.world.centerY - (this.buttonsToDrawArray.length/2 * 40) + (i * 40), 'playButton', function(){this.buttonPressed('playButton')}, this, 2,1,0);
                    this.buttonsToDestroyArray.push(button);
                    break;
                case 1: //this.UI_BUTTON_TYPE.UNPAUSE_BUTTON:
                    var button = game.add.button(game.world.centerX - 48, game.world.centerY - (this.buttonsToDrawArray.length/2 * 40) + (i * 40), 'unpauseButton', function(){this.buttonPressed('unpauseButton')}, this, 2,1,0);
                    this.buttonsToDestroyArray.push(button);
                    break;
                case 2: //this.UI_BUTTON_TYPE.MAIN_MENU_BUTTON:
                    var button = game.add.button(game.world.centerX - 48, game.world.centerY - (this.buttonsToDrawArray.length/2 * 40) + (i * 40), 'mainMenuButton', function(){this.buttonPressed('mainMenuButton')}, this, 2,1,0);
                    this.buttonsToDestroyArray.push(button);
                    break;
                case 3: //this.UI_BUTTON_TYPE.NEXT_LEVEL_BUTTON:
                    var button = game.add.button(game.world.centerX - 48, game.world.centerY - (this.buttonsToDrawArray.length/2 * 40) + (i * 40), 'nextLevelButton', function(){this.buttonPressed('nextLevelButton')}, this, 2,1,0);
                    this.buttonsToDestroyArray.push(button);
                    break;
                default:
                    console.log("Created No Button");
                    break;
            }
        } 
        
        //create a listener for keyboard input
        game.input.keyboard.onDownCallback = function( e ){
            //listens to P or ESC to unpause the game
            if(UI.main.gameState == UI.main.GAME_STATE.PAUSE && (e.keyCode == Phaser.Keyboard.P || e.keyCode == Phaser.Keyboard.ESC)){
                UI.main.buttonPressed('unpauseButton');
            }
            //listens to P or ESC to pause the game
            else if(UI.main.gameState == UI.main.GAME_STATE.IN_LEVEL && (e.keyCode == Phaser.Keyboard.P || e.keyCode == Phaser.Keyboard.ESC)){
                UI.main.buttonPressed('pauseButton');
            }
            //listens for ENTER to select the first option in the array of UI buttons
            if (e.keyCode == Phaser.Keyboard.ENTER){
                UI.main.defaultSelect();
            }
        };
    },
    
    update: function(){
        //print the game score to the top right
        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        
        if(this.scoreText != null) this.scoreText.kill();
        this.scoreText = game.add.text(game.width - 20, 10, "Score: " + this.score, style);
        this.scoreText.x -= this.scoreText.width;
        //put hearts in the top left if you are in a game state where they are relevant
        if (this.gameState == this.GAME_STATE.IN_LEVEL ||
            this.gameState == this.GAME_STATE.LEVEL_COMPLETE ||
            this.gameState == this.GAME_STATE.PAUSE ||
            this.gameState == this.GAME_STATE.GAME_OVER){
            switch (player.main.health){
                case 3:
                    if(this.heart1) this.heart1.kill();
                    if(this.heart2) this.heart2.kill();
                    if(this.heart3) this.heart3.kill();
                    this.heart1 = game.add.sprite(10, 10, 'fullHeart');
                    this.heart2 = game.add.sprite(50, 10, 'fullHeart');
                    this.heart3 = game.add.sprite(90, 10, 'fullHeart');
                    this.heart1.scale.set(2.5,2.5);
                    this.heart2.scale.set(2.5,2.5);
                    this.heart3.scale.set(2.5,2.5);
                    break;
                case 2:
                    if(this.heart1) this.heart1.kill();
                    if(this.heart2) this.heart2.kill();
                    if(this.heart3) this.heart3.kill();
                    this.heart1 = game.add.sprite(10, 10, 'fullHeart');
                    this.heart2 = game.add.sprite(50, 10, 'fullHeart');
                    this.heart3 = game.add.sprite(90, 10, 'emptyHeart');
                    this.heart1.scale.set(2.5,2.5);
                    this.heart2.scale.set(2.5,2.5);
                    this.heart3.scale.set(2.5,2.5);
                    break;
                case 1:
                    if(this.heart1) this.heart1.kill();
                    if(this.heart2) this.heart2.kill();
                    if(this.heart3) this.heart3.kill();
                    this.heart1 = game.add.sprite(10, 10, 'fullHeart');
                    this.heart2 = game.add.sprite(50, 10, 'emptyHeart');
                    this.heart3 = game.add.sprite(90, 10, 'emptyHeart');
                    this.heart1.scale.set(2.5,2.5);
                    this.heart2.scale.set(2.5,2.5);
                    this.heart3.scale.set(2.5,2.5);
                    break;
                default:
                    if(this.heart1) this.heart1.kill();
                    if(this.heart2) this.heart2.kill();
                    if(this.heart3) this.heart3.kill();
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
    
    //A function which handles all UI button presses with a switch statement
    buttonPressed: function(buttonKey) {
        switch (buttonKey){
            case "playButton":
                //update the gamestate
                this.gameState = this.GAME_STATE.IN_LEVEL;
                //destroy all the buttons
                for (var i = 0; i < this.buttonsToDestroyArray.length; i++){
                    this.buttonsToDestroyArray[i].kill();
                }
                this.buttonsToDestroyArray = [];
                this.buttonsToDrawArray = [];
                this.instructionsText.kill();
                //reset the score
                this.score = 0;
                this.instructionsText.kill();
                //rebuild the UI for the current gamestate
                this.create();

                //reset the player health
                player.main.health = player.main.STARTING_HEALTH;
                //create the player objects
                player.main.create();

                //reset the level count
                enemies.main.level = enemies.main.startingLevel;
                //create the enemy objects
                enemies.main.create();
                break;
            case "pauseButton":
                //update the gamestate
                this.gameState = this.GAME_STATE.PAUSE;
                //disable physics
                player.main.bullets.setAll("body.enable", false);
                enemies.main.type1EnemyObjs.setAll("body.enable", false);
                enemies.main.type2EnemyObjs.setAll("body.enable", false);
                enemies.main.type3EnemyObjs.setAll("body.enable", false);
                //destroy all the buttons
                for (var i = 0; i < this.buttonsToDestroyArray.length; i++){
                    this.buttonsToDestroyArray[i].kill();
                }
                this.buttonsToDestroyArray = [];
                this.buttonsToDrawArray = [];
                //rebuild the UI for the current gamestate
                this.create();
                break;
            case "unpauseButton":
                //re enable physics
                player.main.bullets.setAll("body.enable", true);
                enemies.main.type1EnemyObjs.setAll("body.enable", true);
                enemies.main.type2EnemyObjs.setAll("body.enable", true);
                enemies.main.type3EnemyObjs.setAll("body.enable", true);
                //update the gamestate
                this.gameState = this.GAME_STATE.IN_LEVEL;
                //destroy all the buttons
                for (var i = 0; i < this.buttonsToDestroyArray.length; i++){
                    this.buttonsToDestroyArray[i].kill();
                }
                this.buttonsToDestroyArray = [];
                this.buttonsToDrawArray = [];
                //rebuild the UI for the current gamestate
                this.create();
                break;
            case "mainMenuButton":
                //update the gamestate
                this.gameState = this.GAME_STATE.MAIN_MENU;
                
                //destroy all the buttons
                for (var i = 0; i < this.buttonsToDestroyArray.length; i++){
                    this.buttonsToDestroyArray[i].kill();
                }
                this.buttonsToDestroyArray = [];
                this.buttonsToDrawArray = [];
                
                //destroy all the enemies
                enemies.main.type1EnemyObjs.forEachAlive(function(eo) {
                    eo.kill();
                }, enemies.main);
                enemies.main.type2EnemyObjs.forEachAlive(function(eo) {
                    eo.kill();
                }, enemies.main);
                enemies.main.type3EnemyObjs.forEachAlive(function(eo) {
                    eo.kill();
                }, enemies.main);
                
                //delete the bullets
                player.main.bullets.destroy();
                
                //delete the player objects
                player.main.playerObj1.kill();
                player.main.playerObj2.kill();
                
                //rebuild the UI for the current gamestate
                this.create();
                break;
            case "nextLevelButton":
                //update the gamestate
                this.gameState = this.GAME_STATE.IN_LEVEL;
                //destroy all the buttons
                for (var i = 0; i < this.buttonsToDestroyArray.length; i++){
                    this.buttonsToDestroyArray[i].kill();
                }
                this.buttonsToDestroyArray = [];
                this.buttonsToDrawArray = [];
                //rebuild the UI for the current gamestate
                this.create(); 
                player.main.create();
                enemies.main.create();
                break;
            default:
                console.log("Pressed No Button");
                break;
        }
    },   
    
    //This function is called when the enter key is pressed. 
    //Call the function tied to the first button on the screen.
    defaultSelect: function() {
        if(this.buttonsToDestroyArray[0]) this.buttonPressed(this.buttonsToDestroyArray[0].key);    
    },
}