/*:
 * @target MZ
 * @plugindesc Manages lighting based on map names and event IDs
 * @author Claude
 * @help
 * This plugin manages lighting for events based on map names.
 *
 * Usage:
 * 1. Configure the map lighting data in data/map_lighting.json
 * 2. Lighting will be applied when entering maps
 *
 * @requires QJ-Lighting
 */

/*~struct~MapLighting:
 * @param MapName
 * @text Map Name
 * @type string
 * @desc Name of the map
 *
 * @param Events
 * @text Event Lighting Data
 * @type struct<EventLighting>[]
 * @desc Lighting data for events in this map
 */

/*~struct~EventLighting:
 * @param EventId
 * @text Event ID
 * @type number
 * @desc ID of the event
 *
 * @param LightId
 * @text Light ID
 * @type string
 * @desc ID of the light to apply
 */

(() => {
	"use strict";

	const pluginName = "MapLightingManager";
	let mapLightingData = [];
	let isQJLightingLoaded = false;
	let litEvents = new Set();

	const checkQJLighting = function () {
		if (typeof QJ === "undefined" || !QJ.LL) {
			return false;
		}
		return true;
	};

	const loadMapLightingData = function () {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", "../mapData/map_lighting.json");
		xhr.overrideMimeType("application/json");
		xhr.onload = function () {
			if (xhr.status < 400) {
				mapLightingData = JSON.parse(xhr.responseText);
			}
		};
		xhr.send();
	};

	const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;

	window.applyMapLighting = function () {
		if (!isQJLightingLoaded) {
			return;
		}
  
		QJ.LL.spl(1);

		const currentMapId = $gameMap.mapId();
		const mapConfig = mapLightingData.find(
			(config) => config.MapId === currentMapId
		);

		if (mapConfig) {
			mapConfig.Events.forEach((eventConfig) => {
				const eventId = Number(eventConfig.EventId);
				const lightId = eventConfig.LightId;
				const eventKey = `${currentMapId}_${eventId}`;

				if (litEvents.has(eventKey)) {
					return;
				}

				if (QJ && QJ.LL) {
					QJ.LL.sel(eventId, lightId);
					litEvents.add(eventKey);
				}
			});
		}
	};

	Game_Player.prototype.performTransfer = function () {
		_Game_Player_performTransfer.call(this);
		litEvents.clear();

		setTimeout(() => {
			if(!$gameSystem.showLights) return;
			this.applyMapLighting(); 
		}, 10);
	};

	Game_Player.prototype.applyMapLighting = window.applyMapLighting;

	const _Scene_Boot_start = Scene_Boot.prototype.start;
	Scene_Boot.prototype.start = function () {
		_Scene_Boot_start.call(this);
		loadMapLightingData();
		isQJLightingLoaded = checkQJLighting();
	};

})();