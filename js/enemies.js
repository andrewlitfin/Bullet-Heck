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
    
    addEnemy : function (_enemyType) {
        var eo;
        switch(_enemyType){
            case this.enemyType.TYPE1:
                eo = {
                    sprite: game.add.sprite(0, 40, 'enemy1'),
                    health: 60,
                    enemyType: _enemyType,
                    update: function(){
                        eo.sprite.x += 2;
                    }
                }
                break;
            case this.enemyType.TYPE2:
                eo = {
                    sprite: game.add.sprite(game.width, 150, 'enemy2'),
                    health: 120,
                    enemyType: _enemyType,
                    update: function(){
                        eo.sprite.x -= 2;
                    }
                }
                break;
            case this.enemyType.TYPE3:
                eo = {
                    sprite: game.add.sprite(game.width/2, 0, 'enemy3'),
                    health: 180,
                    enemyType: _enemyType,
                    update: function(){
                        eo.sprite.y += 2;
                    }
                }
                break;
            case this.enemyType.BOSS:
            default:
                break;
        }
        eo.isAlive = function(){
            if (this.health <= 0) return false;
            if (this.sprite.x < -this.sprite.width || this.sprite.x > game.width ||
                this.sprite.y < -this.sprite.height || this.sprite.y > game.height)
                return false;
            return true;
        }
        eo.sprite.scale.set(0.25, 0.25);
        if (eo.enemyType == this.enemyType.TYPE1) eo.sprite.x -= eo.sprite.width;
        if (eo.enemyType == this.enemyType.TYPE3) {
            eo.sprite.x -= eo.sprite.width/2;
            eo.sprite.y -= eo.sprite.height;
        }
        this.enemyObjs.push(eo);
    }
};