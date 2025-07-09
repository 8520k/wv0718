/*:
 * @target MZ
 * @plugindesc 대사창에 타이핑 효과와 소리를 추가합니다.
 * @author Your Name
 * @help
 * 대사창에 텍스트가 출력될 때 타이핑 효과와 소리가 재생됩니다.
 * 
 * 명령어:
 * \typ[n] - 타이핑 소리의 피치를 n으로 설정 (50~150)
 * 예시: \typ[120]안녕하세요
 * 
 * \ts[on] - 타이핑 소리 켜기
 * \ts[off] - 타이핑 소리 끄기
 * 
 * 이름별 피치 설정:
 * 이름에 따라 자동으로 피치가 설정됩니다.
 * 예시: "소년" -> 120, "소녀" -> 100, "어른" -> 80
 * 
 * @param typingSound
 * @text 타이핑 효과음
 * @type file
 * @dir audio/se/
 * @desc 타이핑 효과음 파일명 (확장자 제외)
 * @default Cursor1
 * 
 * @param typingSpeed
 * @text 타이핑 속도
 * @type number
 * @min 1
 * @max 10
 * @desc 타이핑 속도 (1: 느림, 10: 빠름)
 * @default 5
 * 
 * @param defaultEnabled
 * @text 기본 활성화 여부
 * @type boolean
 * @on 켜기
 * @off 끄기
 * @desc 게임 시작 시 타이핑 소리 기본 설정
 * @default true
 * 
 * @param namePitchSettings
 * @text 이름별 피치 설정
 * @type struct<NamePitch>[]
 * @desc 이름에 따른 피치 설정
 * @default [{"name":"소년","pitch":"120"},{"name":"소녀","pitch":"100"},{"name":"어른","pitch":"80"}]
 */

/*~struct~NamePitch:
 * @param name
 * @text 이름
 * @type string
 * @desc 매칭할 이름
 * 
 * @param pitch
 * @text 피치
 * @type number
 * @min 50
 * @max 150
 * @desc 설정할 피치 값
 */

