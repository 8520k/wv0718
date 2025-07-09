/*:
 * @target MZ
 * @plugindesc 화면 상단에 타이머를 표시하고 시간이 0이 되면 스크립트를 실행하는 플러그인
 * @author Your Name
 *
 * @param timerHoursVar
 * @text 타이머 시간 변수
 * @type variable
 * @desc 타이머의 시간(시)을 저장할 변수 번호
 * @default 1
 *
 * @param timerMinutesVar
 * @text 타이머 분 변수
 * @type variable
 * @desc 타이머의 분을 저장할 변수 번호
 * @default 2
 *
 * @param timerSecondsVar
 * @text 타이머 초 변수
 * @type variable
 * @desc 타이머의 초를 저장할 변수 번호
 * @default 3
 *
 * @param timerRunningVar
 * @text 타이머 실행 상태 변수
 * @type variable
 * @desc 타이머 실행 상태를 저장할 변수 번호 (0: 정지, 1: 실행, 2: 일시정지)
 * @default 4
 *
 * @param timerScriptVar
 * @text 타이머 스크립트 변수
 * @type variable
 * @desc 타이머 스크립트를 저장할 변수 번호
 * @default 5
 *
 * @command start
 * @text 타이머 시작
 * @desc 타이머를 시작합니다.
 *
 * @arg seconds
 * @type number
 * @text 시간(초)
 * @desc 타이머의 시간을 초 단위로 설정합니다.
 * @default 60
 *
 * @arg script
 * @type note
 * @text 실행할 스크립트
 * @desc 타이머가 0이 되었을 때 실행할 스크립트를 입력하세요.
 * @default ""
 *
 * @command stop
 * @text 타이머 중지
 * @desc 타이머를 중지합니다.
 *
 * @command pause
 * @text 타이머 일시정지
 * @desc 타이머를 일시정지합니다.
 *
 * @command resume
 * @text 타이머 재개
 * @desc 일시정지된 타이머를 재개합니다.
 *
 * @command cancelScript
 * @text 스크립트 실행 취소
 * @desc 타이머가 0이 되었을 때 실행될 스크립트를 취소합니다.
 *
 * @command delete
 * @text 타이머 삭제
 * @desc 타이머를 완전히 삭제하고 모든 데이터를 초기화합니다.
 *
 * @help
 * RPG Maker MZ용 타이머 시스템 플러그인
 * 
 * 플러그인 커맨드:
 * 1. 타이머 시작: 지정된 시간(초)과 스크립트로 타이머를 시작합니다.
 * 2. 타이머 중지: 실행 중인 타이머를 중지합니다.
 * 3. 타이머 일시정지: 타이머를 일시정지합니다.
 * 4. 타이머 재개: 일시정지된 타이머를 재개합니다.
 * 5. 스크립트 실행 취소: 타이머가 0이 되었을 때 실행될 스크립트를 취소합니다.
 * 6. 타이머 삭제: 타이머를 완전히 삭제하고 모든 데이터를 초기화합니다.
 * 
 * 타이머 상태는 게임 변수에 자동으로 저장되어 세이브/로드 시 복원됩니다.
 */

