/*:
 * @target MZ
 * @plugindesc 캐릭터 위에 말풍선과 텍스트를 표시하는 플러그인
 * @author Claude
 * @help
 * 이 플러그인은 캐릭터 위에 말풍선과 텍스트를 표시하는 기능을 제공합니다.
 * 
 * 사용 방법:
 * 1. 플러그인 명령어를 통해 말풍선 설정
 * 2. 표시 트리거 선택:
 *    - 접근 시: 플레이어가 이벤트와 3타일 이내로 접근하면 자동으로 말풍선이 표시됩니다.
 *    - 주기적: 10초마다 5초 동안 말풍선이 표시됩니다.
 *    - 항상: 말풍선이 계속 표시됩니다.
 * 
 * @command setSpeechBubble
 * @text 말풍선 설정
 * @desc 이벤트의 말풍선을 설정합니다.
 * 
 * @arg eventId
 * @type number
 * @text 이벤트 ID
 * @desc 말풍선을 표시할 이벤트의 ID
 * 
 * @arg texts
 * @type string[]
 * @text 텍스트 목록
 * @desc 표시할 텍스트 목록 (여러 개 입력 가능)
 * 
 * @arg triggerType
 * @type select
 * @text 표시 트리거
 * @desc 말풍선이 표시되는 조건
 * @option 접근 시
 * @value proximity
 * @option 주기적
 * @value periodic
 * @option 항상
 * @value always
 * @default proximity
 * 
 * @param checkInterval
 * @text 체크 간격
 * @type number
 * @desc 말풍선 표시 여부를 체크하는 간격(프레임)
 * @default 0.5초
 * 
 * @param displayDuration
 * @text 표시 시간
 * @type number
 * @desc 말풍선이 표시되는 시간(프레임)
 * @default 300
 * 
 * @param checkRange
 * @text 체크 범위
 * @type number
 * @desc 플레이어와 이벤트 사이의 체크 범위(타일)
 * @default 3
 */

