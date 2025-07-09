/*:
 * @target MZ
 * @plugindesc 스위치 41, 42, 43이 모두 켜져있을 때 스위치 50을 켭니다.
 * @author Claude
 * @help
 * 이 플러그인은 스위치 41, 42, 43이 모두 켜져있을 때
 * 자동으로 스위치 50을 켜는 기능을 제공합니다.
 */

(() => {
    'use strict';

    const _Game_Map_update = Game_Map.prototype.update;
    Game_Map.prototype.update = function(sceneActive) {
        _Game_Map_update.call(this, sceneActive);
        this.checkSwitches();
    };

    Game_Map.prototype.checkSwitches = function() {
        if ($gameSwitches.value(41) && 
            $gameSwitches.value(42) && 
            $gameSwitches.value(43)) {
            $gameSwitches.setValue(50, true);
        }
    };
})(); 