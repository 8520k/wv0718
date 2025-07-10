/*:
 * @target MZ
 * @plugindesc osu 스타일의 리듬게임 플러그인
 * @author Claude
 * @help
 * 이 플러그인은 RPG Maker MZ에서 osu 스타일의 리듬게임을 구현합니다.
 * 
 * 사용 방법:
 * 1. 이벤트에서 플러그인 커맨드 "StartRhythmGame"을 호출하여 게임을 시작합니다.
 * 2. 노트는 화면에 떨어지는 원형 오브젝트로 표시됩니다.
 * 3. 노트가 내부 원에 닿았을 때 정확한 타이밍에 클릭하면 점수를 얻습니다.
 * 
 * 노트 추가 방법:
 * 1. 이벤트에서 플러그인 커맨드 "AddNote"를 호출합니다.
 * 2. 시간은 밀리초 단위로 입력합니다 (예: 1000 = 1초)
 * 3. X 위치와 Y 위치는 노트가 나타날 화면 좌표입니다.
 * 
 * 노트 큐 설정 방법:
 * 1. 이벤트에서 플러그인 커맨드 "ClearNoteQueue"를 호출하여 노트 큐를 초기화합니다.
 * 2. "AddNoteToQueue" 커맨드를 사용하여 노트를 하나씩 추가합니다.
 *    - 시간: 노트가 나타날 시간 (밀리초)
 *    - 위치: 노트가 시작할 위치 (왼쪽/오른쪽)
 *    - Y좌표: 노트가 나타날 Y좌표 (기본값: 312)
 * 3. 모든 노트를 추가한 후 "StartRhythmGame"을 호출하여 게임을 시작합니다.
 * 
 * 예시:
 * 1. ClearNoteQueue (노트 큐 초기화)
 * 2. AddNoteToQueue (시간: 1000, 위치: 왼쪽)
 * 3. AddNoteToQueue (시간: 2000, 위치: 오른쪽)
 * 4. AddNoteToQueue (시간: 3000, 위치: 왼쪽)
 * 5. StartRhythmGame (게임 시작)
 * 
 * 노트 이미지 설정 방법:
 * 1. 이벤트에서 플러그인 커맨드 "SetNoteImage"를 호출합니다.
 * 2. 이미지 파일은 img/pictures 폴더에 있어야 합니다.
 * 3. 이미지 크기는 자동으로 노트 크기에 맞게 조정됩니다.
 * 
 * 노트 큐 예시:
 * [
 *   {"time": 1000, "startPosition": "left", "y": 312},
 *   {"time": 2000, "startPosition": "right", "y": 312},
 *   {"time": 3000, "startPosition": "left", "y": 312},
 *   {"time": 4000, "startPosition": "right", "y": 312},
 *   {"time": 5000, "startPosition": "left", "y": 312},
 *   {"time": 6000, "startPosition": "right", "y": 312},
 *   {"time": 7000, "startPosition": "left", "y": 312},
 *   {"time": 8000, "startPosition": "right", "y": 312},
 *   {"time": 9000, "startPosition": "left", "y": 312},
 *   {"time": 10000, "startPosition": "right", "y": 312}
 * ]
 * 
 * @command StartRhythmGame
 * @text 리듬게임 시작
 * @desc 리듬게임을 시작합니다.
 * 
 * @arg bgmName
 * @text BGM 파일명
 * @type file
 * @dir audio/bgm/
 * @desc 게임에 사용할 BGM 파일을 선택하세요
 * 
 * @arg noteSpeed
 * @text 노트 속도 (밀리초)
 * @type number
 * @desc 노트가 도착지까지 도달하는데 걸리는 시간 (밀리초)
 * @default 1000
 * 
 * @arg gameDuration
 * @text 게임 종료 시간 (밀리초)
 * @type number
 * @desc 게임이 종료되는 시간 (밀리초)
 * @default 60000
 * 
 * @arg successScore
 * @text 성공 판정 점수
 * @type number
 * @desc 이 점수를 넘으면 성공으로 판정됩니다
 * @default 0
 * 
 * @arg successSwitchId
 * @text 성공 여부 저장 스위치
 * @type switch
 * @desc 성공/실패 여부를 저장할 스위치 ID
 * @default 0
 * 
 * @arg noteQueue
 * @text 노트 큐
 * @type string
 * @desc 노트 큐를 JSON 형식으로 입력하세요
 * @default []
 * 
 * @command AddNote
 * @text 노트 추가
 * @desc 지정된 시간에 노트를 추가합니다.
 * 
 * @arg time
 * @text 표시 시간 (밀리초)
 * @type number
 * @desc 노트가 화면에 표시될 시간 (밀리초 단위, 1000 = 1초)
 * @default 0
 * 
 * @arg startPosition
 * @text 시작 위치
 * @type select
 * @option 왼쪽
 * @value left
 * @option 오른쪽
 * @value right
 * @desc 노트가 시작할 위치를 선택합니다
 * @default left
 * 
 * @arg y
 * @text Y 위치
 * @type number
 * @desc 노트가 나타날 Y 좌표 (0-624)
 * @default 312
 * 
 * @command SetNoteImage
 * @text 노트 이미지 설정
 * @desc 노트의 이미지를 설정합니다.
 * 
 * @arg imageName
 * @text 이미지 파일명
 * @type file
 * @dir img/pictures/
 * @desc 노트에 사용할 이미지 파일을 선택하세요
 * 
 * @arg noteSize
 * @text 노트 크기
 * @type number
 * @desc 노트의 크기를 픽셀 단위로 지정합니다
 * @default 48
 * 
 * @command ClearNoteQueue
 * @text 노트 큐 초기화
 * @desc 현재 노트 큐를 비웁니다.
 * 
 * @command AddNoteToQueue
 * @text 노트 큐에 노트 추가
 * @desc 노트 큐에 새로운 노트를 추가합니다.
 * 
 * @arg time
 * @text 시간 (밀리초)
 * @type number
 * @desc 노트가 나타날 시간 (밀리초 단위, 1000 = 1초)
 * @default 0
 * 
 * @arg startPosition
 * @text 시작 위치
 * @type select
 * @option 왼쪽
 * @value left
 * @option 오른쪽
 * @value right
 * @desc 노트가 시작할 위치를 선택합니다
 * @default left
 * 
 * @arg y
 * @text Y좌표
 * @type number
 * @desc 노트가 나타날 Y좌표 (0-624)
 * @default 312
 * 
 * @arg noteSpeed
 * @text 노트 속도 (밀리초)
 * @type number
 * @desc 이 노트의 이동 속도 (밀리초 단위, 기본값: 게임 기본 속도)
 * @default 0
 */

