/*:
 * @target MZ
 * @plugindesc 여러 스위치가 켜져있을 때 좌상단에 텍스트를 표시합니다.
 * @author Claude
 * @help
 * 여러 개의 스위치와 텍스트를 설정할 수 있습니다.
 * 각 텍스트는 순서대로 표시됩니다.
 * 이벤트 실행 시 자동으로 텍스트가 페이드아웃되고, 이벤트 종료 후 다시 나타납니다.
 * 
 * @param HUDtextSettings
 * @text 텍스트 설정
 * @type struct<ShowHUDTextSetting>[]
 * @desc 표시할 텍스트 설정
 * @default []
 * 
 * @param fadeDuration
 * @text 페이드 지속시간
 * @type number
 * @min 10
 * @max 120
 * @default 30
 * @desc 텍스트 페이드 인/아웃 지속시간 (프레임)
 */

/*~struct~ShowHUDTextSetting:
 * @param switchId
 * @text 스위치 번호
 * @type switch
 * @desc 텍스트를 표시할 스위치 번호
 * 
 * @param text
 * @text 표시할 텍스트
 * @type string
 * @desc 좌상단에 표시할 텍스트
 * 
 * @param color
 * @text 텍스트 색상
 * @type string
 * @desc 텍스트 색상 (CSS 색상 코드)
 * @default #ffffff
 * 
 * @param fontSize
 * @text 텍스트 크기
 * @type number
 * @min 12
 * @max 72
 * @desc 텍스트 크기 (픽셀)
 * @default 24
 */

