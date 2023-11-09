// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    // 属性引用了星星制作资源
    starPrefab: {
      default: null,
      type: cc.Prefab,
    },
    // 星星消失时间的随机范围
    maxStarDuration: 0,
    minStarDuration: 0,
    // 地面节点，用于确定星星生成的高度
    ground: {
      default: null,
      type: cc.Node,
    },
    // 用于获取主角弹跳的高度，和控制主角行动开关
    player: {
      default: null,
      type: cc.Node,
    },
    scoreDisplay: {
      default: null,
      type: cc.Label,
    },
    scoreAudio: {
      default: null,
      type: cc.AudioClip,
    },
    startBtn: {
      default: null,
      type: cc.Node,
    },
  },

  onLoad() {
    // 开始位置
    this.groundY = this.ground.y + this.ground.height / 2+this.player.height/2;
    console.log('this.ground',this.groundY)
    // 是否开始
    this.enabled = false;
    // 初始化计时
    this.timer = 0;
    this.starDuration = 0;
    this.score = 0;
    // 生成一个星星

    // this.startBtn.on(cc.Node.EventType.MOUSE_DOWN, this.onStartGame,this);
  },

  onStartGame() {
    // 初始化计分
    this.resetScore();
    this.enabled = true;
    this.startBtn.x=30000
    this.player.getComponent('Player').startMoveAt(cc.v2(0, this.groundY));
    // spawn star
    this.spawnNewStar();
  },

  spawnNewStar() {
    var newStar = cc.instantiate(this.starPrefab);
    // 将新增的节点添加到 Canvas 节点下面
    this.node.addChild(newStar);
    newStar.setPosition(this.getNewStarPosition());
    newStar.getComponent('Star').game = this;

    // 重置计时器，根据消失时间范围随机取一个值
    this.starDuration =
      this.minStarDuration +
      Math.random() * (this.maxStarDuration - this.minStarDuration);
    this.timer = 0;
  },
  getNewStarPosition() {
    var randX = 0;
    // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
    var randY =
      this.groundY +
      Math.random() * this.player.getComponent('Player').jumpHeight +
      50;
    // 根据屏幕宽度，随机得到一个星星 x 坐标
    var maxX = this.node.width / 2;
    randX = (Math.random() - 0.5) * 2 * maxX;
    // 返回星星坐标
    return cc.v2(randX, randY);
  },
  gainScore() {
    this.score += 1;
    this.scoreDisplay.string = 'Score:' + this.score;
    cc.audioEngine.playEffect(this.scoreAudio, false);
  },

  resetScore() {
    this.score = 0;
    this.scoreDisplay.string = 'Score: ' + this.score.toString();
  },
  gameOver() {
    // 停止 Player 节点的跳跃动作
    this.player.stopAllActions();
    // this.startBtn.x=0
    // 重新加载场景 game
    cc.director.loadScene('game');
  },

  start() {},

  update(dt) {
    if (!this.enabled) return;
    if (this.timer > this.starDuration) {
      this.gameOver();
      return;
    }
    this.timer += dt;
  },
  onDestroy() {
    // 关闭键盘输入监听
    // this.startBtn.off(cc.Node.EventType.MOUSE_DOWN, this.onStartGame,this);

   
  },
});