(() => {
    'use strict';
    const pluginName = "RhythmGameOsu";

    // 플러그인 파라미터
    const parameters = PluginManager.parameters(pluginName);
    const defaultNoteSize = Number(parameters.noteSize || 48);

    // 이미지 캐시
    const imageCache = {
        noteImage: null,
        noteImageName: null,
        noteSize: defaultNoteSize
    };

    // 게임 설정
    const settings = {
        perfectWindow: 100,     // Perfect 판정 윈도우 (ms)
        goodWindow: 300,       // Good 판정 윈도우 (ms)
        badWindow: 500,        // Bad 판정 윈도우 (ms)
        noteSize: defaultNoteSize,  // 노트 크기
        screenHeight: 624,     // 화면 높이 (RPG Maker MZ 기본값)
        screenWidth: 816,      // 화면 너비 (RPG Maker MZ 기본값)
        targetX: 408,          // 목표 X 좌표 (화면 중앙)
        targetY: 312,          // 목표 Y 좌표 (화면 중앙)
        startY: 312,           // 시작 Y 좌표 (화면 중앙)
        startXLeft: 0,         // 왼쪽 시작 X 좌표
        startXRight: 1500,      // 오른쪽 시작 X 좌표 (화면 너비 - 노트 크기)
        // 판정별 색상 설정
        judgementColors: {
            perfect: '#FFD700',  // 골드
            good: '#00FF00',    // 그린
            bad: '#FF0000',     // 레드
            miss: '#808080'     // 그레이
        },
        hitColor: '#FFFFFF',   // 판정 시 노트 색상

        noteColor: '#E06666'   // 노트 색상
    };

    // 화면 크기가 변경될 때 settings 업데이트
    function updateSettings() {
        settings.screenHeight = Graphics.height;
        settings.screenWidth = Graphics.width;
        settings.targetX = Graphics.width / 2;
        settings.targetY = Graphics.height / 2;
        settings.startY = Graphics.height / 2;
        settings.startXRight = Graphics.width - settings.noteSize / 2;
    }

    // 효과음 설정
    const seSettings = {
        perfect: { name: "Door1", pan: 0, pitch: 100, volume: 90 },
        good: { name: "Door1", pan: 0, pitch: 100, volume: 90 },
        bad: { name: "Door1", pan: 0, pitch: 100, volume: 90 },
        miss: { name: "Door1", pan: 0, pitch: 100, volume: 90 }
    };

    // 이미지 로드 함수 제거
    function loadCustomImages() {
        // 이미지 로드 불필요
    }

    // 게임 상태
    let gameState = {
        isPlaying: false,
        score: 0,
        combo: 0,
        maxCombo: 0,
        notes: [],
        lastNoteTime: 0
    };

    // 노트 클래스
    class Note {
        constructor(x, time, displayTime, startPosition, noteSpeed) {
            this.startX = x;
            this.x = x;
            this.y = settings.startY;
            this.targetX = settings.targetX;
            this.targetY = settings.targetY;
            this.time = time;
            this.displayTime = displayTime;
            this.hit = false;
            this.missed = false;
            this._sprite = null;
            this._approachCircle = null;
            this.startPosition = startPosition;
            this.arrived = false;
            this.arrivalTime = 0;
            this._glowEffect = null;
            this._glowAlpha = 0;
            this._judgementType = null;
            
            const distance = Math.abs(this.targetX - this.startX);
            // 개별 노트 속도 사용 (0이면 게임 기본 속도 사용)
            const travelTime = noteSpeed || $gameTemp.rhythmGameNoteSpeed || 1000;
            this.speed = distance / travelTime;
            this.direction = this.startX < this.targetX ? 1 : -1;

            this.draw();
        }

        draw() {
            if (imageCache.noteImage && imageCache.noteImage.isReady()) {
                // 커스텀 이미지 사용
                const noteBitmap = new Bitmap(settings.noteSize, settings.noteSize);
                const noteCtx = noteBitmap.context;
                
                // 이미지를 노트 크기에 맞게 그리기
                noteCtx.drawImage(imageCache.noteImage._image, 0, 0, settings.noteSize, settings.noteSize);
                
                this._sprite = new Sprite(noteBitmap);
            } else {
                // 기본 노트 그리기
                const noteBitmap = new Bitmap(settings.noteSize, settings.noteSize);
                const noteCtx = noteBitmap.context;
                
                // 노트 내부 원 그리기
                noteCtx.beginPath();
                noteCtx.arc(settings.noteSize / 2, settings.noteSize / 2, settings.noteSize / 2 - 11, 0, Math.PI * 2);
                noteCtx.fillStyle = this.hit ? settings.hitColor : settings.noteColor;
                noteCtx.fill();
                
                this._sprite = new Sprite(noteBitmap);
            }

            this._sprite.x = this.x - settings.noteSize / 2;
            this._sprite.y = this.y - settings.noteSize / 2;
 
        }

        update() {
            if (!this.hit && !this.missed) {
                // 도착지에 도달했는지 확인
                if ((this.direction > 0 && this.x >= this.targetX) || 
                    (this.direction < 0 && this.x <= this.targetX)) {
                    if (!this.arrived) {
                        this.arrived = true;
                        this.arrivalTime = performance.now();
                        // 도착지에 정확히 위치시키기
                        this.x = this.targetX;
                    }
                    
                    // 도착 후 0.1초가 지났으면 미스 처리
                    if (performance.now() - this.arrivalTime >= 100) {
                        this.missed = true;
                        this._judgementType = 'MISS';
                        gameState.combo = 0;
                        // MISS 판정 표시
                        if (RhythmGameScreen.instance) {
                            RhythmGameScreen.instance.showJudgement("MISS", this.x, this.y);
                            AudioManager.playSe(seSettings.miss);
                        }
                        // 스프라이트 제거
                        if (this._sprite && this._sprite.parent) {
                            this._sprite.parent.removeChild(this._sprite);
                        }
                        if (this._glowEffect && this._glowEffect.parent) {
                            this._glowEffect.parent.removeChild(this._glowEffect);
                        }
                    }
                } else {
                    // 도착하지 않았다면 계속 이동 (속도 적용)
                    const deltaTime = 30; // 약 60fps 기준
                    this.x += this.speed * this.direction * (deltaTime / 1000);
                }

                // 화면 밖으로 나가면 미스 처리
                if ((this.direction > 0 && this.x > Graphics.width) || 
                    (this.direction < 0 && this.x < 0)) {
                    this.missed = true;
                    this._judgementType = 'MISS';
                    gameState.combo = 0;
                    // MISS 판정 표시
                    if (RhythmGameScreen.instance) {
                        RhythmGameScreen.instance.showJudgement("MISS", this.x, this.y);
                        AudioManager.playSe(seSettings.miss);
                    }
                }

                // 스프라이트 위치 업데이트
                if (this._sprite) {
                    this._sprite.x = this.x - settings.noteSize / 2;
                    this._sprite.y = this.y - settings.noteSize / 2;
                }
                if (this._glowEffect) {
                    this._glowEffect.x = this.x - settings.noteSize;
                    this._glowEffect.y = this.y - settings.noteSize;
                }
            } 
        }
    }

    // 노트 큐 관리
    let noteQueue = [];
    let isProcessingQueue = false;

    // 노트 추가 함수
    function addNoteToQueue(displayTime, startPosition) {
        // 노트가 화면에 표시되는 시간을 기준으로 실제 생성 시간 계산
        const distance = Math.abs(settings.targetX - (startPosition === 'left' ? settings.startXLeft : settings.startXRight));
        const travelTime = $gameTemp.rhythmGameNoteSpeed || 1000; // 이동에 필요한 시간 (밀리초)
        const createTime = displayTime - travelTime; // 실제 생성 시간

        const x = startPosition === 'left' ? settings.startXLeft : settings.startXRight;
        noteQueue.push({
            time: createTime,
            displayTime: displayTime,
            x: x,
            y: settings.startY,
            startPosition: startPosition,
            processed: false
        });
        // 시간순으로 정렬
        noteQueue.sort((a, b) => a.time - b.time);
    }

    // 게임 스크린 클래스
    class RhythmGameScreen extends Scene_Base {
        static instance = null;

        initialize() {
            super.initialize();
            this._notes = [];
            this._score = 0;
            this._combo = 0;
            this._maxCombo = 0;
            this._sprites = new Sprite();
            this._isPlaying = false;
            this._startTime = 0;
            this._isInitialized = false;
            this._noteQueue = [];
            this._currentJudgement = null;
            this._gameEnded = false; // 게임 종료 플래그 추가
            RhythmGameScreen.instance = this;
        }

        isStarted() {
            return this._isPlaying && this._startTime > 0;
        }

        start() {
            if (this.isStarted()) {
                return;
            }

            if (RhythmGameScreen.instance !== this) {
                return;
            }

            // settings 업데이트
            updateSettings();
            
            this._notes = [];
            this._score = 0;
            this._combo = 0;
            this._maxCombo = 0;
            this._isPlaying = true;
            this._startTime = performance.now();
            $gameTemp.rhythmGameStartTime = this._startTime;  // 게임 시작 시간 저장
            this._lastNoteTime = 0;
            
            // 노트 큐 초기화
            this._noteQueue = [...noteQueue];
            noteQueue = [];
            
            // 커스텀 이미지 로드
            loadCustomImages();
            
            // 배경 음악 재생
            const bgmName = $gameTemp.rhythmGameBgm;
            if (bgmName) {
                AudioManager.playBgm({
                    name: bgmName,
                    pan: 0,
                    pitch: 100,
                    volume: 90
                });
            }

            // 맵 스프라이트 업데이트
            if (this._spriteset) {
                this._spriteset.update();
            }
        }

        create() {
            Scene_Base.prototype.create.call(this);
            this.createDisplayObjects();
            this.createBackground();
            this.createScoreWindow();
        }

        createDisplayObjects() {
            this.createSpriteset();
            this.createWindowLayer();
        }

        createSpriteset() {
            this._spriteset = new Spriteset_Map();
            this.addChild(this._spriteset);
        }

        createWindowLayer() {
            this._windowLayer = new WindowLayer();
            this._windowLayer.x = 0;
            this._windowLayer.y = 0;
            this.addChild(this._windowLayer);
        }

        createBackground() {
            // 반투명 배경 (가장 위 레이어)
            this._background = new Sprite();
            this._background.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._background.bitmap.fillAll('rgba(0, 0, 0, 0.5)');
            this._background.z = 0;
            this.addChild(this._background);
            
            // 배경 이미지 (가장 아래 레이어)
            this._bgImage = new Sprite();
            this._bgImage.bitmap = ImageManager.loadPicture("장작_배경");
            this._bgImage.x = 0;
            this._bgImage.y = 0;
            this._bgImage.z = 1;
            this.addChild(this._bgImage);
            
            // 게임 요소 레이어 (중간 레이어)
            this._sprites = new Sprite();
            this._sprites.z = 2;
            this.addChild(this._sprites);
            
        }



        createScoreWindow() {
            if (Utils.isOptionValid('test')) {
                const rect = new Rectangle(0, 0, 200, 70);
                this._scoreWindow = new Window_Base(rect);
                this._scoreWindow.x = 0;
                this._scoreWindow.y = 0;
                this._scoreWindow.contents.fontFace = Game_System.prototype.mainFontFace;
                this._scoreWindow.contents.fontBold = true;
                this._scoreWindow.contents.textColor = '#ffffff';
                this._scoreWindow.contents.outlineColor = '#000000';
                this._scoreWindow.contents.outlineWidth = 4;
                this._scoreWindow.contents.drawText("Score: 0", 0, 0, 140, 48, 'center');
                this._scoreWindow.z = 4; // 점수 창은 가장 위에 표시
                this._scoreWindow.opacity = 255;
                this._scoreWindow.backOpacity = 255;
                this._scoreWindow.contentsOpacity = 255;
                this.addWindow(this._scoreWindow);
            } else {
                this._scoreWindow = null;
            }
        }

        updateNotes() {
            for (let note of this._notes) {
                note.update();
            }
        }

        checkInput() {
            if (this._isPlaying && (Input.isTriggered('ok') || TouchInput.isTriggered()) && !window.GameResultManager?.isResultDisplaying()) {
                this.checkNoteHit();
            }
        }

        checkNoteHit() {
            if (!$gameTemp.rhythmGameStartTime) {
                return;
            }

            const currentTime = performance.now() - $gameTemp.rhythmGameStartTime;
            let hitAnyNote = false;
            
            for (let note of this._notes) {
                if (!note.hit && !note.missed) {
                    // 노트와 타겟 사이의 거리 계산
                    const distance = Math.abs(note.x - note.targetX);
                    
                    // 거리에 따른 판정
                    if (distance <= 30) {  
                        this.hitNote(note, "PERFECT", 300);
                        AudioManager.playSe(seSettings.perfect);
                        hitAnyNote = true;
                        break;
                    } else if (distance <= 60) {   
                        this.hitNote(note, "GOOD", 100);
                        AudioManager.playSe(seSettings.good);
                        hitAnyNote = true;
                        break;
                    } else if (distance <= 120) {  
                        this.hitNote(note, "BAD", 50);
                        AudioManager.playSe(seSettings.bad);
                        hitAnyNote = true;
                        break;
                    }
                }
            }

            // 노트를 놓쳤을 때 효과음 재생
            if (!hitAnyNote) {
                AudioManager.playSe(seSettings.miss);
            }
        }

        hitNote(note, judgement, score) {
            note.hit = true;
            note._judgementType = judgement;  // 판정 타입 저장
            this._score += score;
            this._combo++;
            
            if (this._combo > this._maxCombo) {
                this._maxCombo = this._combo;
            }
            
            // 판정 표시
            this.showJudgement(judgement, note.x, note.y);
            
            // 점수 업데이트 (개발 모드일 때만)
            if (this._scoreWindow && this._scoreWindow.contents) {
                this._scoreWindow.contents.clear();
                this._scoreWindow.contents.drawText(`Score: ${this._score}`, 0, 0, 140, 48, 'center');
            }

            // 빛나는 효과 추가
            if (note._glowEffect && !note._glowEffect.parent) {
                this._sprites.addChild(note._glowEffect);
            }

            // 0.5초 후 노트와 효과 제거
            setTimeout(() => {
                if (note._sprite && note._sprite.parent) {
                    note._sprite.parent.removeChild(note._sprite);
                }
                if (note._glowEffect && note._glowEffect.parent) {
                    note._glowEffect.parent.removeChild(note._glowEffect);
                }
            }, 500);
        }

        showJudgement(text, x, y) {
            // GameResultManager를 사용하여 판정 이미지 표시
            if (window.GameResultManager) {
                window.GameResultManager.showJudgement(text, x, y, this._sprites);
            } else {
                // 폴백: 기존 텍스트 방식 사용
            if (this._currentJudgement) {
                this._sprites.removeChild(this._currentJudgement);
            }

            const judgement = this.createTextJudgement(text);
            judgement.x = x - judgement.width / 2;
            judgement.y = y - judgement.height / 2;
            this._sprites.addChild(judgement);
            this._currentJudgement = judgement;
            
            // 0.5초 후 판정 텍스트 제거
            setTimeout(() => {
                if (this._currentJudgement && this._currentJudgement.parent) {
                    this._sprites.removeChild(this._currentJudgement);
                    this._currentJudgement = null;
                }
            }, 500);
            }
        }

        createTextJudgement(text) {
            // 비트맵 크기를 더 크게 설정
            const bitmap = new Bitmap(300, 150);
            const ctx = bitmap.context;
            
            // 텍스트 색상 설정
            let textColor;
            switch(text) {
                case "PERFECT":
                    textColor = '#FFD700';  // 골드
                    break;
                case "GOOD":
                    textColor = '#00FF00';  // 그린
                    break;
                case "BAD":
                    textColor = '#FF0000';  // 레드
                    break;
                case "MISS":
                    textColor = '#808080';  // 그레이
                    break;
            }
            
            // 텍스트 그리기
            ctx.font = 'bold 56px CookieRun-Black';  // CookieRun Black 폰트 적용
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = textColor;
            
            // 텍스트 그림자 효과
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            
            ctx.fillText(text, 150, 75);  // 중앙 위치 조정
            
            const judgement = new Sprite(bitmap);
            judgement.scale.x = 0.8;
            judgement.scale.y = 0.8;
            
            return judgement;
        }

        createNewNotes() {
            if (!this._isPlaying) {
                return;
            }
            
            const currentTime = performance.now() - this._startTime;
            
            // 큐에서 현재 시간에 맞는 노트 추가
            while (this._noteQueue.length > 0 && this._noteQueue[0].time <= currentTime) {
                const noteData = this._noteQueue.shift();
                if (!noteData.processed) {
                    // 노트 생성 시 속도 정보 전달
                    const note = new Note(
                        noteData.x,
                        currentTime,
                        noteData.time,
                        noteData.startPosition,
                        noteData.noteSpeed || $gameTemp.rhythmGameNoteSpeed // 개별 속도 또는 기본 속도 사용
                    );
                    this._notes.push(note);
                    
                    // 스프라이트 추가
                    if (note._sprite) {
                        this._sprites.addChild(note._sprite);
                    }
                    noteData.processed = true;
                }
            }
        }

        checkGameEnd() {
            // 게임 시간이 종료되었는지 확인
            const timeElapsed = performance.now() - this._startTime;
            if (timeElapsed >= $gameTemp.rhythmGameDuration) {
                this.endGame();
            }
        }

        endGame() {
            this._isPlaying = false;
            this._gameEnded = true; // 게임 종료 플래그 설정
            
            // 성공 여부 확인 및 스위치 설정
            const isSuccess = this._score >= $gameTemp.rhythmGameSuccessScore;
            if ($gameTemp.rhythmGameSuccessSwitchId > 0) {
                $gameSwitches.setValue($gameTemp.rhythmGameSuccessSwitchId, isSuccess);
            }

            // UI 정리 (showResult 전에 실행)
            this._cleanupUI();
            
            // 통합 결과 관리자 사용
            if (window.GameResultManager) {
                window.GameResultManager.showResult(isSuccess, {
                    restoreBgm: $gameMap.bgm,
                    onComplete: () => {
                        // 이전 화면으로 복귀
                        SceneManager.pop();
                    }
                });
            } else {
                // 폴백: 기존 로직 사용
                this._fallbackEndGame(isSuccess);
            }
        }

        _cleanupUI() {
            // 모든 노트 제거
            for (let note of this._notes) {
                if (note._sprite && note._sprite.parent) {
                    note._sprite.parent.removeChild(note._sprite);
                }
            }
            this._notes = [];

            // 판정 텍스트 제거 (GameResultManager가 있으면 자동으로 처리됨)
            if (!window.GameResultManager && this._currentJudgement && this._currentJudgement.parent) {
                this._sprites.removeChild(this._currentJudgement);
                this._currentJudgement = null;
            }

            // 점수 창 제거
            if (this._scoreWindow && this._scoreWindow.parent) {
                this._windowLayer.removeChild(this._scoreWindow);
                this._scoreWindow = null;
            }

            // 배경 제거
            if (this._background && this._background.parent) {
                this.removeChild(this._background);
                this._background = null;
            }

            // 스프라이트 제거
            if (this._sprites && this._sprites.parent) {
                this.removeChild(this._sprites);
                this._sprites = null;
            }
            
            // 배경 이미지 제거
            if (this._bgImage && this._bgImage.parent) {
                this.removeChild(this._bgImage);
                this._bgImage = null;
            }
        }

        _fallbackEndGame(isSuccess) {
            // 현재 BGM 중지
            AudioManager.stopBgm();
            
            // 결과에 따른 효과음 재생
            if (isSuccess) {
                AudioManager.playMe({ name: "Item", pan: 0, pitch: 100, volume: 90 });
            } else {
                AudioManager.playMe({ name: "Gag", pan: 0, pitch: 100, volume: 90 });
            }
            
            // 효과음 재생 후 맵 BGM 재생
            setTimeout(() => {
                if ($gameMap.bgm) {
                    AudioManager.playBgm($gameMap.bgm);
                }
            }, 1000);
            
            // 결과 창 표시
            const rect = new Rectangle(0, 0, 400, 300);
            rect.x = (Graphics.width - rect.width) / 2;
            rect.y = (Graphics.height - rect.height) / 2;
            const resultWindow = new Window_Base(rect);
            
            // 결과창 설정
            resultWindow.contents.fontSize = 72;
            resultWindow.contents.fontBold = true;
            resultWindow.contents.fontFace = 'CookieRun-Black';
            resultWindow.contents.textColor = isSuccess ? '#00ff00' : '#ff0000';
            resultWindow.contents.outlineColor = '#000000';
            resultWindow.contents.outlineWidth = 4;
            
            // 결과 텍스트 그리기
            const resultText = isSuccess ? "SUCCESS" : "FAILED";
            resultWindow.contents.drawText(resultText, 0, 0, 400, 300, 'center');
            
            // 배경 제거
            resultWindow.opacity = 0;
            
            // 결과 창을 최상위에 표시
            this._windowLayer.addChild(resultWindow);
            resultWindow.z = 999; // 최상위 z-index 설정

            // UI 정리
            this._cleanupUI();
            
            // 3초 후 이전 화면으로 복귀
            setTimeout(() => {
                SceneManager.pop();
            }, 3000);
        }

        update() {
            Scene_Base.prototype.update.call(this);
            
            if (!this._isPlaying) {
                if (!this.isStarted() && !this._gameEnded) {
                    this.start();
                }
                return;
            }

            this.updateNotes();
            this.checkInput();
            this.createNewNotes();
            this.checkGameEnd();
            
            // 맵 스프라이트 업데이트
            if (this._spriteset) {
                this._spriteset.update();
            }
        }

        terminate() {
            super.terminate();
            this._isPlaying = false;
            this._startTime = 0;
            this._gameEnded = true; // 게임 종료 플래그 설정
            
            // GameResultManager가 있으면 판정 텍스트 정리
            if (window.GameResultManager) {
                window.GameResultManager._removeCurrentJudgement();
            }
            
            // 배경 이미지 제거
            if (this._bgImage && this._bgImage.parent) {
                this.removeChild(this._bgImage);
                this._bgImage = null;
            }
            
            if (RhythmGameScreen.instance === this) {
                RhythmGameScreen.instance = null;
            }
        }
    }

    // 플러그인 커맨드 등록
    PluginManager.registerCommand(pluginName, "ClearNoteQueue", args => {
        noteQueue = [];
    });

    PluginManager.registerCommand(pluginName, "AddNoteToQueue", args => {
        const time = Number(args.time || 0);
        const startPosition = String(args.startPosition || "left");
        const y = Number(args.y || 312);
        const noteSpeed = Number(args.noteSpeed || 0); // 0이면 게임 기본 속도 사용
        
        if (!isNaN(time) && (startPosition === 'left' || startPosition === 'right') && !isNaN(y)) {
            const x = startPosition === 'left' ? settings.startXLeft : settings.startXRight;
            noteQueue.push({
                time: time,
                displayTime: time,
                x: x,
                y: y,
                startPosition: startPosition,
                noteSpeed: noteSpeed, // 개별 노트 속도 저장
                processed: false
            });
            // 시간순으로 정렬
            noteQueue.sort((a, b) => a.time - b.time);
        }
    });

    PluginManager.registerCommand(pluginName, "StartRhythmGame", args => {
        const bgmName = String(args.bgmName || "");
        const noteSpeed = Number(args.noteSpeed || 1000);
        const gameDuration = Number(args.gameDuration || 60000);
        const successScore = Number(args.successScore || 0);
        const successSwitchId = Number(args.successSwitchId || 0);

        // 게임 시작 시간 설정
        const gameStartTime = performance.now();
        $gameTemp.rhythmGameStartTime = gameStartTime;
        $gameTemp.rhythmGameDuration = gameDuration;
        $gameTemp.rhythmGameSuccessScore = successScore;
        $gameTemp.rhythmGameSuccessSwitchId = successSwitchId;
        $gameTemp.rhythmGameMaxScore = noteQueue.length * 300;
        $gameTemp.rhythmGameNoteSpeed = noteSpeed; // 기본 노트 속도 저장

        // 노트 큐 초기화 (기존 큐 사용)
        const initialNoteQueue = noteQueue.map(note => ({
            ...note,
            processed: false
        }));
        
        // 노트 큐 초기화
        noteQueue = initialNoteQueue;
        
        SceneManager.push(RhythmGameScreen);
        $gameTemp.rhythmGameBgm = bgmName;
    });

    PluginManager.registerCommand(pluginName, "AddNote", args => {
        const displayTime = Number(args.time);
        const startPosition = String(args.startPosition || "left");
        
        // 노트 큐에 추가
        addNoteToQueue(displayTime, startPosition);
    });

    PluginManager.registerCommand(pluginName, "SetNoteImage", args => {
        const imageName = String(args.imageName || "");
        const noteSize = Number(args.noteSize || defaultNoteSize);
        
        if (imageName) {
            // 이미지 로드
            const bitmap = ImageManager.loadPicture(imageName);
            bitmap.addLoadListener(() => {
                imageCache.noteImage = bitmap;
                imageCache.noteImageName = imageName;
                imageCache.noteSize = noteSize;
                settings.noteSize = noteSize;
            });
        } else {
            // 이미지 초기화
            imageCache.noteImage = null;
            imageCache.noteImageName = null;
            imageCache.noteSize = defaultNoteSize;
            settings.noteSize = defaultNoteSize;
        }
    });

})(); 