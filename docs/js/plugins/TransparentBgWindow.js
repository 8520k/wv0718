/*:
 * @target MZ
 * @plugindesc 옵션창 커스텀
 * @author YourName
 * 
 * @param windowOpacity
 * @text 윈도우 투명도
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * 
 * @param windowSkin
 * @text 윈도우 스킨
 * @type file
 * @dir img/system/
 * @default Window
 */

(() => {
    'use strict';

    // Window_Message의 name 속성 설정
    const _Window_Message_initialize = Window_Message.prototype.initialize;
    Window_Message.prototype.initialize = function(rect) {
        _Window_Message_initialize.call(this, rect);
        this.name = 'default'; // 기본값 설정
    };

    const _Window_Base_loadWindowskin = Window_Base.prototype.loadWindowskin;
    Window_Base.prototype.loadWindowskin = function() {
        if (this instanceof Window_Message || 
            this instanceof Window_NameBox || 
            this instanceof Window_ChoiceList) {
            if (!this.name) {
                this.name = 'default';
            }
            
            // s_vash일 때만 window3 사용, 나머지는 모두 window2 사용
            this.windowskin = this.name === 's_vash' ? 
                ImageManager.loadSystem('window3') : 
                ImageManager.loadSystem('window2');
        } else {
            _Window_Base_loadWindowskin.call(this);
        }
    };
      
    // 여기에 위의 커스텀 코드들을 구현

    // 옵션창의 각 항목 배경을 그리지 않도록 오버라이드
    Window_Selectable.prototype.drawItemBackground = function(index) {
        // 아무것도 하지 않음
    };
})();
