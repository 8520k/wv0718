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
	let isQJLightingLoaded = false;
	let litEvents = new Set();

	const checkQJLighting = function () {
		if (typeof QJ === "undefined" || !QJ.LL) {
			return false;
		}
		return true;
	};

	const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;

	window.applyMapLighting = function () {
		if (!isQJLightingLoaded) {
			return;
		}
  
		QJ.LL.spl(1);

		const currentMapId = $gameMap.mapId();
		const mapConfig = lightingData.find(
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
		isQJLightingLoaded = checkQJLighting();
	};

})();

const lightingData = [
	{
		"MapId": 28,
		"MapName": "S3 -마을B",
		"Events": [
			{
				"EventId": 5,
				"LightId": "1"
			},
			{
				"EventId": 2,
				"LightId": "1"
			},
			{
				"EventId": 6,
				"LightId": "1"
			},
			{
				"EventId": 7,
				"LightId": "1"
			},
			{
				"EventId": 8,
				"LightId": "1"
			},
			{
				"EventId": 9,
				"LightId": "1"
			},
			{
				"EventId": 10,
				"LightId": "1"
			},
			{
				"EventId": 11,
				"LightId": "1"
			},
			{
				"EventId": 12,
				"LightId": "1"
			},
			{
				"EventId": 13,
				"LightId": "1"
			},
			{
				"EventId": 14,
				"LightId": "1"
			},
			{
				"EventId": 15,
				"LightId": "1"
			},
			{
				"EventId": 16,
				"LightId": "1"
			},
			{
				"EventId": 17,
				"LightId": "1"
			},
			{
				"EventId": 18,
				"LightId": "1"
			},
			{
				"EventId": 19,
				"LightId": "1"
			},
			{
				"EventId": 20,
				"LightId": "1"
			},
			{
				"EventId": 21,
				"LightId": "1"
			}
		]
	},
	{
		"MapId": 32,
		"MapName": "S3 - 목공소",
		"Events": [
			{
				"EventId": 2,
				"LightId": "1"
			},
			{
				"EventId": 4,
				"LightId": "1"
			},
			{
				"EventId": 5,
				"LightId": "1"
			}
		]
	},

	{
		"MapId": 27,
		"MapName": "S2 - 마을",
		"Events": [
			{
				"EventId": 10,
				"LightId": "1"
			},
			{
				"EventId": 11,
				"LightId": "1"
			},
			{
				"EventId": 12,
				"LightId": "1"
			},
			{
				"EventId": 13,
				"LightId": "1"
			},
			{
				"EventId": 14,
				"LightId": "1"
			},
			{
				"EventId": 15,
				"LightId": "1"
			},
			{
				"EventId": 16,
				"LightId": "1"
			},
			{
				"EventId": 17,
				"LightId": "1"
			},
			{
				"EventId": 18,
				"LightId": "1"
			},
			{
				"EventId": 19,
				"LightId": "1"
			},
			{
				"EventId": 20,
				"LightId": "1"
			},
			{
				"EventId": 21,
				"LightId": "1"
			},
			{
				"EventId": 22,
				"LightId": "1"
			},
			{
				"EventId": 23,
				"LightId": "1"
			},
			{
				"EventId": 24,
				"LightId": "1"
			},
			{
				"EventId": 25,
				"LightId": "1"
			},
			{
				"EventId": 26,
				"LightId": "1"
			},
			{
				"EventId": 27,
				"LightId": "1"
			},
			{
				"EventId": 28,
				"LightId": "1"
			},
			{
				"EventId": 29,
				"LightId": "1"
			}
		]
	},

	{
		"MapId": 6,
		"MapName": "마을 가는 길",
		"Events": [
			{
				"EventId": 4,
				"LightId": "1"
			},
			{
				"EventId": 5,
				"LightId": "1"
			},
			{
				"EventId": 12,
				"LightId": "1"
			},
			{
				"EventId": 13,
				"LightId": "1"
			},
			{
				"EventId": 14,
				"LightId": "1"
			},
			{
				"EventId": 15,
				"LightId": "1"
			}
		]
	},

	{
		"MapId": 10,
		"MapName": "벌목장A",
		"Events": [
			{
				"EventId": 5,
				"LightId": "1"
			}
		]
	},
	{
		"MapId": 29,
		"MapName": "S1 - 집",
		"Events": [
			{
				"EventId": 1,
				"LightId": "1"
			},
			{
				"EventId": 15,
				"LightId": "1"
			},
			{
				"EventId": 16,
				"LightId": "1"
			},
			{
				"EventId": 17,
				"LightId": "1"
			},
			{
				"EventId": 18,
				"LightId": "1"
			},
			{
				"EventId": 19,
				"LightId": "1"
			},
			{
				"EventId": 20,
				"LightId": "1"
			},
			{
				"EventId": 21,
				"LightId": "1"
			},
			{
				"EventId": 22,
				"LightId": "1"
			},
			{
				"EventId": 23,
				"LightId": "1"
			}
		]
	},
	{
		"MapId": 8,
		"MapName": "제라늄-중",
		"Events": [
			{
				"EventId": 3,
				"LightId": "1"
			},
			{
				"EventId": 4,
				"LightId": "1"
			},
			{
				"EventId": 5,
				"LightId": "1"
			},
			{
				"EventId": 6,
				"LightId": "1"
			},
			{
				"EventId": 7,
				"LightId": "1"
			},
			{
				"EventId": 8,
				"LightId": "1"
			},
			{
				"EventId": 9,
				"LightId": "1"
			},
			{
				"EventId": 10,
				"LightId": "1"
			}
		]
	},
	{
		"MapId": 38,
		"MapName": "제라늄-전",
		"Events": [
			{
				"EventId": 59,
				"LightId": "1"
			}, 
			{
				"EventId": 60,
				"LightId": "1"
			}, 
			{
				"EventId": 61,
				"LightId": "1"
			}, 
			{
				"EventId": 62,
				"LightId": "1"
			}, 
			{
				"EventId": 63,
				"LightId": "1"
			}, 
			{
				"EventId": 64,
				"LightId": "1"
			}, 
			{
				"EventId": 65,
				"LightId": "1"
			}, 
			{
				"EventId": 66,
				"LightId": "1"
			}
		]
	}
]