(() => {
    'use strict';
    
    const pluginName = "TimerSystem";
    const parameters = PluginManager.parameters(pluginName);
    
    // 플러그인 파라미터
    const TIMER_HOURS_VAR = Number(parameters.timerHoursVar || 1);
    const TIMER_MINUTES_VAR = Number(parameters.timerMinutesVar || 2);
    const TIMER_SECONDS_VAR = Number(parameters.timerSecondsVar || 3);
    const TIMER_RUNNING_VAR = Number(parameters.timerRunningVar || 4);
    const TIMER_SCRIPT_VAR = Number(parameters.timerScriptVar || 5);

    // 예약된 공통 이벤트 처리를 위한 확장
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._reservedTimerCommonEvent = null;
    };

    Game_Temp.prototype.reserveTimerCommonEvent = function(script) {
        const list = [
            { code: 355, parameters: [script] }
        ];
        
        // 여러 줄의 스크립트 처리
        const extraLines = script.split('\n').slice(1);
        for (const line of extraLines) {
            if (line.trim() !== '') {
                list.push({ code: 655, parameters: [line] });
            }
        }
        
        this._reservedTimerCommonEvent = list;
    };

    Game_Temp.prototype.clearTimerCommonEvent = function() {
        this._reservedTimerCommonEvent = null;
    };

    // 타이머 관리 객체
    const Timer = {
        time: 0,
        script: '',
        isRunning: false,
        isPaused: false,
        
        start(seconds, script) {
            this.time = seconds;
            this.script = script;
            this.isRunning = true;
            this.isPaused = false;
            this.saveToVariables();
        },
        
        stop() {
            this.time = 0;
            this.script = '';
            this.isRunning = false;
            this.isPaused = false;
            this.saveToVariables();
        },
        
        pause() {
            if (this.isRunning) {
                this.isPaused = true;
                this.saveToVariables();
            }
        },
        
        resume() {
            if (this.isRunning) {
                this.isPaused = false;
                this.saveToVariables();
            }
        },
        
        cancelScript() {
            this.script = '';
            this.saveToVariables();
        },
        
        delete() {
            this.time = 0;
            this.script = '';
            this.isRunning = false;
            this.isPaused = false;
            this.saveToVariables();
            // 변수들을 완전히 초기화
            $gameVariables.setValue(TIMER_HOURS_VAR, 0);
            $gameVariables.setValue(TIMER_MINUTES_VAR, 0);
            $gameVariables.setValue(TIMER_SECONDS_VAR, 0);
            $gameVariables.setValue(TIMER_RUNNING_VAR, 0);
            $gameVariables.setValue(TIMER_SCRIPT_VAR, '');
        },
        
        update() {
            if (this.isRunning && !this.isPaused) {
                if (this.time > 0) {
                    this.time -= 1/60;
                    if (this.time <= 0) {
                        this.time = 0;
                        if (this.script) {
                            try {
                                $gameTemp.reserveTimerCommonEvent(this.script);
                            } catch (e) {
                                console.error('Timer script execution error:', e);
                            }
                        }
                        this.stop();
                    }
                    // 매 프레임마다 변수에 저장 (성능 최적화를 위해 필요시에만)
                    if (Math.floor(this.time) % 60 === 0) {
                        this.saveToVariables();
                    }
                }
            }
        },
        
        formatTime() {
            const totalSeconds = Math.ceil(this.time);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        },
        
        // 타이머 상태를 변수에 저장
        saveToVariables() {
            const totalSeconds = Math.ceil(this.time);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            $gameVariables.setValue(TIMER_HOURS_VAR, hours);
            $gameVariables.setValue(TIMER_MINUTES_VAR, minutes);
            $gameVariables.setValue(TIMER_SECONDS_VAR, seconds);
            
            // 실행 상태 저장 (0: 정지, 1: 실행, 2: 일시정지)
            let runningState = 0;
            if (this.isRunning) {
                runningState = this.isPaused ? 2 : 1;
            }
            $gameVariables.setValue(TIMER_RUNNING_VAR, runningState);
            
            // 스크립트 저장
            $gameVariables.setValue(TIMER_SCRIPT_VAR, this.script);
        },
        
        // 변수에서 타이머 상태 복원
        loadFromVariables() {
            const hours = $gameVariables.value(TIMER_HOURS_VAR) || 0;
            const minutes = $gameVariables.value(TIMER_MINUTES_VAR) || 0;
            const seconds = $gameVariables.value(TIMER_SECONDS_VAR) || 0;
            const runningState = $gameVariables.value(TIMER_RUNNING_VAR) || 0;
            const script = $gameVariables.value(TIMER_SCRIPT_VAR) || '';
            
            // 총 시간을 초 단위로 계산
            this.time = hours * 3600 + minutes * 60 + seconds;
            this.script = script;
            
            // 실행 상태 복원
            switch (runningState) {
                case 1: // 실행 중
                    this.isRunning = true;
                    this.isPaused = false;
                    break;
                case 2: // 일시정지
                    this.isRunning = true;
                    this.isPaused = true;
                    break;
                default: // 정지
                    this.isRunning = false;
                    this.isPaused = false;
                    break;
            }
        }
    };

    // Timer 객체를 전역에서 접근할 수 있도록 등록
    window.Timer = Timer;

    // 스크립트에서 사용할 수 있는 전역 함수들
    window.TimerStart = function(seconds, script) {
        Timer.start(seconds, script);
    };

    window.TimerStop = function() {
        Timer.stop();
    };

    window.TimerPause = function() {
        Timer.pause();
    };

    window.TimerResume = function() {
        Timer.resume();
    };

    window.TimerCancelScript = function() {
        Timer.cancelScript();
    };

    window.TimerDelete = function() {
        Timer.delete();
    };

    window.TimerGetTime = function() {
        return Timer.time;
    };

    window.TimerIsRunning = function() {
        return Timer.isRunning;
    };

    window.TimerIsPaused = function() {
        return Timer.isPaused;
    };

    // Scene_Map 확장
    const _Scene_Map_updateMain = Scene_Map.prototype.updateMain;
    Scene_Map.prototype.updateMain = function() {
        _Scene_Map_updateMain.call(this);
        this.updateTimerEvent();
    };

    Scene_Map.prototype.updateTimerEvent = function() {
        if ($gameTemp._reservedTimerCommonEvent) {
            if (!$gameMap.isEventRunning()) {
                const interpreter = new Game_Interpreter();
                interpreter.setup($gameTemp._reservedTimerCommonEvent);
                interpreter.update();
                $gameTemp.clearTimerCommonEvent();
            }
        }
    };

    // 타이머 스프라이트
    class Sprite_CustomTimer extends Sprite {
        initialize() {
            super.initialize();
            this.createBitmap();
            this.updatePosition();
        }

        createBitmap() {
            const width = 200;
            const height = 48;
            this.bitmap = new Bitmap(width, height);
            this.bitmap.fontFace = $gameSystem.mainFontFace();
            this.bitmap.fontSize = 32;
            this.bitmap.outlineColor = '#333';
            this.bitmap.outlineWidth = 4;
        }

        updatePosition() {
            this.x = (Graphics.width - this.width) / 2;
            this.y = 20;
        }

        update() {
            super.update();
            this.updateVisibility();
            this.updateBitmap();
        }

        updateVisibility() {
            this.visible = Timer.isRunning;
        }

        updateBitmap() {
            if (Timer.isRunning) {
                this.bitmap.clear();
                this.bitmap.textColor = '#ffffff';
                this.bitmap.drawText(Timer.formatTime(), 0, 0, this.bitmap.width, this.bitmap.height, 'center');
            }
        }
    }

    // 플러그인 커맨드 등록
    PluginManager.registerCommand(pluginName, "start", args => {
        const seconds = Number(args.seconds) || 0;
        const script = JSON.parse(args.script || "\"\"");
        Timer.start(seconds, script);
    });

    PluginManager.registerCommand(pluginName, "stop", () => {
        Timer.stop();
    });

    PluginManager.registerCommand(pluginName, "pause", () => {
        Timer.pause();
    });

    PluginManager.registerCommand(pluginName, "resume", () => {
        Timer.resume();
    });

    PluginManager.registerCommand(pluginName, "cancelScript", () => {
        Timer.cancelScript();
    });

    PluginManager.registerCommand(pluginName, "delete", () => {
        Timer.delete();
    });

    // Scene_Map 확장 (타이머 스프라이트 생성)
    const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _Scene_Map_createDisplayObjects.call(this);
        this.createCustomTimer();
    };

    Scene_Map.prototype.createCustomTimer = function() {
        this._customTimerSprite = new Sprite_CustomTimer();
        this.addChild(this._customTimerSprite);
    };

    // 타이머 업데이트
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        Timer.update();
    };

    // 게임 시작 시 타이머 상태 복원
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        Timer.loadFromVariables();
    };

    // 게임 종료 시 타이머 상태 저장
    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        Timer.saveToVariables();
        _Scene_Map_terminate.call(this);
    };
})();