(() => {
    'use strict';
    
    const pluginName = "ShowBottomRightText";
    const parameters = PluginManager.parameters(pluginName);
    
    // 파라미터 파싱 수정
    const rawSettings = parameters['HUDtextSettings'] || '[]';
    const textSettings = JSON.parse(rawSettings).map(setting => {
        if (typeof setting === 'string') {
            return JSON.parse(setting);
        }
        return setting;
    });
    
    const FADE_DURATION = Number(parameters["fadeDuration"] || 30);

    const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _Scene_Map_createDisplayObjects.call(this);
        this.createTopLeftTexts();
    };

    Scene_Map.prototype.createTopLeftTexts = function() {
        if (!textSettings || textSettings.length === 0) {
            return;
        }

        this._topLeftTexts = [];
        textSettings.forEach((setting, index) => {
            let displayText = setting.text;
            
            try {
                if (Imported.ODW_MultiLanguageSystem && ODW.MLS && ODW.MLS.getText) {
                    displayText = ODW.MLS.getText(setting.text);
                }
            } catch (e) {
                console.error("ShowBottomRightText: Translation error", e);
            }

            const text = new PIXI.Text(displayText, {
                fontFamily: $gameSystem.mainFontFace(),
                fontSize: Number(setting.fontSize) || 24,
                fill: setting.color || '#ffffff',
                align: 'left',
                stroke: '#000000',
                strokeThickness: 4,
                padding: 8
            });
            text.visible = false;
            text.setting = setting;
            text.z = 999;
            
            // 페이드 관련 속성 추가
            text._fadeCount = 0;
            text._targetOpacity = 255;
            text._currentOpacity = 255;
            text._isFading = false;
            
            this._topLeftTexts.push(text);
            this.addChild(text);
        });
        this.updateTopLeftTexts();
        
        // 게임 시작 시 이벤트 상태 확인
        const isEventRunning = this.isEventRunning();
        if (isEventRunning) {
            // 이벤트가 이미 실행 중이면 텍스트를 숨김 상태로 시작
            this._topLeftTexts.forEach(text => {
                text.alpha = 0;
                text._targetOpacity = 0;
                text._currentOpacity = 0;
            });
            this._textHudTimer = 0;
            this._textHudInitialized = true;
        } else {
            // 이벤트가 실행되지 않았으면 1초 후 표시
            this._textHudTimer = 60;
            this._textHudInitialized = false;
        }
        
        this._textHudWasEventRunning = isEventRunning;
    };

    Scene_Map.prototype.updateTopLeftTexts = function() {
        if (this._topLeftTexts) {
            let currentY = 30;
            
            this._topLeftTexts.forEach((text, index) => {
                const switchId = Number(text.setting.switchId);
                const isVisible = $gameSwitches.value(switchId);
                const wasVisible = text.visible;
                
                if (wasVisible !== isVisible) {
                    text.visible = isVisible;
                }
                
                if (text.visible) {
                    text.x = 20;
                    text.y = currentY + (text.height * 0.15);
                    currentY += text.height + 10;
                }
            });
        }
    };
    
    // 페이드 기능 추가
    Scene_Map.prototype.updateTextFade = function() {
        if (this._topLeftTexts) {
            this._topLeftTexts.forEach(text => {
                if (text._isFading) {
                    text._fadeCount++;
                    const progress = text._fadeCount / FADE_DURATION;

                    if (progress >= 1) {
                        text._currentOpacity = text._targetOpacity;
                        text._isFading = false;
                        text._fadeCount = 0;
                    } else {
                        const startOpacity = text._targetOpacity === 255 ? 0 : 255;
                        text._currentOpacity =
                            startOpacity + (text._targetOpacity - startOpacity) * progress;
                    }

                    text.alpha = text._currentOpacity / 255;
                }
            });
        }
    };
    
    Scene_Map.prototype.fadeOutTexts = function() {
        if (this._topLeftTexts) {
            this._topLeftTexts.forEach(text => {
                if (text._targetOpacity !== 0) {
                    text._targetOpacity = 0;
                    text._isFading = true;
                    text._fadeCount = 0;
                }
            });
        }
    };
    
    Scene_Map.prototype.fadeInTexts = function() {
        if (this._topLeftTexts) {
            this._topLeftTexts.forEach(text => {
                if (text._targetOpacity !== 255) {
                    text._targetOpacity = 255;
                    text._isFading = true;
                    text._fadeCount = 0;
                }
            });
        }
    };

    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        if (this._topLeftTexts) {
            this._topLeftTexts.forEach(text => {
                this.removeChild(text);
            });
        }
        this.createTopLeftTexts();
    };
    
    // 이벤트 진행 상태 감지 및 텍스트 페이드 제어 - 간단한 방식
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this.updateTextFade();
        this.updateTextVisibility();
    };
    
    Scene_Map.prototype.updateTextVisibility = function() {
        if (this._topLeftTexts) {
            const isEventRunning = this.isEventRunning();
            
            // 초기화가 완료되지 않았을 때 (게임 시작 시)
            if (!this._textHudInitialized) {
                if (this._textHudTimer > 0) {
                    this._textHudTimer--;
                    if (this._textHudTimer === 0) {
                        this.fadeInTexts();
                        this._textHudInitialized = true;
                    }
                }
                return;
            }
            
            // 이벤트가 시작되었을 때
            if (isEventRunning && !this._textHudWasEventRunning) {
                this.fadeOutTexts();
                this._textHudTimer = 0;
            }
            // 이벤트가 종료되었을 때
            else if (!isEventRunning && this._textHudWasEventRunning) {
                this._textHudTimer = 60; // 1초 (60프레임)
            }
            
            // 타이머 업데이트
            if (this._textHudTimer > 0) {
                this._textHudTimer--;
                if (this._textHudTimer === 0) {
                    this.fadeInTexts();
                }
            }
            
            this._textHudWasEventRunning = isEventRunning;
        }
    };
    
    Scene_Map.prototype.isEventRunning = function() {
        return $gameMap.isEventRunning() || $gameMessage.isBusy();
    };

    const _Game_Switches_setValue = Game_Switches.prototype.setValue;
    Game_Switches.prototype.setValue = function(switchId, value) {
        _Game_Switches_setValue.call(this, switchId, value);
        
        if (SceneManager._scene instanceof Scene_Map) {
            const scene = SceneManager._scene;
            scene.updateTopLeftTexts();
        }
    };
})(); 