/*:
 * @target MZ
 * @plugindesc 타이밍 게임 플러그인
 * @author Claude
 * @help
 * 이 플러그인은 RPG Maker MZ에서 타이밍 게임을 구현합니다.
 * 
 * 사용 방법:
 * 1. 이벤트에서 플러그인 커맨드 "StartTimingGame"을 호출하여 게임을 시작합니다.
 * 2. 화면 중앙에 왕복하는 바가 나타나며, 과녁에 맞춰 확인 키를 누르면 점수를 얻습니다.
 * 
 * 게임 설정:
 * 1. 바의 이동 속도는 초당 200px가 기본값입니다.
 * 2. 과녁은 화면 중앙에 위치하며, 바와의 거리에 따라 점수가 결정됩니다.
 * 3. 10px 이내: 100점 (Perfect)
 * 4. 50px 이내: 50점 (Good)
 * 5. 50px 이상: 10점 (Bad)
 * 
 * @command StartTimingGame
 * @text 타이밍 게임 시작
 * @desc 타이밍 게임을 시작합니다.
 * 
 * @arg barSpeeds
 * @text 바 이동 속도 배열
 * @type string
 * @desc 바의 이동 속도를 배열로 입력 (예: [200,300,400])
 * @default [200]
 * 
 * @arg successScore
 * @text 성공 판정 점수
 * @type number
 * @desc 이 점수를 넘으면 성공으로 판정됩니다
 * @default 100
 * 
 * @arg successSwitchId
 * @text 성공 여부 저장 스위치
 * @type switch
 * @desc 성공/실패 여부를 저장할 스위치 ID
 * @default 0
 */

