//File for handling all methods directly related to enemies
"use strict";
// if app exists use the existing copy
// else create a new empty object literal
var UI = UI || {};
var enemies = enemies || {};

enemies.main = {
    // level variable
    level: 1,
    startingLevel: 1,
    // list of active enemies of a given type
    type1EnemyObjs: undefined,
    type2EnemyObjs: undefined,
    type3EnemyObjs: undefined,
    
    // enemy type "enum"
    enemyType: Object.freeze({
        TYPE1: 0,
        TYPE2: 1,
        TYPE3: 2,
        BOSS : 16
    }),
    alreadyCreated: false,
        
    preload : function () {
        game.load.image('enemy1', 'assets/Enemies/ship (1).png');
        game.load.image('enemy2', 'assets/Enemies/ship (2).png');
        game.load.image('enemy3', 'assets/Enemies/ship (3).png');
        game.load.image('boss', 'assets/Enemies/ship (16).png');
    },
    
    create : function () {
        if (!this.alreadyCreated) {
            this.alreadyCreated = true;
            
            // create the three groups of primary enemy types
            this.type1EnemyObjs = game.add.group();
            this.type1EnemyObjs.enableBody = true;
            this.type1EnemyObjs.physicsBodyType = Phaser.Physics.ARCADE;
            
            this.type2EnemyObjs = game.add.group();
            this.type2EnemyObjs.enableBody = true;
            this.type2EnemyObjs.physicsBodyType = Phaser.Physics.ARCADE;
            
            this.type3EnemyObjs = game.add.group();
            this.type3EnemyObjs.enableBody = true;
            this.type3EnemyObjs.physicsBodyType = Phaser.Physics.ARCADE;
        }
        
        for (var i = 0; i <= this.level; i++) {
            var enemySelect = (Math.ceil((Math.random()*3)%3));
            switch (enemySelect) {
                case 1:
                    this.addEnemy(this.enemyType.TYPE1);
                    break;
                case 2:
                    this.addEnemy(this.enemyType.TYPE2);
                    break;
                case 3:
                    this.addEnemy(this.enemyType.TYPE3);
                    break;
            }
        }
    },
    
    update : function () {
        this.type1EnemyObjs.forEachAlive(function(eo) {
            if (eo.isAlive()) game.physics.arcade.moveToXY(eo, (player.main.playerObj1.x + player.main.playerObj2.x )/2, (player.main.playerObj1.y + player.main.playerObj2.y )/2);
        }, this);
        this.type2EnemyObjs.forEachAlive(function(eo) {
            if (eo.isAlive()) game.physics.arcade.moveToObject(eo, player.main.playerObj1);
        }, this);
        this.type3EnemyObjs.forEachAlive(function(eo) {
            if (eo.isAlive()) game.physics.arcade.moveToObject(eo, player.main.playerObj2);
        }, this);
    },
    
    //a function which adds an enemy based on the enemy type we pass it
    addEnemy : function (_enemyType) {
        var eo; //a variable to track the enemy obj we are creating
        switch(_enemyType){
            case this.enemyType.TYPE1: //generate an enemy of type 1
                eo = this.type1EnemyObjs.create(0, (Math.random()*400)%400 + game.height/7, 'enemy1');
                eo.scale.set(0.25, 0.25);
                eo.anchor.set(0.5);
                eo.health = 25; // this value will have to be changed over time
                break;
            case this.enemyType.TYPE2: //generate an enemy of type 2
                eo = this.type2EnemyObjs.create(game.width, (Math.random()*400)%400 + game.height / 7, 'enemy2');
                eo.scale.set(0.25, 0.25);
                eo.anchor.set(0.5, 0.5);
                eo.health = 25;
                break;
            case this.enemyType.TYPE3: //generate an enemy of type 3
                eo = this.type3EnemyObjs.create((Math.random()*300)%300 + game.width/4, 0, 'enemy3');
                eo.scale.set(0.25, 0.25);
                eo.anchor.set(0.5, 0.5);
                eo.health = 25;
                break;
            case this.enemyType.BOSS: //generate an enemy of type 'BOSS'
            default:
                break;
        }
        //method to check if the enemy has either run out of health or left the screen
        eo.isAlive = function(){
            //if the enemy is out of health
            if (this.health <= 0){
                this.kill();
                UI.main.score++;
                return false;
            }
            
            //otherwise
            return true;
        }
    },
};