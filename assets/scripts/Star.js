// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // 星星和主角距离值小于当前值即可收集
        pickRadius:0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    getPlayerDistance(){
        var playerPos  = this.game.player.getPosition()
        // 根据两点位置计算两点之间距离
        var dist  = this.node.position.sub(playerPos).mag()
        return dist
    },
    onPicked(){
        this.game.spawnNewStar();
        this.game.gainScore()
        this.node.destroy();
    },

    update (dt) {
        if(this.getPlayerDistance()<this.pickRadius){
            this.onPicked()
            return
        }
        // 根据计时更新星星的透明度
        var opacityRatio = 1-this.game.timer/this.game.starDuration;
        var minOpacity=50;
        this.node.opacity = minOpacity+Math.floor(opacityRatio*255-minOpacity)
    },
});
