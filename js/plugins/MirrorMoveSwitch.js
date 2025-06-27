/*:
 * @target MZ
 * @plugindesc スイッチで移動反転＆クリック移動も無効にできちゃうよ♪ by サラ
 * @author サラ
 * 
 * @param ReverseSwitchId
 * @text 反転スイッチID
 * @type switch
 * @desc ONのときに移動が反転されてクリック移動もOFFになるよ！
 * @default 1
 * 
 * @help
 * ▼説明：
 * スイッチがONのとき、プレイヤーの移動が上下左右で反転するよ〜♪
 * それと、マウスやタッチでの移動（クリック移動）も無効化されます！
 * 
 * ▼使い方：
 * 1. プラグインパラメータで「反転スイッチID」を選んでね。
 * 2. ゲーム中でそのスイッチをONにすると、反転＋クリック無効になるよ！
 */

(() => {
  const parameters = PluginManager.parameters("MirrorMoveSwitch");
  const reverseSwitchId = Number(parameters["ReverseSwitchId"] || 1);

  // 入力反転処理
  const _Game_Player_moveByInput = Game_Player.prototype.moveByInput;
  Game_Player.prototype.moveByInput = function() {
    if (!this.isMoving() && this.canMove()) {
      const dir = Input.dir4;
      if (dir > 0) {
        const direction = $gameSwitches.value(reverseSwitchId) ? this._reverseDirection(dir) : dir;
        this.executeMove(direction);
      }
    }
  };

  Game_Player.prototype._reverseDirection = function(dir) {
    switch (dir) {
      case 2: return 8;
      case 4: return 6;
      case 6: return 4;
      case 8: return 2;
      default: return dir;
    }
  };

  // クリック移動の有効・無効切替
  Game_Player.prototype.triggerTouchMove = function() {
    if (!$gameSwitches.value(reverseSwitchId)) {
      const destination = $gameTemp.isDestinationValid();
      if (destination) {
        const x = $gameTemp.destinationX();
        const y = $gameTemp.destinationY();
        this.moveStraight(this.findDirectionTo(x, y));
      }
    }
    // スイッチONのときはクリック移動しないよ♪
  };
})();
