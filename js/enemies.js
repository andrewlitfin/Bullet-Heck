//File for handling all methods directly related to enemies
"use strict";
// if app exists use the existing copy
// else create a new empty object literal
var enemies = enemies || {};

enemies.main = {
    // master list of active enemies
    enemyObjs: [],
    // enemy type "enum"
    enemyType: Object.freeze({
        TYPE1: 0,
        TYPE2: 1,
        TYPE3: 2,
        BOSS : 16
    }),
        
    preload : function () {
        game.load.image('enemy1', 'assets/Enemies/ship (1).png');
        game.load.image('enemy2', 'assets/Enemies/ship (2).png');
        game.load.image('enemy3', 'assets/Enemies/ship (3).png');
        game.load.image('boss', 'assets/Enemies/ship (16).png');
    },
    
    create : function () {
        this.addEnemy(this.enemyType.TYPE1);
        this.addEnemy(this.enemyType.TYPE2);
        this.addEnemy(this.enemyType.TYPE3);
    },
    
    update : function () {
        // note to future self:
        // enemies are added with enemyObjs.push([enemy object])
        // and removed with enemyObjs.splice([index], 1)
        // (index arg is going to be stored in toDelete)
        // (second arg is # of enemies to delete)
        var toDelete = [];
        for (var i = 0; i < this.enemyObjs.length; i++) {
            var eo = this.enemyObjs[i];
            eo.update();
            if (!eo.isAlive()){
                this.enemyObjs[i].sprite.destroy();
                this.enemyObjs.splice(i, 1);
                i--;
            }
        }
    },
    
    //a function which adds an enemy based on the enemy type we pass it
    addEnemy : function (_enemyType) {
        var eo; //a variable to track the enemy obj we are creating
        switch(_enemyType){
            case this.enemyType.TYPE1: //generate an enemy of type 1
                eo = {
                    sprite: game.add.sprite(0, 40, 'enemy1'),
                    health: 60,
                    enemyType: _enemyType,
                    update: function(){
                        eo.sprite.x += 2;
                    }
                }
                //rescale the sprite
                eo.sprite.scale.set(0.25, 0.25);
                eo.sprite.x -= eo.sprite.width + 1;
                break;
            case this.enemyType.TYPE2: //generate an enemy of type 2
                eo = {
                    sprite: game.add.sprite(game.width, 150, 'enemy2'),
                    health: 120,
                    enemyType: _enemyType,
                    update: function(){
                        eo.sprite.x -= 2;
                    }
                }
                //rescale the sprite
                eo.sprite.scale.set(0.25, 0.25);
                break;
            case this.enemyType.TYPE3: //generate an enemy of type 3
                eo = {
                    sprite: game.add.sprite(game.width/2, 0, 'enemy3'),
                    health: 180,
                    enemyType: _enemyType,
                    update: function(){
                        eo.sprite.y += 2;
                    }
                }
                //rescale the sprite
                eo.sprite.scale.set(0.25, 0.25);
                eo.sprite.x -= eo.sprite.width/2;
                eo.sprite.y -= eo.sprite.height + 1;
                break;
            case this.enemyType.BOSS: //generate an enemy of type 'BOSS'
            default:
                break;
        }
        //method to check if the enemy has either run out of health or left the screen
        eo.isAlive = function(){
            //if the enemy is out of health
            if (this.health <= 0) return false;
            //if the enemy is off screen
            if (this.sprite.x < 0-this.sprite.width*2||//left
                this.sprite.x > 0+game.width+this.sprite.width||//right
                this.sprite.y < 0-this.sprite.height*2||//top
                this.sprite.y > 0+game.height+this.sprite.height)//bottom
                return false;
            //otherwise
            return true;
        }
        //push the generated enemy onto the array of enemies
        this.enemyObjs.push(eo);
    }
};