/*:
 * @target MZ
 * @plugindesc 특정 스위치가 ON일 때 맵 BGM 자동 재생을 제어하는 플러그인
 * @author Your Name
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * 
 * @param controlSwitchId
 * @text 제어 스위치 ID
 * @type switch
 * @desc BGM 제어에 사용할 스위치 번호
 * @default 1
 * 
 * @param eventBgmName
 * @text 이벤트 BGM 파일명
 * @type file
 * @dir audio/bgm/
 * @desc 스위치가 ON일 때 재생할 BGM 파일명
 * @default Theme1
 * 
 * @param eventBgmVolume
 * @text 이벤트 BGM 볼륨
 * @type number
 * @min 0
 * @max 100
 * @desc 스위치가 ON일 때 재생할 BGM의 볼륨 (0-100)
 * @default 90
 * 
 * @param eventBgmPitch
 * @text 이벤트 BGM 피치
 * @type number
 * @min 50
 * @max 150
 * @desc 스위치가 ON일 때 재생할 BGM의 피치 (50-150)
 * @default 100
 * 
 * @param eventBgmPan
 * @text 이벤트 BGM 팬
 * @type number
 * @min -100
 * @max 100
 * @desc 스위치가 ON일 때 재생할 BGM의 팬 (-100-100)
 * @default 0
 * 
 * @help
 * =============================================================================
 * EventBgmControl.js
 * =============================================================================
 * 
 * 특정 스위치가 ON 상태일 때 맵을 이동해도 맵의 BGM을 자동 실행하지 않고,
 * 지정된 이벤트 BGM을 재생하는 플러그인입니다.
 * 
 * 프록시 패턴을 사용하여 안전하게 BGM을 제어합니다.
 * 
 * 플러그인 매개변수:
 * - controlSwitchId: BGM 제어에 사용할 스위치 번호
 * - eventBgmName: 스위치가 ON일 때 재생할 BGM 파일명
 * - eventBgmVolume: 이벤트 BGM 볼륨 (0-100)
 * - eventBgmPitch: 이벤트 BGM 피치 (50-150)
 * - eventBgmPan: 이벤트 BGM 팬 (-100-100)
 * 
 * 사용법:
 * 1. 플러그인 매개변수에서 제어할 스위치 번호를 설정
 * 2. 이벤트 BGM 파일명과 볼륨, 피치, 팬을 설정
 * 3. 게임 중 해당 스위치를 ON으로 설정하면 맵 BGM 대신 이벤트 BGM 재생
 * 4. 스위치를 OFF로 설정하면 다시 맵 BGM 재생
 * 
 * =============================================================================
 */

(() => {
    'use strict';

    const pluginName = "EventBgmControl";
    const parameters = PluginManager.parameters(pluginName);

    // 플러그인 매개변수 파싱
    const controlSwitchId = Number(parameters['controlSwitchId'] || 1);
    const eventBgmName = parameters['eventBgmName'] || 'Theme1';
    const eventBgmVolume = Number(parameters['eventBgmVolume'] || 90);
    const eventBgmPitch = Number(parameters['eventBgmPitch'] || 100);
    const eventBgmPan = Number(parameters['eventBgmPan'] || 0);

    // BGM 프록시 클래스
    class BgmProxy {
        constructor() {
            this._originalAudioManager = AudioManager;
            this._isEventBgmActive = false;
            this._eventBgm = {
                name: eventBgmName,
                volume: eventBgmVolume,
                pitch: eventBgmPitch,
                pan: eventBgmPan
            };
        }

        // 이벤트 BGM 활성화
        activateEventBgm() {
            if (!this._isEventBgmActive) {
                this._isEventBgmActive = true;
                this._originalAudioManager.playBgm(this._eventBgm);
            }
        }

        // 이벤트 BGM 비활성화
        deactivateEventBgm() {
            if (this._isEventBgmActive) {
                this._isEventBgmActive = false;
                // 맵 BGM 재생
                if ($dataMap.autoplayBgm) {
                    this._originalAudioManager.playBgm($dataMap.bgm);
                }
            }
        }

        // 현재 상태 확인
        isEventBgmActive() {
            return this._isEventBgmActive;
        }

        // 스위치 상태에 따른 BGM 제어
        updateBgm() {
            if ($gameSwitches.value(controlSwitchId)) {
                this.activateEventBgm();
            } else {
                this.deactivateEventBgm();
            }
        }

        // 원본 AudioManager 메서드들에 대한 프록시
        playBgm(bgm, pos) {
            if ($gameSwitches.value(controlSwitchId)) {
                // 스위치가 ON이면 이벤트 BGM 재생
                this._originalAudioManager.playBgm(this._eventBgm, pos);
            } else {
                // 스위치가 OFF이면 원본 BGM 재생
                this._originalAudioManager.playBgm(bgm, pos);
            }
        }

        stopBgm() {
            this._originalAudioManager.stopBgm();
            this._isEventBgmActive = false;
        }

        fadeOutBgm(duration) {
            this._originalAudioManager.fadeOutBgm(duration);
            this._isEventBgmActive = false;
        }
    }

    // 전역 BGM 프록시 인스턴스
    const bgmProxy = new BgmProxy();

    // 원본 함수 저장
    const _Scene_Map_start = Scene_Map.prototype.start;
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    const _Game_Map_autoplay = Game_Map.prototype.autoplay;

    // Scene_Map.prototype.start 오버라이드 (프록시 패턴 적용)
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        bgmProxy.updateBgm();
    };

    // Scene_Map.prototype.onMapLoaded 오버라이드 (프록시 패턴 적용)
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        bgmProxy.updateBgm();
    };

    // Game_Map.prototype.autoplay 오버라이드 (프록시 패턴 적용)
    Game_Map.prototype.autoplay = function() {
        if ($gameSwitches.value(controlSwitchId)) {
            // 스위치가 ON이면 이벤트 BGM만 재생
            bgmProxy.activateEventBgm();
            // BGS는 원본대로 재생
            if ($dataMap.autoplayBgs) {
                AudioManager.playBgs($dataMap.bgs);
            }
        } else {
            // 스위치가 OFF이면 원본 autoplay 실행
            _Game_Map_autoplay.call(this);
        }
    };

    // 스위치 변경 시 BGM 업데이트 (프록시 패턴 적용)
    const _Game_Switches_setValue = Game_Switches.prototype.setValue;
    Game_Switches.prototype.setValue = function(switchId, value) {
        _Game_Switches_setValue.call(this, switchId, value);
        
        // 제어 스위치가 변경되었을 때만 처리
        if (switchId === controlSwitchId && SceneManager._scene instanceof Scene_Map) {
            bgmProxy.updateBgm();
        }
    };

    // 플러그인 등록
    PluginManager.registerCommand(pluginName, "PlayEventBgm", args => {
        // 이벤트 BGM 재생 명령어 (필요시 사용)
        if ($gameSwitches.value(controlSwitchId)) {
            bgmProxy.activateEventBgm();
        }
    });

    // 디버그용 함수 (개발 시 사용)
    window.EventBgmControl = {
        getProxy: () => bgmProxy,
        getSettings: () => ({
            controlSwitchId,
            eventBgmName,
            eventBgmVolume,
            eventBgmPitch,
            eventBgmPan
        }),
        forceUpdateBgm: () => bgmProxy.updateBgm(),
        isEventBgmActive: () => bgmProxy.isEventBgmActive()
    };

})();