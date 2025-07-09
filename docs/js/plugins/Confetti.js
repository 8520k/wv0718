/*:
 * @target MZ
 * @plugindesc 컨페티 이펙트를 추가하는 플러그인입니다.
 * @author YourName
 * @help
 * 이 플러그인은 맵 화면에 컨페티(색종이) 이펙트를 표시합니다.
 * 
 * ■ 플러그인 명령
 * - 컨페티 시작 : 컨페티 이펙트를 시작합니다.
 * - 컨페티 종료 : 컨페티 이펙트를 종료합니다.
 * - 화면의 컨페티 모두 삭제하고 종료 : 모든 컨페티를 즉시 삭제하고 이펙트를 종료합니다.
 * 
 * @command startConfetti
 * @text 컨페티 시작
 * @desc 컨페티 이펙트를 시작합니다.
 * 
 * @command stopConfetti
 * @text 컨페티 종료
 * @desc 컨페티 이펙트를 종료합니다.
 * 
 * @command clearAndStopConfetti
 * @text 화면의 컨페티 모두 삭제하고 종료
 * @desc 화면의 모든 컨페티를 즉시 삭제하고 이펙트를 종료합니다.
 */
(() => {
    'use strict';
    const pluginName = 'Confetti';
    
    // 플러그인 명령어 등록 
    PluginManager.registerCommand(pluginName, "startConfetti", args => {
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager._scene.startConfettiEffect();
        }
    });
    
    PluginManager.registerCommand(pluginName, "stopConfetti", args => {
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager._scene.stopConfettiEffect();
        }
    });
    
    PluginManager.registerCommand(pluginName, "clearAndStopConfetti", args => {
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager._scene.clearAndStopConfettiEffect();
        }
    });

    var confettiContainer = null;

Scene_Map.prototype.startConfettiEffect = function(numConfetti= 150) {
        if (confettiContainer) return; // 이미 실행 중이면 리턴
        
        confettiContainer = new Sprite();
        confettiContainer.z = 10;
         
        this.addChild(confettiContainer);

        var confettiImages = ['confetti3'];

        const createConfetti = () => { 
            if (!confettiContainer.lastCreateTime) confettiContainer.lastCreateTime = 0;
            var currentTime = Graphics.frameCount;
            
            if (currentTime - confettiContainer.lastCreateTime < 6) return; // 100ms (약 6프레임)마다 실행
            confettiContainer.lastCreateTime = currentTime;

            var i = 0;
            const createOneConfetti = () => {
                if (i >= numConfetti || !confettiContainer) return;
                
                var confettiImage = confettiImages[Math.floor(Math.random() * confettiImages.length)];
                var confetti = new Sprite(ImageManager.loadPicture(confettiImage));
                confetti.x = Math.random() * Graphics.width;
                confetti.y = -Math.random() * 200;
                confetti.anchor.x = 0.5;
                confetti.anchor.y = 0.5;
                confetti.rotationSpeed = Math.random() * 0.1 - 0.05;
                confetti.fallSpeed = Math.random() * 1 + 1;
                confetti.tilt = (Math.random() * 30 - 15) / 10;
                confetti.blendMode = PIXI.BLEND_MODES.ADD;
                confettiContainer.addChild(confetti);
                
                i++;
                if (confettiContainer) setTimeout(createOneConfetti, 100);
            };
            
            createOneConfetti();
        }

        createConfetti();

        confettiContainer.update = function() {
            // 페이드아웃 중이면 알파값 감소
            if (this.isFadingOut) {
                this.fadeOutFrame++;
                this.alpha = 1 - (this.fadeOutFrame / this.fadeOutDuration);
                
                // 페이드아웃 완료 시 제거
                if (this.fadeOutFrame >= this.fadeOutDuration) {
                    if (this.parent) {
                        this.parent.removeChild(this);
                    }
                    confettiContainer = null;
                    return;
                }
            }

            for (var i = 0; i < this.children.length; i++) {
                var confetti = this.children[i];
                confetti.rotation += confetti.rotationSpeed;
                confetti.y += confetti.fallSpeed;
                confetti.x += Math.sin(confetti.rotation) * confetti.tilt;

                if (confetti.y > Graphics.height) {
                    confetti.y = -10;
                    confetti.x = Math.random() * Graphics.width;
                }
            }
        };
    };

    Scene_Map.prototype.stopConfettiEffect = function() {
        if (confettiContainer && !confettiContainer.isFadingOut) {
            confettiContainer.isFadingOut = true;
            confettiContainer.fadeOutFrame = 0;
            confettiContainer.fadeOutDuration = 120; // 120프레임
        }
    };

    Scene_Map.prototype.clearAndStopConfettiEffect = function() {
        if (confettiContainer) {
            // 모든 컨페티 즉시 제거
            confettiContainer.children.forEach(child => {
                confettiContainer.removeChild(child);
            });
            this.removeChild(confettiContainer);
            confettiContainer = null;
        }
    };
})();
