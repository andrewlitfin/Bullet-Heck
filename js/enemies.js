//File for handling all methods directly related to enemies
"use strict";
// if app exists use the existing copy
// else create a new empty object literal
var bulletHeck = bulletHeck || {};

bulletHeck.enemies = {
    // master list of active enemies
    enemyObjs: [null],
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
        this.enemyObjs.push({
            enemyType: this.enemyType.TYPE1,
            sprite: game.add.sprite(0, 50, 'enemy1')
        });
        this.enemyObjs[this.enemyObjs.length - 1].sprite.x -= this.enemyObjs[this.enemyObjs.length - 1].width;
    },
    
    update : function () {
        // note to future self:
        // enemies are added with enemyObjs.push([enemy object])
        // and removed with enemyObjs.splice([index], 1)
        // (index arg is going to be stored in toDelete)
        // (second arg is # of enemies to delete)
        var toDelete = [null];
        for (var i = 0, len = this.enemyObjs.length; i < len; i++) {
            var eo = enemyObjs[i];
            switch (eo.enemyType) {
                case this.enemyType.TYPE1:
                    eo.sprite.x += 1;
                    break;
                case this.enemyType.TYPE2:
                    break;
                case this.enemyType.TYPE3:
                    break;
                case this.enemyType.BOSS:
                    break;
                default:
                    break;
            }
        }
        for (var i = 0, len = toDelete.length; i < len; i++) {
            this.enemyObjs.splice(toDelete[i], 1);
        }
    }
};