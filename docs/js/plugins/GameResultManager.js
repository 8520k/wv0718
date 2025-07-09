/*:
 * @target MZ
 * @plugindesc 게임 결과 통합 관리 플러그인
 * @author Claude
 * @help
 * 이 플러그인은 미니게임들의 결과 표시를 통합 관리합니다.
 * 
 * 기능:
 * 1. 게임 성공/실패 결과 표시
 * 2. 판정 이미지 표시 (PERFECT, GOOD, BAD, MISS)
 * 3. BGM 복원 및 효과음 재생
 * 
 * 사용 방법:
 * window.GameResultManager.showResult(isSuccess, options)
 * window.GameResultManager.showJudgement(judgementType, x, y, parentSprite)
 * 
 * @param judgementDuration
 * @text 판정 이미지 표시 시간 (밀리초)
 * @type number
 * @default 500
 */

(() => {
    'use strict';
    const pluginName = "GameResultManager";

    // 플러그인 파라미터
    const parameters = PluginManager.parameters(pluginName);
    const judgementDuration = Number(parameters.judgementDuration || 500);

    // 판정별 이미지 설정
    const judgementImages = {
        perfect: 'perfect',
        good: 'good',
        bad: 'bad',
        miss: 'miss'
    };

    // 결과별 이미지 설정
    const resultImages = {
        success: 'success',
        failed: 'failed'
    };

    // 효과음 설정
    const seSettings = {
        perfect: { name: "Door1", pan: 0, pitch: 100, volume: 90 },
        good: { name: "Door1", pan: 0, pitch: 100, volume: 90 },
        bad: { name: "Door1", pan: 0, pitch: 100, volume: 90 },
        miss: { name: "Door1", pan: 0, pitch: 100, volume: 90 }
    };

    // 결과 표시 상태
    let isResultDisplaying = false;
    let currentJudgementSprite = null;

    // 게임 결과 관리자
    window.GameResultManager = {
        // 결과 표시 중인지 확인
        isResultDisplaying() {
            return isResultDisplaying;
        },

        // 게임 결과 표시
        showResult(isSuccess, options = {}) {
            if (isResultDisplaying) {
                console.warn('[GameResultManager] 이미 결과가 표시 중입니다.');
                return;
            }

            isResultDisplaying = true;
            const {
                restoreBgm = null,
                onComplete = null,
                customText = null
            } = options;

            // 현재 BGM 중지
            AudioManager.stopBgm();

            // 결과에 따른 효과음 재생
            if (isSuccess) {
                AudioManager.playMe({ name: "Item", pan: 0, pitch: 100, volume: 90 });
            } else {
                AudioManager.playMe({ name: "Gag", pan: 0, pitch: 100, volume: 90 });
            }

            // 효과음 재생 후 BGM 복원
            setTimeout(() => {
                if (restoreBgm) {
                    AudioManager.playBgm(restoreBgm);
                }
            }, 1000);

            // 결과 창 표시
            this._showResultWindow(isSuccess, customText);

            // 완료 콜백 실행
            setTimeout(() => {
                isResultDisplaying = false;
                if (onComplete) {
                    onComplete();
                }
            }, 3000);
        },

        // 판정 이미지 표시
        showJudgement(judgementType, x, y, parentSprite = null) {
            // 이전 판정 이미지 제거
            this._removeCurrentJudgement();

            const judgement = this._createJudgementSprite(judgementType);
            if (!judgement) return;
            
            judgement.x = x - 119; // 이미지 너비의 절반 (238/2)
            judgement.y = y - 28.5; // 이미지 높이의 절반 (57/2)

            // 부모 스프라이트가 지정되지 않으면 현재 씬의 스프라이트 레이어 사용
            const targetParent = parentSprite || this._getCurrentSceneSprites();
            if (targetParent) {
                targetParent.addChild(judgement);
                currentJudgementSprite = judgement;

                // 지정된 시간 후 제거
                setTimeout(() => {
                    this._removeCurrentJudgement();
                }, judgementDuration);
            }

            // 효과음 재생
            const seName = seSettings[judgementType.toLowerCase()]?.name || "Door1";
            AudioManager.playSe({ name: seName, pan: 0, pitch: 100, volume: 90 });
        },

        // 현재 판정 이미지 제거
        _removeCurrentJudgement() {
            if (currentJudgementSprite && currentJudgementSprite.parent) {
                currentJudgementSprite.parent.removeChild(currentJudgementSprite);
                currentJudgementSprite = null;
            }
        },

        // 판정 이미지 스프라이트 생성
        _createJudgementSprite(judgementType) {
            const imageName = judgementImages[judgementType.toLowerCase()];
            if (!imageName) {
                console.warn(`[GameResultManager] 판정 이미지를 찾을 수 없습니다: ${judgementType}`);
                return null;
            }

            const judgement = new Sprite(ImageManager.loadPicture(imageName));
            judgement.scale.x = 1.0;
            judgement.scale.y = 1.0;

            return judgement;
        },

        // 결과 창 표시
        _showResultWindow(isSuccess, customText) {
            // 이미지 방식으로 결과 표시
            const resultType = isSuccess ? 'success' : 'failed';
            const imageName = resultImages[resultType];
            
            if (imageName) {
                // 이미지 스프라이트 생성
                const resultSprite = new Sprite(ImageManager.loadPicture(imageName));
                resultSprite.anchor.x = 0.5;
                resultSprite.anchor.y = 0.5;
                resultSprite.x = Graphics.width / 2;
                resultSprite.y = Graphics.height / 2;
                resultSprite.z = 999;

                // 현재 씬에 추가
                const currentScene = SceneManager._scene;
                if (currentScene) {
                    currentScene.addChild(resultSprite);
                }
            } else {
                // 폴백: 기존 텍스트 방식 사용
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
                const resultText = customText || (isSuccess ? "SUCCESS" : "FAILED");
                resultWindow.contents.drawText(resultText, 0, 0, 400, 300, 'center');

                // 배경 제거
                resultWindow.opacity = 0;

                // 결과 창을 최상위에 표시
                const currentScene = SceneManager._scene;
                if (currentScene && currentScene._windowLayer) {
                    currentScene._windowLayer.addChild(resultWindow);
                    resultWindow.z = 999;
                }
            }
        },

        // 현재 씬의 스프라이트 레이어 가져오기
        _getCurrentSceneSprites() {
            const currentScene = SceneManager._scene;
            if (currentScene && currentScene._sprites) {
                return currentScene._sprites;
            }
            return null;
        }
    };

    console.log(`[${pluginName}] 게임 결과 관리자 로드 완료`);

})(); 