(() => {
    'use strict';
    const pluginName = "timingGame";

    // 게임 설정
    const settings = {
        barWidth: 15,           // 바의 너비
        barHeight: 30,          // 바의 높이
        targetWidth: 10,        // 과녁의 너비
        targetHeight: 30,      // 과녁의 높이
        playAreaWidth: 600,    // 왕복 공간의 너비
        screenHeight: 624,     // 화면 높이
        screenWidth: 816,      // 화면 너비
        targetX: 408,          // 과녁 X 좌표 (화면 중앙)
        targetY: 312,          // 과녁 Y 좌표 (화면 중앙)
        // 판정별 색상 설정
        judgementColors: {
            perfect: '#FFD700',  // 골드
            good: '#00FF00',    // 그린
            bad: '#FF0000'      // 레드
        }
    };

    // 게임 상태
    let gameState = {
        isPlaying: false,
        score: 0,
        currentBarSpeed: 0,
        barSpeeds: [],
        currentSpeedIndex: 0,
        barX: 0,
        barDirection: 1,  // 1: 오른쪽, -1: 왼쪽
        remainingAttempts: 0
    };

    // 게임 스크린 클래스
    class TimingGameScreen extends Scene_Base {
        static instance = null;

        initialize() {
            super.initialize();
            this._sprites = new Sprite();
            this._barSprite = null;
            this._isPlaying = false;
            this._startTime = 0;
            TimingGameScreen.instance = this;
        }

        create() {
            // 화면 중앙 기준 갱신 (항상 최신 Graphics.width/height 사용)
            settings.targetX = Graphics.width / 2;
            settings.targetY = Graphics.height / 2;
            super.create();
            this.createBackground();

            // 나무 판자 이미지 추가 (배경 위, 게임 오브젝트 아래)
            const plankImg = ImageManager.loadPicture('나무 판자');
            this._plankSprite = new Sprite(plankImg);
            this._plankSprite.anchor.x = 0.5;
            this._plankSprite.anchor.y = 0.5;
            this._plankSprite.x = Graphics.width / 2;
            this._plankSprite.y = Graphics.height / 2;
            this._plankSprite.z = 2;
            this.addChild(this._plankSprite);
            plankImg.addLoadListener(() => {
                // 화면 너비에 맞게 스케일 조정 (세로는 비율 유지)
                this._plankSprite.scale.x = Graphics.width / plankImg.width;
                this._plankSprite.scale.y = this._plankSprite.scale.x;
            });

            this.createDisplayObjects();
            this.createPlayArea();
            this.createBar();
            this.createScoreWindow();
            
            // 게임 시작
            this._isPlaying = true;
            this._startTime = performance.now();
        }

        createBackground() {
            // 맵 배경
            this._spriteset = new Spriteset_Map();
            this.addChild(this._spriteset);
            // 반투명 오버레이
            this._background = new Sprite();
            this._background.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._background.bitmap.fillAll('rgba(0, 0, 0, 0.5)');
            this.addChild(this._background);
        }

        createDisplayObjects() {
            // 윈도우 레이어 먼저!
            this._windowLayer = new WindowLayer();
            this.addChild(this._windowLayer);
            // 게임 오브젝트 스프라이트
            this._sprites = new Sprite();
            this.addChild(this._sprites);
        }

        createPlayArea() {
            const bitmap = new Bitmap(settings.playAreaWidth, settings.barHeight);
            // bitmap.fillAll('rgba(255,255,0,1)'); // 투명도 1
            this._playAreaSprite = new Sprite(bitmap);
            this._playAreaSprite.x = settings.targetX - settings.playAreaWidth / 2;
            this._playAreaSprite.y = settings.targetY - settings.barHeight / 2;
            this._sprites.addChild(this._playAreaSprite);
        }



        createBar() {
            // 바 스프라이트 생성
            const bitmap = new Bitmap(settings.barWidth, settings.barHeight);
            // bitmap.fillAll('#FF0000');
            this._barSprite = new Sprite(bitmap);
            // 바의 초기 위치를 플레이 영역 내 랜덤으로 지정
            const leftBound = settings.targetX - settings.playAreaWidth / 2;
            const rightBound = settings.targetX + settings.playAreaWidth / 2 - settings.barWidth;
            const randomX = leftBound + Math.random() * (rightBound - leftBound);
            this._barSprite.x = randomX;
            this._barSprite.y = settings.targetY - settings.barHeight / 2;
            this._sprites.addChild(this._barSprite);

            // 바 아래에 이미지 스프라이트 추가 (로드 후 스케일 적용, anchor 적용)
            const img = ImageManager.loadPicture('24795811');
            this._barImageSprite = new Sprite(img);
            this._barImageSprite.x = this._barSprite.x + settings.barWidth / 2;
            this._barImageSprite.y = this._barSprite.y + settings.barHeight;
            this._barImageSprite.visible = false;
            this._barImageSprite.anchor.x = 0.5;
            this._barImageSprite.anchor.y = 0.5;
            this._sprites.addChild(this._barImageSprite);
            img.addLoadListener(() => {
                this._barImageSprite.scale.x = 100 / img.width;
                this._barImageSprite.scale.y = 100 / img.height;
                this._barImageSprite.visible = true;
            });
        }

        createScoreWindow() {
            // 개발(테스트) 모드에서만 점수 윈도우 표시
            if (Utils.isOptionValid('test')) {
                const rect = new Rectangle(0, 0, 200, 70);
                this._scoreWindow = new Window_Base(rect);
                this._scoreWindow.x = 0;
                this._scoreWindow.y = 0;
                this._scoreWindow.contents.fontSize = 28;
                this._scoreWindow.contents.fontBold = true;
                this._scoreWindow.contents.fontFace = $gameSystem.mainFontFace();
                this._scoreWindow.contents.textColor = '#ffffff';
                this._scoreWindow.contents.outlineColor = '#000000';
                this._scoreWindow.contents.outlineWidth = 4;
                this._scoreWindow.contents.drawText("Score: 0", 0, 0, 140, 48, 'center');
                this._windowLayer.addChild(this._scoreWindow);
            } else {
                this._scoreWindow = null;
            }
        }

        update() {
            super.update();
            if (!this._isPlaying) {
                return;
            }

            this.updateBar();
            this.checkInput();
            this.checkGameEnd();
            this.updateScoreWindow();
        }

        updateBar() {
            if (!this._barSprite) {
                return;
            }

            // 바 위치 업데이트
            const speed = gameState.currentBarSpeed; // px/sec
            const deltaSec = Graphics._deltaTime || (1/60); // 프레임당 초
            const deltaX = speed * deltaSec * gameState.barDirection;
            let newX = this._barSprite.x + deltaX;
            
            // 왕복 공간 경계 체크
            const leftBound = settings.targetX - settings.playAreaWidth / 2;
            const rightBound = settings.targetX + settings.playAreaWidth / 2;
            
            if (newX <= leftBound || newX >= rightBound) {
                gameState.barDirection *= -1;
                newX = Math.max(leftBound, Math.min(rightBound, newX));
            }
            
            this._barSprite.x = newX;
            // 이미지 스프라이트도 x좌표를 바와 동일하게 이동 (중앙 정렬)
            if (this._barImageSprite) {
                this._barImageSprite.x = newX + settings.barWidth / 2;
            }
        }

        checkInput() {
            if (this._isPlaying && Input.isTriggered('ok') && !window.GameResultManager?.isResultDisplaying()) {
                this.checkHit();
            }
        }

        checkHit() {
            let judgement, score;
            const barCenterX = this._barSprite.x + settings.barWidth / 2;
            const distance = Math.abs(barCenterX - settings.targetX);
            if (distance <= 20) {
                judgement = "PERFECT";
                score = 100;
            } else if (distance <= 100) {
                judgement = "GOOD";
                score = 50;
            } else {
                judgement = "BAD";
                score = 10;
            }

            // MISS 판정: 마지막 시도에서 BAD가 나온 경우
            let isMiss = (gameState.remainingAttempts === 1 && judgement === "BAD");
            let hammerPitch = 50;
            if (judgement === "GOOD") {
                hammerPitch = 70;
            } else if (isMiss) {
                hammerPitch = 100;
            }
            AudioManager.playSe({ name: 'Hammer', pan: 0, pitch: hammerPitch, volume: 90 });

            this.showJudgement(judgement, score);
            gameState.score += score;
            gameState.remainingAttempts--;

            // 이동영역, 바 모두 숨기기
            if (this._playAreaSprite) this._playAreaSprite.visible = false;
            if (this._barSprite) this._barSprite.visible = false;
            if (this._barImageSprite) this._barImageSprite.visible = false;

            // 다음 속도로 변경 및 2초 후 이동영역, 과녁, 바 다시 그리기
            if (gameState.remainingAttempts > 0) {
                setTimeout(() => {
                    // 기존 스프라이트 제거
                    if (this._playAreaSprite && this._sprites) this._sprites.removeChild(this._playAreaSprite);
                    if (this._barSprite && this._sprites) this._sprites.removeChild(this._barSprite);
                    if (this._barImageSprite && this._sprites) this._sprites.removeChild(this._barImageSprite);
                    // 새로 생성
                    this.createPlayArea();
                    this.createBar();
                }, 2000);
                gameState.currentSpeedIndex++;
                gameState.currentBarSpeed = gameState.barSpeeds[gameState.currentSpeedIndex];
            }
        }

        showJudgement(text, score) {
            // GameResultManager를 사용하여 판정 이미지 표시
            if (window.GameResultManager) {
                window.GameResultManager.showJudgement(text, settings.targetX, settings.targetY, this);
            } else {
                // 폴백: 기존 텍스트 방식 사용
                const bitmap = new Bitmap(350, 120);
                const ctx = bitmap.context;
                ctx.font = `bold 54px ${$gameSystem.mainFontFace()}`;
                ctx.textAlign = 'center';
                ctx.lineWidth = 3;
                ctx.strokeStyle = "#000000";
                ctx.strokeText(text, 175, 60);
                ctx.fillStyle = settings.judgementColors[text.toLowerCase()];
                ctx.fillText(text, 175, 60);
                const sprite = new Sprite(bitmap);
                sprite.x = settings.targetX - 175;
                sprite.y = settings.targetY - 60; // 중앙 정렬
                this.addChild(sprite);
                // 1초 후 제거
                setTimeout(() => {
                    this.removeChild(sprite);
                }, 1000);
            }
        }

        checkGameEnd() {
            if (gameState.remainingAttempts <= 0) {
                this.endGame();
            }
        }

        endGame() {
            this._isPlaying = false;
            
            // 성공 여부 확인 및 스위치 설정
            const isSuccess = gameState.score >= $gameTemp.timingGameSuccessScore;
            if ($gameTemp.timingGameSuccessSwitchId > 0) {
                $gameSwitches.setValue($gameTemp.timingGameSuccessSwitchId, isSuccess);
            }

            // UI 정리 (showResult 전에 실행)
            this._cleanupUI();
            
            // GameResultManager를 사용하여 결과 표시
            if (window.GameResultManager) {
                window.GameResultManager.showResult(isSuccess, {
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
            // 배경을 제외한 모든 스프라이트 삭제
            this.children.slice().forEach(child => {
                // 배경 스프라이트는 this._spriteset, this._background로 관리됨
                if (child !== this._spriteset && child !== this._background && child !== this._windowLayer) {
                    this.removeChild(child);
                }
            });
            if (this._sprites) {
                this._sprites.removeChildren(); // 내부 오브젝트도 모두 제거
            }
        }

        _fallbackEndGame(isSuccess) {
            // GameResultManager를 사용하여 결과 표시
            if (window.GameResultManager) {
                window.GameResultManager.showResult(isSuccess, {
                    onComplete: () => {
                        // 이전 화면으로 복귀
                        SceneManager.pop();
                    }
                });
            } else {
                // 폴백: 기존 로직 사용
                // 성공/실패 효과음 재생
                if (isSuccess) {
                    AudioManager.playMe({ name: "Item", pan: 0, pitch: 100, volume: 90 });
                } else {
                    AudioManager.playMe({ name: "Gag", pan: 0, pitch: 100, volume: 90 });
                }

                // 1초 후 결과 창 표시
                setTimeout(() => {
                    this._cleanupUI();
                    this.showResultWindow(isSuccess);
                    // 2초 후 이전 화면으로 복귀
                    setTimeout(() => {
                        SceneManager.pop();
                    }, 2000);
                }, 1000);
            }
        }

        updateScoreWindow() {
            if (this._scoreWindow && this._scoreWindow.contents) {
                this._scoreWindow.contents.clear();
                this._scoreWindow.contents.drawText(`Score: ${gameState.score}`, 0, 0, 140, 48, 'center');
            }
        }

        showResultWindow(isSuccess) {
            // 결과 창 생성
            const rect = new Rectangle(0, 0, 400, 300);
            rect.x = (Graphics.width - rect.width) / 2;
            rect.y = (Graphics.height - rect.height) / 2;
            const resultWindow = new Window_Base(rect);
            
            // 결과창 설정
            resultWindow.contents.fontSize = 72;
            resultWindow.contents.fontBold = true;
            resultWindow.contents.fontFace = $gameSystem.mainFontFace();
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
            resultWindow.z = 999;
        }

        terminate() {
            super.terminate();
            this._isPlaying = false;
            this._startTime = 0;
            
            // GameResultManager가 있으면 판정 텍스트 정리
            if (window.GameResultManager) {
                window.GameResultManager._removeCurrentJudgement();
            }
            
            if (TimingGameScreen.instance === this) {
                TimingGameScreen.instance = null;
            }
        }
    }

    // 플러그인 커맨드 등록
    PluginManager.registerCommand(pluginName, "StartTimingGame", args => {
        const barSpeeds = JSON.parse(args.barSpeeds || "[200]");
        const successScore = Number(args.successScore || 100);
        const successSwitchId = Number(args.successSwitchId || 0);
        
        // 게임 상태 초기화
        gameState = {
            isPlaying: true,
            score: 0,
            barSpeeds: barSpeeds,
            currentSpeedIndex: 0,
            currentBarSpeed: barSpeeds[0],
            barX: settings.targetX - settings.playAreaWidth / 2,
            barDirection: 1,
            remainingAttempts: barSpeeds.length
        };
        
        // 게임 변수 설정
        $gameTemp.timingGameSuccessScore = successScore;
        $gameTemp.timingGameSuccessSwitchId = successSwitchId;
        
        SceneManager.push(TimingGameScreen);
    });

})();
