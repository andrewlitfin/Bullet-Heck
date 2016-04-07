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
    
    gameState: undefined,
    
    //keyboard inputs
    keyP: undefined,
    keyEsc: undefined,
    keyEnter: undefined,
    
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
        
        //establish keys
        this.keyP = game.input.keyboard.addKey(Phaser.Keyboard.P);
        this.keyEsc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.keyEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    },
    
    create: function(){
        //establish MAIN_MENU UI
        if(this.gameState == this.GAME_STATE.MAIN_MENU){
            this.buttonsToDrawArray.push(0);
            //Add instructions text
            var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle", align: "center" };
            
            this.instructionsText = game.add.text(game.width/2, 80, "Arrow Keys to Move\nSpace Bar to Fire\nPress Play to Begin", style);
            
            this.instructionsText.x -= this.instructionsText.width/2;
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
                    console.log("No Button");
                    break;
            }
        } 
        
        //Add a listener for the pause buttons (P or Esc)
        if (this.gameState == this.GAME_STATE.PAUSE){
            this.keyP.onDown.addOnce(function(){this.buttonPressed('unpauseButton')}, this, 0);
            this.keyEsc.onDown.addOnce(function(){this.buttonPressed('unpauseButton')}, this, 0);
        }
        else if (this.gameState == this.GAME_STATE.IN_LEVEL){
            this.keyP.onDown.addOnce(function(){this.buttonPressed('pauseButton')}, this, 0);
            this.keyEsc.onDown.addOnce(function(){this.buttonPressed('pauseButton')}, this, 0);
        }
        
        //Add a listener for the default select button (Enter)
        this.keyEnter.onDown.addOnce(this.defaultSelect, this, 0);
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
                //rebuild the UI for the current gamestate
                this.create();
                break;
            case "unpauseButton":
                //re enable physics
                player.main.bullets.setAll("body.enable", true);
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
                
                //delete the enemies off the screen
                for(var i = 0; i < enemies.main.enemyObjs.length; i++){
                    enemies.main.enemyObjs[i].sprite.kill();
                }
                enemies.main.enemyObjs = [];
                
                //delete the bullets off the screen
                player.main.bullets.destroy();
                
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
                console.log("Button Key Incorrect");
                break;
        }
    },   
    
    //This function is called when the enter key is pressed. 
    //Call the function tied to the first button on the screen.
    defaultSelect: function() {
        if(this.buttonsToDestroyArray[0]) this.buttonPressed(this.buttonsToDestroyArray[0].key);    
    },
}