/*:
 * @target MZ
 * @plugindesc 제한시간 내 결정키를 정해진 횟수만큼 누르는 미니게임 플러그인
 * @author Claude
 * @help
 * 이 플러그인은 RPG Maker MZ에서 제한시간 내에 결정키를 정해진 횟수만큼 누르는 미니게임을 구현합니다.
 * 
 * 사용 방법:
 * 1. 이벤트에서 플러그인 커맨드 "StartBreakEvent"을 호출하여 게임을 시작합니다.
 * 2. 제한시간 내에 결정키(확인키)를 목표 횟수만큼 누르면 성공합니다.
 * 3. 성공/실패 여부는 지정된 스위치에 저장됩니다.
 * 
 * 디버깅:
 * - F12를 눌러 개발자 도구를 열고 콘솔 탭에서 디버깅 정보를 확인할 수 있습니다.
 * - 게임 시작, 키 입력, 성공/실패 판정 등의 정보가 콘솔에 출력됩니다.
 * 
 * @command StartBreakEvent
 * @text 미니게임 시작
 * @desc 제한시간 내 결정키 누르기 미니게임을 시작합니다.
 * 
 * @arg timeLimit
 * @text 제한시간 (밀리초)
 * @type number
 * @desc 게임 제한시간을 밀리초 단위로 입력하세요 (예: 5000 = 5초)
 * @default 5000
 * 
 * @arg targetCount
 * @text 목표 횟수
 * @type number
 * @desc 달성해야 할 결정키 누르기 횟수를 입력하세요
 * @default 10
 * 
 * @arg successSwitchId
 * @text 성공 여부 저장 스위치
 * @type switch
 * @desc 성공/실패 여부를 저장할 스위치 ID
 * @default 0
 * 
 * @arg bgmName
 * @text BGM 파일명
 * @type file
 * @dir audio/bgm/
 * @desc 게임에 사용할 BGM 파일을 선택하세요 (선택사항)
 * 
 * @arg seName
 * @text 효과음 파일명
 * @type file
 * @dir audio/se/
 * @desc 키를 눌렀을 때 재생할 효과음 파일을 선택하세요 (선택사항)
 */