(() => {
    'use strict';

    const pluginName = "MessageTypingSound";
    const parameters = PluginManager.parameters(pluginName);
    const typingSound = parameters['typingSound'] || 'Cursor1';
    const typingSpeed = Number(parameters['typingSpeed']) || 5;
    const defaultEnabled = parameters['defaultEnabled'] !== 'false';
    
    // 이름별 피치 설정 파싱
    let namePitchSettings = [];
    try {
        const settingsStr = parameters['namePitchSettings'] || '[]';
        const cleanSettingsStr = settingsStr
            .replace(/\n/g, '')
            .replace(/\r/g, '')
            .replace(/\${([^}]+)}/g, '$1');
        
        namePitchSettings = JSON.parse(cleanSettingsStr).map(setting => ({
            name: String(setting.name),
            pitch: Number(setting.pitch)
        }));
    } catch (e) {
        namePitchSettings = [];
    }

    // 변수 이름 변환 함수
    function convertVariableName(name) {
        return name.replace(/\${([^}]+)}/g, '$1');
    }

    // 게임 시스템에 타이핑 사운드 설정 저장
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._typingSoundEnabled = defaultEnabled;
    };

    Game_System.prototype.isTypingSoundEnabled = function() {
        return this._typingSoundEnabled;
    };

    Game_System.prototype.setTypingSoundEnabled = function(enabled) {
        this._typingSoundEnabled = enabled;
    };

    const _Window_Message_processCharacter = Window_Message.prototype.processCharacter;
    Window_Message.prototype.processCharacter = function(textState) {
        const c = textState.text[textState.index];
        if (c && c.charCodeAt(0) >= 0x20 && c !== ' ') {
            if ($gameSystem.isTypingSoundEnabled()) {
                const soundName = typingSound;
                AudioManager.playSe({
                    name: soundName, 
                    volume: 90, 
                    pitch: this._typingPitch || 100, 
                    pan: 0
                });
                this._waitCount = 11 - typingSpeed;
            }
        }
        _Window_Message_processCharacter.call(this, textState);
    };

    const _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        if (code === 'TYP') {
            const pitch = this.obtainEscapeParam(textState);
            if (pitch >= 50 && pitch <= 150) {
                this._typingPitch = pitch;
            }
        } else if (code === 'TS') {
            const param = this.obtainEscapeParam(textState);
            if (param === 'on' || param === 'off') {
                $gameSystem.setTypingSoundEnabled(param === 'on');
            }
        } else {
            _Window_Message_processEscapeCharacter.call(this, code, textState);
        }
    };

    const _Window_Message_newPage = Window_Message.prototype.newPage;
    Window_Message.prototype.newPage = function(textState) {
        const speaker = convertVariableName($gameMessage.speakerName());
        
        if (!speaker || speaker.trim() === '') {
            this._typingPitch = 100;
        } else {
            const setting = namePitchSettings.find(s => s.name === speaker);
            if (setting) {
                this._typingPitch = setting.pitch;
            } else {
                this._typingPitch = 100;
            }
        }
        _Window_Message_newPage.call(this, textState);
    };

    const _Window_Message_updateMessage = Window_Message.prototype.updateMessage;
    Window_Message.prototype.updateMessage = function() {
        if ($gameSystem.isTypingSoundEnabled()) {
            if (this._waitCount > 0) {
                this._waitCount--;
                return true;
            }
        }
        return _Window_Message_updateMessage.call(this);
    };

    // 옵션 메뉴에 타이핑 사운드 설정 추가
    const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand('${typing_effect}', 'typingSound');
    };

    const _Window_Options_getConfigValue = Window_Options.prototype.getConfigValue;
    Window_Options.prototype.getConfigValue = function(symbol) {
        if (symbol === 'typingSound') {
            return $gameSystem.isTypingSoundEnabled();
        }
        return _Window_Options_getConfigValue.call(this, symbol);
    };

    const _Window_Options_setConfigValue = Window_Options.prototype.setConfigValue;
    Window_Options.prototype.setConfigValue = function(symbol, value) {
        if (symbol === 'typingSound') {
            $gameSystem.setTypingSoundEnabled(value);
        } else {
            _Window_Options_setConfigValue.call(this, symbol, value);
        }
    };

    // 이름에 따른 피치 설정
    const _Window_Message_updateSpeakerName = Window_Message.prototype.updateSpeakerName;
    Window_Message.prototype.updateSpeakerName = function() {
        _Window_Message_updateSpeakerName.call(this);
        const speaker = convertVariableName($gameMessage.speakerName());
        if (speaker) {
            const setting = namePitchSettings.find(s => s.name === speaker);
            if (setting) {
                this._typingPitch = setting.pitch;
            } else {
                this._typingPitch = 100;
            }
        }
    };

    // 이름에 따른 피치 설정
    const _Window_Message_convertEscapeCharacters = Window_Message.prototype.convertEscapeCharacters;
    Window_Message.prototype.convertEscapeCharacters = function(text) {
        text = _Window_Message_convertEscapeCharacters.call(this, text);
        
        const nameMatch = text.match(/^([^:]+):/);
        if (nameMatch) {
            const speaker = nameMatch[1].trim();
            $gameMessage.setSpeakerName(speaker);
            const setting = namePitchSettings.find(s => s.name === speaker);
            if (setting) {
                this._typingPitch = setting.pitch;
            } else {
                this._typingPitch = 100;
            }
        } else {
            this._typingPitch = 100;
        }

        text = text.replace(/\\typ\[(\d+)\]/gi, (_, p1) => {
            const pitch = parseInt(p1);
            if (pitch >= 50 && pitch <= 150) {
                this._typingPitch = pitch;
            }
            return '';
        });
        return text;
    };

    // 피치 조절 명령어 등록
    const _Window_Base_obtainEscapeCode = Window_Base.prototype.obtainEscapeCode;
    Window_Base.prototype.obtainEscapeCode = function(textState) {
        const regExp = /^[$.|^!><{}\\]|^[A-Z]+/i;
        const arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return arr[0].toUpperCase();
        } else {
            return "";
        }
    };

    // 피치 조절 명령어 처리
    const _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _Window_Message_startMessage.call(this);
        if (this._speaker) {
            const setting = namePitchSettings.find(s => s.name === this._speaker);
            if (setting) {
                this._typingPitch = setting.pitch;
            } else {
                this._typingPitch = 100;
            }
        }
    };

    // 피치 조절 명령어 처리
    const _Window_Message_createTextState = Window_Message.prototype.createTextState;
    Window_Message.prototype.createTextState = function(text, x, y, width) {
        const textState = _Window_Message_createTextState.call(this, text, x, y, width);
        textState.typingPitch = this._typingPitch || 100;
        return textState;
    };

    // 피치 조절 명령어 처리
    const _Window_Message_processAllText = Window_Message.prototype.processAllText;
    Window_Message.prototype.processAllText = function(textState) {
        this._typingPitch = textState.typingPitch;
        _Window_Message_processAllText.call(this, textState);
    };

    // 피치 조절 명령어 처리
    const _Window_Message_obtainEscapeParam = Window_Message.prototype.obtainEscapeParam;
    Window_Message.prototype.obtainEscapeParam = function(textState) {
        const regExp = /^\[(\d+)\]/;
        const arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return parseInt(arr[1]);
        } else {
            return 0;
        }
    };

    // 피치 조절 명령어 처리
    const _Window_Message_initialize = Window_Message.prototype.initialize;
    Window_Message.prototype.initialize = function(rect) {
        _Window_Message_initialize.call(this, rect);
        this._typingPitch = 100;
        this._speaker = null;
    };

    // 이름에 따른 피치 설정
    const _Window_Message_setSpeaker = Window_Message.prototype.setSpeaker;
    Window_Message.prototype.setSpeaker = function(speaker) {
        _Window_Message_setSpeaker.call(this, speaker);
        if (speaker) {
            const setting = namePitchSettings.find(s => s.name === speaker);
            if (setting) {
                this._typingPitch = setting.pitch;
            } else {
                this._typingPitch = 100;
            }
        }
    };

    // 이름에 따른 피치 설정
    const _Window_Message_setFaceImage = Window_Message.prototype.setFaceImage;
    Window_Message.prototype.setFaceImage = function(faceName, faceIndex) {
        _Window_Message_setFaceImage.call(this, faceName, faceIndex);
        if (faceName) {
            const setting = namePitchSettings.find(s => s.name === faceName);
            if (setting) {
                this._typingPitch = setting.pitch;
            } else {
                this._typingPitch = 100;
            }
        }
    };
})(); 