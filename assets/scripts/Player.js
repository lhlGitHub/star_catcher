cc.Class({
  extends: cc.Component,

  properties: {
    // 跳跃高度
    jumpHeight: 0,
    // 跳跃持续时间
    jumpDuration: 0,
    // 最大移动速度
    maxMoveSpeed: 0,
    //加速度
    accel: 0,
    jumpAudio: {
      default: null,
      type: cc.AudioClip,
    },
  },

  // LIFE-CYCLE CALLBACKS:
  startMoveAt (pos) {
    this.enabled = true;
    this.xSpeed = 0;
    this.node.setPosition(pos);

    var jumpAction = this.runJumpAction();
    cc.tween(this.node).then(jumpAction).start()
},
  runJumpAction() {
    // 上跳
    var jumpUp = cc
      .tween()
      .by(this.jumpDuration, { y: this.jumpHeight }, { easing: 'sineOut' });
    // 下落
    var jumpDown = cc
      .tween()
      .by(this.jumpDuration, { y: -this.jumpHeight }, { easing: 'sineIut' });
    // 创建一个缓动
    var tween = cc
      .tween()
      .sequence(jumpUp, jumpDown)
      // 添加一个回调函数，在前面的动作都结束时调用我们定义的 playJumpSound() 方法
      .call(this.playJumpSound, this);
    // 不断重复
    return cc.tween().repeatForever(tween);
  },
  playJumpSound() {
    cc.audioEngine.playEffect(this.jumpAudio, false);
  },
  onLoad() {
    // var jumpAction = this.runJumpAction();
    // cc.tween(this.node).then(jumpAction).start();
    this.enabled = false;
    // 加速度方向开关
    this.accLeft = false;
    this.accRight = false;
    // 主角当前水平方向速度
    this.xSpeed = 0;
    //初始化键盘输入监听
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },
  onKeyDown(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
        this.accLeft = true;
        break;
      case cc.macro.KEY.d:
        this.accRight = true;
        break;
    }
  },
  onKeyUp(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
        this.accLeft = false;
        break;
      case cc.macro.KEY.d:
        this.accRight = false;
        break;
    }
  },
  onDestroy() {
    // 关闭键盘输入监听
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },
  start() {},

  update(dt) {
    // 根据加速度方向更新速度
    if (this.accLeft) {
      this.xSpeed -= this.accel * dt;
    } else if (this.accRight) {
      this.xSpeed += this.accel * dt;
    }
    // 限制主角速度不能超过最大值
    if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
      this.xSpeed = (this.maxMoveSpeed * this.xSpeed) / Math.abs(this.xSpeed);
    }
    this.node.x += this.xSpeed * dt;

    // 限制不能超出 screen
    if (this.node.x > this.node.parent.width / 2) {
      this.node.x = this.node.parent.width / 2;
      this.xSpeed = 0;
    } else if (this.node.x < -this.node.parent.width / 2) {
      this.node.x = -this.node.parent.width / 2;
      this.xSpeed = 0;
    }
  },
});
