/*:
 * @target MZ
 * @plugindesc 현재 소지중인 아이템의 이미지를 우측 상단 화면에 표시하는 플러그인
 * @author Assistant
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 *
 * @param maxItems
 * @text 최대 표시 아이템 수
 * @type number
 * @min 1
 * @max 10
 * @default 5
 * @desc 화면에 표시할 최대 아이템 개수
 *
 * @param itemSize
 * @text 아이템 이미지 크기
 * @type number
 * @min 20
 * @max 80
 * @default 40
 * @desc 아이템 이미지의 크기 (픽셀)
 *
 * @param containerSize
 * @text 컨테이너 크기
 * @type number
 * @min 30
 * @max 100
 * @default 50
 * @desc 아이템 컨테이너의 크기 (픽셀)
 *
 * @param itemSpacing
 * @text 아이템 간격
 * @type number
 * @min 5
 * @max 30
 * @default 15
 * @desc 아이템 간의 간격 (픽셀)
 *
 * @param backgroundImage
 * @text 배경 이미지
 * @type file
 * @dir img/pictures/
 * @default item_hud_box
 * @desc 아이템 컨테이너의 배경 이미지
 *
 * @param fadeDuration
 * @text 페이드 지속시간
 * @type number
 * @min 10
 * @max 120
 * @default 30
 * @desc HUD 페이드 인/아웃 지속시간 (프레임)
 *
 * @help
 * 현재 소지중인 아이템의 이미지를 우측 상단 화면에 표시하는 플러그인입니다.
 *
 * 기능:
 * - 플레이어가 소지한 아이템의 이미지를 실시간으로 표시
 * - 아이템 개수에 따라 자동으로 레이아웃 조정
 * - 배경 이미지로 아이템을 감싸는 컨테이너 제공
 * - 이벤트 진행 중 자동으로 HUD 페이드아웃
 *
 * 사용법:
 * 플러그인을 활성화하면 자동으로 아이템 HUD가 표시됩니다.
 * 이벤트가 시작되면 HUD가 자동으로 페이드아웃되고, 이벤트가 끝나면 다시 나타납니다.
 */

