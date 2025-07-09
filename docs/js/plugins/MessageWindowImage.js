/*:
 * @target MZ
 * @plugindesc 대사창에 이미지를 표시하는 플러그인
 * @author Claude
 * @help
 * 대사창에 이미지를 표시할 수 있는 플러그인입니다.
 * 
 * 사용법:
 * \tbox - 대사창에 textArea.png 이미지를 표시합니다.
 * 
 * @param defaultWidth
 * @text 기본 너비
 * @type number
 * @desc 이미지의 기본 너비
 * @default 200
 * 
 * @param defaultHeight
 * @text 기본 높이
 * @type number
 * @desc 이미지의 기본 높이
 * @default 200
 * 
 * @param defaultX
 * @text 기본 X 좌표
 * @type number
 * @desc 이미지의 기본 X 좌표
 * @default 0
 * 
 * @param defaultY
 * @text 기본 Y 좌표
 * @type number
 * @desc 이미지의 기본 Y 좌표
 * @default 0
 * 
 * @param defaultOpacity
 * @text 기본 투명도
 * @type number
 * @min 0
 * @max 255
 * @desc 이미지의 기본 투명도 (0-255)
 * @default 255
 * 
 * @command showImage
 * @text 이미지 표시
 * @desc 대사창에 이미지를 표시합니다.
 * 
 * @arg x
 * @type number
 * @text X 좌표
 * @desc 이미지의 X 좌표
 * @default 0
 * 
 * @arg y
 * @type number
 * @text Y 좌표
 * @desc 이미지의 Y 좌표
 * @default 0
 * 
 * @arg width
 * @type number
 * @text 너비
 * @desc 이미지의 너비
 * @default 200
 * 
 * @arg height
 * @type number
 * @text 높이
 * @desc 이미지의 높이
 * @default 200
 * 
 * @arg opacity
 * @type number
 * @text 투명도
 * @desc 이미지의 투명도 (0-255)
 * @default 255
 */