(() => {
    'use strict';

    const pluginName = "CharacterSpeechBubble";
    const parameters = PluginManager.parameters(pluginName);
    const checkInterval = Number(parameters.checkInterval || 0.5) * 60;
    const checkRange = Number(parameters.checkRange || 3);
    const displayDuration = Number(parameters.displayDuration || 300);

    // 말풍선 데이터 저장소
    const speechBubbleData = new Map();
    const initializedEvents = new Set();

    // 말풍선 스프라이트 클래스
    class SpeechBubble extends Sprite {
        constructor(text, backgroundColor, borderColor) {
            super();
            this._text = text;
            this._backgroundColor = backgroundColor || "#333333";
            this._borderColor = borderColor || "#ffffff";
            this._fadeInDuration = 20;
            this._fadeOutDuration = 20;
            this._alpha = 0;
            this._fadingOut = false;
            this._eventSprite = null;
            this._displayTimer = 0;
            this.z = -1;
            this.createBubble();
        }

        createBubble() {
            const padding = 10;
            const radius = 8;
            
            // MultiLanguageSystem을 통한 텍스트 처리
            let processedText = this._text;
            try {
                if (Imported.ODW_MultiLanguageSystem && ODW.MLS && ODW.MLS.getText) {
                    processedText = ODW.MLS.getText(this._text);
                }
            } catch (e) {
                console.warn("MultiLanguageSystem not available, using original text");
            }
            
            // 줄바꿈 처리
            const lines = processedText.split(/\n|\\n/);
            const lineHeight = 20;
            const maxWidth = Math.max(...lines.map(line => this.measureTextWidth(line)));
            const totalHeight = lines.length * lineHeight;
            
            const width = maxWidth + padding * 2;
            const height = totalHeight + padding * 2;
            const tailHeight = 10;
            
            this.bitmap = new Bitmap(width + 1, height + tailHeight);
            this.bitmap.smooth = false;
            const context = this.bitmap.context;
            
            context.imageSmoothingEnabled = false;
            context.textBaseline = 'top';
            
            // 말풍선 본체 그리기
            context.beginPath();
            context.moveTo(radius, 0);
            context.lineTo(width - radius, 0);
            context.quadraticCurveTo(width, 0, width, radius);
            context.lineTo(width, height - radius);
            context.quadraticCurveTo(width, height, width - radius, height);
            context.lineTo(radius, height);
            context.quadraticCurveTo(0, height, 0, height - radius);
            context.lineTo(0, radius);
            context.quadraticCurveTo(0, 0, radius, 0);
            context.closePath();
            
            // 배경 채우기
            context.fillStyle = this._backgroundColor;
            context.fill();
            
            // 테두리 그리기
            context.strokeStyle = this._borderColor;
            context.lineWidth = 2;
            context.stroke();
            
            // 꼬리 그리기
            const tailWidth = 20;
            const tailX = width / 2;
            
            context.beginPath();
            context.moveTo(tailX - tailWidth/2, height - 1);
            context.lineTo(tailX, height + tailHeight - 1);
            context.lineTo(tailX + tailWidth/2, height - 1);
            context.closePath();
            context.fillStyle = this._backgroundColor;
            context.fill();
            
            context.beginPath();
            context.moveTo(tailX - tailWidth/2, height - 1);
            context.lineTo(tailX, height + tailHeight - 1);
            context.lineTo(tailX + tailWidth/2, height - 1);
            context.strokeStyle = this._borderColor;
            context.lineWidth = 2;
            context.stroke();
            
            // 텍스트 그리기
            this.bitmap.textColor = "#ffffff";
            this.bitmap.fontSize = 16;
            this.bitmap.fontFace = $gameSystem.mainFontFace();
            lines.forEach((line, index) => {
                const y = padding + index * lineHeight;
                const lineWidth = this.measureTextWidth(line);
                const x = padding + (maxWidth - lineWidth) / 2;
                this.bitmap.drawText(line, x, y, lineWidth, lineHeight, "left");
            });
            
            this.anchor.x = 0.5;
            this.anchor.y = 1;
            this.alpha = 0;
             
        }

        measureTextWidth(text) {
            const context = new Bitmap(1, 1).context;
            context.font = `16px ${$gameSystem.mainFontFace()}`;
            return context.measureText(text).width;
        }

        measureTextHeight(text) {
            return 20; // 기본 텍스트 높이
        }

        update() {
            super.update();
            
            if (!this._eventSprite || !this._eventSprite.parent) {
                this.destroy();
                return;
            }
            
            if (this._fadingOut) {
                this._alpha -= 1 / this._fadeOutDuration;
                this.alpha = this._alpha;
                if (this._alpha <= 0) {
                    this.destroy();
                }
            } else if (this._alpha < 1) {
                this._alpha += 1 / this._fadeInDuration;
                this.alpha = this._alpha;
            }

            // 주기적 표시를 위한 타이머 업데이트
            if (this._displayTimer > 0) {
                this._displayTimer--;
                if (this._displayTimer <= 0) {
                    this.destroy();
                }
            }

            // 이벤트 스프라이트의 위치에 따라 말풍선 위치 업데이트
            const oldX = this.x;
            const oldY = this.y;
            this.x = this._eventSprite.x;
            this.y = this._eventSprite.y - 48;
            if (oldX !== this.x || oldY !== this.y) {
            }
        }

        setEventSprite(sprite) {
            this._eventSprite = sprite;
        }

        setDisplayTimer(frames) {
            this._displayTimer = frames;
        }

        destroy() {
            this._eventSprite = null;
            super.destroy();
        }
    }

    // 게임 객체 확장
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === "showSpeechBubble") {
            const characterId = Number(args[0]);
            const text = args[1];
            const duration = Number(args[2]);
            const backgroundColor = args[3];
            const borderColor = args[4];
            this.showSpeechBubble(characterId, text, duration, backgroundColor, borderColor);
        }
    };

    Game_Interpreter.prototype.showSpeechBubble = function(characterId, text, duration, backgroundColor, borderColor) {
        const character = this.getCharacter(characterId);
        if (character) {
            const sprite = this.getCharacterSprite(character);
            if (sprite) {
                const bubble = new SpeechBubble(text, backgroundColor, borderColor);
                sprite.addChild(bubble);
                bubble.x = 0;
                bubble.y = -48; // 고정된 높이 사용
            }
        }
    };

    Game_Interpreter.prototype.getCharacter = function(characterId) {
        if (characterId === 0) {
            return $gamePlayer;
        } else if (characterId === -1) {
            const eventId = this._eventId;
            if (eventId > 0) {
                return $gameMap.event(eventId);
            }
            return null;
        } else {
            return $gameMap.event(characterId);
        }
    };

    Game_Interpreter.prototype.getCharacterSprite = function(character) {
        if (!character) return null;
        const spriteset = SceneManager._scene._spriteset;
        if (!spriteset) return null;
        
        if (character === $gamePlayer) {
            return spriteset._characterSprites.find(sprite => sprite._character === character);
        } else {
            return spriteset._characterSprites.find(sprite => 
                sprite._character === character && sprite._character._eventId === character._eventId
            );
        }
    };

    // 플러그인 명령어 등록
    PluginManager.registerCommand(pluginName, "showSpeechBubble", args => {
        const characterId = Number(args.characterId);
        const text = String(args.text);
        const duration = Number(args.duration);
        const backgroundColor = String(args.backgroundColor);
        const borderColor = String(args.borderColor);
        const interpreter = $gameMap._interpreter;
        if (interpreter) {
            interpreter.showSpeechBubble(characterId, text, duration, backgroundColor, borderColor);
        }
    });

    // 게임 이벤트 확장
    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.call(this, mapId, eventId);
        this._speechBubbleCounter = 0;
        this._currentBubble = null;
        this._speechBubbleInitialized = false;
    };

    Game_Event.prototype.getSpeechBubbleText = function() {
        const data = speechBubbleData.get(this._eventId);
        if (data && data.texts && data.texts.length > 0) {
            // 항상 표시 타입일 때는 순차적으로 텍스트 변경
            if (data.triggerType === 'always') {
                this._currentTextIndex = (this._currentTextIndex || 0) % data.texts.length;
                const text = data.texts[this._currentTextIndex];
                this._currentTextIndex = (this._currentTextIndex + 1) % data.texts.length;
                return text;
            } else {
                // 다른 타입은 랜덤 선택
                const text = data.texts[Math.floor(Math.random() * data.texts.length)].replace(/["']/g, '');
                return text;
            }
        }
        return null;
    };

    const _Game_Event_update = Game_Event.prototype.update;
    Game_Event.prototype.update = function() {
        _Game_Event_update.call(this);
        if (speechBubbleData.has(this._eventId)) {
            this.updateSpeechBubble();
        }
    };

    Game_Event.prototype.updateSpeechBubble = function() {
        const data = speechBubbleData.get(this._eventId);
        if (!data) return;

        // 이벤트가 실행 중이면 말풍선 제거
        if ($gameMap._interpreter && $gameMap._interpreter.isRunning()) {
            if (this._currentBubble) {
                this._currentBubble.destroy();
                this._currentBubble = null;
            }
            return;
        }

        this._speechBubbleCounter++;
        if (this._speechBubbleCounter >= checkInterval) {
            this._speechBubbleCounter = 0;
            
            let shouldShow = false;
            let shouldChangeText = false;
            
            switch (data.triggerType) {
                case 'proximity':
                    const isNear = this.isNearPlayer();
                    const dx = Math.abs(this.x - $gamePlayer.x);
                    const dy = Math.abs(this.y - $gamePlayer.y);
                    shouldShow = isNear;
                    break;
                    
                case 'periodic':
                    if (!this._currentBubble) {
                        shouldShow = true;
                    }
                    break;
                    
                case 'always':
                    shouldShow = true;
                    // 항상 표시 타입일 때 텍스트 교체 타이머 체크
                    if (this._currentBubble) {
                        this._textChangeCounter = (this._textChangeCounter || 0) + checkInterval;
                        if (this._textChangeCounter >= 300) { // 5초 (60프레임 * 5)
                            shouldChangeText = true;
                            this._textChangeCounter = 0;
                        }
                    }
                    break;
            }
            
            if (shouldShow && !this._currentBubble) {
                this.showSpeechBubble();
            } else if (shouldChangeText && this._currentBubble) {
                this._currentBubble.destroy();
                this._currentBubble = null;
                this.showSpeechBubble();
            } else if (!shouldShow && this._currentBubble) {
                this._currentBubble.destroy();
                this._currentBubble = null;
            }
        }
    };

    Game_Event.prototype.isNearPlayer = function() {
        const dx = Math.abs(this.x - $gamePlayer.x);
        const dy = Math.abs(this.y - $gamePlayer.y);
        return dx <= checkRange && dy <= checkRange;
    };

    Game_Event.prototype.showSpeechBubble = function() {
        const text = this.getSpeechBubbleText();
        
        if (text) {
            const sprite = this.getCharacterSprite();
            
            if (sprite) {
                // 기존 말풍선이 있다면 제거
                if (this._currentBubble) {
                    this._currentBubble.destroy();
                }

                const bubble = new SpeechBubble(text);
                bubble.setEventSprite(sprite);
                
                // 주기적 표시인 경우 타이머 설정
                const data = speechBubbleData.get(this._eventId);
                if (data && data.triggerType === 'periodic') {
                    bubble.setDisplayTimer(displayDuration);
                }
                
                SceneManager._scene._spriteset.addChild(bubble);
                this._currentBubble = bubble;
            }
        }
    };

    Game_Event.prototype.getCharacterSprite = function() {
        const spriteset = SceneManager._scene._spriteset;
        if (!spriteset) {
            return null;
        }
        
        const sprite = spriteset._characterSprites.find(sprite => 
            sprite._character === this && sprite._character._eventId === this._eventId
        );
        
        return sprite;
    };

    Game_Event.prototype.isEventRunning = function() {
        return $gameMap._interpreter && $gameMap._interpreter.isRunning() && 
               $gameMap._interpreter._eventId === this._eventId;
    };

    // 플러그인 명령어 등록
    PluginManager.registerCommand(pluginName, "setSpeechBubble", args => {
        const eventId = Number(args.eventId);
        const event = $gameMap.event(eventId);
        
        if (!event) {
            return;
        }

        if (event._speechBubbleInitialized) {
            return; // 이미 초기화된 이벤트는 무시
        }

        // 텍스트 파싱 로직 수정
        let texts = [];
        try {
            // JSON 형식으로 파싱 시도
            texts = JSON.parse(args.texts);
        } catch (e) {
            // JSON 파싱 실패 시 기존 방식으로 처리
            texts = args.texts.replace(/[\[\]]/g, '').split(',').map(text => text.trim());
        }
        
        const triggerType = args.triggerType || 'proximity';
        speechBubbleData.set(eventId, { texts: texts, triggerType: triggerType });
        event._speechBubbleInitialized = true;
    });

    // 맵 변경 시 초기화된 이벤트 목록 초기화
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        speechBubbleData.clear();
    };
})(); 