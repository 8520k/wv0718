/*:
 * @target MZ
 * @plugindesc 텍스트 이벤트의 테두리 두께를 조정하는 플러그인
 * @author Assistant
 * @base
 * @orderAfter
 * 
 * @param outlineWidth
 * @text 테두리 두께
 * @type number
 * @min 0
 * @max 12
 * @default 2
 * @desc 텍스트 테두리의 두께를 설정합니다 (0-12)
 * 
 * @param outlineColor
 * @text 테두리 색상
 * @type string
 * @default rgba(0, 0, 0, 0.5)
 * @desc 테두리 색상을 CSS 형식으로 설정합니다
 * 
 * @help
 * 이 플러그인은 모든 텍스트 이벤트의 테두리 두께와 색상을 조정합니다.
 * 
 * 플러그인 매개변수:
 * - outlineWidth: 테두리 두께 (0-12)
 * - outlineColor: 테두리 색상 (CSS 형식)
 * 
 * 사용법:
 * 1. 플러그인을 활성화합니다
 * 2. 매개변수에서 원하는 테두리 두께와 색상을 설정합니다
 * 3. 게임을 실행하면 모든 텍스트에 적용됩니다
 * 
 * @license MIT
 */

(() => {
    'use strict';
    
    const pluginName = "TextOutlineAdjuster";
    const parameters = PluginManager.parameters(pluginName);
    
    const outlineWidth = Number(parameters['outlineWidth'] || 2);
    const outlineColor = parameters['outlineColor'] || 'rgba(0, 0, 0, 0.5)';
    
    // Bitmap 클래스의 outlineWidth와 outlineColor를 오버라이드
    const _Bitmap_initialize = Bitmap.prototype.initialize;
    Bitmap.prototype.initialize = function(width, height) {
        _Bitmap_initialize.call(this, width, height);
        this.outlineWidth = outlineWidth;
        this.outlineColor = outlineColor;
    };
    
    // 기존 Bitmap 객체들도 업데이트
    const _Bitmap_createCanvas = Bitmap.prototype._createCanvas;
    Bitmap.prototype._createCanvas = function(width, height) {
        _Bitmap_createCanvas.call(this, width, height);
        this.outlineWidth = outlineWidth;
        this.outlineColor = outlineColor;
    };
    
    // Window_Base의 텍스트 설정도 오버라이드
    const _Window_Base_createContents = Window_Base.prototype.createContents;
    Window_Base.prototype.createContents = function() {
        _Window_Base_createContents.call(this);
        if (this.contents) {
            this.contents.outlineWidth = outlineWidth;
            this.contents.outlineColor = outlineColor;
        }
    };
    
    // 메시지 윈도우의 텍스트 설정도 오버라이드
    const _Window_Message_createContents = Window_Message.prototype.createContents;
    Window_Message.prototype.createContents = function() {
        _Window_Message_createContents.call(this);
        if (this.contents) {
            this.contents.outlineWidth = outlineWidth;
            this.contents.outlineColor = outlineColor;
        }
    };
    
    // 게임 시스템의 기본 폰트 설정도 오버라이드
    const _Game_System_mainFontFace = Game_System.prototype.mainFontFace;
    Game_System.prototype.mainFontFace = function() {
        const fontFace = _Game_System_mainFontFace.call(this);
        // 폰트 설정 시 outlineWidth도 함께 설정
        if (this._outlineWidth === undefined) {
            this._outlineWidth = outlineWidth;
        }
        return fontFace;
    };
    
    // 모든 텍스트 렌더링에 적용
    const _Bitmap_drawText = Bitmap.prototype.drawText;
    Bitmap.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align) {
        // 현재 outlineWidth가 기본값이면 플러그인 설정으로 변경
        if (this.outlineWidth === 3 && outlineWidth !== 3) {
            this.outlineWidth = outlineWidth;
        }
        if (this.outlineColor === 'rgba(0, 0, 0, 0.5)' && outlineColor !== 'rgba(0, 0, 0, 0.5)') {
            this.outlineColor = outlineColor;
        }
        _Bitmap_drawText.call(this, text, x, y, maxWidth, lineHeight, align);
    };
    
    console.log(`${pluginName}: 텍스트 테두리 두께가 ${outlineWidth}로 설정되었습니다.`);
    
})(); 