(() => {
    'use strict';

    const pluginName = "MessageWindowImage";
    const parameters = PluginManager.parameters(pluginName);
    
    const defaultWidth = Number(parameters['defaultWidth'] || 800);
    const defaultHeight = Number(parameters['defaultHeight'] || 200);
    const defaultX = Number(parameters['defaultX'] || 0);
    const defaultY = Number(parameters['defaultY'] || 0);
    const defaultOpacity = Number(parameters['defaultOpacity'] || 255);
    const defaultImageName = "textWindow1";

    // 대사창에 이미지를 표시하는 클래스
    class MessageWindowImage extends Sprite {
        constructor(imageName, x, y, width, height, opacity) {
            super();
            this._imageName = imageName;
            this._x = x || defaultX;
            this._y = y || defaultY;
            this._width = width || defaultWidth;
            this._height = height || defaultHeight;
            this._opacity = opacity || defaultOpacity;
            this.loadImage();
        }

        loadImage() {
            try {
                this.bitmap = ImageManager.loadPicture(this._imageName);
                
                this.bitmap.addLoadListener(() => {
                    this.x = this._x;
                    this.y = this._y;
                    this.width = this._width;
                    this.height = this._height;
                    this.opacity = this._opacity;
                });
            } catch (error) {
                // 이미지 로드 실패 시 무시
            }
        }

        update() {
            super.update();
            if (this.bitmap && this.bitmap.isReady()) {
                this.visible = true;
            } else {
                this.visible = false;
            }
        }
    }

    // Window_Message 클래스 확장
    const _Window_Message_createSubWindows = Window_Message.prototype.createSubWindows;
    Window_Message.prototype.createSubWindows = function() {
        _Window_Message_createSubWindows.call(this);
        this._messageImage = null;
    };

    const _Window_Message_clear = Window_Message.prototype.clear;
    Window_Message.prototype.clear = function() {
        _Window_Message_clear.call(this);
        if (this._messageImage) {
            this.removeChild(this._messageImage);
            this._messageImage = null;
        }
    };

    // 텍스트 처리 확장
    const _Window_Message_processControlCharacter = Window_Message.prototype.processControlCharacter;
    Window_Message.prototype.processControlCharacter = function(textState, c) {
        if (c === '\\') {
            this.processEscapeCharacter(textState, c);
        } else {
            _Window_Message_processControlCharacter.call(this, textState, c);
        }
    };

    const _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(textState, c) {
        if (!textState || !textState.text || typeof textState.index !== 'number') {
            return;
        }

        const remainingText = textState.text.slice(textState.index);

        if (remainingText.startsWith('tbox[')) {
            textState.index += 5; // 'tbox[' 건너뛰기
            this.processImageEscape(textState);
            return;
        }

        _Window_Message_processEscapeCharacter.call(this, textState, c);
    };

    Window_Message.prototype.processImageEscape = function(textState) {
        if (!textState || !textState.text) {
            return;
        }

        const remainingText = textState.text.slice(textState.index);
        const match = remainingText.match(/^(?:,(.*?))?(?:,(.*?))?(?:,(.*?))?(?:,(.*?))?\]/);

        if (match) {
            const x = match[1] ? Number(match[1]) : defaultX;
            const y = match[2] ? Number(match[2]) : defaultY;
            const width = match[3] ? Number(match[3]) : defaultWidth;
            const height = match[4] ? Number(match[4]) : defaultHeight;
            
            textState.index += match[0].length;
            this.showMessageImage(x, y, width, height);
        } else {
            textState.index += 1;
        }
    };

    Window_Message.prototype.showMessageImage = function(x, y, width, height) {
        if (this._messageImage) {
            this.removeChild(this._messageImage);
        }

        let imageName = "textWindow2";
        const nameBox = this._nameBoxWindow;
        const name = nameBox && nameBox._name ? nameBox._name : "";

        if (nameBox && nameBox.visible && name.trim() !== "") {
            // 특수 이름 처리
            if (name === "${s_wolfwood}") {
                imageName = "swolfwoodWindow";
            } else if (name === "${s_vash}") {
                imageName = "svashWindow";
            } else if (name === "${m_wolfwood}") {
                imageName = "mwolfwoodWindow";
            } else if (name === "${m_vash}") {
                imageName = "mvashWindow";
            } else {
                imageName = "textWindow";
            }
        }

        if (this._background === 0) {
            this._messageImage = new MessageWindowImage(imageName, x, y, width, height);
            this.addChildAt(this._messageImage, 0);
        } else {
            this._messageImage = null;
        }
    };

    // 플러그인 명령어 등록
    PluginManager.registerCommand(pluginName, "showImage", args => {
        const x = Number(args.x) || defaultX;
        const y = Number(args.y) || defaultY;
        const width = Number(args.width) || defaultWidth;
        const height = Number(args.height) || defaultHeight;
        const opacity = Number(args.opacity) || defaultOpacity;
        const command = `\\tbox[,${x},${y},${width},${height}]`;
        $gameMessage.add(command);
    });

    // 메시지 처리 확장
    const _Window_Message_convertEscapeCharacters = Window_Message.prototype.convertEscapeCharacters;
    Window_Message.prototype.convertEscapeCharacters = function(text) {
        text = _Window_Message_convertEscapeCharacters.call(this, text);
        text = text.replace(/\\tbox\[(.*?)\]/gi, (match, p1) => {
            return match;
        });
        return text;
    };

    // 메시지 표시 시 자동으로 이미지 표시
    const _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _Window_Message_startMessage.call(this);
        this.showMessageImage(defaultX, this.height - defaultHeight, defaultWidth, defaultHeight);
    };

    // 메시지 창 크기 변경 시 이미지 위치 업데이트
    const _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function() {
        _Window_Message_updatePlacement.call(this);
        if (this._messageImage) {
            this._messageImage.y = this.height - defaultHeight;
        }
        // 배경이 '창'일 때 윈도우를 완전히 투명하게
        if (this._background === 0) {
            this.opacity = 0;
            this.backOpacity = 0;
            if (this._windowSpriteContainer) this._windowSpriteContainer.alpha = 0;
            if (this._windowFrameSprite) this._windowFrameSprite.alpha = 0;
        }
    };

    const _Window_Message_update = Window_Message.prototype.update;
    Window_Message.prototype.update = function() {
        _Window_Message_update.call(this);
        if (this._background === 0 && this._windowFrameSprite) {
            this._windowFrameSprite.alpha = 0;
            this._windowFrameSprite.visible = false;
        }
    };

    // 이름 윈도우(Window_NameBox)도 투명하게 처리
    if (typeof Window_NameBox !== 'undefined') {
        const _Window_NameBox_updatePlacement = Window_NameBox.prototype.updatePlacement;
        Window_NameBox.prototype.updatePlacement = function() {
            _Window_NameBox_updatePlacement.call(this);
            const parent = this._messageWindow;
            if (parent && parent._background === 0) {
                this.opacity = 0;
                this.backOpacity = 0;
                if (this._windowSpriteContainer) this._windowSpriteContainer.alpha = 0;
                if (this._windowFrameSprite) {
                    this._windowFrameSprite.alpha = 0;
                    this._windowFrameSprite.visible = false;
                }
            }
        };
        const _Window_NameBox_update = Window_NameBox.prototype.update;
        Window_NameBox.prototype.update = function() {
            _Window_NameBox_update.call(this);
            const parent = this._messageWindow;
            if (parent && parent._background === 0 && this._windowFrameSprite) {
                this._windowFrameSprite.alpha = 0;
                this._windowFrameSprite.visible = false;
            }
        };
    }
})(); 