(() => {
    'use strict';
    const pluginName = "BreakEvent";

    // 디버깅 로그 함수
    function debugLog(message, data = null) {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `[${pluginName}] [${timestamp}] ${message}`;
        
        if (data !== null) {
            console.log(logMessage, data);
        } else {
            console.log(logMessage);
        }
    }

    // 게임 설정
    const settings = {
        screenHeight: 624,     // 화면 높이 (RPG Maker MZ 기본값)
        screenWidth: 816,      // 화면 너비 (RPG Maker MZ 기본값)
        progressBarWidth: 400, // 프로그레스 바 너비
        progressBarHeight: 30, // 프로그레스 바 높이
        progressBarColor: '#00FF00', // 프로그레스 바 색상 (초록)
        progressBarBgColor: '#333333', // 프로그레스 바 배경 색상
        textColor: '#FFFFFF',  // 텍스트 색상
        textOutlineColor: '#000000', // 텍스트 아웃라인 색상
        textOutlineWidth: 4,   // 텍스트 아웃라인 두께
        animationDuration: 300 // 애니메이션 지속시간 (밀리초)
    };

    // 화면 크기가 변경될 때 settings 업데이트
    function updateSettings() {
        settings.screenHeight = Graphics.height;
        settings.screenWidth = Graphics.width;
        debugLog(`화면 크기 업데이트: ${settings.screenWidth}x${settings.screenHeight}`);
    }

    // 게임 상태
    let gameState = {
        isPlaying: false,
        currentCount: 0,
        targetCount: 0,
        timeLimit: 0,
        startTime: 0,
        successSwitchId: 0,
        bgmName: "",
        seName: ""
    };

    // 미니게임 스크린 클래스
    class BreakEventScreen extends Scene_Base {
        static instance = null;

        initialize() {
            super.initialize();
            debugLog("BreakEventScreen 초기화 시작");
            
            this._isPlaying = false;
            this._currentCount = 0;
            this._targetCount = 0;
            this._timeLimit = 0;
            this._startTime = 0;
            this._successSwitchId = 0;
            this._bgmName = "";
            this._seName = "";
            this._progressBar = null;
            this._countText = null;
            this._timeText = null;
            this._background = null;
            this._bgImage = null;
            this._sprites = new Sprite();
            this._originalMapBgm = null; // 원본 맵 BGM 저장용
            this._gameEnded = false; // 게임 종료 플래그 추가
            BreakEventScreen.instance = this;
            
            debugLog("BreakEventScreen 초기화 완료");
        }

        isStarted() {
            return this._isPlaying && this._startTime > 0;
        }

        start() {
            if (this.isStarted()) {
                debugLog("게임이 이미 시작되어 있음");
                return;
            }

            if (BreakEventScreen.instance !== this) {
                debugLog("인스턴스 불일치로 게임 시작 취소");
                return;
            }

            // settings 업데이트
            updateSettings();
            
            // 현재 맵 BGM 정보 저장
            this._originalMapBgm = $gameMap.bgm ? Object.assign({}, $gameMap.bgm) : null;
            debugLog("원본 맵 BGM 저장", this._originalMapBgm);
            
            this._isPlaying = true;
            this._currentCount = 0;
            this._targetCount = gameState.targetCount;
            this._timeLimit = gameState.timeLimit;
            this._startTime = performance.now();
            this._successSwitchId = gameState.successSwitchId;
            this._bgmName = gameState.bgmName;
            this._seName = gameState.seName;
            
            debugLog("게임 시작", {
                targetCount: this._targetCount,
                timeLimit: this._timeLimit,
                successSwitchId: this._successSwitchId,
                bgmName: this._bgmName,
                seName: this._seName
            });
            
            // 배경 음악 재생
            if (this._bgmName && this._bgmName.trim() !== "") {
                AudioManager.playBgm({
                    name: this._bgmName,
                    pan: 0,
                    pitch: 100,
                    volume: 90
                });
                debugLog(`BGM 재생: ${this._bgmName}`);
            } else {
                debugLog("BGM 파일이 설정되지 않아 배경음악 재생 안함");
            }

            // 맵 스프라이트 업데이트
            if (this._spriteset) {
                this._spriteset.update();
            }
        }

        create() {
            debugLog("화면 생성 시작");
            Scene_Base.prototype.create.call(this);
            this.createDisplayObjects();
            this.createBackground();
            this.createProgressBar();
            this.createTextElements();
            debugLog("화면 생성 완료");
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
            debugLog("배경 생성 시작");
            
            // 반투명 배경 (가장 위 레이어)
            this._background = new Sprite();
            this._background.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._background.bitmap.fillAll('rgba(0, 0, 0, 0.5)');
            this._background.z = 0;
            this.addChild(this._background);
            
            // 배경 이미지 (가장 아래 레이어)
            this._bgImage = new Sprite();
            this._bgImage.bitmap = ImageManager.loadPicture("쓰러진_나무");
            this._bgImage.x = 0;
            this._bgImage.y = 0;
            this._bgImage.z = 1;
            this.addChild(this._bgImage);
            
            // 게임 요소 레이어 (중간 레이어)
            this._sprites = new Sprite();
            this._sprites.z = 2;
            this.addChild(this._sprites);
            
            debugLog("배경 생성 완료");
        }

        createProgressBar() {
            debugLog("프로그레스 바 생성 시작");
            
            const barWidth = settings.progressBarWidth;
            const barHeight = settings.progressBarHeight;
            const x = (Graphics.width - barWidth) / 2;
            const y = Graphics.height / 2 - 50;

            // 프로그레스 바 배경 (연한 회색, 둥근 모서리)
            const bgBitmap = new Bitmap(barWidth, barHeight);
            const bgCtx = bgBitmap.context;
            bgCtx.save();
            this._drawRoundRect(bgCtx, 0, 0, barWidth, barHeight, barHeight / 2);
            bgCtx.fillStyle = '#f1f4f7';
            bgCtx.fill();
            bgCtx.restore();
            this._progressBarBg = new Sprite(bgBitmap);
            this._progressBarBg.x = x;
            this._progressBarBg.y = y;
            this._sprites.addChild(this._progressBarBg);

            // 진행 바 (초기값 0)
            this._progressBar = new Sprite(new Bitmap(barWidth, barHeight));
            this._progressBar.x = x;
            this._progressBar.y = y;
            this._sprites.addChild(this._progressBar);

            debugLog("프로그레스 바 생성 완료", {
                position: { x, y },
                size: { width: barWidth, height: barHeight }
            });
        }

        // 둥근 사각형 그리기 헬퍼
        _drawRoundRect(ctx, x, y, w, h, r) {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
        }

        // 진행도에 따라 색상 반환
        _progressColor(progress) {
            if (progress < 0.2) return '#3498ff'; // 파랑
            if (progress < 0.4) return '#2e8b57'; // 초록
            if (progress < 0.6) return '#2edcff'; // 하늘
            if (progress < 0.8) return '#ffd43b'; // 노랑
            return '#e74c3c'; // 빨강
        }

        // 사선 패턴 그리기 (바의 높이에 맞게)
        _drawStripePattern(ctx, color, w, h) {
            const patternCanvas = document.createElement('canvas');
            patternCanvas.width = h * 2; // 사선 반복 간격
            patternCanvas.height = h;
            const pctx = patternCanvas.getContext('2d');
            pctx.fillStyle = color;
            pctx.globalAlpha = 0.3;
            pctx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
            pctx.globalAlpha = 0.5;
            pctx.strokeStyle = '#fff';
            pctx.lineWidth = h / 3;
            // 사선 그리기
            for (let i = -patternCanvas.width; i < patternCanvas.width; i += h) {
                pctx.beginPath();
                pctx.moveTo(i, h);
                pctx.lineTo(i + h, 0);
                pctx.stroke();
            }
            const pattern = ctx.createPattern(patternCanvas, 'repeat');
            ctx.fillStyle = pattern;
        }

        updateProgressBar() {
            if (!this._progressBar) return;

            const progress = Math.max(0, Math.min(1, this._currentCount / this._targetCount));
            const barWidth = settings.progressBarWidth;
            const barHeight = settings.progressBarHeight;
            const radius = barHeight / 2;
            const fillWidth = Math.round(barWidth * progress);
            const color = this._progressColor(progress);

            // 새로운 프로그레스 바 비트맵 생성
            const progressBitmap = new Bitmap(barWidth, barHeight);
            const ctx = progressBitmap.context;
            ctx.save();
            // 진행 영역
            this._drawRoundRect(ctx, 0, 0, barWidth, barHeight, radius);
            ctx.clip();
            if (fillWidth > 0) {
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, fillWidth, barHeight);
                // 사선 패턴
                this._drawStripePattern(ctx, color, fillWidth, barHeight);
                ctx.globalAlpha = 0.7;
                ctx.fillRect(0, 0, fillWidth, barHeight);
            }
            ctx.restore();

            // 기존 스프라이트 교체
            this._sprites.removeChild(this._progressBar);
            this._progressBar = new Sprite(progressBitmap);
            this._progressBar.x = (Graphics.width - barWidth) / 2;
            this._progressBar.y = Graphics.height / 2 - 50;
            this._sprites.addChild(this._progressBar);
        }

        createTextElements() {
            debugLog("텍스트 요소 생성 시작");
            
            // 시간 텍스트
            const timeBitmap = new Bitmap(400, 60);
            const timeCtx = timeBitmap.context;
            timeCtx.font = 'bold 36px CookieRun-Black';
            timeCtx.textAlign = 'center';
            timeCtx.textBaseline = 'middle';
            timeCtx.fillStyle = settings.textColor;
            timeCtx.strokeStyle = settings.textOutlineColor;
            timeCtx.lineWidth = settings.textOutlineWidth;
            const remainingTime = Math.max(0, Math.ceil((this._timeLimit - (performance.now() - this._startTime)) / 1000));
            timeCtx.strokeText(`남은 시간: ${remainingTime}초`, 200, 30);
            timeCtx.fillText(`남은 시간: ${remainingTime}초`, 200, 30);
            
            this._timeText = new Sprite(timeBitmap);
            this._timeText.x = (Graphics.width - 400) / 2;
            this._timeText.y = Graphics.height / 2 - 150;
            this._sprites.addChild(this._timeText);
            
            debugLog("텍스트 요소 생성 완료");
        }

        updateTimeText() {
            if (!this._timeText) return;

            const remainingTime = Math.max(0, Math.ceil((this._timeLimit - (performance.now() - this._startTime)) / 1000));
            
            const timeBitmap = new Bitmap(400, 60);
            const timeCtx = timeBitmap.context;
            timeCtx.font = 'bold 36px CookieRun-Black';
            timeCtx.textAlign = 'center';
            timeCtx.textBaseline = 'middle';
            timeCtx.fillStyle = settings.textColor;
            timeCtx.strokeStyle = settings.textOutlineColor;
            timeCtx.lineWidth = settings.textOutlineWidth;
            timeCtx.strokeText(`남은 시간: ${remainingTime}초`, 200, 30);
            timeCtx.fillText(`남은 시간: ${remainingTime}초`, 200, 30);
            
            this._sprites.removeChild(this._timeText);
            this._timeText = new Sprite(timeBitmap);
            this._timeText.x = (Graphics.width - 400) / 2;
            this._timeText.y = Graphics.height / 2 - 150;
            this._sprites.addChild(this._timeText);
        }

        checkInput() {
            if (this._isPlaying && Input.isTriggered('ok') && !window.GameResultManager?.isResultDisplaying()) {
                this.handleKeyPress();
            }
        }

        handleKeyPress() {
            if (!this._isPlaying) {
                debugLog("게임이 진행 중이 아니므로 키 입력 무시");
                return;
            }

            this._currentCount++;
            
            debugLog("키 입력 감지", {
                currentCount: this._currentCount,
                targetCount: this._targetCount,
                remainingTime: Math.ceil((this._timeLimit - (performance.now() - this._startTime)) / 1000)
            });
            
            // 효과음 재생
            if (this._seName) {
                AudioManager.playSe({ name: this._seName, pan: 0, pitch: 100, volume: 90 });
                debugLog(`효과음 재생: ${this._seName}`);
            } else {
                AudioManager.playSe({ name: "Item", pan: 0, pitch: 100, volume: 90 });
                debugLog("기본 효과음 재생: Item");
            }

            // UI 업데이트
            this.updateProgressBar();

            // 목표 달성 확인
            if (this._currentCount >= this._targetCount) {
                debugLog("목표 횟수 달성! 게임 성공");
                this.endGame(true);
            }
        }

        checkGameEnd() {
            if (!this._isPlaying) return;

            const timeElapsed = performance.now() - this._startTime;
            if (timeElapsed >= this._timeLimit) {
                debugLog("제한시간 초과! 게임 실패", {
                    timeElapsed: Math.ceil(timeElapsed / 1000),
                    timeLimit: Math.ceil(this._timeLimit / 1000)
                });
                this.endGame(false);
            }
        }

        endGame(isSuccess) {
            debugLog("게임 종료", {
                isSuccess: isSuccess,
                finalCount: this._currentCount,
                targetCount: this._targetCount,
                timeElapsed: Math.ceil((performance.now() - this._startTime) / 1000)
            });
            
            this._isPlaying = false;
            this._gameEnded = true; // 게임 종료 플래그 설정
            
            // 성공 여부를 스위치에 저장
            if (this._successSwitchId > 0) {
                $gameSwitches.setValue(this._successSwitchId, isSuccess);
                debugLog(`스위치 ${this._successSwitchId}에 결과 저장`, { value: isSuccess });
            } else {
                debugLog("스위치 ID가 설정되지 않아 결과 저장 안함");
            }
            
            // UI 정리 (showResult 전에 실행)
            this._cleanupUI();
            
            // 통합 결과 관리자 사용
            if (window.GameResultManager) {
                window.GameResultManager.showResult(isSuccess, {
                    restoreBgm: this._originalMapBgm,
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
            // UI 요소들 제거
            if (this._progressBar && this._progressBar.parent) {
                this._sprites.removeChild(this._progressBar);
                this._progressBar = null;
            }
            if (this._progressBarBg && this._progressBarBg.parent) {
                this._sprites.removeChild(this._progressBarBg);
                this._progressBarBg = null;
            }
            if (this._timeText && this._timeText.parent) {
                this._sprites.removeChild(this._timeText);
                this._timeText = null;
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
            
            debugLog("UI 요소 정리 완료");
        }

        _fallbackEndGame(isSuccess) {
            // 현재 BGM 중지
            AudioManager.stopBgm();
            debugLog("BGM 중지");
            
            // 결과에 따른 효과음 재생
            if (isSuccess) {
                AudioManager.playMe({ name: "Item", pan: 0, pitch: 100, volume: 90 });
                debugLog("성공 효과음 재생: Item");
            } else {
                AudioManager.playMe({ name: "Gag", pan: 0, pitch: 100, volume: 90 });
                debugLog("실패 효과음 재생: Gag");
            }
            
            // 효과음 재생 후 맵 BGM 복원
            setTimeout(() => {
                if (this._originalMapBgm) {
                    AudioManager.playBgm(this._originalMapBgm);
                    debugLog("원본 맵 BGM 복원", this._originalMapBgm);
                } else {
                    debugLog("저장된 맵 BGM이 없어 BGM 복원 안함");
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

            debugLog("결과 창 표시", { resultText: resultText });

            // UI 정리
            this._cleanupUI();
            
            // 3초 후 이전 화면으로 복귀
            setTimeout(() => {
                debugLog("이전 화면으로 복귀");
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

            this.checkInput();
            this.checkGameEnd();
            this.updateTimeText();
            
            // 맵 스프라이트 업데이트
            if (this._spriteset) {
                this._spriteset.update();
            }
        }

        terminate() {
            debugLog("화면 종료");
            super.terminate();
            this._isPlaying = false;
            this._startTime = 0;
            this._gameEnded = true; // 게임 종료 플래그 설정
            
            // 맵 BGM 복원 (안전장치)
            if (this._originalMapBgm && !AudioManager.isBgmPlaying()) {
                AudioManager.playBgm(this._originalMapBgm);
                debugLog("terminate에서 맵 BGM 복원", this._originalMapBgm);
            }
            
            // 배경 이미지 제거
            if (this._bgImage && this._bgImage.parent) {
                this.removeChild(this._bgImage);
                this._bgImage = null;
            }
            
            if (BreakEventScreen.instance === this) {
                BreakEventScreen.instance = null;
                debugLog("인스턴스 정리 완료");
            }
        }
    }

    // 플러그인 커맨드 등록
    PluginManager.registerCommand(pluginName, "StartBreakEvent", args => {
        const timeLimit = Number(args.timeLimit || 5000);
        const targetCount = Number(args.targetCount || 10);
        const successSwitchId = Number(args.successSwitchId || 0);
        const bgmName = String(args.bgmName || "");
        const seName = String(args.seName || "");

        debugLog("플러그인 커맨드 실행", {
            timeLimit: timeLimit,
            targetCount: targetCount,
            successSwitchId: successSwitchId,
            bgmName: bgmName,
            seName: seName
        });

        // 게임 상태 설정
        gameState.timeLimit = timeLimit;
        gameState.targetCount = targetCount;
        gameState.successSwitchId = successSwitchId;
        gameState.bgmName = bgmName;
        gameState.seName = seName;
        
        debugLog("게임 상태 설정 완료", gameState);
        
        SceneManager.push(BreakEventScreen);
        debugLog("BreakEventScreen으로 화면 전환");
    });

    debugLog("BreakEvent 플러그인 로드 완료");

})();