/*:
 * @target MZ
 * @plugindesc 戦闘中のヘルプウィンドウを完全に無効にするプラグイン
 * @author あなたの名前
 * @help
 * 戦闘中のすべてのウィンドウからヘルプウィンドウを切り離し、表示されないようにします。
 */

(() => {
    const _Scene_Battle_createHelpWindow = Scene_Battle.prototype.createHelpWindow;
    Scene_Battle.prototype.createHelpWindow = function() {
        _Scene_Battle_createHelpWindow.call(this);
        if (this._helpWindow) {
            this._helpWindow.hide();
            this._helpWindow.deactivate();
        }
    };

    const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        _Scene_Battle_createAllWindows.call(this);

        // 各種ウィンドウからヘルプウィンドウの紐づけを解除
        const windows = [
            this._skillWindow,
            this._itemWindow,
            this._actorCommandWindow,
            this._partyCommandWindow
        ];

        for (const win of windows) {
            if (win && win.setHelpWindow) {
                win.setHelpWindow(null);
            }
        }
    };
})();
