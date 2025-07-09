//==========================================================
// RPG Maker MZ QJ-Lighting.js
//==========================================================
/*:
 * @target MZ
 * @plugindesc Light and Shadows [V2.5]
 * @author Qiu Jiu
 * @orderAfter UltraMode7
 *
 *
 * @help
 * QJ-Lighting.js
 * ===============================================================================
 * Zero.Notice
 * ===============================================================================
 * 1.This plugin can work with UM7, please put this after UM7.
 * ===============================================================================
 * One.basic help of plugin
 * ===============================================================================
 * 1.plugin structure(logical structure, not the actual layer structure)
 *
 *
 * ========================
 * Occlusion layer (map mask / black part)
 * ========================
 *   ^
 *   |
 *   |               ============================
 *   |            -->Simple lights (for area lights / timed lights)
 * =====         /   ============================                    ======================
 * light layer--<                                                 -->Real time shadow (terrain or region)
 * =====         \   ======================                      /   ======================
 *                -->Full light (for events / players)----------<    
 *                   ======================                      \   =============
 *                                                                -->Event/Player Shadow
 *                                                                   =============
 *
 *
 * 2.There are two types of lights : Full Light And Simple Light。
 *   Full Light : 
 *      1.complete light parameters.
 *      2.generate real-time shadow and event shadow.
 *      3.consume a lot of resources and have low upper quantity limit.
 *      4.can only be binded to player and events    
 *   Simple Light :
 *      1.can`t generate shadow.
 *      2.have low resource consumption and high upper quantity limit.
 *      3.can only be created on specified location(terrain , region and (x,y))
 *
 *   ******************
 *   You can use my another plugin QJ-MapProjectileMZ.js to bind Simple Light to the projectiles,and you can control the position of the
 *   light by controlling the position of the projectiles.
 *   ******************
 * 3.To create a Full Light, you must firstly set a light in the plugin parameter "Full Light Preset" on the right, and then 
 *   the light can be (only) binded to events or events by using the "light id".
 *   (1)-add light to player:
 *       you can set the initial light to the player in the plugin paramete "Player Init Light Id".
 *       if you wan`t to change the light of player ,you can use the script QJ.LL.spl(lightId).
 *       there are detail description below.
 *   (2)-add light to event:
 *       set the first instruction of an event page of the event as "comment", and write the something in the comment instruction.
 *       there are detail description below.
 *       different lights can be set for different event pages, and the lights will be reloaded after changing the event page. 
 *       therefore, if you want to change the lights of events when the game is running, you can use a self switch to change the 
 *     light.
 *   (3)-performance:
 *       after the light image is set in the database, it will be preloaded when the game is loaded, which can improve the stability 
 *     of the system and greatly improve the efficiency.
 *   (4)-special light image setting:
 *       light images are placed in folder img/lights when the symbol $ is added in front of the set light image name, the light image 
 *     will be horizontally divided into four lines, and each line corresponds to the four direction of player and events:
 *     down, left, right and up
 *       the image can have parenthesis that contains frames and speed: imageName[frames,speed] eg: circle-shine[4,6]
 *       The light image will be vertically divided into "total frame number" grid.
 * 4.To create a Simple Light, you must firstly set a light in the plugin parameter "Simple Light Preset" on the right.
 *   (1)you can bind the Simple Light to the designated region.(plugin parameter Region Light)
 *      there are detail description below.
 *   (2)you can add a timing Simple Light to the designated position.(script QJ.LL.tempLight(lightId,during,x,y))
 *      there are detail description below.
 * 5.There are two types of lights : Region Shadow And Event/Player Shadow.
 *   (1)Region Shadow:(multi-height shadows)
 *      Tile shadow shape:
 *          These can take different shapes,I offer the some default values and you can add your own shapw.
 *          The basic setting method of shape is to write the objects of each point in the array.
 *          The base coordinate of the point is the upper left corner of the block.
 *          e.g: [{t:0,x:0,y:0},{t:0,x:48,y:0},{t:0,x:48,y:48},{t:0,x:0,y:48}]
 *          It means to draw a horizontal line from (0,0) to (48,0), then draw a horizontal line to (48,48), and then draw a 
 *         horizontal line to (0,48). Finally, connect it first, and then paint in the painted track.Where x and Y respectively 
 *         represent the coordinates relative to the "upper left corner of the block", and t represents the drawing method from 
 *         this point to the next point.
 *          The value of t and the corresponding drawing method:
 *            0 straight line
 *            1 draw an arc clockwise (towards the outside)
 *            2 draw an arc clockwise (towards the inside)
 *            3 draw an arc counterclockwise (towards the outside)
 *            4 draw an arc counterclockwise (towards the inside)
 *            5 connect this point with the initial point and color the generated figure, and then open a new starting point to draw the next part
 *      Ultra region Shadow:
 *          (same as other plugin)
 *   (2)Event/Player Shadow:
 *      you can specify a light source that can generate the shadows of events and player.
 *      a light source can generate shadows by setting the plugin parameters "Full Light Preser".
 *      whether an event can be projected or not, the corresponding instructions must be written in the comment of an event page 
 *      For details, see Two.Event Comment 3.event shadow
 * 6.If a attribute name container the symbol *,it can have dramatic effect.[!!!!!!!!!!!!!!!!!!!!Important!!!!!!!!!!!!!!!!!!!!]
 *   the string in the following format can be used to design the dynamic change effect (similar to setting key frames):
 *
 *   duration1|value1~duration2|value2~duration3|value3 ......
 *   e.g:
 *       60|0.2~60|0.6~60|1 
 *       the true value is 0.2 at frames 0-60, 0.6 at frames 60-120, 1 at frames 20-180, and then cycle.
 *
 *   The symbol | is used to divide the duration and the corresponding value. In addition to |, you can also use / or %.
 *
 *   | represents that the value of the data instantly becomes the corresponding value.
 *   / represents that the value of the data changes linearly from the previous value to the corresponding value in during time.
 *   % is the same as / ,but / represents linear gradient and % represents curve gradient (circle).
 * ================================================================
 *
 *
 *
 * ===============================================================================
 * Two.Event Comment(the first instructions of the event page)
 * ===============================================================================
 * 1.Base Comment:add the light to event(Qiu Jiu Light Layer)
 *   <QJLL:lightId> the lightId is the light id of preset light in plugin parameter Full Light Preset. 
 * ================================================================
 * 2.Modify the attributes of event light on the basis of preset:(Qiu Jiu Light Layer)
 *   <QJLL-scaleX:value>                     e.g:  <QJLL-scaleX:1>
 *   <QJLL-scaleY:value>                     e.g:  <QJLL-scaleY:1>
 *   <QJLL-tint:value>                       e.g:  <QJLL-tint:#ff00ff>
 *   <QJLL-offsetX:value>                    e.g:  <QJLL-offsetX:0>
 *   <QJLL-offsetY:value>                    e.g:  <QJLL-offsetY:0>
 *   <QJLL-dirOffsetX:value>                 e.g:  <QJLL-dirOffsetX:0~0~0~0>
 *   <QJLL-dirOffsetY:value>                 e.g:  <QJLL-dirOffsetY:0~0~0~0>
 *   <QJLL-opacity:value>                    e.g:  <QJLL-opacity:1>
 *   <QJLL-rotation:value>                   e.g:  <QJLL-rotation:0>
 *   <QJLL-rotationAuto:value>               e.g:  <QJLL-rotationAuto:0>
 *   <QJLL-dirRotation:value>                e.g:  <QJLL-dirRotation:0~0~0~0>
 *   <QJLL-shadowCharacter:false/true>       e.g:  <QJLL-shadowCharacter:false>
 *   <QJLL-shadowCharacterOffsetX:value>     e.g:  <QJLL-shadowCharacterOffsetX:0>
 *   <QJLL-shadowCharacterOffsetY:value>     e.g:  <QJLL-shadowCharacterOffsetY:0>
 *   <QJLL-shadowCharacterMaxOpacity:value>  e.g:  <QJLL-shadowCharacterMaxOpacity:1>
 *   <QJLL-shadowCharacterMaxDistance:value> e.g:  <QJLL-shadowCharacterMaxDistance:150>
 * ================================================================
 * 3.Event shadow:(Qiu Jiu Character Shadow)
 *   <QJCS-status:false/true>:if this event has shadow.the default value is false. e.g: <QJCS-status:true>.
 *   <QJCS-imgName:value>:The shadow of event is the img of event by default.
 *      You can change the img of event`s shadow.
 *      1.the img of shadow should be in img/lights.
 *        If the first char of img`s name is $, the img will be divided into four lines horizonally,
*         four lines refer to the four directions of the event.
 *      2.when you do not set the img of shadow, the shadow of evnet will be the event`s character image and
 *        it will be changed to the event`s character image auto.
 *        but when you set the img of shadow, it will not change auto.
 *      3.the system will changed the color of  shadow to black auto.
 *      4.！！！Noticeing！！！
 *        if you use <QJCS-imgName:value> to set the image of shadow, you also need to
 *        add the name of image file to the plugin parameter 'shadow imgae preset',
 *        or you can`t change the shadow correctly.
 *   <QJCS-opacity:value>:the opacity of shadow. e.g: <QJCS-opacity:1>.
 *   <QJCS-offsetX:value>:the x offset of shadow. e.g: <QJCS-offsetX:0>.
 *   <QJCS-offsetY:value>:the y offset of shadow. e.g: <QJCS-offsetY:0>.
 *   <QJCS-offsetDirX:down~left~right~up>:the x direction offset of shadow. e.g: <QJCS-offsetDirX:0~0~0~0>.
 *   <QJCS-offsetDirY:down~left~right~up>:the y direction offset of shadow. e.g: <QJCS-offsetDirY:0~0~0~0>.
 *   <QJCS-yCut:value>:on the basis of the original shadow image, float the anchor point by value pixels, and then cut off the 
 *      image under the anchor point. When the value of QJCS-model is D[],this effect can make the shadow rotate more naturally.
 *      the default value of value is 0. The recommended value is 24. e.g: <QJCS-yCut:24>.
 *   <QJCS-model:value>:the mode of this event projection.the default value is D[]. e.g: <QJCS-model:D[]>.
 *
 *      D[]:the shadow will only rotate according to the direction of the light source and the event without any deformation.
 *          Suitable for people with small walking map and small feet.
 *      DM[value]:is the same as D[], and the closer the light source is to the event, the shorter the shadow Value represents 
 *          the distance between the light source and the event (pixel value) when the size ratio of the shadow to the original 
 *          image is 1:1(grid size is 48*48).The recommended value is 48(DM[48]).
 *      DW[value]:is the same as D[], and the closer the light source is to the event, the longer the shadow Value represents 
 *          the distance between the light source and the event (pixel value) when the size ratio of the shadow to the original 
 *          image is 1:1(grid size is 48*48).The recommended value is 96(DW[96]).
 *
 *      B[]:the bottom of the shadow does not change, but the shadow will deform according to the direction of the light source 
 *          and the event.
 *          When the light source is on the same level as the shadow, the shadow becomes very narrow.
 *          Suitable for big character image such as wide door,big monster and column.
 *      BM[value]:is the same as B[], and the closer the light source is to the event, the shorter the shadow Value represents 
 *          the distance between the light source and the event (pixel value) when the size ratio of the shadow to the original 
 *          image is 1:1(grid size is 48*48).The recommended value is 48(DM[48]).
 *      BW[value]:is the same as B[], and the closer the light source is to the event, the longer the shadow Value represents the 
 *          distance between the light source and the event (pixel value) when the size ratio of the shadow to the original image 
 *          is 1:1(grid size is 48*48).The recommended value is 96(DW[96]).
 *   <QJCS-yCut:value>:
 *      Based on the original shadow image, float the anchor point up by value pixels, and then cut off the image under the anchor point 
 *      when the value of QJCS-model is D[] or DM[] or DW[],
 *      This effect can make the rotation of shadow more natural. The default value of value is 0.
 *      It is recommended to write a value of 24.
 *      For example     <QJCS-yCut:24>
 * ================================================================
 *
 *
 *
 * ===============================================================================
 * Three.Script
 * ===============================================================================
 * 1.Open or close light effect:
 *   QJ.LL.open()
 *   QJ.LL.close()
 * ================================================================
 * 2.modify the color of ambient screen.
 *   QJ.LL.tint(during,color)
 *      during:(frames)gradient time,changes instantaneously when 0 is written.
 *      color:target color.
 * ================================================================
 * 3.modify the light of player.
 *   (set player light -> spl)
 *   (delete player light -> dpl)
 *   (add player light -> apl)
 *   QJ.LL.splHide(lightId):temporarily hide player light.
 *            when leaving the lightId to blank or null, all lights of player will be hide.
 *   QJ.LL.splShow(lightId):show player light.
 *            when leaving the lightId to blank or null, all lights of player will be show.
 *
 *   QJ.LL.spl(lightId):
 *             delete all lights of player and add the light 'lightId' to player.
 *   QJ.LL.apl(lightId):
 *             add the light 'lightId' to player.
 *             if this light of palyer exists, nothing will happen.
 *   QJ.LL.dpl(lightId):
 *             delete the light 'lightId' of player.
 *             when the lightId is null, all lights of player will be delete.
 *
 *   QJ.LL.splScaleX(value):          modify the x scale of light
 *   QJ.LL.splScaleY(value):          modify the y scale of light
 *   QJ.LL.splTint(value):            modify the tint of light
 *   QJ.LL.splOffsetX(value):         modify the x offset of light
 *   QJ.LL.splOffsetY(value):         modify the y offset of light
 *   QJ.LL.splDirOffsetX(value):      modify the x direction offset of light
 *   QJ.LL.splDirOffsetY(value):      modify the y direction offset of light
 *   QJ.LL.splOpacity(value):         modify the opacity of light
 *   QJ.LL.splRotation(value):        modify the rotation of light
 *   QJ.LL.splDirRotation(value):     modify the direction rotation of light
 * ================================================================
 * 4.modify the shadow of player.(set player shadow -> sps)
 *   QJ.LL.spsStatus(false/true)            :show/hide player shadow.
 *   QJ.LL.spsImgName(value)                :reset the image of player`s shadow.
 *         use QJ.LL.imgName("") or QJ.LL.imgName(null) to set the image of player`s shadow to default.
 *   QJ.LL.spsTint(value)                   :modify the tint of player shadow.
 *   QJ.LL.spsOpacity(value)                :modify the opacity of player shadow.
 *   QJ.LL.spsOffsetX(value)                :modify the x offset of player shadow.
 *   QJ.LL.spsOffsetY(value)                :modify the y offset of player shadow.
 *   QJ.LL.spsOffsetDirX(down~left~right~up):modify the x direction offset of player shadow.
 *   QJ.LL.spsOffsetDirY(down~left~right~up):modify the y direction offset of player shadow.
 *   QJ.LL.spsModel(value)                  :modify the model of player shadow.
 *   QJ.LL.spsYCut(value)                   :modify the yCut of player shadow.
 * ================================================================
 * 5.add an temp timing light on (x,y):
 *   QJ.LL.tempLight(lightId,during,x,y):generates a light that disappears regularly at the specified position.
 *      lightId:Simple Light Id.
 *      during:the time that light exist.writing - 1 means that the light will always exist.
 *      x/y:In pixels
 * ================================================================
 * 6.modify the light of event.
 *   (set event light -> sel)
 *   (delete event light -> del)
 *   (add event light -> ael)
 *   QJ.LL.selHide(lightId):temporarily hide event light.
 *            when leaving the lightId to blank or null, all lights of event will be hide.
 *   QJ.LL.selShow(lightId):show event light.
 *            when leaving the lightId to blank or null, all lights of event will be show.
 *
 *   QJ.LL.sel(lightId):
 *             delete all lights of event and add the light 'lightId' to event.
 *   QJ.LL.ael(lightId):
 *             add the light 'lightId' to event.
 *             if this light of palyer exists, nothing will happen.
 *   QJ.LL.del(lightId):
 *             delete the light 'lightId' of event.
 *             when the lightId is null, all lights of event will be delete.
 *
 *   QJ.LL.selScaleX(value):          modify the x scale of light
 *   QJ.LL.selScaleY(value):          modify the y scale of light
 *   QJ.LL.selTint(value):            modify the tint of light
 *   QJ.LL.selOffsetX(value):         modify the x offset of light
 *   QJ.LL.selOffsetY(value):         modify the y offset of light
 *   QJ.LL.selDirOffsetX(value):      modify the x direction offset of light
 *   QJ.LL.selDirOffsetY(value):      modify the y direction offset of light
 *   QJ.LL.selOpacity(value):         modify the opacity of light
 *   QJ.LL.selRotation(value):        modify the rotation of light
 *   QJ.LL.selDirRotation(value):     modify the direction rotation of light
 * ================================================================
 *
 *
 * ===============================================================================
 * Four.Tilesets Note
 * ===============================================================================
 * 1.(Qiu Jiu Terrain Tag Shadow)
 *   <QJTS-1:value> <QJTS-2:value> ...... <QJTS-7:value>
 *   You can make a terrain of this map tilesets have the shadow effect of the area with region whose id is value.
 *    e.g: <QJTS-1:255> the terrain 1 of this map tilesets have the shadow effect of the area with region 255.
 * ================================================================
 * 2.(Qiu Jiu Terrain Tag light)
 *   <QJL-1:value> <QJL-2:value> ...... <QJL-7:value>
 *    You can make a terrain of this map tilesets have the Simple Light of the area with region whose id is value.
 *    e.g: <QJL-2:100> the terrain 2 of this map tilesets have the Simple Light of the area with region 100.
 * ================================================================
 *
 *
 * ===============================================================================
 * Five.Terms of Use
 * ===============================================================================
 * This plugin is free for non-commercial use.
 * 
 * This plugin is NOT FREE for COMMERCIAL use.
 * If you want to use this plugin for commercial use,you can:
 * Buy this plugin on itch.io
 * https://qiujiu.itch.io/qj-lighting
 * 
 * ===============================================================================
 * Six.Time System
 * ===============================================================================
 *
 * 1.The time system has only three basic quantities of "seconds, minutes and hours", which must correspond to a variable 
 *   respectively.
 *   The time system is divided into two modes:
 *   (1) Compatible with other time systems: the light plugin will not change the values of the three variables, and the system 
 *       will only change the picture tone according to the values of the three variables.
 *   (2) Autonomous operation: the light plugin will automatically change the values of those three variables to change the current 
 *       time, so as to change the picture tone.You can directly change the values of these three variables to change the time. 
 *       Changing the values of these three variables when loading the game can modify the "initial time".
 * 2.script:
 *   QJ.LL.setTimeSystem(true/false);         Turn the time system on or off.
 *   QJ.LL.setTimeRunStatus(true/false);      Turn time pass on or off (this script is only useful when the mode of the time system is "autonomous operation").
 *   QJ.LL.setTimeHubStatus(true/false);      Open or close the UI of the time system.
 *   $gameMap.addLightingSecondQJ(value);     Add a certain second.
 *   $gameMap.addLightingMiniteQJ(value);     Add a certain score.
 *   $gameMap.addLightingHourQJ(value);       Add a certain amount of time.
 * 3.Map Notes 
 *   If < indoor > is written in the map notes, the indoor tone transformation mode is used, otherwise the outdoor tone 
 *   transformation mode is used.
 *
 * ===============================================================================
 * Seven.Map Note
 * ===============================================================================
 * 1.<QJScreenTint:value>
 *   You can automatically change the map hue when loading the map.
 *   This change overrides the hue in the time system.
 *   e.g:  <QJScreenTint:#00ffaa>
 * 
 *
 *
 * @param chaos
 * @text base Setting
 * 
 * @param lightPreset
 * @type struct<presetData>[]
 * @text Full Light Preset[0] 
 * @desc Full Light Preset[0],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 * 
 * @param lightPreset1
 * @type struct<presetData>[]
 * @text Full Light Preset[1]
 * @desc Full Light Preset[1],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 * 
 * @param lightPreset2
 * @type struct<presetData>[]
 * @text Full Light Preset[2]
 * @desc Full Light Preset[2],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 * 
 * @param lightPreset3
 * @type struct<presetData>[]
 * @text Full Light Preset[3]
 * @desc Full Light Preset[3],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 * 
 * @param lightPreset4
 * @type struct<presetData>[]
 * @text Full Light Preset[4]
 * @desc Full Light Preset[4],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 * 
 * @param lightPreset5
 * @type struct<presetData>[]
 * @text Full Light Preset[5]
 * @desc Full Light Preset[5],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 * 
 * @param lightPreset6
 * @type struct<presetData>[]
 * @text Full Light Preset[6]
 * @desc Full Light Preset[6],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 * 
 * @param lightPreset7
 * @type struct<presetData>[]
 * @text Full Light Preset[7]
 * @desc Full Light Preset[7],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 * 
 * @param lightPreset8
 * @type struct<presetData>[]
 * @text Full Light Preset[8]
 * @desc Full Light Preset[8],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 * 
 * @param lightPreset9
 * @type struct<presetData>[]
 * @text Full Light Preset[9]
 * @desc Full Light Preset[9],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 *
 * @param miniLights
 * @type struct<miniLightsData>[]
 * @text Simple Full Light Preset[0]
 * @desc Simple Full Light Preset[0],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 *
 * @param miniLights1
 * @type struct<miniLightsData>[]
 * @text Simple Full Light Preset[1]
 * @desc Simple Full Light Preset[1],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 *
 * @param miniLights2
 * @type struct<miniLightsData>[]
 * @text Simple Full Light Preset[2]
 * @desc Simple Full Light Preset[2],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 *
 * @param miniLights3
 * @type struct<miniLightsData>[]
 * @text Simple Full Light Preset[3]
 * @desc Simple Full Light Preset[3],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 *
 * @param miniLights4
 * @type struct<miniLightsData>[]
 * @text Simple Full Light Preset[4]
 * @desc Simple Full Light Preset[4],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 *
 * @param miniLights5
 * @type struct<miniLightsData>[]
 * @text Simple Full Light Preset[5]
 * @desc Simple Full Light Preset[5],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 *
 * @param miniLights6
 * @type struct<miniLightsData>[]
 * @text Simple Full Light Preset[6]
 * @desc Simple Full Light Preset[6],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 *
 * @param miniLights7
 * @type struct<miniLightsData>[]
 * @text Simple Full Light Preset[7]
 * @desc Simple Full Light Preset[7],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 *
 * @param miniLights8
 * @type struct<miniLightsData>[]
 * @text Simple Full Light Preset[8]
 * @desc Simple Full Light Preset[8],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 *
 * @param miniLights9
 * @type struct<miniLightsData>[]
 * @text Simple Full Light Preset[9]
 * @desc Simple Full Light Preset[9],divide the lights to 0 1 2... to classify them in convenience.
 * @parent chaos
 * @default []
 *
 * @param region
 * @type struct<regionData>[]
 * @text Region Shadow
 * @desc Region Shadow
 * @parent chaos
 * @default []
 *
 * @param regionLights
 * @type struct<regionLightsData>[]
 * @text Region Light
 * @desc Region Light:generate Simple light on designated region.
 * @parent chaos
 * @default []
 *
 * @param characterShadowList
 * @type file[]
 * @dir img/lights
 * @text shadow image list 
 * @desc shadow image list.when you want to change the image of evnet`s shadow, you need to write the image`s name there.
 * @parent chaos
 * @default []
 *
 * @param shadowDefault
 * @text default shadow
 *
 * @param characterShadowDefault
 * @type struct<characterShadowDefaultDetail>
 * @text Event Shadow Default
 * @desc the default value of event shadow.
 * @parent shadowDefault
 * @default {"status":"false","tint":"#000000","opacity":"1","offsetX":"0","offsetY":"0","offsetDirX":"0~0~0~0","offsetDirY":"0~0~0~0","model":"D[]","yCut":"0"}
 *
 * @param playerShadowDefault
 * @type struct<playerShadowDefaultDetail>
 * @text Player Shadow Default
 * @desc the default value of player shadow.
 * @parent shadowDefault
 * @default {"status":"false","tint":"#000000","opacity":"1","offsetX":"0","offsetY":"0","offsetDirX":"0~0~0~0","offsetDirY":"0~0~0~0","model":"D[]","yCut":"0"}
 *
 * @param defaultSetting
 * @text other setting
 *
 * @param playerInitLight
 * @type text
 * @text Player Init Light Id
 * @desc Player Init Light Id
 * @parent defaultSetting
 * @default test
 *
 * @param maskInitColor
 * @type text
 * @text Ambient Color
 * @desc very black#191919,black#202020,normal#292929,bright#393939,very bright#555555,very very bright#666666
 * @parent defaultSetting
 * @default #292929
 *
 * @param hidePrimordialShadow
 * @type boolean
 * @text Hide Native Shadow
 * @desc Hide The Native Shadow of RPG Maker
 * @parent defaultSetting
 * @default true
 *
 * @param defaultOpen
 * @type boolean
 * @text Open Light Effect
 * @desc If Open Light Effect By Default
 * @parent defaultSetting
 * @default true
 *
 * @param lightLayerZ
 * @type boolean
 * @text show on picture
 * @desc if show lights on pictures
 * @parent defaultSetting
 * @default true
 *
 * @param timeSystem
 * @text time system
 *
 * @param timeSystemInit
 * @type boolean
 * @text use
 * @desc weather use time system
 * @parent timeSystem
 * @default false
 *
 * @param timeSystemStatus
 * @type boolean
 * @text time pass default
 * @desc time pass default
 * @parent timeSystem
 * @default false
 *
 * @param timeSystemSpeed
 * @type number
 * @text time pass speed
 * @desc one second in reality is equal to how many seconds in the game
 * @parent timeSystem
 * @default 360
 *
 * @param timeSystemMode
 * @type boolean
 * @text time system mode
 * @on use other time system
 * @off autonomous operation
 * @desc 
 * @parent timeSystem
 * @default false
 *
 * @param timeSystemData1
 * @type variable
 * @text Second Variable Id
 * @desc Second Variable Id(0-59)
 * @parent timeSystem
 * @default 21
 *
 * @param timeSystemData2
 * @type variable
 * @text Minite Variable Id
 * @desc Minite Variable Id(0-59)
 * @parent timeSystem
 * @default 22
 *
 * @param timeSystemData3
 * @type variable
 * @text Hour Variable Id
 * @desc Hour Variable Id(0-23)
 * @parent timeSystem
 * @default 23
 *
 * @param timeSystemSwitch
 * @type switch
 * @text Night Switch Id
 * @desc When it`s night, the switch becomes true.
 * @parent timeSystem
 * @default 20
 *
 * @param timeSystemMain
 * @type struct<timeSystemSettingList>[]
 * @text Hour Setting
 * @desc Hour Setting
 * @parent timeSystem
 * @default ["{\"startHour\":\"0\",\"indoorColor\":\"#292929\",\"outdoorColor\":\"#292929\",\"colorChangeDur\":\"30\",\"isNight\":\"true\"}","{\"startHour\":\"5\",\"indoorColor\":\"#555555\",\"outdoorColor\":\"#555555\",\"colorChangeDur\":\"30\",\"isNight\":\"false\"}","{\"startHour\":\"7\",\"indoorColor\":\"#888888\",\"outdoorColor\":\"#ffffff\",\"colorChangeDur\":\"30\",\"isNight\":\"false\"}","{\"startHour\":\"17\",\"indoorColor\":\"#ffa72e\",\"outdoorColor\":\"#ffa72e\",\"colorChangeDur\":\"30\",\"isNight\":\"false\"}","{\"startHour\":\"19\",\"indoorColor\":\"#555555\",\"outdoorColor\":\"#555555\",\"colorChangeDur\":\"30\",\"isNight\":\"false\"}","{\"startHour\":\"20\",\"indoorColor\":\"#292929\",\"outdoorColor\":\"#292929\",\"colorChangeDur\":\"30\",\"isNight\":\"true\"}"]
 *
 * @param timeSystemHub
 * @type struct<timeSystemHub>
 * @text UI 
 * @desc UI, you can choose to use the UI or not.
 * @parent timeSystem
 * @default {"timeSystemHubStatus":"false","timeSystemHub":"0","timeSystemHubX":"0","timeSystemHubY":"0","timeSystemHubImg1":"ColckImage","timeSystemHubImg2":"HourHand","timeSystemHubImg3":"MiniteHand","timeSystemHubImg4":"SecondHand"}
 *
*/
/*~struct~timeSystemSettingList:
 *
 * @param startHour
 * @type number
 * @text start hour
 * @desc start hour
 * @default 0
 *
 * @param indoorColor
 * @type text
 * @text indoor tint
 * @desc indoor tint
 * @default #000000
 *
 * @param outdoorColor
 * @type text
 * @text outdoor tint
 * @desc outdoor tint
 * @default #000000
 *
 * @param colorChangeDur
 * @type number
 * @text tint changing time
 * @desc tint changing time
 * @default 30
 *
 * @param isNight
 * @type boolean
 * @text night or not.
 * @desc this stage is night or not.
 * @default false
 *
 *
*/
/*~struct~timeSystemHub:
 *
 * @param timeSystemHubStatus
 * @type boolean
 * @text show ui by default
 * @desc show ui by default
 * @default false
 *
 * @param timeSystemHub
 * @type select
 * @text UI type
 * @desc UI type
 * @option clock
 * @value 0
 * @option text
 * @value 1
 * @default 0
 *
 * @param timeSystemHubX
 * @type number
 * @text UI x offset
 * @desc UI x offset
 * @default 0
 *
 * @param timeSystemHubY
 * @type number
 * @text UI y offset
 * @desc UI y offset
 * @default 0
 *
 * @param timeSystemHubImg1
 * @type file
 * @dir img/system/
 * @text clock dial img
 * @desc clock dial img
 * @default ColckImage
 *
 * @param timeSystemHubImg2
 * @type file
 * @dir img/system/
 * @text hour hand img
 * @desc hour hand img
 * @default HourHand
 *
 * @param timeSystemHubImg3
 * @type file
 * @dir img/system/
 * @text minite hand img
 * @desc minite hand img
 * @default MiniteHand
 *
 * @param timeSystemHubImg4
 * @type file
 * @dir img/system/
 * @text text UI background
 * @desc text UI background
 * @default NumberBackground
 *
*/
/*~struct~presetData:
 *
 * @param ======0
 *
 * @param id
 * @type text
 * @text light id
 * @desc light id
 * @default test
 *
 * @param ======1
 *
 * @param imgName
 * @type file
 * @dir img/lights
 * @text light image
 * @desc light image
 * @default circle
 *
 * @param ======2
 *
 * @param scaleX
 * @type text
 * @text x scale *
 * @desc x scale,0-1.
 * @default 1
 *
 * @param scaleY
 * @type text
 * @text y scale *
 * @desc y scale,0-1.
 * @default 1
 *
 * @param ======3
 *
 * @param tint
 * @type text
 * @text tint*
 * @desc tint.
 * @default #FFFFFF
 *
 * @param ======4
 *
 * @param offsetX
 * @type text
 * @text x offset*
 * @desc x offset*
 * @default 0
 *
 * @param offsetY
 * @type text
 * @text y offset*
 * @desc y offset*
 * @default 0
 *
 * @param dirOffsetX
 * @type text
 * @text x direction offset*
 * @desc x direction offset*.down~left~right~up
 * @default 0~0~0~0
 *
 * @param dirOffsetY
 * @type text
 * @text y direction offset*
 * @desc y direction offset*.down~left~right~up
 * @default 0~0~0~0
 *
 * @param ======5
 *
 * @param opacity
 * @type text
 * @text opacity*
 * @desc opacity,0-1.
 * @default 1
 *
 * @param randomFlickerOpacity
 * @type struct<randomFlickerOpacityData>
 * @text random flicker
 * @desc random flicker
 * @default {"status":"false","minIntervalTime":"10","maxIntervalTime":"180","fadeRate":"40","fadeTime":"6"}
 *
 * @param ======6
 *
 * @param rotation
 * @type text
 * @text rotation*
 * @desc rotation,0-360.
 * @default 0
 *
 * @param rotationMouse
 * @type boolean
 * @text Facing the mouse
 * @desc Whether to attach the angle towards the mouse. After turning on this switch, it is best to set other angles to 0.
 * @default false
 *
 * @param dirRotation
 * @type text
 * @text direction rotation
 * @desc direction rotation.down~left~right~up.e.g: 180~270~90~0
 * @default 0~0~0~0
 *
 * @param dirRotationFrame
 * @type text
 * @text direction rotation speed
 * @desc direction rotation speed.The recommended value is 10.
 * @default 0
 *
 * @param rotationAuto
 * @type text
 * @text roation speed
 * @desc roation speed,if the speed>0,the light will rotate auto.
 * @default 0
 *
 * @param ======7
 *
 * @param shadowWall
 * @type boolean
 * @text show Region Shadow
 * @desc show Region Shadow
 * @default false
 *
 * @param ======8
 *
 * @param shadowCharacter
 * @type boolean
 * @text show Events/Player Shadow
 * @desc show Events/Player Shadow
 * @default false
 *
 * @param shadowCharacterOffsetX
 * @type text
 * @text Projection point x offset
 * @desc Projection point x offset
 * @default 0
 *
 * @param shadowCharacterOffsetY
 * @type text
 * @text Projection point y offset
 * @desc Projection point y offset
 * @default 0
 *
 * @param shadowCharacterMaxOpacity
 * @type text
 * @text shadow opacity
 * @desc shadow opacity
 * @default 0.6
 *
 * @param shadowCharacterMaxDistance
 * @type text
 * @text max shadow radius
 * @desc max shadow radius
 * @default 150
 *
 * @param shadowCharacterShakeX
 * @type select
 * @text shadow jitter
 * @desc shadow jitter
 * @default 1
 * @option no shaker
 * @value 1
 * @option Slight jitter
 * @value 40|1~5/1.01~5/1~10|1~5/1.01~5/1
 * @option General jitter
 * @value 40|1~5/1.02~5/1~10|1~5/1.02~5/1
 * @option Strong jitter
 * @value 40|1~5/1.03~5/1~10|1~5/1.03~5/1
 * @option Very Strong jitter
 * @value 40|1~5/1.04~5/1~10|1~5/1.04~5/1
 *
 * @param ======9
 *
 * 
 *
*/
/*~struct~randomFlickerOpacityData:
 *
 * @param status
 * @type boolean
 * @text whether to activate random flicker
 * @desc whether to activate random flicker
 * @default false
 *
 * @param minIntervalTime
 * @type number
 * @min 1
 * @text min flicker interval time
 * @desc min flicker interval time
 * @default 10
 *
 * @param maxIntervalTime
 * @type number
 * @min 1
 * @text max flicker interval time
 * @desc max flicker interval time
 * @default 180
 *
 * @param fadeRate
 * @type text
 * @text dimming degree(%)
 * @desc dimming degree(%)
 * @default 40
 *
 * @param fadeTime
 * @type text
 * @text single flashing duration
 * @desc single flashing duration
 * @default 8
 *
*/
/*~struct~regionLightsData:
 *
 * @param ======0
 *
 * @param id
 * @type number
 * @min 1
 * @max 255
 * @text region id
 * @desc region id
 * @default 1
 *
 * @param lightId
 * @type text
 * @text Simple Light Id
 * @desc Simple Light Id
 * @default 1
 *
 * @param ======1
 *
 * @param showCondition
 * @type select
 * @text show condition
 * @desc show condition
 * @default 0
 * @option always show
 * @value 0
 * @option Displayed when the player is in this region.
 * @value 1
 * @option Displayed when the player is in this tile.
 * @value 2
 *
 * @param showConditionExtra
 * @type note
 * @text extra show condition
 * @desc extra show condition(js).return the boolean to decide if light shows.
 * @default ""
 *
 *
 * @param ======2
 *
*/
/*~struct~miniLightsData:
 *
 *
 * @param ======0
 *
 * @param id
 * @type text
 * @text Simple Light Id
 * @desc Simple Light Id
 * @default 1
 *
 * @param ======1
 *
 * @param imgName
 * @type file
 * @dir img/lights
 * @text image
 * @desc image
 * @default circle
 *
 * @param ======2
 *
 * @param scaleX
 * @type text
 * @text x scale *
 * @desc x scale ,0-1.
 * @default 1
 *
 * @param scaleY
 * @type text
 * @text y scale *
 * @desc y scale ,0-1.
 * @default 1
 *
 * @param ======3
 *
 * @param tint
 * @type text
 * @text tint*
 * @desc tint.
 * @default #FFFFFF
 *
 * @param ======4
 *
 * @param offsetX
 * @type text
 * @text x offset*
 * @desc x offset.
 * @default 0
 *
 * @param offsetY
 * @type text
 * @text y offset*
 * @desc y offset.
 * @default 0
 *
 * @param ======5
 *
 * @param opacity
 * @type text
 * @text opacity*
 * @desc opacity,0-1.
 * @default 1
 *
 * @param ======6
 *
 * @param rotation
 * @type text
 * @text roattion*
 * @desc roattion,0-360.
 * @default 0
 *
 * @param ======7
 *
 * 
 *
*/
/*~struct~regionData:
 *
 * @param ======0
 * @default 
 *
 * @param id
 * @type number
 * @min 1
 * @max 255
 * @text region id
 * @desc region id
 * @default 1
 *
 * @param ======1
 *
 * @param rectOpacity
 * @type text
 * @text shelter opacity
 * @desc shelter opacity,0-1.
 * @default 1
 *
 * @param rectTint
 * @type text
 * @text shelter tint.
 * @desc shelter tint.
 * @default #000000
 *
 * @param rectShape
 * @type select
 * @text shelter shape
 * @desc shelter shape
 * @default [{t:0,x:0,y:0},{t:0,x:48,y:0},{t:0,x:48,y:48},{t:0,x:0,y:48}]
 * @option no shelter
 * @value []
 * @option square(48*48)
 * @value [{t:0,x:0,y:0},{t:0,x:48,y:0},{t:0,x:48,y:48},{t:0,x:0,y:48}]
 * @option 1/2 square(24*24)
 * @value [{t:0,x:12,y:12},{t:0,x:36,y:12},{t:0,x:36,y:36},{t:0,x:12,y:36}]
 * @option circle(48*48)
 * @value [{t:1,x:24,y:0,r:24},{t:1,x:24,y:48,r:24}]
 * @option 1/2 circle(48*48)
 * @value [{t:1,x:24,y:12,r:12},{t:1,x:24,y:36,r:12}]
 * @option upper left square(48*48)
 * @value [{t:0,x:0,y:0},{t:0,x:48,y:0},{t:0,x:0,y:48}]
 * @option upper right square(48*48)
 * @value [{t:0,x:0,y:0},{t:0,x:48,y:0},{t:0,x:48,y:48}]
 * @option lower right square(48*48)
 * @value [{t:0,x:48,y:0},{t:0,x:48,y:48},{t:0,x:0,y:48}]
 * @option lower left square(48*48)
 * @value [{t:0,x:0,y:0},{t:0,x:48,y:48},{t:0,x:0,y:48}]
 * @option upper left 1/4 circle(48*48)
 * @value [{t:0,x:0,y:0},{t:1,x:48,y:0,r:48},{t:0,x:0,y:48}]
 * @option upper right 1/4 circle(48*48)
 * @value [{t:0,x:48,y:0},{t:1,x:48,y:48,r:48},{t:0,x:0,y:0}]
 * @option lower right1/4 circle(48*48)
 * @value [{t:0,x:48,y:48},{t:1,x:0,y:48,r:48},{t:0,x:48,y:0}]
 * @option lower left1/4 circle(48*48)
 * @value [{t:0,x:0,y:48},{t:1,x:0,y:0,r:48},{t:0,x:48,y:48}]
 * @option upper left  square1/2(24*24)
 * @value [{t:0,x:0,y:0},{t:0,x:24,y:0},{t:0,x:0,y:24}]
 * @option upper right  square1/2(24*24)
 * @value [{t:0,x:24,y:0},{t:0,x:48,y:0},{t:0,x:48,y:24}]
 * @option lower right square1/2(24*24)
 * @value [{t:0,x:48,y:24},{t:0,x:48,y:48},{t:0,x:24,y:48}]
 * @option lower left square1/2(24*24)
 * @value [{t:0,x:0,y:24},{t:0,x:24,y:48},{t:0,x:0,y:48}]
 * @option upper left 1/4 circle1/2(24*24)
 * @value [{t:0,x:0,y:0},{t:1,x:24,y:0,r:24},{t:0,x:0,y:24}]
 * @option upper right 1/4 circle1/2(24*24)
 * @value [{t:0,x:48,y:0},{t:1,x:48,y:24,r:24},{t:0,x:24,y:0}]
 * @option lower right1/4 circle1/2(24*24)
 * @value [{t:0,x:48,y:48},{t:1,x:24,y:48,r:24},{t:0,x:48,y:24}]
 * @option lower left1/4 circle1/2(24*24)
 * @value [{t:0,x:0,y:48},{t:1,x:0,y:24,r:24},{t:0,x:24,y:48}]
 * @option left 1/2 circle(24*48)
 * @value [{t:0,x:0,y:0},{t:3,x:0,y:48,r:24},{t:0,x:0,y:0}]
 * @option upper 1/2 circle(48*24)
 * @value [{t:0,x:48,y:0},{t:3,x:0,y:0,r:24},{t:0,x:48,y:0}]
 * @option right 1/2 circle(24*48)
 * @value [{t:0,x:48,y:48},{t:3,x:48,y:0,r:24},{t:0,x:48,y:48}]
 * @option lower 1/2 circle(48*24)
 * @value [{t:0,x:0,y:48},{t:3,x:48,y:48,r:24},{t:0,x:0,y:48}]
 *
 * @param ======2
 *
 * @param shadowShow
 * @type boolean
 * @text ultra shadow
 * @desc if generate the ultra shadow
 * @default false
 *
 * @param shadowHeight
 * @type number
 * @min 0
 * @max 8
 * @text ultra shadow height
 * @desc ultra shadow height
 * @default 0
 *
 * @param shadowTint
 * @type text
 * @text ultra shadow color
 * @desc ultra shadow color
 * @default #000000
 *
 * @param ======3
 *
*/
/*~struct~characterShadowDefaultDetail:
 *
 * @param status
 * @type boolean
 * @text show or colse by default
 * @desc show or colse by default
 * @default false
 *
 * @param tint
 * @type text
 * @text shadow tint
 * @desc shadow tint,black#000000,white#ffffff.
 * @default #000000
 *
 * @param opacity
 * @type text
 * @text opacity
 * @desc opacity
 * @default 1
 *
 * @param offsetX
 * @type number
 * @text shadow x offset
 * @desc shadow x offset
 * @default 0
 *
 * @param offsetY
 * @type number
 * @text shadow y offset
 * @desc shadow y offset
 * @default 0
 *
 * @param offsetDirX
 * @type text
 * @text shadow x direction offset
 * @desc shadow x direction offset
 * @default 0~0~0~0
 *
 * @param offsetDirY
 * @type text
 * @text shadow y direction offset
 * @desc shadow y direction offset
 * @default 0~0~0~0
 *
 * @param model
 * @type text
 * @text projection model
 * @desc projection model
 * @default D[]
 *
 * @param yCut
 * @type text
 * @text yCut
 * @desc yCut
 * @default 0
 *
*/
/*~struct~playerShadowDefaultDetail:
 *
 * @param status
 * @type boolean
 * @text show or colse by default
 * @desc show or colse by default
 * @default false
 *
 * @param tint
 * @type text
 * @text shadow tint
 * @desc shadow tint,black#000000,white#ffffff.
 * @default #000000
 *
 * @param opacity
 * @type text
 * @text opacity
 * @desc opacity
 * @default 1
 *
 * @param offsetX
 * @type number
 * @text shadow x offset
 * @desc shadow x offset
 * @default 0
 *
 * @param offsetY
 * @type number
 * @text shadow y offset
 * @desc shadow y offset
 * @default 0
 *
 * @param offsetDirX
 * @type text
 * @text shadow x offset
 * @desc shadow x offset
 * @default 0~0~0~0
 *
 * @param offsetDirY
 * @type text
 * @text shadow y offset
 * @desc shadow y offset
 * @default 0~0~0~0
 *
 * @param model
 * @type text
 * @text projection model
 * @desc projection model
 * @default D[]
 *
 * @param yCut
 * @type text
 * @text yCut
 * @desc yCut
 * @default 0
 *
*/
//==========================================================
//
//==========================================================
var QJ = QJ || {};
QJ.LL = QJ.LL || {};
var Imported = Imported || {};
Imported.QJLighting = true;
//==========================================================
//
//==========================================================
QJ.LL.globalText = [
"PIXI version is low.",
"The image load fail.Image name is: ",
"No Shadow Name.",
"No such Full Light.Light Name is: ",
"No such Simple Light.Light Name is: ",
"No such Simple Light(show on region).Region Id and Light Name is: ",
"No such Simple Light(QJ.LL.tempLight).Light Name is: "
];
QJ.LL.error = (content)=>{throw new Error(content+".");}
QJ.LL.isOnMapAndHaveLoaded = function() {
    return SceneManager._scene&&SceneManager._scene._spriteset&&
        SceneManager._scene.constructor.name == "Scene_Map";
}
//==========================================================
//
//==========================================================
//if (Number(PIXI.VERSION[0])<5) {throw new Error(QJ.LL.globalText[0]);}
//==========================================================
//
//==========================================================
function QJFrameLight() {
    this.initialize.apply(this, arguments);
}
function Game_QJLightLayer() {
    this.initialize.apply(this, arguments);
}
function Game_QJLightLayerMini() {
    this.initialize.apply(this, arguments);
}
function Sprite_QJLightSystem() {
    this.initialize.apply(this, arguments);
}
function Sprite_QJLightLayer() {
    this.initialize.apply(this, arguments);
}
function Sprite_QJLightLayerMini() {
    this.initialize.apply(this, arguments);
}
function Sprite_timeSystemSpriteQJ() {
    this.initialize.apply(this, arguments);
}
function Sprite_QJLLContainer() {
    this.initialize.apply(this, arguments);
}
function Filter_QJLight() {
    this.initialize.apply(this, arguments);
}
function Sprite_QJCharacterShadowLayer() {
    this.initialize.apply(this, arguments);
}
//==========================================================
//
//==========================================================
(($ = {})=>{
//==========================================================
//preset
//==========================================================
const pluginName = "QJ-Lighting";
const parameters = PluginManager.parameters(pluginName);
const hidePrimordialShadow = eval(parameters.hidePrimordialShadow);
const characterShadowPresetList = [];
const characterShadowDefault = JsonEx.parse(parameters.characterShadowDefault);
const playerShadowDefault = JsonEx.parse(parameters.playerShadowDefault);
const characterShadowPresetListTexture = {};
const presetDataList = {};
const miniLightsData = {};
const regionLightsData = {};
const regionData = {};
const saveTexture = {};//save texture to pretend reloading or rerendering
const standardTile = 48;//standardTile
const standardExpand = QJ.LL.standardExpand = 96;//standardExpand
const lightLayerZ = eval(parameters.lightLayerZ);
//==========================================================
//
//==========================================================
let dx=0,dy=0,dx48=0,dy48=0,gw=0,gh=0,gws=0,ghs=0;//map display x/y.graphhics width/height.
//============================
//============================
//============================
//============================
//============================
//============================
//==========================================================
//ImageManager
//==========================================================
ImageManager.loadLightQJLL = function(filename) {
    let bit = this.loadBitmap('img/lights/', filename);
    bit._name = filename;
    return bit;
};
//==========================================================
//
//==========================================================
let mouseX=0,mouseY=0;
const LL_TouchInput__onTouchMove = TouchInput._onTouchMove;
TouchInput._onTouchMove = function(event) {
    LL_TouchInput__onTouchMove.call(this,event);
    mouseX = Graphics.pageToCanvasX(event.pageX);
    mouseY = Graphics.pageToCanvasY(event.pageY);
};
const LL_TouchInput__onMouseMove = TouchInput._onMouseMove;
TouchInput._onMouseMove = function(event) {
    LL_TouchInput__onMouseMove.call(this,event);
    mouseX = Graphics.pageToCanvasX(event.pageX);
    mouseY = Graphics.pageToCanvasY(event.pageY);
};
//==========================================================
//
//==========================================================
QJ.LL.calculateAngleByTwoPoint=function(x,y,ex,ey){
    let ro;
    if (ex>x&&ey<y)  ro=(-Math.atan((x-ex)/(y-ey)));
    if (ex>x&&ey>y)  ro=(Math.PI-Math.atan((x-ex)/(y-ey)));
    if (ex<x&&ey>y)  ro=(Math.PI-Math.atan((x-ex)/(y-ey)));
    if (ex<x&&ey<y)  ro=(2*Math.PI-Math.atan((x-ex)/(y-ey)));
    if (ex==x&&ey>y) ro=Math.PI;
    if (ex==x&&ey<y) ro=0;
    if (ex>x&&ey==y) ro=Math.PI/2;
    if (ex<x&&ey==y) ro=Math.PI*3/2;
    if (ex==x&&ey==y)ro=null;
    return ro;
};
QJ.LL.calculateShape = function(data) {
    if (!data||data.length==0) return [];
    for (let i=0,il=data.length,
        cpx,cpy,r,x,y,nx,ny,chax,chay,cx,cy,pl,al,initX=data[0].x,initY=data[0].y;i<il;i++) {
        if (data[i].t==0) continue;
        else if (data[i].t==5) {
            initX=data[i].x;
            initY=data[i].y;
            continue;
        }
        x = data[i].x;
        y = data[i].y;
        nx = data[i+1]?data[i+1].x:initX;
        ny = data[i+1]?data[i+1].y:initY;
        chax = x-nx;
        chay = y-ny;
        r = data[i].r;
        cpx = (x+nx)/2;
        cpy = (y+ny)/2;
        pl = Math.sqrt(chax*chax+chay*chay);
        al = Math.sqrt(r*r-pl*pl/4);
        if (data[i].t==1) {
            data[i].cx = cpx+al*(chay/pl||0);
            data[i].cy = cpy-al*(chax/pl||0);
            data[i].ccw = false;
        } else if (data[i].t==2) {
            data[i].cx = cpx+al*(chay/pl||0);
            data[i].cy = cpy-al*(chax/pl||0);
            data[i].ccw = false;
        } else if (data[i].t==3) {
            data[i].cx = cpx-al*(chay/pl||0);
            data[i].cy = cpy+al*(chax/pl||0);
            data[i].ccw = true;
        } else if (data[i].t==4) {
            data[i].cx = cpx-al*(chay/pl||0);
            data[i].cy = cpy+al*(chax/pl||0);
            data[i].ccw = true;
        }
        data[i].cx = Math.round(data[i].cx);
        data[i].cy = Math.round(data[i].cy);
        data[i].sa = QJ.LL.calculateAngleByTwoPoint(data[i].cx,data[i].cy, x, y)-Math.PI/2;
        data[i].ea = QJ.LL.calculateAngleByTwoPoint(data[i].cx,data[i].cy,nx,ny)-Math.PI/2;
    }
    return data;
};
QJ.LL.calculateDirAttribute = function(data,attributeName,rotate) {
    try{
        let detail = data[attributeName].split("~");
        if (detail.length==4) {
            data[attributeName] = [0,0,Number(detail[0])*(rotate?Math.PI/180:1),0,Number(detail[1])*(rotate?Math.PI/180:1),0,
                Number(detail[2])*(rotate?Math.PI/180:1),0,Number(detail[3])*(rotate?Math.PI/180:1),0];
        } else {
            data[attributeName] = [0,
                Number(detail[0])*(rotate?Math.PI/180:1),
                Number(detail[1])*(rotate?Math.PI/180:1),
                Number(detail[2])*(rotate?Math.PI/180:1),
                Number(detail[3])*(rotate?Math.PI/180:1),
                0,
                Number(detail[4])*(rotate?Math.PI/180:1),
                Number(detail[5])*(rotate?Math.PI/180:1),
                Number(detail[6])*(rotate?Math.PI/180:1),
                Number(detail[7])*(rotate?Math.PI/180:1)];
        }
    } catch(e) {
        QJ.LL.error(attributeName + " can not be "+data[attributeName]);
    }
};
QJ.LL.getCSModel = function(value) {
    if (value[0]=="D") {
        if (value[1]=="[") {
            return [0,0];
        } else if (value[1]=="M") {
            return [0,1,Number(value.match(/DM\[([^\]]+)\]/)[1])];
        } else if (value[1]=="W") {
            return [0,2,Number(value.match(/DW\[([^\]]+)\]/)[1])];
        }
    } else if (value[0]=="B") {
        if (value[1]=="[") {
            return [1,0];
        } else if (value[1]=="M") {
            return [1,1,Number(value.match(/BM\[([^\]]+)\]/)[1])];
        } else if (value[1]=="W") {
            return [1,2,Number(value.match(/BW\[([^\]]+)\]/)[1])];
        }
    }
    return [0,0];
};
(()=>{
    //===================================
    let detail;
    //===================================
    characterShadowDefault.status=eval(characterShadowDefault.status);
    characterShadowDefault.opacity=Number(characterShadowDefault.opacity);
    characterShadowDefault.offsetX=Number(characterShadowDefault.offsetX);
    characterShadowDefault.offsetY=Number(characterShadowDefault.offsetY);
    characterShadowDefault.yCut=Number(characterShadowDefault.yCut);
    //===================================
    playerShadowDefault.status=eval(playerShadowDefault.status);
    playerShadowDefault.opacity=Number(playerShadowDefault.opacity);
    playerShadowDefault.offsetX=Number(playerShadowDefault.offsetX);
    playerShadowDefault.offsetY=Number(playerShadowDefault.offsetY);
    playerShadowDefault.yCut=Number(playerShadowDefault.yCut);
    QJ.LL.calculateDirAttribute(playerShadowDefault,"offsetDirX");
    QJ.LL.calculateDirAttribute(playerShadowDefault,"offsetDirY");
    playerShadowDefault.model=QJ.LL.getCSModel(playerShadowDefault.model);
    //===================================
    let sR=eval(parameters.region);
    for (let i of sR) {
        detail = JsonEx.parse(i);
        detail.id = Number(detail.id);
        detail.rectOpacity = Number(detail.rectOpacity);
        detail.rectTint = detail.rectTint;
        detail.rectShape = QJ.LL.calculateShape(eval(detail.rectShape));
        detail.shadowShow = eval(detail.shadowShow);
        detail.shadowOpacity = 1;//Number(detail.shadowOpacity);
        detail.shadowTint = Number("0x"+detail.shadowTint.substr(1));
        detail.shadowHeight = Number(detail.shadowHeight);
        regionData[detail.id] = detail;
    }
    //===================================
    let ps=eval(parameters.lightPreset);
    for (let i=1;i<=9;i++) ps.push.apply(ps,eval(parameters["lightPreset"+i]));
    for (let i of ps) {
        detail = JsonEx.parse(i);
        //===============================================
        detail.character = null;
        detail.anchorX=0.5;
        detail.anchorY=0.5;
        //===============================================
        QJ.LL.calculateDirAttribute(detail,"dirOffsetX");
        QJ.LL.calculateDirAttribute(detail,"dirOffsetY");
        QJ.LL.calculateDirAttribute(detail,"dirRotation",true);
        //===============================================
        saveTexture[detail.imgName] = detail.imgName;
        detail.dirRotationFrame = Number(detail.dirRotationFrame);
        detail.rotationAuto = Number(detail.rotationAuto)*Math.PI/180;
        detail.shadowCharacter = eval(detail.shadowCharacter);
        detail.shadowWall = eval(detail.shadowWall);
        detail.shadowCharacterOffsetX = Number(detail.shadowCharacterOffsetX);
        detail.shadowCharacterOffsetY = Number(detail.shadowCharacterOffsetY);
        detail.shadowCharacterMaxOpacity = Number(detail.shadowCharacterMaxOpacity);
        detail.shadowCharacterMaxDistance = Number(detail.shadowCharacterMaxDistance);
        //===============================================
        detail.rotationMouse = detail.rotationMouse?eval(detail.rotationMouse):false;
        if (detail.randomFlickerOpacity!==undefined) {
            let tempData = JsonEx.parse(detail.randomFlickerOpacity);
            detail.randomFlickerOpacity = {
                status:tempData.status==="true"?true:false,
                minIntervalTime:Number(tempData.minIntervalTime),
                maxIntervalTime:Number(tempData.maxIntervalTime),
                fadeRate:Number(tempData.fadeRate),
                fadeTime:Number(tempData.fadeTime)
            };
        } else {
            detail.randomFlickerOpacity = null;
        }
        //===============================================
        presetDataList[detail.id] = detail;
        //===============================================
    }
    //===================================
    ps=eval(parameters.miniLights);
    for (let i=1;i<=9;i++) ps.push.apply(ps,eval(parameters["miniLights"+i]));
    for (let i of ps) {
        detail = JsonEx.parse(i);
        //===============================================
        saveTexture[detail.imgName] = detail.imgName;
        detail.anchorX=0.5;
        detail.anchorY=0.5;
        detail.during = -1;
        //===============================================
        miniLightsData[detail.id] = detail;
        //===============================================
    }
    //===================================
    ps=eval(parameters.regionLights);
    for (let i of ps) {
        detail = JsonEx.parse(i);
        //===============================================
        if (miniLightsData[detail.lightId]) {
            regionLightsData[Number(detail.id)] = JsonEx.makeDeepCopy(miniLightsData[detail.lightId]);
            regionLightsData[Number(detail.id)].showCondition = Number(detail.showCondition);
            regionLightsData[Number(detail.id)].showConditionExtra = detail.showConditionExtra.length>2?
                eval("(function(ifShow){"+eval(detail.showConditionExtra)+"})"):null;
        } else {
            QJ.LL.error(QJ.LL.globalText[5]+id+" "+detail.lightId);
        }
        //===============================================
    }
    //===================================
    for (let i of characterShadowPresetList) {
        characterShadowPresetListTexture[i] = i;
    }
    //===================================
})();
//==========================================================
//hidePrimordialShadow
//==========================================================
if (hidePrimordialShadow) {
    Tilemap.prototype._addShadow = function(bitmap, shadowBits, dx, dy) {
    
    };
}
//==========================================================
//saveTexture
//==========================================================
$.Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function() {
    if (!$.Scene_Boot_isReady.apply(this,arguments)) {
        return false;
    }
    if (!DataManager.LightingQJPreLoad) {
        for (let i in saveTexture) {
            saveTexture[i] = ImageManager.loadLightQJLL(saveTexture[i]);
        }
        for (let i in characterShadowPresetListTexture) {
            characterShadowPresetListTexture[i] = ImageManager.loadLightQJLL(characterShadowPresetListTexture[i]);
        }
        DataManager.LightingQJPreLoad = true;
    }
    if (!DataManager.LightingQJPreLoadOver) {
        for (let i in saveTexture) {
            if (!saveTexture[i]) return false;
            if (!saveTexture[i].width) return false;
            if (!saveTexture[i].copyTexture) {
                QJ.LL.addTexture(i,saveTexture[i]);
            }
        }
        for (let i in characterShadowPresetListTexture) {
            if (!characterShadowPresetListTexture[i]) return false;
            if (!characterShadowPresetListTexture[i].width) return false;
            if (!characterShadowPresetListTexture[i].copyTexture) {
                QJ.LL.addShadowTexture(i,characterShadowPresetListTexture[i]);
            }
        }
        QJ.LL.addMaskTexture("#000000",gws,ghs);
        DataManager.LightingQJPreLoadOver = true;
    }
    //==================================
    return true;
};
//==========================================================
//saveTexture
//==========================================================
QJ.LL.generateMultiTextureShader = function() {
    let vertexSrc = `
        precision highp float;
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;
        attribute vec4 aColor;
        attribute float aTextureId;
        uniform mat3 projectionMatrix;
        varying vec2 vTextureCoord;
        varying vec4 vColor;
        varying float vTextureId;
        void main(void){
            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            vTextureCoord = aTextureCoord;
            vTextureId = aTextureId;
            vColor = aColor;
        }
    `;
    let fragmentSrc = `
        varying vec2 vTextureCoord;
        varying vec4 vColor;
        varying float vTextureId;
        uniform sampler2D uSamplers[2];
        uniform float sRSin;
        uniform float sRCos;
        uniform float sROffsetX;
        uniform float sROffsetY;
        uniform float sRScaleX;
        uniform float sRScaleY;
        uniform float sRScaleX2;
        uniform float sRScaleY2;
        uniform float frameX;
        uniform float frameY;
        uniform float frameW;
        uniform float frameH;
        uniform float startX;
        uniform float startY;
        void main(void){
            if (vTextureCoord.x<startX||vTextureCoord.y<startY||vTextureCoord.x>1.0-startX||vTextureCoord.y>1.0-startY) {
                gl_FragColor = vec4(0,0,0,0);
            } else {
                vec4 color0 = texture2D(uSamplers[0],vec2(
                    (vTextureCoord.x-startX)/(1.0-2.0*startX)/frameW+frameX,
                    (vTextureCoord.y-startY)/(1.0-2.0*startY)/frameH+frameY));
                vec4 color1 = texture2D(uSamplers[1],vec2(
                    (vTextureCoord.x*sRCos*sRScaleX-vTextureCoord.y*sRSin*sRScaleY)*sRScaleX2+sROffsetX,
                    (vTextureCoord.y*sRCos*sRScaleY+vTextureCoord.x*sRSin*sRScaleX)*sRScaleY2+sROffsetY));
                gl_FragColor = color0 * color1 * vColor;
                
            }
        }
    `;
    return new PIXI.Shader.from(vertexSrc, fragmentSrc, {
        uSamplers: [0,1],
        projectionMatrix: new PIXI.Matrix(),
        sRSin:0,
        sRCos:0,
        sROffsetX:0,
        sROffsetY:0,
        sRScaleX:0,
        sRScaleY:0,
        sRScaleX2:0,
        sRScaleY2:0,
        frameX:0,
        frameY:0,
        frameW:0,
        frameH:0,
        startX:0,
        startY:0
    });
}
//==========================================================
//saveTexture
//==========================================================
QJ.LL.addShadowTexture = function(imgName,bitmap) {
    let lsCanvas = document.createElement('canvas');
    let lscontext = lsCanvas.getContext('2d');
    let lsBaseTexture = null;
    let w=bitmap.width,h=bitmap.height;
    lsCanvas.width = w;
    lsCanvas.height = h;
    lsBaseTexture = new PIXI.BaseTexture(lsCanvas);
    lsBaseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
    lsBaseTexture.width = w;
    lsBaseTexture.height = h;
    lscontext.globalCompositeOperation = 'source-over';
    lscontext.drawImage(bitmap._canvas?bitmap._canvas:bitmap._image,0,0,w,h,0,0,w,h);
    lsBaseTexture.update();
    lsBaseTexture.copyTexture = true;
    characterShadowPresetListTexture[imgName] = lsBaseTexture;
};
QJ.LL.addTexture = function(imgName,bitmap) {
    let lsCanvas = document.createElement('canvas');
    let lscontext = lsCanvas.getContext('2d');
    let lsBaseTexture = null;
    let w=bitmap.width,h=bitmap.height;
    lsCanvas.width = w;
    lsCanvas.height = h;
    lsBaseTexture = new PIXI.BaseTexture(lsCanvas);
    lsBaseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
    lsBaseTexture.width = w;
    lsBaseTexture.height = h;
    lscontext.globalCompositeOperation = 'source-over';
    lscontext.drawImage(bitmap._canvas?bitmap._canvas:bitmap._image,0,0,w,h,0,0,w,h);
    lsBaseTexture.update();
    lsBaseTexture.copyTexture = true;
    saveTexture[imgName] = lsBaseTexture;
};
QJ.LL.addMaskTexture  = function(color,w,h) {
    let lsCanvas = document.createElement('canvas');
    let lscontext = lsCanvas.getContext('2d');
    let lsBaseTexture = null;
    lsCanvas.width = w;
    lsCanvas.height = h;
    lsBaseTexture = new PIXI.BaseTexture(lsCanvas);
    lsBaseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
    lsBaseTexture.width = w;
    lsBaseTexture.height = h;
    lscontext.fillStyle = color;
    lscontext.fillRect(0,0,w,h);
    lsBaseTexture.update();
    lsBaseTexture.copyTexture = true;
    saveTexture["___"] = lsBaseTexture;
};
QJ.LL.findSprite = function(character) {
    if (!QJ.LL.isOnMapAndHaveLoaded()) return null;
    for (let i of SceneManager._scene._spriteset._characterSprites) {
        if (i._character == character) return i;
    }
    return null;
}
QJ.LL.getCharacter = function(id) {
    if (id==-1) return $gamePlayer;
    else return $gameMap.event(id);
}
QJ.LL.calculateAnnotation = function(event) {
    let page=null,content="";
    try{
        page=event.page();
    } catch(e) {
        page=null;
    }
    if (page) {
        if (page.list[0].code === 108) {
            let i=0;
            while (page.list[i].code === 408 || page.list[i].code === 108) {
                content=content + page.list[i].parameters[0];
                i++;
            }
        }
    }
    return content;
};
QJ.LL.getLLData = function(event,annotation) {
    if (annotation.length<=0) return "";
    let detail = annotation.match(/<QJLL:[^>]*>/i);
    return detail?(detail[0].substr(6,detail[0].length-7)):"";
}
QJ.LL.getLLDataDetail = function(detail,annotation) {
    for (let i=0,id=annotation.match(/<QJLL-[^:]*:[^>]*>/ig)||[],il=id.length,detailData;i<il;i++) {
        detailData = id[i].match(/<QJLL-([^:]*):([^>]*)>/i);
        detail[detailData[1]] = detailData[2];
        if (detailData[1]=="dirOffsetX") QJ.LL.calculateDirAttribute(detail,"dirOffsetX");
        else if (detailData[1]=="dirOffsetY") QJ.LL.calculateDirAttribute(detail,"dirOffsetY");
        else if (detailData[1]=="dirRotation") QJ.LL.calculateDirAttribute(detail,"dirRotation",true);
        else if (detailData[1]=="dirRotationFrame") detail.dirRotationFrame = Number(detail.dirRotationFrame);
        else if (detailData[1]=="rotationAuto") detail.rotationAuto = Number(detail.rotationAuto)*Math.PI/180;
        else if (detailData[1]=="shadowCharacter") detail.shadowCharacter = eval(detail.shadowCharacter);
        else if (detailData[1]=="shadowWall") detail.shadowWall = eval(detail.shadowWall);
        else if (detailData[1]=="shadowCharacterMaxOpacity") detail.shadowCharacterMaxOpacity = Number(detail.shadowCharacterMaxOpacity);
        else if (detailData[1]=="shadowCharacterMaxDistance") detail.shadowCharacterMaxDistance = Number(detail.shadowCharacterMaxDistance);
        else if (detailData[1]=="rotationMouse") detail.rotationMouse = eval(detail.rotationMouse);
    }
}
QJ.LL.getCSData = function(detail,annotation) {
    let csData = JsonEx.makeDeepCopy(characterShadowDefault);
    csData.imgName = '';
    for (let i=0,id=annotation.match(/<QJCS-[^:]*:[^>]*>/ig)||[],il=id.length,detailData;i<il;i++) {
        detailData = id[i].match(/<QJCS-([^:]*):([^>]*)>/i);
        csData[detailData[1]] = detailData[2];
    }
    csData.model=QJ.LL.getCSModel(csData.model);
    QJ.LL.calculateDirAttribute(csData,"offsetDirX");
    QJ.LL.calculateDirAttribute(csData,"offsetDirY");
    csData.offsetX=Number(csData.offsetX);
    csData.offsetY=Number(csData.offsetY);
    csData.opacity=Number(csData.opacity);
    csData.status=eval(csData.status);
    csData.tint=Number("0x"+csData.tint.substr(1));
    csData.yCut=Number(csData.yCut);
    return csData;
}
QJ.LL.preset = function(id,character) {
    //===============================================
    if (!presetDataList[id]) {
        QJ.LL.error(QJ.LL.globalText[3]+id);
    }
    //===============================================
    let detail = JsonEx.makeDeepCopy(presetDataList[id]);
    //===============================================
    if (character) QJ.LL.getLLDataDetail(detail,character.annotation);
    //===============================================
    detail.scaleX = new QJFrameLight("scaleX",detail.scaleX,0);
    detail.scaleY = new QJFrameLight("scaleY",detail.scaleY,0);
    detail.tint = new QJFrameLight("tint",detail.tint,1);
    detail.offsetX = new QJFrameLight("offsetX",detail.offsetX,0);
    detail.offsetY = new QJFrameLight("offsetY",detail.offsetY,0);
    detail.opacity = new QJFrameLight("opacity",detail.opacity,0);
    detail.shadowCharacterOffsetX = new QJFrameLight("shadowCharacterOffsetX",detail.shadowCharacterOffsetX,0);
    detail.shadowCharacterOffsetY = new QJFrameLight("shadowCharacterOffsetY",detail.shadowCharacterOffsetY,0);
    detail.rotation = new QJFrameLight("rotation",detail.rotation,2);
    detail.shadowCharacterShakeX = new QJFrameLight("shadowCharacterShakeX",detail.shadowCharacterShakeX,0);
    //===============================================
    return detail;
    //===============================================
}
QJ.LL.hexToRgb = function (hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return {r: parseInt(result[1],16),g: parseInt(result[2], 16),b: parseInt(result[3], 16)};
}
QJ.LL.rgbToHex = function (rgb) {
    let r=rgb.r.toString(16),g=rgb.g.toString(16),b=rgb.b.toString(16);
    return "#"+(r.length==1?("0"+r):r)+(g.length==1?("0"+g):g)+(b.length==1?("0"+b):b);
}
QJ.LL.dealRegionLights = function(id) {
    //===============================================
    if (!regionLightsData[id]) {
        QJ.LL.error(QJ.LL.globalText[4]+id);
    }
    //===============================================
    let detail = JsonEx.makeDeepCopy(regionLightsData[id]);
    //===============================================
    detail.scaleX = new QJFrameLight("scaleX",detail.scaleX,0);
    detail.scaleY = new QJFrameLight("scaleY",detail.scaleY,0);
    detail.tint = new QJFrameLight("tint",detail.tint,1);
    detail.offsetX = new QJFrameLight("offsetX",detail.offsetX,0);
    detail.offsetY = new QJFrameLight("offsetY",detail.offsetY,0);
    detail.opacity = new QJFrameLight("opacity",detail.opacity,0);
    detail.rotation = new QJFrameLight("rotation",detail.rotation,2);
    //===============================================
    return detail;
    //===============================================
}
QJ.LL.dealMiniLights = function(id) {
    //===============================================
    if (!miniLightsData[id]) {
        QJ.LL.error(QJ.LL.globalText[6]+id);
    }
    //===============================================
    let detail = JsonEx.makeDeepCopy(miniLightsData[id]);
    //===============================================
    detail.scaleX = new QJFrameLight("scaleX",detail.scaleX,0);
    detail.scaleY = new QJFrameLight("scaleY",detail.scaleY,0);
    detail.tint = new QJFrameLight("tint",detail.tint,1);
    detail.offsetX = new QJFrameLight("offsetX",detail.offsetX,0);
    detail.offsetY = new QJFrameLight("offsetY",detail.offsetY,0);
    detail.opacity = new QJFrameLight("opacity",detail.opacity,0);
    detail.rotation = new QJFrameLight("rotation",detail.rotation,2);
    //===============================================
    return detail;
    //===============================================
}
//==========================================================
//
//==========================================================
QJ.LL.open = function () {
    $gameSystem.showLights = true;

}
QJ.LL.close = function () {
    $gameSystem.showLights = false;
    console.log("QJ.LL.close");
}
QJ.LL.tint = function (time,color,ifSystem) {
    if (time==0) {
        $gameSystem.lightStaticChange = [0,null,color,
                ifSystem?$gameSystem.lightStaticChange[3]:color];
    } else {
        $gameSystem.lightStaticChange = [time,
            new QJFrameLight("___","0|"+$gameSystem.lightStaticChange[2]+"~"+time+"/"+color,1),color,
                ifSystem?$gameSystem.lightStaticChange[3]:color];
    }
}
//==========================================================
//
//==========================================================
QJ.LL.splHide = function (lightId) {
    if ($gameSystem.playerLight) {
        if (!lightId) {
            Object.values($gameSystem.playerLight).forEach((light)=>{
                light.visible = false;
            });
        } else if ($gameSystem.playerLight[lightId]) {
            $gameSystem.playerLight[lightId].visible = false;
        }
    }
}
QJ.LL.splShow = function (lightId) {
    if ($gameSystem.playerLight) {
        if (!lightId) {
            Object.values($gameSystem.playerLight).forEach((light)=>{
                light.visible = true;
            });
        } else if ($gameSystem.playerLight[lightId]) {
            $gameSystem.playerLight[lightId].visible = true;
        }
    }
}
QJ.LL.spl = function (lightId) {
    QJ.LL.dpl(null);
    QJ.LL.apl(lightId);
}
QJ.LL.apl = function (lightId) {
    if (!lightId||$gameSystem.playerLight[lightId]) {
        return;
    } else {
        $gameSystem.playerLight[lightId] = new Game_QJLightLayer(-1,QJ.LL.preset(lightId));
        if (QJ.LL.isOnMapAndHaveLoaded()) SceneManager._scene._spriteset.addQJLight($gameSystem.playerLight[lightId]);
    }
}
QJ.LL.dpl = function (lightId) {
    if (!lightId) {
        if (QJ.LL.isOnMapAndHaveLoaded()) SceneManager._scene._spriteset.removeTargetLight(-1,null);
        Object.values($gameSystem.playerLight).forEach((light)=>{
            light.setDead();
        });
    } else if ($gameSystem.playerLight[lightId]) {
        if (QJ.LL.isOnMapAndHaveLoaded()) SceneManager._scene._spriteset.removeTargetLight(-1,lightId);
        $gameSystem.playerLight[lightId].setDead();
    }
}
QJ.LL.splScaleX = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.scaleX = new QJFrameLight("scaleX",value,0);
    }
}
QJ.LL.splScaleY = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.scaleY = new QJFrameLight("scaleY",value,0);
    }
}
QJ.LL.splTint = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.tint = new QJFrameLight("tint",value,1);
    }
}
QJ.LL.splOffsetX = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.offsetX = new QJFrameLight("offsetX",value,0);
    }
}
QJ.LL.splOffsetY = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.offsetY = new QJFrameLight("offsetY",value,0);
    }
}
QJ.LL.splDirOffsetX = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.offsetDirX = value;
        QJ.LL.calculateDirAttribute($gameSystem.playerLight[lightId].initData,"offsetDirX");
    }
}
QJ.LL.splDirOffsetY = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.offsetDirY = value;
        QJ.LL.calculateDirAttribute($gameSystem.playerLight[lightId].initData,"offsetDirY");
    }
}
QJ.LL.splOpacity = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.opacity = new QJFrameLight("opacity",value,0);
    }
}
QJ.LL.splRotation = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.opacity = new QJFrameLight("opacity",value,2);
    }
}
QJ.LL.splDirRotation = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.dirRotation = value;
        QJ.LL.calculateDirAttribute($gameSystem.playerLight[lightId].initData,"dirRotation",true);
    }
}
//==========================================================
//
//==========================================================
QJ.LL.selHide = function (eventId,lightId) {
    if ($gameSystem.characterLights[eventId]) {
        if (!lightId) {
            Object.values($gameSystem.characterLights[eventId]).forEach((light)=>{
                light.visible = false;
            });
        } else if ($gameSystem.characterLights[eventId][lightId]) {
            $gameSystem.characterLights[eventId][lightId].visible = false;
        }
    }
}
QJ.LL.selShow = function (eventId,lightId) {
    if ($gameSystem.characterLights[eventId]) {
        if (!lightId) {
            Object.values($gameSystem.characterLights[eventId]).forEach((light)=>{
                light.visible = true;
            });
        } else if ($gameSystem.characterLights[eventId][lightId]) {
            $gameSystem.characterLights[eventId][lightId].visible = true;
        }
    }
}
QJ.LL.sel = function (eventId,lightId) {
    QJ.LL.del(eventId,null);
    QJ.LL.ael(eventId,lightId);
}
QJ.LL.ael = function (eventId,lightId) {
    if (!lightId||!$gameSystem.characterLights[eventId]||$gameSystem.characterLights[eventId][lightId]) {
        return;
    } else {
        let sprite = new Game_QJLightLayer(eventId,QJ.LL.preset(lightId));
        $gameSystem.characterLights[eventId][lightId] = sprite;
        if (QJ.LL.isOnMapAndHaveLoaded()) SceneManager._scene._spriteset.addQJLight(sprite);
    }
}
QJ.LL.del = function (eventId,lightId) {
    if (!lightId&&$gameSystem.characterLights[eventId]) {
        if (QJ.LL.isOnMapAndHaveLoaded()) SceneManager._scene._spriteset.removeTargetLight(eventId,null);
        Object.values($gameSystem.characterLights[eventId]).forEach((light)=>{
            light.setDead();
        });
    } else if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        if (QJ.LL.isOnMapAndHaveLoaded()) SceneManager._scene._spriteset.removeTargetLight(eventId,lightId);
        $gameSystem.characterLights[eventId][lightId].setDead();
    }
}
QJ.LL.selScaleX = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.scaleX = new QJFrameLight("scaleX",value,0);
    }
}
QJ.LL.selScaleY = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.scaleY = new QJFrameLight("scaleY",value,0);
    }
}
QJ.LL.selTint = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.tint = new QJFrameLight("tint",value,1);
    }
}
QJ.LL.selOffsetX = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.offsetX = new QJFrameLight("offsetX",value,0);
    }
}
QJ.LL.selOffsetY = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.offsetY = new QJFrameLight("offsetY",value,0);
    }
}
QJ.LL.selDirOffsetX = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.offsetDirX = value;
        QJ.LL.calculateDirAttribute($gameSystem.characterLights[eventId][lightId].initData,"offsetDirX");
    }
}
QJ.LL.selDirOffsetY = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.offsetDirY = value;
        QJ.LL.calculateDirAttribute($gameSystem.characterLights[eventId][lightId].initData,"offsetDirY");
    }
}
QJ.LL.selOpacity = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.opacity = new QJFrameLight("opacity",value,0);
    }
}
QJ.LL.selRotation = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.opacity = new QJFrameLight("opacity",value,2);
    }
}
QJ.LL.selDirRotation = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.dirRotation = value;
        QJ.LL.calculateDirAttribute($gameSystem.characterLights[eventId][lightId].initData,"dirRotation",true);
    }
}
//==========================================================
//
//==========================================================
QJ.LL.spsStatus = function (value) {
    $gamePlayer.QJSC.status = value;
    if ($gameMap) {
        $gameMap.characterShadowList[-1] = value;
        $gamePlayer.refreshFollowersShadow();
    }
}
QJ.LL.spsImgName = function (value) {
    $gamePlayer.QJSC.imgName = value;
    $gamePlayer.textureForShadowNeedRefresh = true;
}
QJ.LL.spsTint = function (value) {
    $gamePlayer.QJSC.tint = value;
}
QJ.LL.spsOpacity = function (value) {
    $gamePlayer.QJSC.opacity = value;
}
QJ.LL.spsOffsetX = function (value) {
    $gamePlayer.QJSC.offsetX = value;
}
QJ.LL.spsOffsetY = function (value) {
    $gamePlayer.QJSC.offsetY = value;
}
QJ.LL.spsOffsetDirX = function (value) {
    $gamePlayer.QJSC.offsetDirX = value;
    QJ.LL.calculateDirAttribute($gamePlayer.QJSC,"offsetDirX");
}
QJ.LL.spsOffsetDirY = function (value) {
    $gamePlayer.QJSC.offsetDirY = value;
    QJ.LL.calculateDirAttribute($gamePlayer.QJSC,"offsetDirY");
}
QJ.LL.spsModel = function (value) {
    $gamePlayer.QJSC.model=QJ.LL.getCSModel(value);
}
QJ.LL.spsYCut = function (value) {
    $gamePlayer.QJSC.yCut = value;
}
//==========================================================
//
//==========================================================
QJ.LL.tempLight = function (lightId,during,x,y) {
    let initData = QJ.LL.dealMiniLights(lightId);
    initData.during = Math.max(0,during);
    let odata = new Game_QJLightLayerMini({type:0,
        x:x+dx48+standardExpand/2,
        y:y+dy48+standardExpand/2
    },initData,$gameSystem.miniLights.length);
    $gameSystem.miniLights.push(odata);
    if (QJ.LL.isOnMapAndHaveLoaded()) {
        SceneManager._scene._spriteset.addQJMiniLight(odata);
    }
}
QJ.LL.miniLightObjectFunction = {

};
/*
迷你灯光的对象绑定：
type:   0固定位置    1地形    2对象
这里对2对象进行详细描述：
首先需要在新的插件中在QJ.LL.miniLightObjectFunction内插入固定的变化函数，属性名为新插件唯一的属性名，属性值为一个对象。
这个对象中可以写如下函数来使Game_QJLightLayerMini进行call。
以灯光插件为例：
QJ.LL.miniLightObjectFunction["QJLighting"] = {
    update:function() {},
    updatePosition:function() {},//必须写，确定灯光位置。
    updateRotation:function() {},
    updateScale:function() {},
    updateOpacity:function() {},
    setDead:function() {}
}
在以上的函数中使用函数来实现:
this.setDead()来删除此灯光。
this.attach读取您在attachData中的数据，且会加上type:2和attributeName:attributeName。

然后，生成一个新的插件的方法为：
QJ.LL.miniLightObject(minLightId,attributeName,attachData);
attributeName:在上面写的东西，比如"QJLighting"。
*/
QJ.LL.miniLightObject = function (minLightId,attributeName,attachData = {}) {
    let initData = QJ.LL.dealMiniLights(minLightId);
    attachData.type = 2;
    attachData.attributeName = attributeName;
    initData.during = -1;
    let odata = new Game_QJLightLayerMini(attachData,initData,$gameSystem.miniLights.length);
    $gameSystem.miniLights.push(odata);
    if (QJ.LL.isOnMapAndHaveLoaded()) {
        SceneManager._scene._spriteset.addQJMiniLight(odata);
    }
}
//==========================================================
//
//==========================================================
QJ.LL.lightObjectFunction = {

};
/*
灯光的对象绑定：
首先需要在新的插件中在QJ.LL.mlightObjectFunction内插入固定的变化函数，属性名为新插件唯一的属性名，属性值为一个对象。
这个对象中可以写如下函数来使Game_QJLightLayer进行call。
以灯光插件为例：
QJ.LL.miniLightObjectFunction["QJLighting"] = {
    makeName:(value)=>value,//必须写，确定绑定的灯光容器名
    updateRotation:function() {}
}
在以上的函数中使用函数来实现:
this.setDead()来删除此灯光。
this.attach读取您在attachData中的数据，且会加上attributeName:attributeName。
绑定的对象必须重写QJ.LL.character对象来使其可读取新的绑定对象。
且在绑定的对象中需要写上
direction() //如果不需要朝向，那么最好是不变的2
_realX
_realY
screenX()
screenY()
这几个属性。
从根本上说，简易灯光是完全由新增的函数来控制的，而这个灯光主要是由这些绑定对象的属性或者方法来控制的。

然后，生成一个新的插件的方法为：
QJ.LL.lightObject(lightId,boundObjectId,attributeName,attachData);
attributeName:在上面写的东西，比如"QJLighting"。
*/
QJ.LL.lightObject = function (lightId,boundObjectId,attributeName,attachData = {}) {
    let lightShowId = QJ.LL.lightObjectFunction[attributeName].makeName(boundObjectId);
    let lightData = QJ.LL.preset(lightId);
    attachData.attributeName = attributeName;
    lightData.attach = attachData;
    let sprite = new Game_QJLightLayer(lightShowId,lightData);
    if (!$gameSystem.characterLights[lightShowId]) {
        $gameSystem.characterLights[lightShowId] = {};
    }
    $gameSystem.characterLights[lightShowId][lightId] = sprite;
    if (QJ.LL.isOnMapAndHaveLoaded()) SceneManager._scene._spriteset.addQJLight(sprite);
}
//==========================================================
//
//==========================================================
QJ.LL.setTimeSystem = function (value) {
    $gameSystem.timeSystemQJLighting.use = !!value;
}
QJ.LL.setTimeRunStatus = function (value) {
    $gameSystem.timeSystemQJLighting.status = !!value;
}
QJ.LL.setTimeHubStatus = function (value) {
    $gameSystem.timeSystemQJLighting.hub.timeSystemHubStatus = !!value;
    if ($gameSystem.timeSystemQJLighting.hub.timeSystemHubStatus&&QJ.LL.isOnMapAndHaveLoaded()) {
        SceneManager._scene._spriteset.createTimeSpriteLightingQJ();
    }
}
//==========================================================
//
//==========================================================
QJ.LL.calculateAngleByTwoPoint=function(x,y,ex,ey){
    let ro;
    if (ex>x&&ey<y)  ro=(-Math.atan((x-ex)/(y-ey)));
    if (ex>x&&ey>y)  ro=(Math.PI-Math.atan((x-ex)/(y-ey)));
    if (ex<x&&ey>y)  ro=(Math.PI-Math.atan((x-ex)/(y-ey)));
    if (ex<x&&ey<y)  ro=(2*Math.PI-Math.atan((x-ex)/(y-ey)));
    if (ex==x&&ey>y) ro=Math.PI;
    if (ex==x&&ey<y) ro=0;
    if (ex>x&&ey==y) ro=Math.PI/2;
    if (ex<x&&ey==y) ro=Math.PI*3/2;
    if (ex==x&&ey==y)ro=null;//说明在同一点
    return ro;
};
//==========================================================
//
//==========================================================
const LL_Scene_Map_updateMain = Scene_Map.prototype.updateMain;
Scene_Map.prototype.updateMain = function() {
    LL_Scene_Map_updateMain.call(this);
    dx = $gameMap.displayX();
    dy = $gameMap.displayY();
    dx48 = Math.floor(dx*48-standardExpand/2);
    dy48 = Math.floor(dy*48-standardExpand/2);
    if ($gameSystem.showLights) {
        let charList;
        for (let i in $gameSystem.characterLights) {
            charList = $gameSystem.characterLights[i];
            if (charList) {
                for (let j in charList) {
                    if (charList[j]) {
                        charList[j].update();
                    }
                }
            }
        }
        let mL = $gameSystem.miniLights;
        for (let i of mL) {
            if (i) i.update();
        }
    }
};
//==========================================================
//
//==========================================================
const tempTimeList = {};
let tempTimeCountTime = 0;
let tempTimeCountTimeData = null;
JsonEx.parse(parameters.timeSystemMain).forEach((value)=>{
    let detail = JsonEx.parse(value);
    let num = Number(detail.startHour);
    if (tempTimeCountTimeData) {
        for (let i=tempTimeCountTime;i<num;i++) {
            tempTimeList[i] = tempTimeCountTimeData;
        }
        tempTimeCountTime = num;
    }
    tempTimeCountTimeData = {
        colorChangeDur:Number(detail.colorChangeDur),
        indoorColor:detail.indoorColor,
        outdoorColor:detail.outdoorColor,
        isNight:eval(detail.isNight)
    };
});
for (let i=tempTimeCountTime;i<24;i++) {
    tempTimeList[i] = tempTimeCountTimeData;
}
const tempTimeHubData = JsonEx.parse(parameters.timeSystemHub);
$.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    $.Game_System_initialize.apply(this,arguments);
    this.showLights = eval(parameters.defaultOpen);
    this.lightStaticChange = [0,null,parameters.maskInitColor,parameters.maskInitColor];
    this.characterLights = {};
    this.characterLights[-1] = {};
    this.miniLights = [];
    this.timeSystemQJLighting = {
        use:eval(parameters.timeSystemInit),
        status:eval(parameters.timeSystemStatus),
        mode:eval(parameters.timeSystemStatus),
        second:Number(parameters.timeSystemData1),
        minite:Number(parameters.timeSystemData2),
        hour:Number(parameters.timeSystemData3),
        nightSwitch:Number(parameters.timeSystemSwitch),
        speed:(isNaN(Number(parameters.timeSystemSpeed))?60:Number(parameters.timeSystemSpeed))/60,
        list:tempTimeList,
        hubStatus:eval(parameters.timeSystemHubShow),
        nowMapIndoor:false,
        nowMapTint:null,
        hub:{
            timeSystemHub: tempTimeHubData.timeSystemHub=="0"?true:false,
            timeSystemHubImg1: tempTimeHubData.timeSystemHubImg1,
            timeSystemHubImg2: tempTimeHubData.timeSystemHubImg2,
            timeSystemHubImg3: tempTimeHubData.timeSystemHubImg3,
            timeSystemHubImg4: tempTimeHubData.timeSystemHubImg4,
            timeSystemHubStatus: eval(tempTimeHubData.timeSystemHubStatus),
            timeSystemHubX: Number(tempTimeHubData.timeSystemHubX),
            timeSystemHubY: Number(tempTimeHubData.timeSystemHubY)
        }
    };
}
Object.defineProperties(Game_System.prototype, {
    playerLight: {
        get: function() {
            return this.characterLights[-1];
        },
        set: function(value) {
            this.characterLights[-1] = value;
        },
        configurable: true
    }
});
//==========================================================
//
//==========================================================
$.Graphics_resize = Graphics.resize;
Graphics.resize = function(width, height) {
    $.Graphics_resize.apply(this,arguments);
    gw = Graphics.width;
    gh = Graphics.height;
    gws = Math.floor(gw+standardExpand);
    ghs = Math.floor(gh+standardExpand);
};
//==========================================================
//
//==========================================================
const LL_Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    //===========================================
    let oldPlayerLights = $gameSystem.characterLights[-1];
    $gameSystem.characterLights = {};
    $gameSystem.characterLights[-1] = oldPlayerLights;
    //===========================================
    $gameSystem.miniLights = [];
    this.characterShadowList = {};
    this.characterShadowList[-1] = $gamePlayer.QJSC.status;
    $gamePlayer.refreshFollowersShadow();
    //======================================
    LL_Game_Map_setup.call(this,mapId);
    //======================================
    let tilesetData = $dataTilesets[this._tilesetId].meta
    //======================================
    this.terrainTagToRegion = [0,  0,0,0,0,0,0,0];
    for (let i=1,regionId;i<8;i++) {
        if (tilesetData["QJTS-"+i]) {
            regionId = Number(tilesetData["QJTS-"+i]);
            if (regionData[regionId]) {
                this.terrainTagToRegion[i] = regionId;
            }
        }
    }
    //======================================
    this.terrainTagToRegionLights = [0,  0,0,0,0,0,0,0];
    for (let i=1,regionId;i<8;i++) {
        if (tilesetData["QJL-"+i]) {
            regionId = Number(tilesetData["QJL-"+i]);
            if (regionLightsData[regionId]) {
                this.terrainTagToRegionLights[i] = regionId;
            }
        }
    }
    //======================================
    this.shadowDataQJLL = new Array(this.width());
    for (let i=0,il=this.width(),j,jl=this.height(),id,lsid,k,heightY;i<il;i++) {
        this.shadowDataQJLL[i] = new Array(this.height());
        for (j=0;j<jl;j++) {
            //========================
            id = this.regionIdForLight(i,j);
            if (regionLightsData[id]) {
                //type 0固定位置 1地形 2对象
                $gameSystem.miniLights.push(new Game_QJLightLayerMini({
                    type:1,regionId:id,
                    x:i*48+24,y:j*48+24,
                    mapX:i,mapY:j
                    },QJ.LL.dealRegionLights(id),$gameSystem.miniLights.length));
            }
            //========================
            id = this.regionIdForShadow(i,j);
            if (regionData[id]) {
                heightY = regionData[id].shadowHeight;
                for (k=1;k<=regionData[id].shadowHeight;k++) {
                    lsid = this.regionIdForShadow(i,j+k);
                    if (regionData[lsid]) {
                        heightY=k-1;
                        break;
                    }
                }
                for (k=0;k<=heightY;k++) {
                    this.shadowDataQJLL[i][j+k] = j+heightY;
                }
                j+=heightY;
            } else this.shadowDataQJLL[i][j]=-1;
        }
    }
    //======================================
    this.lightingNoteGetQJ();
    this.updateTrueLightingTintQJ();
    //======================================
};
Game_Map.prototype.lightingNoteGetQJ = function() {
    let lightingData = $gameSystem.timeSystemQJLighting;
    let meta = $dataMap.meta;
    lightingData.nowMapTint = meta.QJScreenTint?meta.QJScreenTint:null;
    lightingData.nowMapIndoor = ("indoor" in meta)?true:false;
};
Game_Map.prototype.updateTrueLightingTintQJ = function() {
    let lightingData = $gameSystem.timeSystemQJLighting;
    let hour = this.getLightingHourQJ();
    if (lightingData.nowMapTint) {
        QJ.LL.tint(0,lightingData.nowMapTint,true);
    } else if (lightingData.use) {
        let hourData = lightingData.list[hour];
        if (lightingData.nightSwitch>0) $gameSwitches.setValue(lightingData.nightSwitch,hourData.isNight);
        if (lightingData.nowMapIndoor) {
            QJ.LL.tint(hourData.colorChangeDur,hourData.indoorColor,true);
        } else {
            QJ.LL.tint(hourData.colorChangeDur,hourData.outdoorColor,true);
        }
        this.remHourLightingQJ = hour;
    } else {
        QJ.LL.tint(0,$gameSystem.lightStaticChange[3],true);
    }
};
const LL_Game_Map_update = Game_Map.prototype.update;
Game_Map.prototype.update = function(sceneActive) {
    LL_Game_Map_update.call(this,sceneActive);
    if ($gameSystem.timeSystemQJLighting.use) {
        let lightingData = $gameSystem.timeSystemQJLighting;
        if (lightingData.status) {
            this.addLightingSecondQJ(lightingData.speed);
        }
        let hour = this.getLightingHourQJ();
        if (this.remHourLightingQJ != hour) {
            this.updateTrueLightingTintQJ();
        }
    }
};
Game_Map.prototype.getLightingHourQJ = function() {
    let lightingData = $gameSystem.timeSystemQJLighting;
    return lightingData.hour>0?$gameVariables.value(lightingData.hour):0;
};
Game_Map.prototype.getLightingMiniteQJ = function() {
    let lightingData = $gameSystem.timeSystemQJLighting;
    return lightingData.minite>0?$gameVariables.value(lightingData.minite):0;
};
Game_Map.prototype.getLightingSecondQJ = function() {
    let lightingData = $gameSystem.timeSystemQJLighting;
    return lightingData.second>0?$gameVariables.value(lightingData.second):0;
};
Game_Map.prototype.addLightingHourQJ = function(value) {
    let lightingData = $gameSystem.timeSystemQJLighting;
    let valueNew = $gameVariables.value(lightingData.hour)+(value==undefined?1:value);
    $gameVariables.setValue(lightingData.hour,valueNew%24);
};
Game_Map.prototype.addLightingMiniteQJ = function(value) {
    let lightingData = $gameSystem.timeSystemQJLighting;
    let valueNew = $gameVariables.value(lightingData.minite)+(value==undefined?1:value);
    if (Math.floor(valueNew/60)>0) {
        this.addLightingHourQJ(Math.floor(valueNew/60));
    }
    $gameVariables.setValue(lightingData.minite,valueNew%60);
};
Game_Map.prototype.addLightingSecondQJ = function(value) {
    let lightingData = $gameSystem.timeSystemQJLighting;
    let valueNew = $gameVariables.value(lightingData.second)+(value==undefined?1:value);
    if (Math.floor(valueNew/60)>0) {
        this.addLightingMiniteQJ(Math.floor(valueNew/60));
    }
    $gameVariables.setValue(lightingData.second,valueNew%60);
};
Game_Map.prototype.setLightingHourQJ = function(value) {
    let lightingData = $gameSystem.timeSystemQJLighting;
    let valueNew = $gameVariables.value(lightingData.hour)+(value==undefined?1:value);
    $gameVariables.setValue(lightingData.hour,valueNew%24);
};
Game_Map.prototype.setLightingMiniteQJ = function(value) {
    let lightingData = $gameSystem.timeSystemQJLighting;
    let valueNew = $gameVariables.value(lightingData.minite)+(value==undefined?1:value);
    if (Math.floor(valueNew/60)>0) {
        this.addLightingHourQJ(Math.floor(valueNew/60));
    }
    $gameVariables.setValue(lightingData.minite,valueNew%60);
};
Game_Map.prototype.setLightingSecondQJ = function(value) {
    let lightingData = $gameSystem.timeSystemQJLighting;
    let valueNew = $gameVariables.value(lightingData.second)+(value==undefined?1:value);
    if (Math.floor(valueNew/60)>0) {
        this.addLightingMiniteQJ(Math.floor(valueNew/60));
    }
    $gameVariables.setValue(lightingData.second,valueNew%60);
};
Game_Map.prototype.regionIdForShadow = function(x, y) {
    let id = this.regionId(x,y),terrainTag;
    if (!regionData[id]&&this.terrainTagToRegion) {
        terrainTag = this.terrainTag(x,y);
        if (this.terrainTagToRegion[terrainTag]>0) {
            id = this.terrainTagToRegion[terrainTag];
        }
    }
    return id;
};
Game_Map.prototype.regionIdForLight = function(x, y) {
    let id = this.regionId(x,y),terrainTag;
    if (!regionLightsData[id]&&this.terrainTagToRegionLights) {
        terrainTag = this.terrainTag(x,y);
        if (this.terrainTagToRegionLights[terrainTag]>0) {
            id = this.terrainTagToRegionLights[terrainTag];
        }
    }
    return id;
};
Game_Map.prototype.adjustXWithoutDisplay = function(x) {
    if (
        this.isLoopHorizontal() &&
        x < this._displayX - (this.width() - this.screenTileX()) / 2
    ) {
        return x + $dataMap.width;
    } else {
        return x;
    }
};
Game_Map.prototype.adjustYWithoutDisplay = function(y) {
    if (
        this.isLoopVertical() &&
        y < this._displayY - (this.height() - this.screenTileY()) / 2
    ) {
        return y + $dataMap.height;
    } else {
        return y;
    }
};
//==========================================================
//
//==========================================================
const LL_Game_Player_initMembers = Game_Player.prototype.initMembers;
Game_Player.prototype.initMembers = function() {
    LL_Game_Player_initMembers.call(this);
    let orginData = parameters.playerInitLight;
    if (!!orginData) $gameSystem.playerLight[orginData] = new Game_QJLightLayer(-1,QJ.LL.preset(orginData));
    this.QJSC = JsonEx.makeDeepCopy(playerShadowDefault);
    for (let i of this._followers._data) {
        i.QJSC = this.QJSC;
    }
    this.textureForShadowNeedRefresh = true;
    this.reSetX = 0;
    this.reSetY = 0;
    this.remRegionId = 0;
};
Game_Player.prototype.refreshFollowersShadow = function() {
    for (let i=0,il=this._followers._data.length,vis=this._followers._visible&&$gamePlayer.QJSC.status;i<il;i++) {
        $gameMap.characterShadowList[-(i+2)] = vis;
    }
};
const LL_Game_Player_showFollowers = Game_Player.prototype.showFollowers;
Game_Player.prototype.showFollowers = function() {
    LL_Game_Player_showFollowers.call(this);
    this.refreshFollowersShadow();
};
const LL_Game_Player_hideFollowers = Game_Player.prototype.hideFollowers;
Game_Player.prototype.hideFollowers = function() {
    LL_Game_Player_hideFollowers.call(this);
    this.refreshFollowersShadow();
};
const LL_Game_Player_update = Game_Player.prototype.update;
Game_Player.prototype.update = function(sa) {
    LL_Game_Player_update.call(this,sa);
    this.reSetX = Math.floor(this._realX+0.5);
    this.reSetY = Math.floor(this._realY+0.5);
    this.remRegionId = $gameMap.regionId(this.reSetX,this.reSetY);
};
//==========================================================
//
//==========================================================
const LL_Game_Event_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function() {
    LL_Game_Event_setupPage.call(this);
    if ($gameSystem.characterLights[this._eventId]) {
        for (let i of Object.values($gameSystem.characterLights[this._eventId])) {
            i.setDead();
        }
        if (QJ.LL.isOnMapAndHaveLoaded()) {
            SceneManager._scene._spriteset.removeTargetLight(this._eventId,null);
        }
    }
    $gameSystem.characterLights[this._eventId] = {};
    this.annotation = QJ.LL.calculateAnnotation(this);
    let lightId = QJ.LL.getLLData(this,this.annotation);
    if (lightId) {
        let odata = new Game_QJLightLayer(this._eventId,QJ.LL.preset(lightId,this));
        $gameSystem.characterLights[this._eventId][lightId] = odata;
        if (QJ.LL.isOnMapAndHaveLoaded()) SceneManager._scene._spriteset.addQJLight(odata);
    }
    this.QJSC = QJ.LL.getCSData(this,this.annotation);
    $gameMap.characterShadowList[this._eventId] = this.QJSC.status;
    this.textureForShadowNeedRefresh = true;
};
/*const LL_Game_Event_update = Game_Event.prototype.update;
Game_Event.prototype.update = function() {
    LL_Game_Event_update.call(this);

};*/
//==========================================================
//Load all layer container.
//==========================================================
let mapCharacterSpriteReSaveList = {};
//==========================================================
const LL_Spriteset_Base_initialize = Spriteset_Base.prototype.initialize;
Spriteset_Base.prototype.initialize = function() {
    //======================================
    mapCharacterSpriteReSaveList = {};
    //======================================
    LL_Spriteset_Base_initialize.call(this);
    //======================================
};
const LL_Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
Spriteset_Map.prototype.createUpperLayer = function() {
    //======================================
    if (!lightLayerZ) {
        this.lightSystemSprite = new Sprite_QJLightSystem(this);
        this.addChild(this.lightSystemSprite);
    }
    //======================================
    LL_Spriteset_Map_createUpperLayer.call(this);
    //======================================
    if (lightLayerZ) {
        this.lightSystemSprite = new Sprite_QJLightSystem(this);
        this.addChild(this.lightSystemSprite);
    }
    //======================================
    this.lightCharacterShadowContainer = new Sprite_QJCharacterShadowLayer(this,this.lightSystemSprite);
    this._tilemap.addChildAt(this.lightCharacterShadowContainer,0);
    //====================================
    if ($gameSystem.timeSystemQJLighting.hub.timeSystemHubStatus) {
        this.createTimeSpriteLightingQJ();
    }
    //====================================
};
Spriteset_Map.prototype.addQJLight = function(odata) {
    return this.lightSystemSprite.addQJLight(odata);
};
Spriteset_Map.prototype.addQJMiniLight = function(odata) {
    return this.lightSystemSprite.addQJMiniLight(odata);
};
Spriteset_Map.prototype.removeTargetLight = function(id,lightId) {
    return this.lightSystemSprite.removeTargetLight(id,lightId);
};
Spriteset_Map.prototype.createTimeSpriteLightingQJ = function() {
    this.timeSystemSpriteQJ = new Sprite_timeSystemSpriteQJ();
    this.addChild(this.timeSystemSpriteQJ);
};
//==========================================================
//Sprite_timeSystemSpriteQJ
//==========================================================
Sprite_timeSystemSpriteQJ.prototype = Object.create(Sprite.prototype);
Sprite_timeSystemSpriteQJ.prototype.constructor = Sprite_timeSystemSpriteQJ;
Sprite_timeSystemSpriteQJ.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    let hub = $gameSystem.timeSystemQJLighting.hub;
    this.timeSystemHubX = hub.timeSystemHubX;
    this.timeSystemHubY = hub.timeSystemHubY;
};
Sprite_timeSystemSpriteQJ.prototype.update = function() {
    if (!$gameSystem.timeSystemQJLighting.hub.timeSystemHubStatus) {
        this.parent.removeChild(this);
        this.destroy();
        return;
    }
    let s=$gameMap.getLightingSecondQJ();
    let m=$gameMap.getLightingMiniteQJ();
    let h=$gameMap.getLightingHourQJ();
    if (this.model != $gameSystem.timeSystemQJLighting.hub.timeSystemHub) {
        this.model = $gameSystem.timeSystemQJLighting.hub.timeSystemHub;
        this.refreshData();
    }
    if (this.working&&(this.s!=s||this.m!=m||this.h!=h)) {
        this.s = s;
        this.m = m;
        this.h = h;
        this.updateData();
    }
};
Sprite_timeSystemSpriteQJ.prototype.refreshData = function() {
    let hub = $gameSystem.timeSystemQJLighting.hub;
    if ((this.model&&(!ImageManager.loadSystem(hub.timeSystemHubImg1).width||
        !ImageManager.loadSystem(hub.timeSystemHubImg2).width||
        !ImageManager.loadSystem(hub.timeSystemHubImg3).width))||
        (!this.model&&(!ImageManager.loadSystem(hub.timeSystemHubImg4).width))) {
        setTimeout(this.refreshData.bind(this),5);
        return;
    }
    this.removeChildren();
    this.s = -1;
    this.m = -1;
    this.h = -1;
    this.working = true;
    let baseX = this.timeSystemHubX,baseY = this.timeSystemHubY;
    if (this.model) {
        //==================================================
        let sprite1 = new Sprite(ImageManager.loadSystem(hub.timeSystemHubImg1));
        sprite1.x = Graphics.width-sprite1.width+baseX;
        sprite1.y = baseY;
        this.sprite1 = sprite1;
        this.addChild(sprite1);
        //==================================================
        let sprite2 = new Sprite(ImageManager.loadSystem(hub.timeSystemHubImg2));
        sprite2.anchor.x = 0.5; 
        sprite2.anchor.y = (sprite2.height-sprite2.width/2)/sprite2.height;
        sprite2.x = sprite1.x+sprite1.width/2;
        sprite2.y = sprite1.y+sprite1.height/2;
        this.addChild(sprite2);
        this.sprite2 = sprite2;
        //==================================================
        let sprite3 = new Sprite(ImageManager.loadSystem(hub.timeSystemHubImg3));
        sprite3.anchor.x = 0.5; 
        sprite3.anchor.y = (sprite3.height-sprite3.width/2)/sprite3.height;
        sprite3.x = sprite1.x+sprite1.width/2;
        sprite3.y = sprite1.y+sprite1.height/2;
        this.addChild(sprite3);
        this.sprite3 = sprite3;
        //==================================================
    } else {
        //==================================================
        let sprite4 = new Sprite(ImageManager.loadSystem(hub.timeSystemHubImg4));
        sprite4.anchor.x = 0.5; 
        sprite4.x = Graphics.width/2+baseX;
        sprite4.y = baseY;
        this.addChild(sprite4);
        this.sprite4 = sprite4;
        //==================================================
        let bitmap5 = new Bitmap(sprite4.width,sprite4.height);
        bitmap5.fontSize = 24;
        let sprite5 = new Sprite(bitmap5);
        sprite5.anchor.x = 0.5; 
        sprite5.x = Graphics.width/2;
        sprite5.y = baseY;
        this.addChild(sprite5);
        this.sprite5 = sprite5;
        this.bitmap5 = bitmap5;
        //==================================================
    }
};
Sprite_timeSystemSpriteQJ.prototype.updateData = function() {
    let hub = $gameSystem.timeSystemQJLighting.hub;
    if (this.model) {
        this.sprite3.rotation = (this.m+this.s/60)%60/60*Math.PI*2;
        this.sprite2.rotation = (this.h+this.m/60+this.s/3600)%12/12*Math.PI*2;
    } else {
        this.bitmap5.clear();
        this.bitmap5.drawText((this.h>9?this.h:("0"+this.h))+":"+(this.m>9?this.m:("0"+this.m)),0,0,
            this.sprite5.width,this.sprite5.height,"center");
    }
};
//==========================================================
//Sprite_Character.
//==========================================================
const QJLL_Sprite_Character_setCharacter = Sprite_Character.prototype.setCharacter;
Sprite_Character.prototype.setCharacter = function(character) {
    QJLL_Sprite_Character_setCharacter.call(this,character);
    this.refreshTextureForShadow();
    if (this.constructor.name!="Sprite_Character") return;
    if (character._eventId) mapCharacterSpriteReSaveList[character._eventId] = this;
    else if (character==$gamePlayer) mapCharacterSpriteReSaveList[-1] = this;
    else {
        for (let data=$gamePlayer._followers._data,i=0,il=data.length;i<il;i++) {
            if (character==data[i]) mapCharacterSpriteReSaveList[-(i+2)] = this;
        }
    }
};
const QJLL_Sprite_Character_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function() {
    QJLL_Sprite_Character_update.call(this);
    if (this._character.textureForShadowNeedRefresh) {
        this.refreshTextureForShadow();
    }
    if (this.textureLLSpecial&&this.textureLLSpecial.dirMode) {
        let newY = this.textureLLSpecial.frame.height*(this._character.direction()/2-1);
        if (this.textureLLSpecial.frame.y!=newY) {
            this.textureLLSpecial.frame.y = newY;
            this.textureLLSpecial.frame = this.textureLLSpecial.frame;
        }
    }
};
Sprite_Character.prototype.refreshTextureForShadow = function() {
    this._character.textureForShadowNeedRefresh = false;
    let qjsc = this._character.QJSC;
    if (!qjsc) return;
    if (!qjsc.imgName) {
        this.textureLLSpecial = null;
    } else {
        if (!characterShadowPresetListTexture[qjsc.imgName]) {
            QJ.LL.error(QJ.LL.globalText[2]+qjsc.imgName+" "+this._eventId+" "+$gameMap.mapId());
        } else {
            let baseTextureNeed = characterShadowPresetListTexture[qjsc.imgName];
            this.textureLLSpecial = new PIXI.Texture(baseTextureNeed);
            if (qjsc.imgName[0]=="$") {
                this.textureLLSpecial.dirMode = true;
                this.textureLLSpecial.frame = new PIXI.Rectangle(0,0,0,0);
                this.textureLLSpecial.frame.height = baseTextureNeed.height/4;
                this.textureLLSpecial.frame.width = baseTextureNeed.width;
                this.textureLLSpecial.frame.x = 0;
                this.textureLLSpecial.frame.y = this.textureLLSpecial.frame.height*(this._character.direction()/2-1);
                this.textureLLSpecial.frame = this.textureLLSpecial.frame;
            } else {
                this.textureLLSpecial.dirMode = false;
            }
        }
    }
};
//==========================================================
//
//==========================================================
const LL_Sprite_Character_setTileBitmap = Sprite_Character.prototype.setTileBitmap;
Sprite_Character.prototype.setTileBitmap = function() {
    LL_Sprite_Character_setTileBitmap.call(this);
    if (this.bitmap) this.bitmap.addLoadListener((bit)=>this.transfromTextureLL(bit));
    else this.textureLL = null;
};
const LL_Sprite_Character_setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
Sprite_Character.prototype.setCharacterBitmap = function() {
    LL_Sprite_Character_setCharacterBitmap.call(this);
    if (this.bitmap) this.bitmap.addLoadListener((bit)=>this.transfromTextureLL(bit));
    else this.textureLL = null;
};
Sprite_Character.prototype.transfromTextureLL = function(bit) {
    bit=bit?bit:this.bitmap;
    if (bit&&bit._image) {
        if (!bit.textureLL) {
            let source = bit._image;
            let lsCanvas = document.createElement('canvas');
            let w = source.width,h = source.height;
            lsCanvas.width = w;
            lsCanvas.height = h;
            let lsContext = lsCanvas.getContext('2d');
            lsContext.drawImage(source,0,0,w,h,0,0,w,h);
            bit.textureLL = new PIXI.BaseTexture(lsCanvas);
        }
        this.textureLL = new PIXI.Texture(bit.textureLL);
    } else this.textureLL = null;
};
//==========================================================
//To contain extra layer.
//==========================================================
Sprite_QJLLContainer.prototype = Object.create(PIXI.Container.prototype);
Sprite_QJLLContainer.prototype.constructor = Sprite_QJLLContainer;
Sprite_QJLLContainer.prototype.initialize = function() {
    PIXI.Container.call(this);
}
Sprite_QJLLContainer.prototype.update = function() {
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
};
//==========================================================
//Filter_QJLight.
//==========================================================
Filter_QJLight.prototype = Object.create(PIXI.Filter.prototype);
Filter_QJLight.prototype.constructor = Filter_QJLight;
Filter_QJLight.prototype.initialize = function() {
    //delete some redundant native values about filter and mask.
    let vertexSrc = `
    attribute vec2 aVertexPosition;
    attribute vec2 aTextureCoord;
    varying vec2 vTextureCoord;
    uniform mat3 projectionMatrix;
    void main(void){
        gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
        vTextureCoord = aTextureCoord ;
    }`;
    //simple background set.
    let fragmentSrc = `
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    uniform vec4 backgroundColor;
    void main(void){
       vec4 sample = texture2D(uSampler, vTextureCoord);
       gl_FragColor = sample + backgroundColor;
    }`;
    PIXI.Filter.call(this,vertexSrc,fragmentSrc,{backgroundColor:[0,0,0,0]});
};
Filter_QJLight.prototype.setBackgroundColor = function(r,g,b,a) {
    this.uniforms.backgroundColor[0] = r*a;
    this.uniforms.backgroundColor[1] = g*a;
    this.uniforms.backgroundColor[2] = b*a;
    this.uniforms.backgroundColor[3] = a;
};
//==========================================================
//Sprite_QJLightLayer.Main light layer.
//==========================================================
Sprite_QJLightSystem.prototype = Object.create(PIXI.Sprite.prototype);
Sprite_QJLightSystem.prototype.constructor = Sprite_QJLightSystem;
Sprite_QJLightSystem.prototype.initialize = function(spriteset) {
    //====================================
    this._spriteset = spriteset;
    this.mw = $gameMap.width()*48+standardExpand;
    this.mh = $gameMap.height()*48+standardExpand;
    this.oldFilterColor = null;
    this.averageColorAlpha = 1;
    this.whiteVisible = false;
    //====================================
    PIXI.Sprite.call(this);
    this.x = -standardExpand/2;
    this.y = -standardExpand/2;
    this.filterMask = new Filter_QJLight();
    this.filterMask.blendMode = 2;
    this.filters = [this.filterMask];
    this.filterArea = new Rectangle(0,0,gws,ghs);
    this.updateFilterColor();
    //====================================
    this.miniLightsContainer = new PIXI.Container();
    this.addChild(this.miniLightsContainer);
    //====================================
    let lsCanvas,lsContext,lsBaseTexture = null;
    lsCanvas = document.createElement('canvas');
    lsContext = lsCanvas.getContext('2d');
    lsCanvas.width = this.mw;
    lsCanvas.height = this.mh;
    lsBaseTexture = new PIXI.BaseTexture(lsCanvas);
    lsBaseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
    lsBaseTexture.width = this.mw;
    lsBaseTexture.height = this.mh;
    this.blockContext = lsContext;
    this.blocklsBaseTexture = lsBaseTexture;
    this.blockTexture = new PIXI.Texture(lsBaseTexture);
    this.blockSprite = new PIXI.Sprite(this.blockTexture);
    this.blockSprite.blendMode = 2;
    this.setBlock(this.blockContext,this.blocklsBaseTexture);
    this.updateBlocklsTextureFrame();
    this.addChild(this.blockSprite);
    //====================================
    let charList;
    for (let i in $gameSystem.characterLights) {
        charList = $gameSystem.characterLights[i];
        for (let j in charList) {
            this.addQJLight(charList[j]);
        }
    }
    for (let i of $gameSystem.miniLights) {
        if (i) this.addQJMiniLight(i);
    }
    //====================================
};
Sprite_QJLightSystem.prototype.updateBlocklsTextureFrame = function() {
    let realX = (dx48+0).clamp(0, this.mw),realY = (dy48+0).clamp(0, this.mh);
    let realW = (gws - realX + dx48).clamp(0, this.mw - realX);
    let realH = (ghs - realY + dy48).clamp(0, this.mh - realY);
    this.blockTexture.frame.x = realX;
    this.blockTexture.frame.y = realY;
    this.blockTexture.frame.width = realW;
    this.blockTexture.frame.height = realH;
    this.blockSprite.pivot.x = dx48 - realX;
    this.blockSprite.pivot.y = dy48 - realY;
    this.blockTexture.frame = this.blockTexture.frame;
}
Sprite_QJLightSystem.prototype.addQJLight = function(odata) {
    let lightSprite = new Sprite_QJLightLayer(this._spriteset,odata);
    this.addChildAt(lightSprite,0);
    return lightSprite;
};
Sprite_QJLightSystem.prototype.addQJMiniLight = function(odata) {
    let lightSprite = new Sprite_QJLightLayerMini(this._spriteset,odata);
    this.miniLightsContainer.addChild(lightSprite);
    return lightSprite;
};
Sprite_QJLightSystem.prototype.removeTargetLight = function(id,lightId) {
    if (!lightId) {
        for (let i of this.children) {
            if (i.character==id) {
                i.setDead();
            }
        }
    } else {
        for (let i of this.children) {
            if (i.character==id&&i.lightId==lightId) {
                i.setDead();
                break;
            }
        }
    }
};
Sprite_QJLightSystem.prototype.refreshFilter = function(color) {
    let r=parseInt(color.substr(1,2),16)/255;
    let g=parseInt(color.substr(3,2),16)/255;
    let b=parseInt(color.substr(5,2),16)/255;
    this.averageColorAlpha = Math.floor((1-(r+g+b)/3)*100)/100;
    this.oldFilterColor=color;
    if (!this.whiteVisible) {
        if (this.oldFilterColor!="#ffffff") {
            this.whiteVisible = true;
        }
    } else {
        if (this.oldFilterColor=="#ffffff") {
            this.whiteVisible = false;
        }
    }
    this.filterMask.setBackgroundColor(r,g,b,1);
};
Sprite_QJLightSystem.prototype.updateFilterColor = function() {
    if ($gameSystem.lightStaticChange[0]>0) {
        if (!$gameSystem.lightStaticChange[1]) {
            $gameSystem.lightStaticChange[0] = 0;
            $gameSystem.lightStaticChange[1] = null;
            if (this.oldFilterColor!=$gameSystem.lightStaticChange[2]) {
                this.refreshFilter($gameSystem.lightStaticChange[2]);
            }
        } else {
            $gameSystem.lightStaticChange[0]--;
            let tarColor = $gameSystem.lightStaticChange[1].get();
            if (this.oldFilterColor!=tarColor) {
                this.refreshFilter(tarColor);
            }
            if ($gameSystem.lightStaticChange[0]==0) $gameSystem.lightStaticChange[1]=null;
        }
    } else {
        if (this.oldFilterColor!=$gameSystem.lightStaticChange[2]) {
            this.refreshFilter($gameSystem.lightStaticChange[2]);
        }
    }
};
Sprite_QJLightSystem.prototype.update = function() {
    this.updateFilterColor();
    this.visible = $gameSystem.showLights && this.whiteVisible;
    if (this.visible) {
        this.children.forEach((child)=>{
            if (child.update) child.update();
        });
        this.miniLightsContainer.children.forEach((child)=>{
            if (child.update) child.update();
        });
        this.updateBlocklsTextureFrame();
    }
};
Sprite_QJLightSystem.prototype.setBlock = function(bctx,bbt) {
    let regionId,blockShape,nextLineType,x48,y48,terrainTag;
    for (let i=0,il=$gameMap.width();i<il;i++) {
        for (let j=0,jl=$gameMap.height();j<jl;j++) {
            regionId = $gameMap.regionIdForShadow(i,j);
            if (regionData[regionId]&&regionData[regionId].rectShape.length>0) {
                //===========================
                x48 = i*48;
                y48 = j*48;
                //===========================
                blockShape = regionData[regionId].rectShape;
                //===========================
                bctx.save();
                bctx.fillStyle = regionData[regionId].rectTint;
                bctx.globalAlpha = regionData[regionId].rectOpacity;
                bctx.translate(x48,y48);
                for (let k=0,mk=0,kl=blockShape.length,initX=blockShape[0].x,initY=blockShape[0].y,x,y;k<kl;k++) {
                    if (mk==0) {
                        bctx.beginPath();
                        bctx.moveTo(initX,initY);
                    }
                    nextLineType = blockShape[k].t;
                    mk++;
                    x = blockShape[k+1]?blockShape[k+1].x:initX;
                    y = blockShape[k+1]?blockShape[k+1].y:initY;
                    if (nextLineType==0) {
                        bctx.lineTo(x,y);
                    } else if (nextLineType==5) {
                        bctx.closePath();
                        bctx.fill();
                        if (!blockShape[k+1]) break;
                        initX=blockShape[k+1].x;
                        initY=blockShape[k+1].y;
                        mk=0;
                        continue;
                    } else {
                        bctx.arc(blockShape[k].cx,blockShape[k].cy,blockShape[k].r,blockShape[k].sa,blockShape[k].ea,blockShape[k].ccw);
                    }
                    if (k==kl-1) {
                        bctx.closePath();
                        bctx.fill();
                    }
                }
                bctx.restore();
                //===========================
            }
        }
    }
    bbt.update();
}
//==========================================================
//Game_QJLightLayer
//==========================================================
Game_QJLightLayer.prototype.initialize = function(characterId,initLightData) {
    //=========================================
    this.lightId = initLightData.id;
    this.character = characterId;
    this.dead = false;
    this.shadowWall = initLightData.shadowWall;
    this.shadowCharacter = initLightData.shadowCharacter;
    this.visible = true;
    this.attach = initLightData.attach||null;
    //=========================================
    this.x = 0;
    this.y = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.opacity = 1;
    this.rotation = 0;
    this.rotationAuto = 0;
    this.tint = "#FFFFFF";
    this.initData = initLightData;
    this.dirRotationFrame = [0,0,0,0];//时间，速度，起始，终止
    this.shadowCharacterShakeX = 1;
    //=========================================
    this.dialogLength = 0;
    //=========================================
    this.needRefreshFrame = false;
    this.lightSpriteFrame = [0,0,1,1];
    let baseTextureData = saveTexture[initLightData.imgName];
    this.bimtapWidth = baseTextureData.width;
    this.bimtapHeight = baseTextureData.height;
    if (initLightData.imgName.includes("$")) {
        this.lightSpriteFrame[3] = 4;
        this.dirImgFrame = true;
    } else this.lightSpriteFrame[3] = 1;
    let animEffect = initLightData.imgName.match(/\[([^,]+)\,([^]+)\]/i);
    if (animEffect) {
        this.dramaticBitmap = [0,Number(animEffect[2]),0,Number(animEffect[1])];
        this.lightSpriteFrame[2] = this.dramaticBitmap[3];
    } else this.lightSpriteFrame[2] = 1;
    //=========================================
    this.dialogLength = Math.floor(Math.sqrt(this.bimtapWidth*this.bimtapWidth/this.lightSpriteFrame[2]/this.lightSpriteFrame[2]+
        this.bimtapHeight*this.bimtapHeight/this.lightSpriteFrame[3]/this.lightSpriteFrame[3]));
    this.startX = (1-this.bimtapWidth /this.lightSpriteFrame[2]/this.dialogLength)/2;
    this.startY = (1-this.bimtapHeight/this.lightSpriteFrame[3]/this.dialogLength)/2;
    //=========================================
    this.initRandomFlickerOpacity();
    //=========================================
    this.update();
    //=========================================
};
Game_QJLightLayer.prototype.initRandomFlickerOpacity = function() {
    let od = this.initData;
    if (od.randomFlickerOpacity!==null && od.randomFlickerOpacity.status) {
        let realHalfFadeTime = Math.max(1,Math.floor(od.randomFlickerOpacity.fadeTime/2));
        let realFadeRate = (1-od.randomFlickerOpacity.fadeRate/100).clamp(0,1);
        this.randomFlickerOpacity = {
            time:0,
            frameTime:0,
            realFadeTime:realHalfFadeTime*2,
            fadeFrame:new QJFrameLight("fadeFrame",`0|1~${realHalfFadeTime}/${realFadeRate}~${realHalfFadeTime}/1`,0)
        };
    } else {
        this.randomFlickerOpacity = null;
    }
};
Game_QJLightLayer.prototype.updateRandomFlickerOpacity = function(od,character,d) {
    let rfo = this.randomFlickerOpacity;
    if (rfo.time<=0) {
        if (rfo.frameTime>=rfo.realFadeTime) {
            rfo.time = Math.max(1,Math.floor(od.randomFlickerOpacity.minIntervalTime+Math.random()*(od.randomFlickerOpacity.maxIntervalTime-od.randomFlickerOpacity.minIntervalTime)));
            rfo.frameTime = 0;
        } else {
            this.opacity *= rfo.fadeFrame.getTar(rfo.frameTime);
            rfo.frameTime++;
        }
    } else {
        rfo.time--;
    }
};
Game_QJLightLayer.prototype.updateFrame = function(character) {
    //=========================================
    if (!this.dirImgFrame&&!this.dramaticBitmap) return;
    let tarX=0,tarY=0;
    if (this.dirImgFrame) tarY = (character.direction()/2-1)/4;
    else tarY = 0;
    if (this.dramaticBitmap) {
        this.dramaticBitmap[0]++;
        if (this.dramaticBitmap[0]>=this.dramaticBitmap[1]) {
            this.dramaticBitmap[0] = 0;
            this.dramaticBitmap[2]++;
            if (this.dramaticBitmap[2]>=this.dramaticBitmap[3]) {
                this.dramaticBitmap[2]=0;
            }
        }
        tarX = this.dramaticBitmap[2]/this.dramaticBitmap[3];
    } else tarX = 0;
    if (tarX!=this.lightSpriteFrame[0]||tarY!=this.lightSpriteFrame[1]) {
        this.needRefreshFrame = true;
        this.lightSpriteFrame[0] = tarX;
        this.lightSpriteFrame[1] = tarY;
    }
    //=========================================
};
Game_QJLightLayer.prototype.update = function() {
    //=========================================
    let character = QJ.LL.getCharacter(this.character);
    if (!character) {this.setDead();return;}
    let od = this.initData;
    //=========================================
    this.updateFrame(character);
    //=========================================
    this.rotationAuto+=od.rotationAuto;
    //=========================================
    let d = character.direction();
    //为SSMBS_Avartar适配的八方移动，这插件作者实现八方移动的方式真……
    if (character._direction8dir!=undefined) {
        if (character._direction8dir==1||character._direction8dir==3||
            character._direction8dir==7||character._direction8dir==9) {
            d = character._direction8dir;
        }
    }
    //_/
    this.updatePosition(od,character,d);
    this.updateRotation(od,character,d);
    this.updateScale(od,character,d);
    this.updateOpacity(od,character,d)
    this.shadowCharacterOffsetX = od.shadowCharacterOffsetX.get();
    this.shadowCharacterOffsetY = od.shadowCharacterOffsetY.get();
    if (this.dirRotationFrame[3]!=od.dirRotation[d]) {
        if (od.dirRotationFrame>0) {
            this.dirRotationFrame[0] = od.dirRotationFrame;
            let changeDegree = od.dirRotation[d]-this.dirRotationFrame[3];
            if (Math.abs(changeDegree)>Math.PI) {
                this.dirRotationFrame[1] = -Math.sign(changeDegree)*(Math.abs(changeDegree)-Math.PI)/od.dirRotationFrame;
            } else {
                this.dirRotationFrame[1] = changeDegree/od.dirRotationFrame;
            }
            this.dirRotationFrame[2] = this.dirRotationFrame[3];
            this.dirRotationFrame[3] = od.dirRotation[d];
        } else {
            this.dirRotationFrame[0] = 0;
            this.dirRotationFrame[3] = od.dirRotation[d];
        }
    }
    if (this.dirRotationFrame[0]==0) {
        this.rotation+=this.dirRotationFrame[3];
    } else {
        this.dirRotationFrame[2]+=this.dirRotationFrame[1];
        this.dirRotationFrame[0]--;
        this.rotation+=this.dirRotationFrame[2];
    }
    this.tint = od.tint.get();
    this.shadowCharacterShakeX = od.shadowCharacterShakeX.get();
    //=========================================
    //=========================================
    //=========================================
    //=========================================
};
Game_QJLightLayer.prototype.updatePosition = function(od,character,d) {
    //=========================================
    if (!$dataMap) return; 
    this.x = $gameMap.adjustXWithoutDisplay(character._realX)*standardTile+
        od.offsetX.get()+od.dirOffsetX[d];
    this.y = $gameMap.adjustYWithoutDisplay(character._realY)*standardTile+
        od.offsetY.get()+od.dirOffsetY[d];
    //=========================================
};
Game_QJLightLayer.prototype.updateRotation = function(od,character,d) {
    //=========================================
    this.rotation = od.rotation.get()+this.rotationAuto;
    if (od.rotationMouse) this.rotation+=QJ.LL.calculateAngleByTwoPoint(character.screenX(),character.screenY(),
        mouseX+standardExpand/2,mouseY+standardExpand/2);
    if (this.attach) {
        let functions = QJ.LL.lightObjectFunction[this.attach.attributeName];
        if (functions.updateRotation) {
            functions.updateRotation.call(this,od,character,d);
            return;
        }
    }
    //=========================================
};
Game_QJLightLayer.prototype.updateScale = function(od,character,d) {
    //=========================================
    this.scaleX = od.scaleX.get();
    this.scaleY = od.scaleY.get();
    //=========================================
};
Game_QJLightLayer.prototype.updateOpacity = function(od,character,d) {
    //=========================================
    this.opacity = od.opacity.get();
    if (this.randomFlickerOpacity!==null) {
        this.updateRandomFlickerOpacity(od,character,d);
    }
    //=========================================
};
Game_QJLightLayer.prototype.setDead = function() {
    //=========================================
    delete $gameSystem.characterLights[this.character][this.lightId];
    this.dead = true;
    //=========================================
};
//==========================================================
//Game_QJLightLayerMini
//==========================================================
Game_QJLightLayerMini.prototype.initialize = function(attach,initLightData,index) {
    //=========================================
    this.lightId = initLightData.id;
    this.dead = false;
    this.visible = true;
    this.index = index;
    this.attach = attach;
    this.existTime = 0;
    //=========================================
    this.x = 0;
    this.y = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.opacity = 1;
    this.rotation = 0;
    this.rotationAuto = 0;
    this.tint = "#FFFFFF";
    this.initData = initLightData;
    this.time = this.initData.during;
    //========================================= 
    this.needRefreshFrame = true;
    let baseTextureData = saveTexture[initLightData.imgName];
    this.lightSpriteFrame = [0,0,baseTextureData.width,baseTextureData.height];
    let animEffect = initLightData.imgName.match(/\[([^,]+)\,([^]+)\]/i);
    if (animEffect) {
        this.dramaticBitmap = [0,Number(animEffect[2]),0,Number(animEffect[1])];
        this.lightSpriteFrame[2] /= this.dramaticBitmap[3];
    }
    //=========================================
    this.update();
    //=========================================
};
Game_QJLightLayerMini.prototype.updateFrame = function() {
    //=========================================
    if (!this.dramaticBitmap) return;
    let tarX=0;
    if (this.dramaticBitmap) {
        this.dramaticBitmap[0]++;
        if (this.dramaticBitmap[0]>=this.dramaticBitmap[1]) {
            this.dramaticBitmap[0] = 0;
            this.dramaticBitmap[2]++;
            if (this.dramaticBitmap[2]>=this.dramaticBitmap[3]) {
                this.dramaticBitmap[2]=0;
            }
        }
        tarX = this.dramaticBitmap[2]*this.lightSpriteFrame[2];
    }
    if (tarX!=this.lightSpriteFrame[0]) {
        this.needRefreshFrame = true;
        this.lightSpriteFrame[0] = tarX;
    }
    //=========================================
};
Game_QJLightLayerMini.prototype.update = function() {
    //=========================================
    let od = this.initData;
    this.updateFrame();
    //=========================================
    if (this.time>0) this.time--;
    else if (this.time==0) {
        this.setDead();
        return;
    }
    this.updatePosition(od);
    this.updateRotation(od);
    this.updateScale(od);
    this.updateOpacity(od)
    this.tint = od.tint.get();
    this.existTime++;
    if (this.attach.type==1) {
        let ifShow = false,id = this.attach.regionId;
        if (od.showCondition==0) {
            ifShow=true;
        } else if (od.showCondition==1) {
            ifShow=$gamePlayer.remRegionId==id;
        } else if (od.showCondition==2) {
            ifShow=$gamePlayer.reSetX==this.attach.mapX&&$gamePlayer.reSetY==this.attach.mapY;
        }
        if (regionLightsData[id].showConditionExtra) {
            ifShow = regionLightsData[id].showConditionExtra.call(this,ifShow);
        }
        this.visible = ifShow;
    }
    if (this.attach.type==2) {
        let functions = QJ.LL.miniLightObjectFunction[this.attach.attributeName];
        if (functions.update) functions.update.call(this,od);
    }
    //=========================================
};
Game_QJLightLayerMini.prototype.updatePosition = function(od) {
    //=========================================
    if (this.attach.type==0||this.attach.type==1) {
        this.x = this.attach.x+od.offsetX.get();
        this.y = this.attach.y+od.offsetY.get();
    } else if (this.attach.type==2) {
        let functions = QJ.LL.miniLightObjectFunction[this.attach.attributeName];
        if (functions.updatePosition) functions.updatePosition.call(this,od);
    }
    //=========================================
};
Game_QJLightLayerMini.prototype.updateRotation = function(od) {
    //=========================================
    if (this.attach.type==2) {
        let functions = QJ.LL.miniLightObjectFunction[this.attach.attributeName];
        if (functions.updateRotation) {
            functions.updateRotation.call(this,od);
            return;
        }
    }
    this.rotation = od.rotation.get();
    //=========================================
};
Game_QJLightLayerMini.prototype.updateScale = function(od) {
    //=========================================
    if (this.attach.type==2) {
        let functions = QJ.LL.miniLightObjectFunction[this.attach.attributeName];
        if (functions.updateScale) {
            functions.updateScale.call(this,od);
            return;
        }
    }
    this.scaleX = od.scaleX.get();
    this.scaleY = od.scaleY.get();
    //=========================================
};
Game_QJLightLayerMini.prototype.updateOpacity = function(od) {
    //=========================================
    if (this.attach.type==2) {
        let functions = QJ.LL.miniLightObjectFunction[this.attach.attributeName];
        if (functions.updateOpacity) {
            functions.updateOpacity.call(this,od);
            return;
        }
    }
    this.opacity = od.opacity.get();
    //=========================================
};
Game_QJLightLayerMini.prototype.setDead = function() {
    //=========================================
    if (this.attach.type==2) {
        let functions = QJ.LL.miniLightObjectFunction[this.attach.attributeName];
        if (functions.setDead) functions.setDead.call(this);
    }
    $gameSystem.miniLights[this.index] = null;
    this.dead = true;
    //=========================================
};
//==========================================================
//Sprite_QJLightPart
//==========================================================
Sprite_QJLightLayer.prototype = Object.create(PIXI.Sprite.prototype);
Sprite_QJLightLayer.prototype.constructor = Sprite_QJLightLayer;
Sprite_QJLightLayer.prototype.initialize = function(_parent,odata) {
    //====================================
    this._spriteset = _parent;
    this.lightId = odata.lightId;
    this.odata = odata;
    this.initData = odata.initData;
    this.character = odata.character;
    this.oldScaleXRem = 0;
    this.oldScaleYRem = 0;
    this.onWallMode = false;
    this.dead = false;
    this.shadowWall = this.odata.shadowWall;
    //====================================
    let baseTextureUse = saveTexture[odata.initData.imgName];
    this.dialogLength = this.odata.dialogLength;
    //====================================
    if (this.shadowWall) {
        PIXI.Sprite.call(this,new PIXI.RenderTexture.create({width:this.dialogLength,height:this.dialogLength}));
    } else {
        PIXI.Sprite.call(this,new PIXI.Texture(baseTextureUse));
    }
    if (this.shadowWall) this.pluginName = "qjlightrender";
    this.anchor.set(0.5,0.5);
    //====================================
    if (this.shadowWall) {
        this.lightTexture = new PIXI.Texture(baseTextureUse);
    }
    //====================================
    if (this.shadowWall) {
        this.shadowSprite = new PIXI.Graphics();
        this.shadowSprite.isLightShadow = true;
        this.shadowSprite.x = this.dialogLength/2;
        this.shadowSprite.y = this.dialogLength/2;
        this.shadowTexture = new PIXI.RenderTexture.create({width:this.dialogLength,height:this.dialogLength});
        this._texture.baseTexture.sendTextureData = [this.lightTexture,this.shadowTexture];
        this._texture.baseTexture.sendRotationData = [0,0,0,0,0,0,0,0,this.odata.lightSpriteFrame,this.odata.startX,this.odata.startY];
        this.shadowTexture.baseTexture.clearColor=[1,1,1,1];
    }
    //====================================
    this.buildShadowContainer();
    //====================================
};
Sprite_QJLightLayer.prototype.buildShadowContainer = function() {
    if (this.odata.shadowCharacter) {
        this.characterShadowContainer = new PIXI.Container();
        this.characterShadowContainer.csList = [];
    }
};
Sprite_QJLightLayer.prototype.render = function(renderer) {
    if (!this.visible) return;
    this._render(renderer);
};
Sprite_QJLightLayer.prototype.update = function() {
    //===================================
    if ($gameSystem.characterLights[this.character][this.lightId]!=this.odata) {
        this.setDead();
        return;
    }
    //===================================
    let refreshShadow=false,refreshShadowUvs=false,newVisible=true;
    //===================================
    this.updatePosition();
    //===================================
    newVisible = this.odata.visible;
    //===================================
    if (newVisible!=this.visible) {
        this.visible = newVisible;
        if (this.visible) {
            if (this.characterShadowContainer) this.characterShadowContainer.visible = true;
            refreshShadow=true;
            refreshShadowUvs=true;
        } else {
            if (this.characterShadowContainer) this.characterShadowContainer.visible = false;
        }
    }
    //===================================
    if (!this.visible) return;
    //===================================
    this.alpha = this.odata.opacity;
    //===================================
    if (this.oldTint!=this.odata.tint) {
        this.tint = Number("0x"+this.odata.tint.substr(1));
        this.oldTint = this.odata.tint;
    }
    //===================================
    let scaleData = this.updateScale();
    if (scaleData[0]) refreshShadowUvs = scaleData[0];
    if (scaleData[1]) refreshShadow    = scaleData[1];
    //===================================
    if (this.oldRotation!=this.odata.rotation) {
        this.oldRotation = this.odata.rotation;
        this.rotation = this.oldRotation;
        refreshShadowUvs = true;
    }
    //===================================
    if (this.oldX!=this.odata.x||this.oldY!=this.odata.y) {
        this.oldX=this.odata.x;
        this.oldY=this.odata.y;
        refreshShadow = true;
    }
    //===================================
    if (refreshShadowUvs&&this.shadowWall) this.refreshShadowUvs();
    if (refreshShadow&&this.shadowWall) this.refreshShadowRegion();
    //===================================
};
Sprite_QJLightLayer.prototype.updateScale = function() {
    //===================================
    let refreshShadowUvs,refreshShadow;
    if (this.oldScaleX!=this.odata.scaleX||this.oldScaleY!=this.odata.scaleY) {
        this.oldScaleX = this.odata.scaleX;
        this.oldScaleY = this.odata.scaleY;
        this.scale = new PIXI.ObservablePoint(null,null,this.oldScaleX,this.oldScaleY);
        refreshShadowUvs = true;
        if (this.oldScaleX>this.oldScaleXRem||this.oldScaleY>this.oldScaleYRem) {
            this.oldScaleXRem=this.oldScaleX;
            this.oldScaleYRem=this.oldScaleY;
            refreshShadow = true;
        }
    }
    return [refreshShadowUvs,refreshShadow];
    //===================================
};
Sprite_QJLightLayer.prototype.updatePosition = function() {
    this.x = this.odata.x-dx48+standardTile/2;
    this.y = this.odata.y-dy48+standardTile/2;
};
Sprite_QJLightLayer.prototype.refreshShadowUvs = function() {
    let sin = Math.sin(this.rotation),cos = Math.cos(this.rotation);
    this._texture.baseTexture.sendRotationData[0] = sin;
    this._texture.baseTexture.sendRotationData[1] = cos;
    this._texture.baseTexture.sendRotationData[2] = 0.5-((cos)*this.oldScaleX-(sin)*this.oldScaleY)*0.5/this.oldScaleXRem;
    this._texture.baseTexture.sendRotationData[3] = 0.5-((sin)*this.oldScaleX+(cos)*this.oldScaleY)*0.5/this.oldScaleYRem;
    this._texture.baseTexture.sendRotationData[4] = this.oldScaleX;
    this._texture.baseTexture.sendRotationData[5] = this.oldScaleY;
    this._texture.baseTexture.sendRotationData[6] = 1/this.oldScaleXRem;
    this._texture.baseTexture.sendRotationData[7] = 1/this.oldScaleYRem;
}
Sprite_QJLightLayer.prototype.refreshShadowRegion = function() {
    //===================================
    let regionIdForShadow = $gameMap.regionIdForShadow.bind($gameMap);
    let pixiPointer = PIXI;
    let mathPointer = Math;
    //===================================
    let x = this.oldX,y = this.oldY;
    let sc = this.shadowSprite,dl = this.dialogLength/2,sd = $gameMap.shadowDataQJLL;
    let absPX = mathPointer.floor(x/48)*48-x,absPY = mathPointer.floor(y/48)*48-y;
    let scaleX=this.oldScaleXRem,scaleY=this.oldScaleYRem;
    let iStart = mathPointer.max(mathPointer.floor((x-dl*scaleX)/48),0),iEnd = mathPointer.min(mathPointer.floor((x+dl*scaleX)/48),$gameMap.width()-1);
    let jStart = mathPointer.max(mathPointer.floor((y-dl*scaleY)/48),0),jEnd = mathPointer.min(mathPointer.floor((y+dl*scaleY)/48),$gameMap.height()-1);
    let id,x1,y1,x2,y2,sx,sy,expandTimes=mathPointer.max(jEnd-jStart,iEnd-iStart),addHeight=0;
    //===================================
    let tempNullLineStyle = new pixiPointer.LineStyle();
    let tempFillStyle0 = Object.assign(new pixiPointer.FillStyle(),{color:0xffffff,alpha:1,visible:true});
    let tempFillStyle1;
    let tempFillStyle2 = Object.assign(new pixiPointer.FillStyle(),{color:0x000000,alpha:1,visible:true});//黑色
    //===================================
    sc.clear();
    //===================================
    this.onWallMode = sd[
        mathPointer.min(mathPointer.max(mathPointer.round(x/48),0),$gameMap.width()-1)][
        mathPointer.min(mathPointer.max(mathPointer.round(y/48),0),$gameMap.height()-1)];
    //===================================
    let tarY;
    let whiteBlockList = [];
    let blockBlockList = [];
    //===================================
    for (let i=iStart;i<=iEnd;i++) {
        for (let j=jStart;j<=jEnd;j++) {
            //===================================
            if (sd[i][j]==-1) continue;
            id = regionIdForShadow(i,j);
            if (regionData[id]&&regionData[id].shadowShow) {
                //===========================
                sx = i*48-x-24;
                sy = j*48-y-24;
                //===========================
                if (sx<0&&sy<0&&sx>-48&&sy>-48) continue;
                //===========================
                tempFillStyle1 = Object.assign(new pixiPointer.FillStyle(),{
                    color:regionData[id].shadowTint,alpha:regionData[id].shadowOpacity,visible:true});
                addHeight = regionData[id].shadowHeight;
                //===========================
                if (this.onWallMode!=-1) {
                    //===========================
                    tarY = sd[i][j];
                    //===========================
                    if (tarY!=j&&tarY==this.onWallMode) {
                        //===========================
                        sc.geometry.graphicsData.push(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                            (sx+48)/scaleX,(sy)/scaleY                ,(sx+48)/scaleX,(sy+addHeight*48+48)/scaleY,
                            (sx)/scaleX,   (sy+addHeight*48+48)/scaleY,(sx)/scaleX,   (sy)/scaleY
                            ),tempFillStyle0,tempNullLineStyle,null));
                        //===========================
                        j = tarY;
                        //===========================
                    } else {
                        //==========================
                        sy+=addHeight*48;
                        //===========================
                        if (j+addHeight-this.onWallMode==1) {
                            if (sx>=0&&sy>=0)         {//3
                                x1=(sx   )/scaleX; y1=(sy+48)/scaleY; x2=(sx+48)/scaleX; y2=(sy   )/scaleY;
                                sc.geometry.graphicsData.unshift(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                                    x1*expandTimes,y1*expandTimes,x1,y1,x1,y2,dl,y2
                                    ),tempFillStyle1,tempNullLineStyle,null));
                            } else if (sx<=-48&&sy>=0){//1
                                x1=(sx   )/scaleX; y1=(sy   )/scaleY; x2=(sx+48)/scaleX; y2=(sy+48)/scaleY;
                                sc.geometry.graphicsData.unshift(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                                    -dl,y1,x2,y1,x2,y2,x2*expandTimes,y2*expandTimes
                                    ),tempFillStyle1,tempNullLineStyle,null));
                            }
                        } else {
                            if (sx>=0&&sy>=0)         {//3
                                x1=(sx   )/scaleX; y1=(sy+48)/scaleY; x2=(sx+48)/scaleX; y2=(sy   )/scaleY;
                            } else if (sx<=-48&&sy>=0){//1
                                x1=(sx   )/scaleX; y1=(sy   )/scaleY; x2=(sx+48)/scaleX; y2=(sy+48)/scaleY;
                            } else if (sy>=0)         {//2
                                x1=(sx   )/scaleX; y1=(sy   )/scaleY; x2=(sx+48)/scaleX; y2=(sy   )/scaleY;
                            }
                            sc.geometry.graphicsData.unshift(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                                x1*expandTimes,y1*expandTimes,x1,y1,x2,y2,x2*expandTimes,y2*expandTimes
                                ),tempFillStyle1,tempNullLineStyle,null));
                        }
                        //===========================
                        sc.geometry.graphicsData.unshift(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                            (sx+48)/scaleX,(sy   )/scaleY,(sx+48)/scaleX,(sy+48)/scaleY,(sx   )/scaleX,(sy+48)/scaleY,(sx   )/scaleX,(sy   )/scaleY
                            ),tempFillStyle1,tempNullLineStyle,null));
                        //===========================
                    }
                    //===========================
                    continue;
                    //===========================
                } else {
                    //===========================
                    sy += addHeight*48;
                    //===========================
                    if (sx>=0&&sy>=0)         {x1=sx   ; y1=sy+48; x2=sx+48; y2=sy   ;}//3
                    else if (sx<=-48&&sy>=0)  {x1=sx   ; y1=sy   ; x2=sx+48; y2=sy+48;}//1
                    else if (sy>=0)           {x1=sx   ; y1=sy   ; x2=sx+48; y2=sy   ;}//2
                    else if (sx>=0&&sy<-48)   {x1=sx+48; y1=sy+48; x2=sx   ; y2=sy   ;}//9
                    else if (sx>=0)           {x1=sx   ; y1=sy+48; x2=sx   ; y2=sy   ;}//6
                    else if (sx<=-48&&sy<-48) {x1=sx+48; y1=sy   ; x2=sx   ; y2=sy+48;}//7
                    else if (sx<=-48)         {x1=sx+48; y1=sy   ; x2=sx+48; y2=sy+48;}//4
                    else if (sy<=-48)         {x1=sx+48; y1=sy+48; x2=sx   ; y2=sy+48;}//8
                    //===========================
                    blockBlockList.push([x1,y1,x2,y2]);//收集基础射线数据
                    //===========================
                    x1/=scaleX;
                    y1/=scaleY;
                    x2/=scaleX;
                    y2/=scaleY;
                    //===========================
                    sc.geometry.graphicsData.push(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                        x1*expandTimes,y1*expandTimes,x1,y1,x2,y2,x2*expandTimes,y2*expandTimes
                        ),tempFillStyle1,tempNullLineStyle,null));
                    //===========================
                    if (j+1<$gameMap.height() && regionIdForShadow(i,j+1)!=id) {//收集所有墙面数据
                        whiteBlockList.push([sx,sy-addHeight*48+48,sx+48,sy+48]);
                    }
                    //===========================
                    /*if (y>j*48-24+48+regionData[id].shadowHeight*48) {
                        for (let k=0,kl=regionData[id].shadowHeight;k<kl;k++) {
                            if (regionIdForShadow(i,j+k+1)==id) {addHeight=k;break;}
                            sy = j*48-y-24+48+k*48;
                            sc.geometry.graphicsData.push(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                                sx/scaleX,     sy/scaleY     ,(sx+48)/scaleX,(sy)/scaleY,
                                (sx+48)/scaleX,(sy+48)/scaleY,(sx)/scaleX,   (sy+48)/scaleY
                                ),tempFillStyle0,tempNullLineStyle,null));
                        }
                    } else {
                        for (let k=0,kl=regionData[id].shadowHeight;k<kl;k++) {
                            if (regionIdForShadow(i,j+k+1)==id) {addHeight=k;break;}
                            sy = j*48-y-24+48+k*48;
                            sc.geometry.graphicsData.push(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                                sx/scaleX,     sy/scaleY     ,(sx+48)/scaleX,(sy)/scaleY,
                                (sx+48)/scaleX,(sy+48)/scaleY,(sx)/scaleX,   (sy+48)/scaleY
                                ),Object.assign(new pixiPointer.FillStyle(),{color:pixiPointer.utils.rgb2hex([1,1,1]),
                                alpha:1,visible:true}),tempNullLineStyle,null));
                        }
                    }*/
                    //===========================
                }
                //===========================
            }
            //===========================
        }
    }
    //===================================
    if (this.onWallMode!=-1) {
        sy = (this.onWallMode*48-y-24+48)/scaleY;
        sc.geometry.graphicsData.splice(0,0,new pixiPointer.GraphicsData(new pixiPointer.Polygon(
            dl,-dl,dl,sy,-dl,sy,-dl,-dl),
            Object.assign(new pixiPointer.FillStyle(),{color:0x000000,alpha:1,visible:true}),tempNullLineStyle,null));
    } else {
        //blackAfterAdd：将黑色前墙面涂色储存起来，在之后再重新输出，保证黑色在白色上面让黑色完全覆盖白色。
        //因为这里的白色除了整个块都是白色的外，其它半白块都是处于“背后”的状态。
        for (let i=0,il=whiteBlockList.length,detail,blackAfterAdd;i<il;i++) {
            let detail = whiteBlockList[i];
            if (detail[3]>=0) {//玩家完全在其上
                sc.geometry.graphicsData.push(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                    detail[0]/scaleX,detail[1]/scaleY,
                    detail[2]/scaleX,detail[1]/scaleY,
                    detail[2]/scaleX,detail[3]/scaleY,
                    detail[0]/scaleX,detail[3]/scaleY
                    ),tempFillStyle2,tempNullLineStyle,null));
            } else {//分为两种，一种是渐变过渡色，一种是纯白，但不管是哪一个，只有完全可透时是自己的颜色，不然就是纯黑色
                let isTotalNoCave = true;
                let footY = detail[3];
                let footSX = detail[0];
                let footEX = detail[2];
                blackAfterAdd = [];
                for (let j=0,jl=blockBlockList.length,blockDetail,lineX1,lineX2;j<jl;j++) {
                    blockDetail = blockBlockList[j];
                    if (footY>=mathPointer.max(blockDetail[1],blockDetail[3])) {
                        continue;
                    }
                    if (mathPointer.min(blockDetail[0],blockDetail[2])>=detail[0] && 
                        mathPointer.max(blockDetail[0],blockDetail[2])<=detail[2] &&
                        mathPointer.min(blockDetail[1],blockDetail[3])>=detail[1] && 
                        mathPointer.max(blockDetail[1],blockDetail[3])<=detail[3]) {
                        continue;
                    }
                    if (blockDetail[0]==blockDetail[2]&&blockDetail[0]*footSX>0&&blockDetail[0]*footEX>0) {//八个象限，这个方法中全左和全右需要特殊判定，也就是射点在同一竖列时
                        lineX1 = (blockDetail[0]>0?footEX:footSX)*blockDetail[1]/blockDetail[0];
                        lineX2 = (blockDetail[0]>0?footEX:footSX)*blockDetail[3]/blockDetail[2];
                        if (footY>=mathPointer.max(lineX1,lineX2) || footY<=mathPointer.min(lineX1,lineX2)) {
                            continue;
                        }
                    } else {//八个象限，其他6个象限使用此通用办法
                        lineX1 = footY*blockDetail[0]/blockDetail[1];
                        if (lineX1*blockDetail[0]<0) {//不要加上等于号
                            continue;
                        }
                        lineX2 = footY*blockDetail[2]/blockDetail[3];
                        if (lineX2*blockDetail[2]<0) {//不要加上等于号
                            continue;
                        }
                        if (footSX>=mathPointer.max(lineX1,lineX2) || footEX<=mathPointer.min(lineX1,lineX2)) {
                            continue;
                        }
                    }
                    //是黑色
                    isTotalNoCave = false;
                    lineX1 = footY*(blockDetail[0]<blockDetail[2]?(blockDetail[0]/blockDetail[1]):(blockDetail[2]/blockDetail[3]));
                    if (lineX1>footSX&&lineX1<footEX) {//左白右黑分涂块
                        sc.geometry.graphicsData.push(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                            detail[0]/scaleX,detail[1]/scaleY,
                            lineX1/scaleX,detail[1]/scaleY,
                            lineX1/scaleX,detail[3]/scaleY,
                            detail[0]/scaleX,detail[3]/scaleY
                            ),tempFillStyle0,tempNullLineStyle,null));
                        blackAfterAdd.push([
                            lineX1/scaleX,detail[1]/scaleY,
                            detail[2]/scaleX,detail[1]/scaleY,
                            detail[2]/scaleX,detail[3]/scaleY,
                            lineX1/scaleX,detail[3]/scaleY
                        ]);
                    } else {
                        lineX1 = footY*(blockDetail[0]>blockDetail[2]?(blockDetail[0]/blockDetail[1]):(blockDetail[2]/blockDetail[3]));
                        if (lineX1>footSX&&lineX1<footEX) {//左黑右白分涂块
                            sc.geometry.graphicsData.push(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                                lineX1/scaleX,detail[1]/scaleY,
                                detail[2]/scaleX,detail[1]/scaleY,
                                detail[2]/scaleX,detail[3]/scaleY,
                                lineX1/scaleX,detail[3]/scaleY
                                ),tempFillStyle0,tempNullLineStyle,null));
                            blackAfterAdd.push([
                                detail[0]/scaleX,detail[1]/scaleY,
                                lineX1/scaleX,detail[1]/scaleY,
                                lineX1/scaleX,detail[3]/scaleY,
                                detail[0]/scaleX,detail[3]/scaleY
                            ]);
                        } else {//全黑块
                            blackAfterAdd.push([
                                detail[0]/scaleX,detail[1]/scaleY,
                                detail[2]/scaleX,detail[1]/scaleY,
                                detail[2]/scaleX,detail[3]/scaleY,
                                detail[0]/scaleX,detail[3]/scaleY
                            ]);
                        }
                    }
                }
                for (let bAA of blackAfterAdd) {
                    sc.geometry.graphicsData.push(new pixiPointer.GraphicsData(new pixiPointer.Polygon(bAA),tempFillStyle2,tempNullLineStyle,null));
                }
                if (isTotalNoCave) {//完全没有被射到，是原色，或者说纯白块
                    sc.geometry.graphicsData.push(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                        detail[0]/scaleX,detail[1]/scaleY,
                        detail[2]/scaleX,detail[1]/scaleY,
                        detail[2]/scaleX,detail[3]/scaleY,
                        detail[0]/scaleX,detail[3]/scaleY
                        ),tempFillStyle0,tempNullLineStyle,null));
                }
            }
            
        }
    }
    sc.geometry.dirty++;
    //===================================
    Graphics._app.renderer.render(this.shadowSprite,this.shadowTexture);
    //===================================
};
Sprite_QJLightLayer.prototype.setDead = function() {
    //===================================
    if (this.characterShadowContainer&&this.characterShadowContainer.parent) {
        this.characterShadowContainer.parent.removeChild(this.characterShadowContainer);
    }
    this.parent.removeChild(this);
    this.destroy();
    this.dead = true;
    //===================================
};
//==========================================================
//Sprite_QJLightPart
//==========================================================
Sprite_QJLightLayerMini.prototype = Object.create(PIXI.Sprite.prototype);
Sprite_QJLightLayerMini.prototype.constructor = Sprite_QJLightLayerMini;
Sprite_QJLightLayerMini.prototype.initialize = function(_parent,odata) {
    //====================================
    this._spriteset = _parent;
    this.odata = odata;
    this.initData = odata.initData;
    this.index = odata.index;
    this.dead = false;
    //====================================
    PIXI.Sprite.call(this,new PIXI.Texture(saveTexture[odata.initData.imgName]));
    this.anchor.set(0.5,0.5);
    this.update();
    //====================================
};
Sprite_QJLightLayerMini.prototype.update = function() {
    //===================================
    if ($gameSystem.miniLights[this.index]!=this.odata) {
        this.setDead();
        return;
    }
    //===================================
    this.updatePosition();
    //===================================
    this.alpha = this.odata.opacity;
    this.visible = this.odata.visible;
    //===================================
    if (this.oldTint!=this.odata.tint) {
        this.tint = Number("0x"+this.odata.tint.substr(1));
        this.oldTint = this.odata.tint;
    }
    this.updateScale();
    if (this.oldRotation!=this.odata.rotation) {
        this.oldRotation = this.odata.rotation;
        this.rotation = this.oldRotation;
    }
    if (this.odata.needRefreshFrame) {
        this.odata.needRefreshFrame = false;
        this.texture.frame.x = this.odata.lightSpriteFrame[0];
        this.texture.frame.width = this.odata.lightSpriteFrame[2];
        this.texture.frame = this.texture.frame;
    }
    //===================================
};
Sprite_QJLightLayerMini.prototype.setDead = function() {
    //===================================
    this.parent.removeChild(this);
    this.destroy();
    this.dead = true;
    //===================================
};
Sprite_QJLightLayerMini.prototype.updatePosition = function() {
    //===================================
    this.x = this.odata.x-dx48;
    this.y = this.odata.y-dy48;
    //===================================
};
Sprite_QJLightLayerMini.prototype.updateScale = function() {
    //===================================
    if (this.oldScaleX!=this.odata.scaleX||this.oldScaleY!=this.odata.scaleY) {
        this.oldScaleX = this.odata.scaleX;
        this.oldScaleY = this.odata.scaleY;
        this.scale = new PIXI.ObservablePoint(null,null,this.oldScaleX,this.oldScaleY);
    }
    //===================================
};
//==========================================================
//UltraMode7
//==========================================================
if (Imported.Blizzard_UltraMode7) {
    //==========================================================
    //
    //==========================================================
    const LLS_Game_QJLightLayer_updatePosition = Game_QJLightLayer.prototype.updatePosition;
    Game_QJLightLayer.prototype.updatePosition = function(od,character,d) {
        if (!$gameMap.useUltraMode7) return LLS_Game_QJLightLayer_updatePosition.call(this,od,character,d);
        //=========================================
        if (!$dataMap) return; 
        this.x = $gameMap.adjustXWithoutDisplay(character._realX)*standardTile;
        this.xAdd = od.offsetX.get()+od.dirOffsetX[d];
        this.y = $gameMap.adjustYWithoutDisplay(character._realY)*standardTile;
        this.yAdd = od.offsetY.get()+od.dirOffsetY[d];
        //=========================================
    };
    const LLS_Sprite_QJLightLayer_updatePosition = Sprite_QJLightLayer.prototype.updatePosition;
    Sprite_QJLightLayer.prototype.updatePosition = function() {
        if (!$gameMap.useUltraMode7) return LLS_Sprite_QJLightLayer_updatePosition.call(this);
        //===================================
        let loopedPosition = $gameMap.adjustUltraMode7LoopedPosition((this.odata.x+standardTile/2)/48,(this.odata.y+standardTile/2)/48);
        let position = UltraMode7.mapToScreen(loopedPosition.x*$gameMap.tileWidth(),loopedPosition.y*$gameMap.tileHeight());
        let scale = this.UM7scale = UltraMode7.mapToScreenScale(loopedPosition.x*$gameMap.tileWidth(),loopedPosition.y*$gameMap.tileHeight());
        this.x = position.x+standardExpand/2+this.odata.xAdd*scale;
        this.y = position.y+standardExpand/2+this.odata.yAdd*scale;
        //===================================
    };
    const LLS_Sprite_QJLightLayer_updateScale = Sprite_QJLightLayer.prototype.updateScale;
    Sprite_QJLightLayer.prototype.updateScale = function() {
        if (!$gameMap.useUltraMode7) return LLS_Sprite_QJLightLayer_updateScale.call(this);
        //===================================
        let scale = this.UM7scale,refreshShadowUvs,refreshShadow;
        let scaleX = this.odata.scaleX*scale;
        let scaleY = this.odata.scaleY*scale;
        if (this.oldScaleX!=scaleX||this.oldScaleY!=scaleY) {
            this.oldScaleX = scaleX;
            this.oldScaleY = scaleY;
            this.scale = new PIXI.ObservablePoint(null,null,this.oldScaleX,this.oldScaleY);
            refreshShadowUvs = true;
            if (this.oldScaleX>this.oldScaleXRem||this.oldScaleY>this.oldScaleYRem) {
                this.oldScaleXRem=this.oldScaleX;
                this.oldScaleYRem=this.oldScaleY;
                refreshShadow = true;
            }
        }
        return [refreshShadowUvs,refreshShadow];
        //===================================
    };
    //==========================================================
    //
    //==========================================================
    const LLS_Game_QJLightLayerMini_updatePosition = Game_QJLightLayerMini.prototype.updatePosition;
    Game_QJLightLayerMini.prototype.updatePosition = function(od) {
        if (!$gameMap.useUltraMode7) return LLS_Game_QJLightLayerMini_updatePosition.call(this,od);
        //=========================================
        this.xAdd = od.offsetX.get();
        this.yAdd = od.offsetY.get();
        if (this.attach.type==0||this.attach.type==1) {
            this.x = this.attach.x;
            this.y = this.attach.y;
        } else if (this.attach.type==2) {
            if (this.attach.object.isDeadQJ()) {
                this.setDead();
                return;
            }
            this.x = this.attach.object.mapShowXQJ();
            this.y = this.attach.object.mapShowYQJ();
        }
        this.x += this.xAdd;
        this.y += this.yAdd;
        //=========================================
    };
    const LLS_Sprite_QJLightLayerMini_updatePosition = Sprite_QJLightLayerMini.prototype.updatePosition;
    Sprite_QJLightLayerMini.prototype.updatePosition = function() {
        if (!$gameMap.useUltraMode7) return LLS_Sprite_QJLightLayerMini_updatePosition.call(this);
        //===================================
        let loopedPosition = $gameMap.adjustUltraMode7LoopedPosition(this.odata.x/48,this.odata.y/48);
        let position = UltraMode7.mapToScreen(loopedPosition.x*$gameMap.tileWidth(),loopedPosition.y*$gameMap.tileHeight());
        this.x = position.x+standardExpand/2;
        this.y = position.y+standardExpand/2;
        let scale = UltraMode7.mapToScreenScale(loopedPosition.x*$gameMap.tileWidth(),loopedPosition.y*$gameMap.tileHeight());
        let scaleX = this.odata.scaleX*scale;
        let scaleY = this.odata.scaleY*scale;
        if (this.oldScaleX!=scaleX||this.oldScaleY!=scaleY) {
            this.oldScaleX = scaleX;
            this.oldScaleY = scaleY;
            this.scale = new PIXI.ObservablePoint(null,null,this.oldScaleX,this.oldScaleY);
        }
        //===================================
    };
    const LLS_Sprite_QJLightLayerMini_updateScale = Sprite_QJLightLayerMini.prototype.updateScale;
    Sprite_QJLightLayerMini.prototype.updateScale = function() {
        if (!$gameMap.useUltraMode7) return LLS_Sprite_QJLightLayerMini_updateScale.call(this);
        //===================================
        //nothing
        //===================================
    };
    //==========================================================
    //
    //==========================================================
}
//==========================================================
//
//==========================================================
Sprite_QJLightSystem.prototype.render = function(renderer) {
    if (!this.visible) return;
    renderer.batch.flush();
    var filters = this.filters;
    if (filters) {
        if (!this._enabledFilters) this._enabledFilters = [];
        this._enabledFilters.length = 0;
        for (var i = 0; i < filters.length; i++) {
            if (filters[i].enabled) this._enabledFilters.push(filters[i]);
        }
        if (this._enabledFilters.length) renderer.filter.push(this, this._enabledFilters);
    }
    this._render(renderer);
    if (this.children.length>2) {
        for (var _i2 = 0, j = this.children.length-2; _i2 < j; _i2++) {
            this.children[_i2].render(renderer);
        }
        renderer.batch.flush();
    }
    this.children[this.children.length-2].render(renderer);
    this.children[this.children.length-1].render(renderer);
    renderer.batch.flush();
    if (filters && this._enabledFilters && this._enabledFilters.length) {
        renderer.filter.pop();
    }
};
//==========================================================
//QJLightRender
//==========================================================
QJLightRender = function() {
    this.initialize(...arguments);
}
QJLightRender._drawCallPool = [];
QJLightRender._textureArrayPool = [];
QJLightRender.prototype = Object.create(PIXI.ObjectRenderer.prototype);
QJLightRender.prototype.constructor = QJLightRender;
QJLightRender.prototype.initialize = function(renderer) {
    PIXI.ObjectRenderer.call(this,renderer);
    //====================================
    this.geometryClass = PIXI.BatchGeometry;
    this.vertexSize = 6;
    this.state = PIXI.State.for2d();
    this.size = PIXI.settings.SPRITE_BATCH_SIZE * 4;
    this._vertexCount = 0;
    this._indexCount = 0;
    this._bufferedElements = [];
    this._bufferedTextures = [];
    this._bufferSize = 0;
    this._shader = null;
    this._packedGeometries = [];
    this._packedGeometryPoolSize = 2;
    this._flushId = 0;
    this._aBuffers = {};
    this._iBuffers = {};
    this.MAX_TEXTURES = 1;
    //====================================
    this.renderer.on('prerender', this.onPrerender, this);
    renderer.runners.contextChange.add(this);
    //====================================
    this._dcIndex = 0;
    this._aIndex = 0;
    this._iIndex = 0;
    this._attributeBuffer = null;
    this._indexBuffer = null;
    this._tempBoundTextures = [];
    this._defaultSyncData = {textureCount:0};
    //====================================
};
QJLightRender.prototype.onPrerender = function() {
    this._flushId = 0;
};
QJLightRender.prototype.contextChange = function() {
    var gl = this.renderer.gl;
    this.MAX_TEXTURES = 1;
    this._shader = QJ.LL.generateMultiTextureShader();
    for (var i = 0; i < this._packedGeometryPoolSize; i++) {
        this._packedGeometries[i] = new (this.geometryClass)();
    }
    this.initFlushBuffers();
};
QJLightRender.prototype.initFlushBuffers = function() {
    var _drawCallPool = QJLightRender._drawCallPool;
    var _textureArrayPool = QJLightRender._textureArrayPool;
    var MAX_SPRITES = this.size / 4;
    var MAX_TA = Math.floor(MAX_SPRITES / this.MAX_TEXTURES) + 1;
    while (_drawCallPool.length < MAX_SPRITES) {
        _drawCallPool.push(new PIXI.BatchDrawCall());
    }
    while (_textureArrayPool.length < MAX_TA) {
        _textureArrayPool.push(new PIXI.BatchTextureArray());
    }
    for (var i = 0; i < this.MAX_TEXTURES; i++) {
        this._tempBoundTextures[i] = null;
    }
};
QJLightRender.prototype.render = function(element) {
    if (!element._texture.valid) return;
    if (this._vertexCount + (element.vertexData.length / 2) > this.size) this.flush();
    this._vertexCount += element.vertexData.length / 2;
    this._indexCount += element.indices.length;
    this._bufferedTextures[this._bufferSize] = element._texture.baseTexture;
    this._bufferedElements[this._bufferSize++] = element;
};
QJLightRender.prototype.buildTexturesAndDrawCalls = function() {
    var ref = this;
    var textures = ref._bufferedTextures;
    var MAX_TEXTURES = ref.MAX_TEXTURES;
    var textureArrays = QJLightRender._textureArrayPool;
    var batch = this.renderer.batch;
    var boundTextures = this._tempBoundTextures;
    var touch = this.renderer.textureGC.count;
    var TICK = ++PIXI.BaseTexture._globalBatch;
    var countTexArrays = 0;
    var texArray = textureArrays[0];
    var start = 0;
    batch.copyBoundTextures(boundTextures, MAX_TEXTURES);
    for (var i = 0; i < this._bufferSize; ++i) {
        var tex = textures[i];
        textures[i] = null;
        if (tex._batchEnabled === TICK) continue;
        if (texArray.count >= MAX_TEXTURES) {
            batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
            this.buildDrawCalls(texArray, start, i);
            start = i;
            texArray = textureArrays[++countTexArrays];
            ++TICK;
        }
        tex._batchEnabled = TICK;
        tex.touched = touch;
        texArray.elements[texArray.count++] = tex;
    }
    if (texArray.count > 0) {
        batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
        this.buildDrawCalls(texArray, start, this._bufferSize);
        ++countTexArrays;
        ++TICK;
    }
    for (var i$1 = 0; i$1 < boundTextures.length; i$1++) {
        boundTextures[i$1] = null;
    }
    PIXI.BaseTexture._globalBatch = TICK;
};
QJLightRender.prototype.buildDrawCalls = function(texArray, start, finish) {
    var ref = this;
    var elements = ref._bufferedElements;
    var _attributeBuffer = ref._attributeBuffer;
    var _indexBuffer = ref._indexBuffer;
    var vertexSize = ref.vertexSize;
    var drawCalls = QJLightRender._drawCallPool;
    var dcIndex = this._dcIndex;
    var aIndex = this._aIndex;
    var iIndex = this._iIndex;
    var drawCall = drawCalls[dcIndex];
    drawCall.start = this._iIndex;
    drawCall.texArray = texArray;
    for (var i = start; i < finish; ++i) {
        var sprite = elements[i];
        var tex = sprite._texture.baseTexture;
        var spriteBlendMode = PIXI.utils.premultiplyBlendMode[
            tex.alphaMode ? 1 : 0][sprite.blendMode];
        elements[i] = null;
        if (start < i && drawCall.blend !== spriteBlendMode) {
            drawCall.size = iIndex - drawCall.start;
            start = i;
            drawCall = drawCalls[++dcIndex];
            drawCall.texArray = texArray;
            drawCall.start = iIndex;
        }
        this.packInterleavedGeometry(sprite, _attributeBuffer, _indexBuffer, aIndex, iIndex);
        aIndex += sprite.vertexData.length / 2 * vertexSize;
        iIndex += sprite.indices.length;
        drawCall.blend = spriteBlendMode;
    }
    if (start < finish) {
        drawCall.size = iIndex - drawCall.start;
        ++dcIndex;
    }
    this._dcIndex = dcIndex;
    this._aIndex = aIndex;
    this._iIndex = iIndex;
};
QJLightRender.prototype.updateGeometry = function() {
    var ref = this;
    var packedGeometries = ref._packedGeometries;
    var attributeBuffer = ref._attributeBuffer;
    var indexBuffer = ref._indexBuffer;
    if (!PIXI.settings.CAN_UPLOAD_SAME_BUFFER) {
        if (this._packedGeometryPoolSize <= this._flushId) {
            this._packedGeometryPoolSize++;
            packedGeometries[this._flushId] = new (this.geometryClass)();
        }
        packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
        packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);
        this.renderer.geometry.bind(packedGeometries[this._flushId]);
        this.renderer.geometry.updateBuffers();
        this._flushId++;
    } else {
        packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
        packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);
        this.renderer.geometry.updateBuffers();
    }
};
QJLightRender.prototype.bindUniforms = function(ud,uv,renderer,syncData) {
    var v = null;
    var cv = null
    var t = 0;
    var gl = renderer.gl
    cv = ud.uSamplers.value;
    v = uv.uSamplers;
    gl.uniform1iv(ud.uSamplers.location, v);
    gl.uniformMatrix3fv(ud.projectionMatrix.location, false, uv.projectionMatrix.toArray(true));
    if(uv.sRSin !== ud.sRSin.value) {
        ud.sRSin.value = uv.sRSin
        gl.uniform1f(ud.sRSin.location, uv.sRSin)
    }
    if(uv.sRCos !== ud.sRCos.value) {
        ud.sRCos.value = uv.sRCos
        gl.uniform1f(ud.sRCos.location, uv.sRCos)
    }
    if(uv.sROffsetX !== ud.sROffsetX.value) {
        ud.sROffsetX.value = uv.sROffsetX
        gl.uniform1f(ud.sROffsetX.location, uv.sROffsetX)
    }
    if(uv.sROffsetY !== ud.sROffsetY.value) {
        ud.sROffsetY.value = uv.sROffsetY
        gl.uniform1f(ud.sROffsetY.location, uv.sROffsetY)
    }
    if(uv.sRScaleX !== ud.sRScaleX.value) {
        ud.sRScaleX.value = uv.sRScaleX
        gl.uniform1f(ud.sRScaleX.location, uv.sRScaleX)
    }
    if(uv.sRScaleY !== ud.sRScaleY.value) {
        ud.sRScaleY.value = uv.sRScaleY
        gl.uniform1f(ud.sRScaleY.location, uv.sRScaleY)
    }
    if(uv.sRScaleX2 !== ud.sRScaleX2.value) {
        ud.sRScaleX2.value = uv.sRScaleX2
        gl.uniform1f(ud.sRScaleX2.location, uv.sRScaleX2)
    }
    if(uv.sRScaleY2 !== ud.sRScaleY2.value) {
        ud.sRScaleY2.value = uv.sRScaleY2
        gl.uniform1f(ud.sRScaleY2.location, uv.sRScaleY2)
    }
    if(uv.frameX !== ud.frameX.value) {
        ud.frameX.value = uv.frameX
        gl.uniform1f(ud.frameX.location, uv.frameX)
    }
    if(uv.frameY !== ud.frameY.value) {
        ud.frameY.value = uv.frameY
        gl.uniform1f(ud.frameY.location, uv.frameY)
    }
    if(uv.frameW !== ud.frameW.value) {
        ud.frameW.value = uv.frameW
        gl.uniform1f(ud.frameW.location, uv.frameW)
    }
    if(uv.frameH !== ud.frameH.value) {
        ud.frameH.value = uv.frameH
        gl.uniform1f(ud.frameH.location, uv.frameH)
    }
    if(uv.startX !== ud.startX.value) {
        ud.startX.value = uv.startX
        gl.uniform1f(ud.startX.location, uv.startX)
    }
    if(uv.startY !== ud.startY.value) {
        ud.startY.value = uv.startY
        gl.uniform1f(ud.startY.location, uv.startY)
    }
    renderer.shader.syncUniforms(uv.globals,renderer.shader.getglProgram(), syncData);
}
QJLightRender.prototype.drawBatches = function() {
    var dcCount = this._dcIndex;
    var ref = this.renderer;
    var gl = ref.gl;
    var stateSystem = ref.state;
    var drawCalls = QJLightRender._drawCallPool;
    var curTexArray = null;
    var unif = this._shader.uniforms;
    gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
    //=================================
    for (var i = 0; i < dcCount; i++) {
        var ref$1 = drawCalls[i];
        var texArray = ref$1.texArray;
        var type = ref$1.type;
        var size = ref$1.size;
        var start = ref$1.start;
        var blend = ref$1.blend;
        curTexArray = texArray;
        var textureSystem = this.renderer.texture;
        var currentTexture = texArray.elements[0];
        textureSystem.bind(currentTexture.sendTextureData[0],0);
        textureSystem.bind(currentTexture.sendTextureData[1],1);
        texArray.elements[0] = null;
        texArray.count = 0;
        //=================================
        var sendData = currentTexture.sendRotationData;
        unif.sRSin = sendData[0];
        unif.sRCos = sendData[1];
        unif.sROffsetX = sendData[2];
        unif.sROffsetY = sendData[3];
        unif.sRScaleX = sendData[4];
        unif.sRScaleY = sendData[5];
        unif.sRScaleX2 = sendData[6];
        unif.sRScaleY2 = sendData[7];
        unif.frameX = sendData[8][0];
        unif.frameY = sendData[8][1];
        unif.frameW = sendData[8][2];
        unif.frameH = sendData[8][3];
        unif.startX = sendData[9];
        unif.startY = sendData[10];
        this._defaultSyncData.textureCount = 0;
        this.bindUniforms(this.renderer.shader.getglProgram().uniformData,
            this._shader.uniformGroup.uniforms,ref,this._defaultSyncData);
        //=================================
        this.state.blendMode = blend;
        stateSystem.set(this.state);
        gl.drawElements(type, size, gl.UNSIGNED_SHORT, start * 2);
    }
};
QJLightRender.prototype.flush = function() {
    if (this._vertexCount === 0) return;
    this._attributeBuffer = this.getAttributeBuffer(this._vertexCount);
    this._indexBuffer = this.getIndexBuffer(this._indexCount);
    this._aIndex = 0;
    this._iIndex = 0;
    this._dcIndex = 0;
    this.buildTexturesAndDrawCalls();
    this.updateGeometry();
    this.drawBatches();
    this._bufferSize = 0;
    this._vertexCount = 0;
    this._indexCount = 0;
};
QJLightRender.prototype.start = function() {
    this.renderer.state.set(this.state);
    this.renderer.shader.bind(this._shader,true);
    if (PIXI.settings.CAN_UPLOAD_SAME_BUFFER) {
        this.renderer.geometry.bind(this._packedGeometries[this._flushId]);
    }
};
QJLightRender.prototype.stop = function() {
    this.flush();
};
QJLightRender.prototype.destroy = function() {
    for (var i = 0; i < this._packedGeometryPoolSize; i++) {
        if (this._packedGeometries[i]) {
            this._packedGeometries[i].destroy();
        }
    }
    this.renderer.off('prerender', this.onPrerender, this);
    this._aBuffers = null;
    this._iBuffers = null;
    this._packedGeometries = null;
    this._attributeBuffer = null;
    this._indexBuffer = null;
    if (this._shader) {
        this._shader.destroy();
        this._shader = null;
    }
    PIXI.ObjectRenderer.prototype.destroy.call(this);
};
QJLightRender.prototype.getAttributeBuffer = function(size) {
    var roundedP2 = PIXI.utils.nextPow2(Math.ceil(size / 8));
    var roundedSizeIndex = PIXI.utils.log2(roundedP2);
    var roundedSize = roundedP2 * 8;
    if (this._aBuffers.length <= roundedSizeIndex) {
        this._iBuffers.length = roundedSizeIndex + 1;
    }
    var buffer = this._aBuffers[roundedSize];
    if (!buffer) {
        this._aBuffers[roundedSize] = buffer = new PIXI.ViewableBuffer(roundedSize * this.vertexSize * 4);
    }
    return buffer;
};
QJLightRender.prototype.getIndexBuffer = function(size) {
    var roundedP2 = PIXI.utils.nextPow2(Math.ceil(size / 12));
    var roundedSizeIndex = PIXI.utils.log2(roundedP2);
    var roundedSize = roundedP2 * 12;
    if (this._iBuffers.length <= roundedSizeIndex) {
        this._iBuffers.length = roundedSizeIndex + 1;
    }
    var buffer = this._iBuffers[roundedSizeIndex];
    if (!buffer) {
        this._iBuffers[roundedSizeIndex] = buffer = new Uint16Array(roundedSize);
    }
    return buffer;
};
QJLightRender.prototype.packInterleavedGeometry = function(element, attributeBuffer, indexBuffer, aIndex, iIndex) {
    var uint32View = attributeBuffer.uint32View;
    var float32View = attributeBuffer.float32View;
    var packedVertices = aIndex / this.vertexSize;
    var uvs = element.uvs;
    var indicies = element.indices;
    var vertexData = element.vertexData;
    var textureId = element._texture.baseTexture._batchLocation;
    var alpha = Math.min(element.worldAlpha, 1.0);
    var argb = (alpha < 1.0
        && element._texture.baseTexture.alphaMode)
        ? PIXI.utils.premultiplyTint(element._tintRGB, alpha)
        : element._tintRGB + (alpha * 255 << 24);
    for (var i = 0; i < vertexData.length; i += 2) {
        float32View[aIndex++] = vertexData[i];
        float32View[aIndex++] = vertexData[i + 1];
        float32View[aIndex++] = uvs[i];
        float32View[aIndex++] = uvs[i + 1];
        uint32View[aIndex++] = argb;
        float32View[aIndex++] = textureId;
    }
    for (var i$1 = 0; i$1 < indicies.length; i$1++) {
        indexBuffer[iIndex++] = packedVertices + indicies[i$1];
    }
};
PIXI.Renderer.registerPlugin("qjlightrender",QJLightRender);
//==========================================================
//Sprite_QJLightShadowLayer
//==========================================================
Sprite_QJCharacterShadowLayer.prototype = Object.create(PIXI.Container.prototype);
Sprite_QJCharacterShadowLayer.prototype.constructor = Sprite_QJCharacterShadowLayer;
Sprite_QJCharacterShadowLayer.prototype.initialize = function(scene,mainMask) {
    //====================================
    PIXI.Container.call(this);
    //====================================
    this.scene = scene;
    this.mainMask = mainMask;
    this.z = 1;
    //====================================
};
Sprite_QJCharacterShadowLayer.prototype.update = function() {
    //===================================
    this.visible = $gameSystem.showLights&&this.mainMask.visible;
    if (!this.visible) return;
    //===================================
    let children = this.mainMask.children;
    let container,initData,csd,csTarget,characterSprite,odata,character,angle,jumpHeight;
    let mcsl=$gameMap.characterShadowList;
    let lx,ly,cx,cy,distence,direction;
    //===================================
    for (let i=0,il=children.length-1;i<il;i++) {
        //===================================
        if (!children[i]||!children[i].characterShadowContainer) continue;
        container = children[i].characterShadowContainer;
        if (!container.parent) this.addChild(container);
        //===================================
        lx = children[i].x - standardExpand/2;
        ly = children[i].y - standardExpand/2;
        initData = children[i].initData;
        odata = children[i].odata;
        //===================================
        for (let j in mcsl) {
            //===================================
            if (j==children[i].character) continue;
            if (mcsl[j]==false) {
                if (container.csList[j]) {
                    container.removeChild(container.csList[j]);
                    delete container.csList[j];
                }
                continue;
            }
            if (!container.csList[j]) {
                csTarget = new PIXI.Sprite();
                csTarget.blendMode = 2;
                csTarget.anchor.set(0.5,1);
                container.addChild(csTarget);
                container.csList[j] = csTarget;
            } else csTarget = container.csList[j];
            //===================================
            characterSprite = mapCharacterSpriteReSaveList[j];
            if (!characterSprite) continue;
            character = characterSprite._character;
            jumpHeight = character.jumpHeight();
            //===================================
            csd = character.QJSC;
            cx = character.screenX();
            cy = character.screenY()-csd.yCut+jumpHeight;
            angle = QJ.LL.calculateAngleByTwoPoint(lx,ly,cx-odata.shadowCharacterOffsetX,cy-odata.shadowCharacterOffsetY);
            cx += Math.sin(angle)*jumpHeight;
            cy += -Math.cos(angle)*jumpHeight;
            //===================================
            distence = Math.sqrt((cx-odata.shadowCharacterOffsetX-lx)*(cx-odata.shadowCharacterOffsetX-lx)+
                (cy-odata.shadowCharacterOffsetY-ly)*(cy-odata.shadowCharacterOffsetY-ly))+jumpHeight;
            //===================================
            csTarget.alpha = Math.floor(csd.opacity*initData.shadowCharacterMaxOpacity*100*(
                Math.min(1,Math.max(1-distence/initData.shadowCharacterMaxDistance))))/100
                *this.mainMask.averageColorAlpha;
            //===================================
            if (csTarget.alpha<=0.01) {
                csTarget.visible = false;
                continue;
            } else csTarget.visible = true;
            //===================================
            if (!csd.imgName) {
                if (!characterSprite.textureLL) continue;
                if (csTarget.texture!=characterSprite.textureLL) csTarget.texture = characterSprite.textureLL;
                if (csTarget.texture.frame.x!=characterSprite._frame.x||
                    csTarget.texture.frame.y!=characterSprite._frame.y||
                    csTarget.texture.frame.width!=characterSprite._frame.width||
                    csTarget.texture.frame.height!=characterSprite._frame.height-csd.yCut) {
                    csTarget.texture.frame.x=characterSprite._frame.x;
                    csTarget.texture.frame.y=characterSprite._frame.y;
                    csTarget.texture.frame.width=characterSprite._frame.width;
                    csTarget.texture.frame.height=characterSprite._frame.height-csd.yCut;
                    characterSprite.textureLL.frame = characterSprite.textureLL.frame;
                }
            } else {
                if (!characterSprite.textureLLSpecial) continue;
                if (csTarget.texture!=characterSprite.textureLLSpecial) {
                    csTarget.texture = characterSprite.textureLLSpecial;
                }
            }
            //===================================
            direction = character.direction();
            csTarget.tint = csd.tint;
            csTarget.x = cx+csd.offsetX+csd.offsetDirX[direction];
            csTarget.y = cy+csd.offsetY+csd.offsetDirY[direction];
            //===================================
            if (csd.model[0]==0) {
                csTarget.rotation = angle;
                csTarget.skew.x = 0;
            } else {
                csTarget.rotation = 0;
                csTarget.skew.x =  -angle;
            }
            //===================================
            csTarget.scale.y = children[i].odata.shadowCharacterShakeX;
            if (csd.model[1]==0) {
                //nothing
            } else if (csd.model[1]==1) {
                csTarget.scale.y *= distence/csd.model[2];
            } else if (csd.model[1]==2) {
                csTarget.scale.y *= Math.min(Math.max(2 - distence/csd.model[2],0.1),2);
            }
            //===================================
        }
        this.updateOtherShadow(container,lx,ly,initData,odata);
        //===================================
    }
    //===================================
};
Sprite_QJCharacterShadowLayer.prototype.updateOtherShadow = function(container,lx,ly,initData,odata) {

}
//==========================================================
//QJ-Doodads.js
//==========================================================
if (Imported.QJDoodads) {
    //==========================================================
    //
    //==========================================================
    QJ.DD.standardStructData.shadow = {
        status:false,
        yCut:0,
        opacity:1,
        tint:"#000000",
        offsetX:0,
        offsetY:0,
        model:"B[]"
    };
    const LL_Sprite_DoodadQJ_fixNewValueNull = Sprite_DoodadQJ.prototype.fixNewValueNull;
    Sprite_DoodadQJ.prototype.fixNewValueNull = function(data) {
        data = LL_Sprite_DoodadQJ_fixNewValueNull.call(this,data);
        if (typeof data.shadow != 'object') {
            data.shadow = {};
            for (let i in QJ.DD.standardStructData.shadow) {
                data.shadow[i] = QJ.DD.standardStructData.shadow[i];
            }
        }
        return data;
    };
    const LL_Scene_Map_addNewDoodadEditAttribute = Scene_Map.prototype.addNewDoodadEditAttribute;
    Scene_Map.prototype.addNewDoodadEditAttribute = function(list,doodadData,editWindow) {
        list = LL_Scene_Map_addNewDoodadEditAttribute.call(this,list,doodadData,editWindow);
        list = list.concat([
            {name:"------↓--shadow--↓------",enable:false,ext:{
                content:"",inputType:0,
                help:["The following attribute is shadow.","Need plugin QJ-Lighting."],
            },handler:null},
            {name:"Shadow Status",enable:true,ext:{
                content:doodadData.shadow.status?"true":"false",inputType:3,attribute:['shadow','status'],
                fixValue:(value)=>{return !eval(value);},
                help:["Show/Hide shadow.","Need plugin QJ-Lighting."],
            },handler:null},
            {name:"Shadow yCut",enable:true,ext:{
                content:doodadData.shadow.yCut,inputType:1,attribute:['shadow','yCut'],
                fixValue:(value)=>{value=Number(value);return isNaN(value)?0:Math.floor(value);},
                left:(value)=>{return Number(value)-1;},
                right:(value)=>{return Number(value)+1;},
                help:["The yCut data of shadow.","Need plugin QJ-Lighting."],
            },handler:null},
            {name:"Shadow X Offset",enable:true,ext:{
                content:doodadData.shadow.offsetX,inputType:1,attribute:['shadow','offsetX'],
                fixValue:(value)=>{value=Number(value);return isNaN(value)?0:Math.floor(value);},
                left:(value)=>{return Number(value)-1;},
                right:(value)=>{return Number(value)+1;},
                help:["The x offset of shadow.","Need plugin QJ-Lighting."],
            },handler:null},
            {name:"Shadow Y Offset",enable:true,ext:{
                content:doodadData.shadow.offsetY,inputType:1,attribute:['shadow','offsetY'],
                fixValue:(value)=>{value=Number(value);return isNaN(value)?0:Math.floor(value);},
                left:(value)=>{return Number(value)-1;},
                right:(value)=>{return Number(value)+1;},
                help:["The y offset of shadow.","Need plugin QJ-Lighting."],
            },handler:null},
            {name:"Shadow Opacity",enable:true,ext:{
                content:doodadData.shadow.opacity,inputType:1,attribute:['shadow','opacity'],
                fixValue:(value)=>{value=Number(value);return (value>=0&&value<=1)?Math.floor(value*1000)/1000:1;},
                left:(value)=>{return Number(value)-0.05;},
                right:(value)=>{return Number(value)+0.05;},
                help:["The opacity of shadow. range 0-1.","Press ← to subtract 0.05.Press → to add 0.05. ","Need plugin QJ-Lighting."],
            },handler:null},
            {name:"Shadow Tint",enable:true,ext:{
                content:doodadData.shadow.opacity,inputType:1,attribute:['shadow','tint'],
                fixValue:(value)=>{value=String(value);return (value[0]=='#'&&value.length==7&&!isNaN(Number("0x"+value.substr(1))))?
                    value:"#000000";},
                help:["The tint of shadow.","Default value is #000000 (black).","Need plugin QJ-Lighting."],
            },handler:null},
            {name:"Shadow Model",enable:true,ext:{
                content:doodadData.shadow.model,inputType:1,attribute:['shadow','model'],
                fixValue:(value)=>{return value;},
                help:["The model of shadow.","Default value is B[].","Need plugin QJ-Lighting. Please visit the help of QJ-Lighting for detail."],
            },handler:null},
            {name:"------↑--shadow--↑------",enable:false,ext:{
                content:"",inputType:0,
                help:["The above attribute is shadow.","Need plugin QJ-Lighting."],
            },handler:null},
            ]);
        return list;
    }
    //==========================================================
    //
    //==========================================================
    const LL_Sprite_QJCharacterShadowLayer_updateOtherShadow = Sprite_QJCharacterShadowLayer.prototype.updateOtherShadow;
    Sprite_QJCharacterShadowLayer.prototype.updateOtherShadow = function(container,lx,ly,initData,odata) {
        LL_Sprite_QJCharacterShadowLayer_updateOtherShadow.call(this,container,lx,ly,initData,odata);
        if (container.doodadsShadow) {
            for (let i of container.doodadsShadow) {
                i.mainDoodads.updateDoodadsShadow(i,lx,ly,initData,odata);
            }
        }
    }
    //==========================================================
    //
    //==========================================================
    //+doodads ok
    const LL_Sprite_DoodadQJ_setBase = Sprite_DoodadQJ.prototype.setBase;
    Sprite_DoodadQJ.prototype.setBase = function() {
        LL_Sprite_DoodadQJ_setBase.call(this);
        this.shadowData = JsonEx.makeDeepCopy(this.data.shadow?this.data.shadow:QJ.DD.standardStructData.shadow);
        this.shadowData.model = QJ.LL.getCSModel(this.shadowData.model);
        this.shadowData.tint = Number("0x"+this.shadowData.tint.substr(1));
        if (this.constructor.name == "Sprite_MouseDoodadsCursorQJ"||
            !this._spriteset.lightSystemSprite) {this.doodadShadowSprite = [];return;}
        if (this.doodadShadowSprite) {
            this.doodadShadowSprite.forEach((sprite)=>{
                let container = sprite.parent;
                sprite.parent.removeChild(sprite);
                container.doodadsShadow.splice(container.doodadsShadow.indexOf(sprite),1);
            });
        }
        this.doodadShadowSprite = [];
        if (this.shadowData.status) {
            let children = this._spriteset.lightSystemSprite.children;
            for (let i of children) {
                if (!i||!i.characterShadowContainer) continue;
                this.addShadow(i.characterShadowContainer);
            }
        }
    };
    Sprite_DoodadQJ.prototype.addShadow = function(container) {
        for (let i=0,idata=container.children,il=idata.length;i<il;i++) {
            if (idata[i].mainDoodads==this) {
                return;
            }
        }
        let newShadowSprite = new PIXI.Sprite();
        newShadowSprite.mainDoodads = this;
        newShadowSprite.blendMode = 2;
        newShadowSprite.anchor.set(0.5,1);
        container.addChild(newShadowSprite);
        this.doodadShadowSprite.push(newShadowSprite);
        container.doodadsShadow.push(newShadowSprite);
    };
    //-doodads ok
    const LL_Sprite_DoodadQJ_destroy = Sprite_DoodadQJ.prototype.destroy;
    Sprite_DoodadQJ.prototype.destroy = function() {
        LL_Sprite_DoodadQJ_destroy.call(this);
        if (this.doodadShadowSprite&&this.doodadShadowSprite.length) {
            this.doodadShadowSprite.forEach((sprite)=>{
                let container = sprite.parent;
                container.removeChild(sprite);
                container.doodadsShadow.splice(container.doodadsShadow.indexOf(sprite),1);
            });
        }
        this.doodadShadowSprite = [];
    };
    Sprite_MouseDoodadsCursorQJ.prototype.destroy = function() {
        LL_Sprite_DoodadQJ_destroy.call(this);
    };
    const LL_Sprite_DoodadQJ_update = Sprite_DoodadQJ.prototype.update;
    Sprite_DoodadQJ.prototype.update = function() {
    LL_Sprite_DoodadQJ_update.call(this);
    if (this.doodadShadowSprite&&this.doodadShadowSprite.length) {
        this.doodadShadowSprite.forEach((sprite)=>this.updateShadowSprite(sprite));
    }
    };
    Sprite_DoodadQJ.prototype.updateShadowSprite = function(sprite) {
    
    };
    //==========================================================
    //
    //==========================================================
    //+lights ok
    const LL_Sprite_QJLightLayer_buildShadowContainer = Sprite_QJLightLayer.prototype.buildShadowContainer;
    Sprite_QJLightLayer.prototype.buildShadowContainer = function() {
        LL_Sprite_QJLightLayer_buildShadowContainer.call(this);
        if (this.characterShadowContainer) {
            this.characterShadowContainer.doodadsShadow = [];
            if (this._spriteset._doodadsQJ) {
                for (let i of this._spriteset._doodadsQJ) {
                    if (i.shadowData&&i.shadowData.status) i.addShadow(this.characterShadowContainer);
                }
            }
        }
    };
    //-lights 
    const Sprite_QJLightLayer_setDead = Sprite_QJLightLayer.prototype.setDead;
    Sprite_QJLightLayer.prototype.setDead = function() {
        //===================================
        Sprite_QJLightLayer.prototype.setDead.call(this);
        if (this.characterShadowContainer) {
            for (let i of this.characterShadowContainer.children) {
                if (i.addShadow) {
                    let sprites = i.addShadow.doodadShadowSprite;
                    sprites.splice(sprites.indexOf(i),1);
                }
            }
        }
        //===================================
    };
    //==========================================================
    //
    //==========================================================
    Sprite_DoodadQJ.prototype.updateDoodadsShadow = function(csTarget,lx,ly,initData,odata) {
            //===================================
            csd = this.shadowData;
            cx = this.x;
            cy = this.y-csd.yCut;
            angle = QJ.LL.calculateAngleByTwoPoint(lx,ly,cx-odata.shadowCharacterOffsetX,cy-odata.shadowCharacterOffsetY);
            cx += Math.sin(angle);
            cy += -Math.cos(angle);
            //===================================
            distence = Math.sqrt((cx-odata.shadowCharacterOffsetX-lx)*(cx-odata.shadowCharacterOffsetX-lx)+
                (cy-odata.shadowCharacterOffsetY-ly)*(cy-odata.shadowCharacterOffsetY-ly));
            //===================================
            csTarget.alpha = Math.floor(csd.opacity*initData.shadowCharacterMaxOpacity*100*(
                Math.min(1,Math.max(1-distence/initData.shadowCharacterMaxDistance))))/100;
            //===================================
            if (csTarget.alpha<=0.01) {
                csTarget.visible = false;
                return;
            } else csTarget.visible = true;
            //===================================
            if (!csd.imgName) {
                if (!this.texture) return;
                if (csTarget.texture!=this.texture) csTarget.texture = this.texture;
            }
            //===================================
            csTarget.tint = csd.tint;
            csTarget.x = cx+csd.offsetX;
            csTarget.y = cy+csd.offsetY;
            //===================================
            if (csd.model[0]==0) {
                csTarget.rotation = angle;
                csTarget.skew.x = 0;
            } else {
                csTarget.rotation = 0;
                csTarget.skew.x =  -angle;
            }
            //===================================
            csTarget.scale.y = odata.shadowCharacterShakeX;
            if (csd.model[1]==0) {
                //nothing
            } else if (csd.model[1]==1) {
                csTarget.scale.y *= distence/csd.model[2];
            } else if (csd.model[1]==2) {
                csTarget.scale.y *= Math.min(Math.max(2 - distence/csd.model[2],0.1),2);
            }
    };
    //==========================================================
    //
    //==========================================================
}
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//QJFrameLight./ fade effect.| direction effect.
//==========================================================
QJFrameLight.prototype.initialize = function(name,orginData,dataType,noFadeCopy) {
    noFadeCopy = noFadeCopy||false;
    this.i = dataType;//0-number 1-text 2-degree
    this.n = name;
    this.d = {};
    this.m = 0;
    this.t = 0;
    this.rt = 0;
    this.isMode = true;
    if (typeof orginData == "string"&&orginData.includes("~")) {
        let data = orginData.split("~"),num=0,fadeT=0,last;
        for (let i=0,il=data.length,detail;i<il;i++) {
            if (data[i].includes("|")) {
                detail = data[i].split("|");
                if (dataType==0) num = Number(detail[1]);
                else if (dataType==1) num = detail[1];
                else if (dataType==2) num = Number(detail[1])*Math.PI/180;
                this.d[this.m] = num;
                if (noFadeCopy) {
                    for (let i=this.m,ll=Number(detail[0]);i<ll;i++) {
                        this.d[i] = num;
                    }
                }
                this.m+=Number(detail[0]);
                this.d[this.m] = num;
            } else if (data[i].includes("/")) {
                detail = data[i].split("/");
                fadeT = Number(detail[0]);
                if (dataType==0) {
                    num = Number(detail[1]);
                    last = this.d[this.m];
                    for (let j=1;j<=fadeT;j++) {
                        this.d[this.m+j] = last+(num-last)*j/fadeT;
                    }
                    this.m+=fadeT;
                    this.d[this.m] = num;
                } else if (dataType==1) {
                    num = QJ.LL.hexToRgb(detail[1]);
                    last = QJ.LL.hexToRgb(this.d[this.m])//[0,{r:0,g:0,b:0}];
                    for (let j=1;j<=fadeT;j++) {
                        this.d[this.m+j] = QJ.LL.rgbToHex({
                            r:Math.floor(last.r+(num.r-last.r)*j/fadeT),
                            g:Math.floor(last.g+(num.g-last.g)*j/fadeT),
                            b:Math.floor(last.b+(num.b-last.b)*j/fadeT)
                        });
                    }
                    this.m+=fadeT;
                    this.d[this.m] = detail[1];
                } else if (dataType==2) {
                    num = Number(detail[1])*Math.PI/180;
                    last = this.d[this.m];
                    for (let j=1;j<=fadeT;j++) {
                        this.d[this.m+j] = last+(num-last)*j/fadeT;
                    }
                    this.m+=fadeT;
                    this.d[this.m] = num;
                }
            } else if (data[i].includes("%")) {
                detail = data[i].split("%");
                fadeT = Number(detail[0]);
                if (dataType==0) {
                    num = Number(detail[1]);
                    last = this.d[this.m];
                    for (let j=1;j<=fadeT;j++) {
                        this.d[this.m+j] = num-(num-last)*Math.sqrt(1-Math.pow(j/fadeT,2));
                    }
                    this.m+=fadeT;
                    this.d[this.m] = num;
                } else if (dataType==1) {
                    num = QJ.LL.hexToRgb(detail[1]);
                    last = QJ.LL.hexToRgb(this.d[this.m])//[0,{r:0,g:0,b:0}];
                    for (let j=1,xs;j<=fadeT;j++) {
                        xs = Math.sqrt(1-Math.pow(j/fadeT,2));
                        this.d[this.m+j] = QJ.LL.rgbToHex({
                            r:Math.floor(num.r-(num.r-last.r)*xs),
                            g:Math.floor(num.g-(num.g-last.g)*xs),
                            b:Math.floor(num.b-(num.b-last.b)*xs)
                        });
                    }
                    this.m+=fadeT;
                    this.d[this.m] = detail[1];
                } else if (dataType==2) {
                    num = Number(detail[1])*Math.PI/180;
                    last = this.d[this.m];
                    for (let j=1;j<=fadeT;j++) {
                        this.d[this.m+j] = num-(num-last)*Math.sqrt(1-Math.pow(j/fadeT,2));
                    }
                    this.m+=fadeT;
                    this.d[this.m] = num;
                }
            }
        }
    } else {
        this.isMode = false;
        let num;
        if (dataType==0) num = Number(orginData);
        else if (dataType==1) num = orginData;
        else if (dataType==2) num = Number(orginData)*Math.PI/180;
        this.d[this.m] = num;
    }
};
QJFrameLight.prototype.get = function() {
    if (this.t>this.m) this.t = 0;
    if (this.d[this.t]!=undefined) this.rt = this.t;
    this.t++;
    return this.d[this.rt];
};
QJFrameLight.prototype.getOnly = function() {
    return this.d[this.rt];
};
QJFrameLight.prototype.getTar = function(i) {
    return this.d[i>this.m?0:i];
};
//==========================================================
//
//==========================================================
})(QJ.LL.reWrite);
//==========================================================
//
//==========================================================