/*:
 * @target MZ
 * @plugindesc Picture bust plugin for RPG Maker MZ
 * @author Your Name
 *
 * @help
 * This plugin allows you to show bust pictures with various effects.
 *
 * @command enterBust
 * @text Enter Bust
 * @desc Shows a bust picture with enter animation
 *
 * @arg pictureId
 * @type number
 * @min 1
 * @max 100
 * @text Picture ID
 * @desc The ID of the picture to show
 *
 * @arg name
 * @type string
 * @text Picture Name
 * @desc The name of the picture file
 *
 * @arg duration
 * @type number
 * @min 0
 * @default 60
 * @text Duration
 * @desc Duration of the animation in frames
 */

(() => {
    const pluginName = "PictureBust";

    PluginManager.registerCommand(pluginName, "enterBust", args => {
        const pictureId = Number(args.pictureId);
        const name = String(args.name);
        const duration = Number(args.duration);

        // Get game screen dimensions
        const screenWidth = Graphics.width;
        const screenHeight = Graphics.height;

        // Show picture off-screen
        $gameScreen.showPicture(pictureId, name, 0, -screenWidth, 0, 100, 100, 255, 0);

        // Move picture to center of screen
        $gameScreen.movePicture(
            pictureId,
            0,
            screenWidth / 2,
            screenHeight / 2,
            100,
            100,
            255,
            0,
            duration,
            1
        );
    });
})(); 