(() => {
	"use strict";

	const pluginName = "ItemHUD";
	const parameters = PluginManager.parameters(pluginName);

	const MAX_ITEMS = Number(parameters["maxItems"] || 5);
	const ITEM_SIZE = Number(parameters["itemSize"] || 40);
	const CONTAINER_SIZE = Number(parameters["containerSize"] || 50);
	const ITEM_SPACING = Number(parameters["itemSpacing"] || 15);
	const BACKGROUND_IMAGE = parameters["backgroundImage"] || "item_hud_box";
	const FADE_DURATION = Number(parameters["fadeDuration"] || 30);

	// 아이템 HUD 스프라이트 클래스
	class Sprite_ItemHUD extends Sprite {
		constructor() {
			super();
			this._items = [];
			this._background = null;
			this._fadeCount = 0;
			this._targetOpacity = 255;
			this._currentOpacity = 255;
			this._isFading = false; 
			this.createItemSprites();
			this.updateVisibility();
		}

		createItemSprites() {
			for (let i = 0; i < MAX_ITEMS; i++) {
				const itemSprite = new Sprite_ItemIcon();
				itemSprite.visible = false;
				this._items.push(itemSprite);
				this.addChild(itemSprite);
			}
		}

		update() {
			super.update();
			this.updateItemDisplay();
			this.updateFade();
			this.updateVisibility();
		}

		updateItemDisplay() {
			const items = this.getPlayerItems();
			const displayCount = Math.min(items.length, MAX_ITEMS);

			for (let i = 0; i < MAX_ITEMS; i++) {
				const itemSprite = this._items[i];
				if (i < displayCount) {
					const item = items[i];
					itemSprite.setItem(item);
					itemSprite.visible = true;
					this.updateItemPosition(itemSprite, i, displayCount);
				} else {
					itemSprite.visible = false;
				}
			}
		}

		getPlayerItems() {
			const items = [];
			$gameParty.items().forEach((item) => {
				if (item && item.meta.itemHUD !== "false") {
					items.push(item);
				}
			});
			return items;
		}

		updateItemPosition(itemSprite, index, totalItems) {
			const x = -index * (CONTAINER_SIZE + ITEM_SPACING);
			const y = 0;
			itemSprite.x = x;
			itemSprite.y = y;
		}

		updateVisibility() {
			const shouldBeVisible = SceneManager._scene instanceof Scene_Map;
			if (this.visible !== shouldBeVisible) {
				this.visible = shouldBeVisible;
			}
		}

		updateFade() {
			if (this._isFading) {
				this._fadeCount++;
				const progress = this._fadeCount / FADE_DURATION;

				if (progress >= 1) {
					this._currentOpacity = this._targetOpacity;
					this._isFading = false;
					this._fadeCount = 0;
				} else {
					const startOpacity = this._targetOpacity === 255 ? 0 : 255;
					this._currentOpacity =
						startOpacity + (this._targetOpacity - startOpacity) * progress;
				}

				this.opacity = this._currentOpacity;
			}
		}

		fadeOut() {
			if (this._targetOpacity !== 0) {
				this._targetOpacity = 0;
				this._isFading = true;
				this._fadeCount = 0;
			}
		}

		fadeIn() {
			if (this._targetOpacity !== 255) {
				this._targetOpacity = 255;
				this._isFading = true;
				this._fadeCount = 0;
			}
		}
	}

	// 아이템 아이콘 스프라이트 클래스
	class Sprite_ItemIcon extends Sprite {
		constructor() {
			super();
			this._item = null;
			this._background = null;
			this._iconSprite = null;
			this.createBackground();
			this.createIconSprite();
		}

		createBackground() {
			this._background = new Sprite();
			this._background.bitmap = ImageManager.loadPicture(BACKGROUND_IMAGE);
			this.addChild(this._background);
		}

		createIconSprite() {
			this._iconSprite = new Sprite();
			this.addChild(this._iconSprite);
		}

		setItem(item) {
			if (this._item !== item) {
				this._item = item;
				this.updateIcon();
			}
		}

		updateIcon() {
			if (this._item) {
				// 아이콘 시트 불러오기
				const iconSet = ImageManager.loadSystem("IconSet");
				const iconIndex = this._item.iconIndex;
				const pw = 32; // 아이콘 한 칸의 너비
				const ph = 32; // 아이콘 한 칸의 높이
				const sx = (iconIndex % 16) * pw;
				const sy = Math.floor(iconIndex / 16) * ph;

				// 비트맵 생성 및 아이콘 그리기
				this._iconSprite.bitmap = new Bitmap(ITEM_SIZE, ITEM_SIZE);
				iconSet.addLoadListener(() => {
					this._iconSprite.bitmap.clear();
					this._iconSprite.bitmap.blt(iconSet, sx, sy, pw, ph, 0, 0, ITEM_SIZE, ITEM_SIZE);
				});

				// 아이콘을 컨테이너 중앙에 위치
				this._iconSprite.x = (CONTAINER_SIZE - ITEM_SIZE) / 2;
				this._iconSprite.y = (CONTAINER_SIZE - ITEM_SIZE) / 2;

				// 배경 위치(0,0), 크기 조정
				this._background.x = 0;
				this._background.y = 0;
				// 크기 조정은 필요시 배경 이미지를 미리 맞춰두는 것이 일반적이므로 생략
			}
		}
	}

	// Scene_Map에 아이템 HUD 추가
	const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
	Scene_Map.prototype.createAllWindows = function () {
		_Scene_Map_createAllWindows.call(this);
		this.createItemHUD();
	};

	Scene_Map.prototype.createItemHUD = function () {
		this._itemHUD = new Sprite_ItemHUD();
		this.addChild(this._itemHUD);
		this.updateItemHUDPosition();
		
		// 게임 시작 시 이벤트 상태 확인
		const isEventRunning = this.isEventRunning();
		if (isEventRunning) {
			// 이벤트가 이미 실행 중이면 HUD를 숨김 상태로 시작
			this._itemHUD.opacity = 0;
			this._itemHUD._targetOpacity = 0;
			this._itemHUD._currentOpacity = 0;
			this._itemHudTimer = 0;
			this._itemHudInitialized = true;
		} else {
			// 이벤트가 실행되지 않았으면 1초 후 표시
			this._itemHudTimer = 60;
			this._itemHudInitialized = false;
		}
		
		this._itemHudWasEventRunning = isEventRunning;
	};

	Scene_Map.prototype.updateItemHUDPosition = function () {
		if (this._itemHUD) {
			this._itemHUD.x = Graphics.width - CONTAINER_SIZE - 10;
			this._itemHUD.y = 10;
		}
	};

	// 화면 크기 변경 시 HUD 위치 업데이트
	const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
	Scene_Map.prototype.onMapLoaded = function () {
		_Scene_Map_onMapLoaded.call(this);
		this.updateItemHUDPosition();
	};

	// 이벤트 진행 상태 감지 및 HUD 페이드 제어 - 간단한 방식
	const _Scene_Map_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function () {
		_Scene_Map_update.call(this);
		this.updateItemHUDVisibility();
	};

	Scene_Map.prototype.updateItemHUDVisibility = function () {
		if (this._itemHUD) {
			const isEventRunning = this.isEventRunning();
			
			// 초기화가 완료되지 않았을 때 (게임 시작 시)
			if (!this._itemHudInitialized) {
				if (this._itemHudTimer > 0) {
					this._itemHudTimer--;
					if (this._itemHudTimer === 0) {
						this._itemHUD.fadeIn();
						this._itemHudInitialized = true;
					}
				}
				return;
			}
			
			// 이벤트가 시작되었을 때
			if (isEventRunning && !this._itemHudWasEventRunning) {
				this._itemHUD.fadeOut();
				this._itemHudTimer = 0;
			}
			// 이벤트가 종료되었을 때
			else if (!isEventRunning && this._itemHudWasEventRunning) {
				this._itemHudTimer = 60; // 1초 (60프레임)
			}
			
			// 타이머 업데이트
			if (this._itemHudTimer > 0) {
				this._itemHudTimer--;
				if (this._itemHudTimer === 0) {
					this._itemHUD.fadeIn();
				}
			}
			
			this._itemHudWasEventRunning = isEventRunning;
		}
	};

	Scene_Map.prototype.isEventRunning = function () {
		return $gameMap.isEventRunning() || $gameMessage.isBusy();
	};
})();
