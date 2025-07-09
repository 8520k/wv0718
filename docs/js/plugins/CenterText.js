/*:
 * @target MZ
 * @plugindesc 화면 중앙에 텍스트를 표시하는 플러그인
 * @author Claude
 * @help
 * 
 * 플러그인 명령어:
 * ShowCenterText text, fadeIn, displayTime, fadeOut, fontSize
 * 
 * text: 표시할 텍스트
 * fadeIn: 페이드인 시간 (프레임)
 * displayTime: 표시 시간 (프레임)
 * fadeOut: 페이드아웃 시간 (프레임)
 * fontSize: 텍스트 크기
 * 
 * 예시:
 * ShowCenterText "안녕하세요!", 30, 60, 30, 36
 * 
 * @command showCenterText
 * @text 중앙 텍스트 표시
 * @desc 화면 중앙에 텍스트를 표시합니다.
 * 
 * @arg text
 * @type string
 * @text 텍스트
 * @desc 표시할 텍스트
 * 
 * @arg fadeIn
 * @type number
 * @text 페이드인 시간
 * @desc 페이드인 시간 (프레임)
 * @default 30
 * 
 * @arg displayTime
 * @type number
 * @text 표시 시간
 * @desc 텍스트가 표시되는 시간 (프레임)
 * @default 60
 * 
 * @arg fadeOut
 * @type number
 * @text 페이드아웃 시간
 * @desc 페이드아웃 시간 (프레임)
 * @default 30
 * 
 * @arg fontSize
 * @type number
 * @text 글자 크기
 * @desc 텍스트의 글자 크기
 * @default 36
 * 
 * @orderAfter ODW_MultiLanguageSystem
 */

(() => {
    'use strict';

    const pluginName = "CenterText";

    // 스프라이트 클래스 정의
    class Sprite_CenterText extends Sprite {
        constructor() {
            super();
            this._text = "";
            this._fadeInTime = 0;
            this._displayTime = 0;
            this._fadeOutTime = 0;
            this._fontSize = 36;
            this._opacity = 0;
            this._phase = "fadeIn";
            this.createBitmap();
        }

        createBitmap() {
            this.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this.bitmap.fontSize = this._fontSize;
            this.bitmap.fontBold = true;
            this.bitmap.fontFace = $gameSystem.mainFontFace();
            this.bitmap.textColor = "#ffffff";
            this.bitmap.outlineColor = "#000000";
            this.bitmap.outlineWidth = 4;
        }

        setup(text, fadeIn, displayTime, fadeOut, fontSize) {
            this._text = text;
            this._fadeInTime = fadeIn;
            this._displayTime = displayTime;
            this._fadeOutTime = fadeOut;
            this._fontSize = fontSize;
            this._opacity = 0;
            this._phase = "fadeIn";
            this.bitmap.fontSize = fontSize;
            this.bitmap.fontFace = $gameSystem.mainFontFace();
            this.bitmap.clear();
            
            let displayText = text;
            console.log("CenterText: Original text:", text);
            console.log("CenterText: ODW.MLS available:", !!Imported.ODW_MultiLanguageSystem);
            
            try {
                if (Imported.ODW_MultiLanguageSystem && ODW.MLS && ODW.MLS.getText) {
                    console.log("CenterText: ODW.MLS.getText available");
                    displayText = ODW.MLS.getText(text);
                    console.log("CenterText: Translated text:", displayText);
                } else {
                    console.log("CenterText: Translation system not available");
                }
            } catch (e) {
                console.error("CenterText: Translation error", e);
            }
            
            this._displayText = displayText;
            this.opacity = 0;
        }

        update() {
            super.update();
            if (this._phase === "fadeIn") {
                this._opacity += 255 / this._fadeInTime;
                if (this._opacity >= 255) {
                    this._opacity = 255;
                    this._phase = "display";
                }
                this.bitmap.clear();
                this.bitmap.drawText(this._displayText, 0, 0, Graphics.width, Graphics.height, "center");
            } else if (this._phase === "display") {
                this._displayTime--;
                if (this._displayTime <= 0) {
                    this._phase = "fadeOut";
                }
            } else if (this._phase === "fadeOut") {
                this._opacity -= 255 / this._fadeOutTime;
                if (this._opacity <= 0) {
                    this._opacity = 0;
                    this._phase = "finished";
                }
            }
            this.opacity = this._opacity;
        }

        isFinished() {
            return this._phase === "finished";
        }
    }

    // 스프라이트 관리자
    let _centerTextSprite = null;

    // 플러그인 명령어 등록
    PluginManager.registerCommand(pluginName, "showCenterText", args => {
        const text = String(args.text);
        const fadeIn = Number(args.fadeIn);
        const displayTime = Number(args.displayTime);
        const fadeOut = Number(args.fadeOut);
        const fontSize = Number(args.fontSize);

        if (!_centerTextSprite) {
            _centerTextSprite = new Sprite_CenterText();
            SceneManager._scene.addChild(_centerTextSprite);
        }

        _centerTextSprite.setup(text, fadeIn, displayTime, fadeOut, fontSize);
    });

    // 스프라이트 업데이트
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (_centerTextSprite && _centerTextSprite.isFinished()) {
            _centerTextSprite.destroy();
            _centerTextSprite = null;
        }
    };
})(); 