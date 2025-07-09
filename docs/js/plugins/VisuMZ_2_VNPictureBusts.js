//=============================================================================
// VisuStella MZ - Visual Novel Picture Busts
// VisuMZ_2_VNPictureBusts.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_2_VNPictureBusts = true;

var VisuMZ = VisuMZ || {};
VisuMZ.VNPictureBusts = VisuMZ.VNPictureBusts || {};
VisuMZ.VNPictureBusts.version = 1.03;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 2] [Version 1.03] [VNPictureBusts]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Visual_Novel_Picture_Busts_VisuStella_MZ
 * @base VisuMZ_0_CoreEngine
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin enables the game engine to use Pictures (normally available
 * event commands like "Show Picture" and "Move Picture") as Picture Busts,
 * similar to those seen in Visual Novels. These Picture Busts are given a
 * plethora of Plugin Commands to utilize and control them in ways to help
 * create narratives amongst characters akin to Visual Novels. The Plugin
 * Commands will also help streamline and remove the more tedious aspects of
 * trying to recreate a similar bust system with vanilla RPG Maker MZ.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Streamlined Plugin Commands to allow for commonly seen Picture Bust usage
 *   commonly found in Visual Novel genre-type games.
 * * Quickly Enter/Exit busts with Plugin Commands with a structure based
 *   around simplified screen positioning rather than exact coordinates.
 * * Change Picture Bust graphics without needing to fiddle with any other
 *   property for quicker switching between expressions or poses.
 * * Mirror, unmirror, or simply flip one direction to another for Picture
 *   Busts with ease without altering any other property.
 * * Fade in, fade out, or fade to exact opacity amounts without needing to
 *   alter any other property.
 * * Play Battle Animations on Picture Busts. Normally, Battle Animations would
 *   appear behind pictures, but this plugin creates specially effects to allow
 *   for them to play on top of the Picture Busts themselves.
 * * Move Picture Busts around relatively or to exact coordinates or using the
 *   plugin's predetermined positions in a streamlined fashion.
 * * Scale Picture Busts to enlarge them or shrink them while keeping other
 *   properties intact and untouched.
 * * Alter tones/tints for the Picture Busts in order to portray an active,
 *   passive, or normal effect.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Required Plugin List ------
 *
 * * VisuMZ_0_CoreEngine
 *
 * This plugin requires the above listed plugins to be installed inside your
 * game's Plugin Manager list in order to work. You cannot start your game with
 * this plugin enabled without the listed plugins.
 *
 * ------ Tier 2 ------
 *
 * This plugin is a Tier 2 plugin. Place it under other plugins of lower tier
 * value on your Plugin Manager list (ie: 0, 1, 2, 3, 4, 5). This is to ensure
 * that your plugins will have the best compatibility with the rest of the
 * VisuStella MZ library.
 *
 * ============================================================================
 * Quick Understanding on How Busts Work
 * ============================================================================
 * 
 * These are some tidbits on how Picture Busts work.
 *
 * ---
 * 
 * Busts Face Left
 * 
 * This plugin is made under the assumption that the Picture Busts are normally
 * facing left in their raw form. This is to match RPG Maker MZ's "Pictures" of
 * actors and to allow for more user familiarity with how Busts work.
 * 
 * Naturally, you can reverse everything as long as you adjust the settings
 * properly in this plugin's Plugin Parameters.
 * 
 * ---
 *
 * Busts are Pictures
 * 
 * "Busts" in this plugin are mechanically Pictures in RPG Maker MZ. The
 * properties that Pictures and Busts share are one and the same. This means
 * that you can control Pictures with this plugin's Bust-centric commands and
 * you can control Busts with "Move Picture", "Rotate Picture", "Tint Picture",
 * and "Erase Picture" event commands.
 * 
 * Naturally, this also means that any Picture of Bust that hasn't been made
 * available through the "Show Picture" event command or "BASIC: Enter Bust(s)"
 * Plugin Command won't be able to use either event commands or Plugin Commands
 * related to the Picture/Bust manipulation.
 *
 * ---
 *
 * Picture ID's Matter for Busts
 * 
 * Picture ID's matter when selecting them for Busts. Picture ID's with a lower
 * number will appear further in the "back" behind other Pictures/Busts while
 * Picture ID's with a higher number will appear more on "top".
 * 
 * It makes no difference if the object was formed as a Picture or as a Bust
 * first. The layer system is still intact.
 *
 * ---
 *
 * Specialized Bust Origin/Anchor
 * 
 * Pictures have two Origin/Anchor modes: "Upper Left" or "Center". The Origin
 * refers to the point in which the picture marks and aligns itself with based
 * on the coordinates it's given.
 * 
 * If you are using "Upper Left", then the Picture's X and Y will indicate that
 * the Picture's Upper Left corner of the image will be at X and Y. If you are
 * using "Center", then that means the Picture's X and Y will indicate that
 * the Picture's Center point of the image will be at X and Y.
 * 
 * Busts have a unique Origin/Anchor that can be setup in the Plugin Parameters
 * and it normally defaults to "Center Bottom", aka Anchor X value of 0.5 and
 * Anchor Y value of 1.0. The "Bust" Anchor works best with Busts because it
 * allows for the natural manipulation of busts relative to the bottom of the
 * screen position.
 * 
 * As mentioned before, this can be modified in the Plugin Parameters. We don't
 * recommend changing it unless you know what you're doing.
 *
 * ---
 * 
 * Predetermined Positioning
 * 
 * Messing with exact coordinates is messy and extremely inefficient when
 * working with them for a long enough time. This plugin offers a Predetermined
 * Position coordinate system, to which, the rest of the plugin will refer to
 * as "Positions" for short.
 * 
 * There are 11 Positions available through this plugin, one for each number
 * between 0 and 10. These Positions start on the left side of the screen and
 * go towards the right, with a 200 pixel buffer from the edges. They are also
 * aligned at the bottom of the screen.
 * 
 * In other words, something like this:
 * 
 * +--------+--------------------------------------------------------+--------+
 * |        |                                                        |        |
 * |        |                        Screen                          |        |
 * |<------>|                                                        |<------>|
 * |        |                                                        |        |
 * |  200   |                                                        |  200   |
 * | Pixel  |                                                        | Pixel  |
 * | Buffer |                                                        | Buffer |
 * |        |                                                        |        |
 * |<------>|                                                        |<------>|
 * |        |                                                        |        |
 * |  200   |                                                        |  200   |
 * | Pixel  |                                                        | Pixel  |
 * | Buffer |                                                        | Buffer |
 * |        |                      Positions                         |        |
 * |<------>|                                                        |<------>|
 * |        0    1    2    3     4     5     6     7     8     9    10        |
 * |        |                                                        |        |
 * +--------+--------------------------------------------------------+--------+
 * 
 * These Positions can be changed in the Plugin Parameters if you understand
 * JavaScript code. If you do not, we do NOT recommend tinkering with it.
 * 
 * This means if the Position 0 is used, the Picture Bust will appear centered
 * at the bottom of the far left side of the screen with a 200 distance buffer.
 * If the Position 5 is used, the Picture Bust will appear at the center bottom
 * of the screen. If the Position 8 is used, the Picture Bust will appear about
 * 3/4ths the way across the screen from the left.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * The following are Plugin Commands that come with this plugin. They can be
 * accessed through the Plugin Command event command.
 *
 * ---
 * 
 * === Basic-Bust Plugin Commands ===
 * 
 * ---
 *
 * BASIC: Enter Bust
 * - Generic entrance for ONE picture bust.
 * - Walks in from a little behind and fades in.
 *
 *   Picture ID:
 *   - What is the Picture ID to associate with this bust?
 *   - You may use JavaScript code.
 *
 *     Picture File:
 *     - What picture file do you wish to use?
 *
 *     Origin:
 *     - What kind of origin setting do you wish to use for this bust?
 *     - Upper Left
 *     - Center
 *     - Bust
 *
 *   Screen Position:
 *   - Insert a screen position value from 0 to 10.
 *   - Coordinates are determined by Plugin Parameters.
 *   - Refer to "Quick Understanding on How Busts Work" to understand how
 *     "Predetermined Positioning" positioning works by default.
 *
 *     Start Offset X:
 *     - What starting position to enter the bust from?
 *     - Negative: behind; Positive: front.
 *     - You may use JavaScript.
 *
 *     Start Offset Y:
 *     - What starting position to enter the bust from?
 *     - Negative: up; Positive: down.
 *     - You may use JavaScript.
 *
 *     Entrance Easing:
 *     - Select which easing type you wish to apply.
 *
 *   Horizontal Mirror:
 *   - Apply horizontal mirroring for this bust?
 *     - None
 *     - Mirror
 *     - Auto
 *     - Auto-Reverse
 *
 *   Duration:
 *   - Duration in frames for the bust entrance.
 *
 * ---
 *
 * BASIC: Exit Bust(s)
 * - Generic exit for picture bust(s).
 * - Walks back and fades out.
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *     End Offset X:
 *     - What end position to exit the bust to?
 *     - Negative: behind; Positive: front.
 *     - You may use JavaScript.
 *
 *     End Offset Y:
 *     - What end position to exit the bust to?
 *     - Negative: up; Positive: down.
 *     - You may use JavaScript.
 *
 *     Exit Easing:
 *     - Select which easing type you wish to apply.
 *
 *     Flip Direction:
 *     - Flip direction when exiting?
 *
 *   Duration:
 *   - Duration in frames for the bust exit.
 *
 *   Auto-Erase?:
 *   - Automatically erase the bust(s) after fading out completely?
 *
 * ---
 *
 * BASIC: Graphic Change
 * - Changes ONE bust's graphic without changing any of its other properties.
 * - Useful for quickly changing facial expressions or poses.
 *
 *   Picture ID:
 *   - What is the Picture ID to associate with this bust?
 *   - You may use JavaScript code.
 *
 *   Picture File:
 *   - What picture file do you wish to use?
 *
 * ---
 *
 * BASIC: Mirror Bust(s)
 * - Change the facing direction the bust(s).
 * - This alters the horizontal scaling of the bust(s).
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *   Horizontal Mirror:
 *   - How do you wish to affect the mirroring for the bust(s)?
 *     - None
 *     - Mirror
 *     - Auto
 *     - Auto-Reverse
 *     - Toggle
 *
 * ---
 *
 * BASIC: Origin Change Bust(s)
 * - Change the origin/anchor for bust(s).
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *     Origin:
 *     - Pick what kind of origin setting to use for this bust?
 *     - "Bust" value is based on Plugin Parameters.
 *       - Upper Left
 *       - Center
 *       - Bust
 *
 *   Duration:
 *   - Duration in frames for the origin change.
 *
 * ---
 *
 * BASIC: Play Animation on Bust(s)
 * - Plays a specific battle animation on bust(s).
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *     Battle Animation ID:
 *     - Select which battle animation to play on bust.
 *
 *       Mirror Animation?:
 *       - Mirror the animation effect?
 *
 *   Wait For Animation?:
 *   - Wait until the animation is finished before continuing?
 *
 * ---
 * 
 * === Breathing Plugin Commands ===
 * 
 * ---
 * 
 * BREATHING: Start
 * - Starts breathing aspect for selected bust(s).
 * - Makes it look like the bust graphic is more alive.
 * 
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 * 
 *   Speed:
 * 
 *     Speed X:
 *     Speed Y:
 *     - Speed used for the horizontal/vertical breathing cycle.
 *     - Higher is slower.
 *     - You may use JavaScript.
 * 
 *   Rate:
 * 
 *     Rate X:
 *     Rate Y:
 *     - Rate used for the horizontal/vertical breathing cycle.
 *     - Determines change amount.
 *     - You may use JavaScript.
 * 
 * ---
 * 
 * BREATHING: Stop
 * - Stops breathing aspect for selected bust(s).
 * - The bust graphic becomes static.
 * 
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 * 
 * ---
 * 
 * === Fade-Bust Plugin Commands ===
 * 
 * ---
 *
 * FADE: Fade In Bust(s)
 * - Brings selected picture bust(s) opacity levels to 255.
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *   Duration:
 *   - Duration in frames for the bust fade in.
 *
 * ---
 *
 * FADE: Fade Out Bust(s)
 * - Brings selected picture bust(s) opacity levels to 0.
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *   Duration:
 *   - Duration in frames for the bust fade out.
 *
 *     Auto-Erase?:
 *     - Automatically erase the bust(s) after fading out completely?
 *
 * ---
 *
 * FADE: Opacity By X, Bust(s)
 * - Adjusts selected picture bust(s) opacity levels relatively.
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *   Adjust Opacity:
 *   - Adjust opacity value of pictures by this amount.
 *   - Negative: Lower, Positive: Higher.
 *   - You may use JavaScript.
 *
 *   Duration:
 *   - Duration in frames for the bust fading.
 *
 * ---
 *
 * FADE: Opacity To X, Bust(s)
 * - Brings selected picture bust(s) opacity levels to a custom value.
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *   Target Opacity:
 *   - What opacity value do you wish to adjust the bust to?
 *   - Use a value between 0 and 255.
 *
 *   Duration:
 *   - Duration in frames for the bust fading.
 *
 * ---
 * 
 * === Fidgeting Plugin Commands ===
 * 
 * ---
 * 
 * FIDGETING: Start
 * - Starts fidgeting aspect for selected bust(s).
 * - Bust graphic moves back and forth.
 * 
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 * 
 *   Speed:
 * 
 *     Speed X:
 *     Speed Y:
 *     - Speed used for the horizontal/vertical fidgeting cycle.
 *     - Higher is slower.
 *     - You may use JavaScript.
 * 
 *   Distance:
 * 
 *     Distance X:
 *     Distance Y:
 *     - Max distance used for the horizontal/vertical fidgeting cycle.
 *     - Determines change amount.
 *     - You may use JavaScript.
 * 
 * ---
 * 
 * FIDGETING: Stop
 * - Stops fidgeting aspect for selected bust(s).
 * - The bust graphic becomes stationary.
 * 
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 * 
 * ---
 * 
 * === Movement-Bust Plugin Commands ===
 * 
 * ---
 *
 * MOVE: Move Bust(s) By Coordinates
 * - Move bust(s) relative to current coordinates(s).
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *     Move By X:
 *     - Negative: left; Positive: right; "Unchanged" for none.
 *     - You may use JavaScript.
 *
 *     Move By Y:
 *     - Negative: up; Positive: down; "Unchanged" for none.
 *     - You may use JavaScript.
 *
 *     Move Easing:
 *     - Select which easing type you wish to apply.
 *
 *   Flip Direction:
 *   - Flip direction when moving?
 *
 *   Duration:
 *   - Duration in frames for the bust movement.
 *
 * ---
 *
 * MOVE: Move Bust(s) By Position
 * - Move bust(s) relative to current position(s).
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *     Move By Position:
 *     - Negative: left; Positive: right; "Unchanged" for none.
 *     - You may use JavaScript.
 *     - Results between 0 and 10.
 *
 *     Move Easing:
 *     - Select which easing type you wish to apply.
 *
 *   Flip Direction:
 *   - Flip direction when moving?
 *
 *   Duration:
 *   - Duration in frames for the bust movement.
 *
 * ---
 *
 * MOVE: Move Bust(s) to Coordinates
 * - Move bust(s) to exact coordinates(s).
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *     Target X:
 *     - Target X coordinate.
 *     - "Unchanged" for no changes.
 *     - You may use JavaScript.
 *
 *     Target Y:
 *     - Target Y coordinate.
 *     - "Unchanged" for no changes.
 *     - You may use JavaScript.
 *
 *     Move Easing:
 *     - Select which easing type you wish to apply.
 *
 *   Flip Direction:
 *   - Flip direction when moving?
 *
 *   Duration:
 *   - Duration in frames for the bust movement.
 *
 * ---
 *
 * MOVE: Move Bust(s) to Position
 * - Move bust(s) to the predetermined position.
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *     Target Position:
 *     - Target predetermined position from 0 to 10.
 *     - You may use JavaScript.
 *
 *     Move Easing:
 *     - Select which easing type you wish to apply.
 *
 *   Flip Direction:
 *   - Flip direction when moving?
 *
 *   Duration:
 *   - Duration in frames for the bust movement.
 *
 * ---
 *
 * MOVE: Reset Bust(s) to Position
 * - Reset bust(s) to the current position(s).
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *     Move Easing:
 *     - Select which easing type you wish to apply.
 *
 *   Flip Direction:
 *   - Flip direction when moving?
 *
 *   Duration:
 *   - Duration in frames for the bust movement.
 *
 * ---
 * 
 * === Scaling-Bust Plugin Commands ===
 * 
 * ---
 *
 * SCALE: Scale Bust(s) By
 * - Scale bust(s) by specific amounts.
 * - Value scale: 100 = 100% = 1.0
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *     Scale X By:
 *     - Alter (additively) the X scaling value by this.
 *     - You may use JavaScript.
 *
 *     Scale Y By:
 *     - Alter (additively) the Y scaling value by this.
 *     - You may use JavaScript.
 *
 *   Duration:
 *   - Duration in frames for the bust scaling.
 *
 * ---
 *
 * SCALE: Scale Bust(s) To
 * - Scale bust(s) to specific values.
 * - Value scale: 100 = 100% = 1.0
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *     Scale X By:
 *     - Set X scaling value to this.
 *     - You may use JavaScript.
 *     - "Unchanged" for no changes.
 *
 *     Scale Y By:
 *     - Set Y scaling value to this.
 *     - You may use JavaScript.
 *     - "Unchanged" for no changes.
 *
 *   Duration:
 *   - Duration in frames for the bust scaling.
 *
 * ---
 *
 * SCALE: Scale Reset Bust(s)
 * - Resets the scale for bust(s) to the default settings in the
 *   Plugin Parameters.
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *   Duration:
 *   - Duration in frames for the bust scaling.
 *
 * ---
 * 
 * === Swaying Plugin Commands ===
 * 
 * ---
 * 
 * SWAYING: Start
 * - Starts swaying aspect for selected bust(s).
 * - Bust graphic moves back and forth.
 * 
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 * 
 *   Speed:
 * 
 *     Angle Speed:
 *     - Speed used for the swaying cycle.
 *     - Higher is slower.
 *     - You may use JavaScript.
 * 
 *   Angle:
 * 
 *     Angle Sway:
 *     - Max angle used for the swaying cycle.
 *     - Determines change amount.
 *     - You may use JavaScript.
 * 
 * ---
 * 
 * SWAYING: Stop
 * - Stops swaying aspect for selected bust(s).
 * - The bust graphic becomes stationary.
 * 
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 * 
 * ---
 * 
 * === Tone/Tint-Bust Plugin Commands ===
 * 
 * ---
 *
 * TONE: Bright Bust(s)
 * - Brighten bust(s) to use the Tone settings found in the Plugin Parameters.
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *   Duration:
 *   - Duration in frames for the tone change.
 *
 * ---
 *
 * TONE: Dim Bust(s)
 * - Dims bust(s) to use the Tone settings found in the Plugin Parameters.
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *   Duration:
 *   - Duration in frames for the tone change.
 *
 * ---
 *
 * TONE: Normal Bust(s)
 * - Normalize bust(s) to no tone at all.
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *   Duration:
 *   - Duration in frames for the tone change.
 *
 * ---
 *
 * TONE: Preset Tone for Bust(s)
 * - Use RPG Maker MZ's present tones/tints for bust(s).
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *     Preset Name:
 *     - What tone preset do you wish to apply?
 *       - Normal
 *       - Dark
 *       - Sepia
 *       - Sunset
 *       - Night
 *
 *   Duration:
 *   - Duration in frames for the tone change.
 *
 * ---
 *
 * TONE: Target Tone for Bust(s)
 * - Use a custom target tone for the bust(s).
 *
 *   Picture ID(s):
 *   - What Picture ID(s) to associate with this command?
 *   - You may use JavaScript code.
 *
 *     Custom Tone:
 *     - What tone do you want for the bust(s)?
 *     - Format: [Red, Green, Blue, Gray]
 *
 *   Duration:
 *   - Duration in frames for the tone change.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Settings
 * ============================================================================
 *
 * These are the general settings that govern the default values pertaining to
 * the Picture Busts used by this Plugin.
 *
 * ---
 *
 * Anchor Settings
 * 
 *   Anchor X:
 *   - Determines the anchor/origin X setting for Picture Busts.
 *   - 0.0 is left, 0.5 is center, 1.0 is right.
 * 
 *   Anchor Y:
 *   - Determines the anchor/origin Y setting for Picture Busts.
 *   - 0.0 is left, 0.5 is center, 1.0 is right.
 *
 * ---
 *
 * Scale Settings
 * 
 *   Scale X:
 *   - Scale X adjustment settings for Picture Busts.
 *   - Value scale: 100 = 100% = 1.0
 * 
 *   Scale Y:
 *   - Scale Y adjustment settings for Picture Busts.
 *   - Value scale: 100 = 100% = 1.0
 * 
 *   Mirror Horizontally:
 *   - Which positions will be mirrored horizontally?
 *   - You want your Busts facing the center of the screen.
 *   - This treats Busts as if they
 *
 * ---
 *
 * Screen Positioning
 * 
 *   JS: Position X:
 *   - Code to determine used to calculate the X coordinate for each
 *     screen position.
 *   - Refer to "Quick Understanding on How Busts Work" to understand how
 *     "Predetermined Positioning" positioning works by default.
 * 
 *   JS: Position Y:
 *   - Code to determine used to calculate the Y coordinate for each
 *     screen position.
 *   - Refer to "Quick Understanding on How Busts Work" to understand how
 *     "Predetermined Positioning" positioning works by default.
 *
 * ---
 *
 * Tone
 * 
 *   Bright Tone:
 *   - What tone do you want for brightness?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Dim Tone:
 *   - What tone do you want for dimming?
 *   - Format: [Red, Green, Blue, Gray]
 *
 * ---
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *
 * 1. These plugins may be used in free or commercial games provided that they
 * have been acquired through legitimate means at VisuStella.com and/or any
 * other official approved VisuStella sources. Exceptions and special
 * circumstances that may prohibit usage will be listed on VisuStella.com.
 * 
 * 2. All of the listed coders found in the Credits section of this plugin must
 * be given credit in your games or credited as a collective under the name:
 * "VisuStella".
 * 
 * 3. You may edit the source code to suit your needs, so long as you do not
 * claim the source code belongs to you. VisuStella also does not take
 * responsibility for the plugin if any changes have been made to the plugin's
 * code, nor does VisuStella take responsibility for user-provided custom code
 * used for custom control effects including advanced JavaScript notetags
 * and/or plugin parameters that allow custom JavaScript code.
 * 
 * 4. You may NOT redistribute these plugins nor take code from this plugin to
 * use as your own. These plugins and their code are only to be downloaded from
 * VisuStella.com and other official/approved VisuStella sources. A list of
 * official/approved sources can also be found on VisuStella.com.
 *
 * 5. VisuStella is not responsible for problems found in your game due to
 * unintended usage, incompatibility problems with plugins outside of the
 * VisuStella MZ library, plugin versions that aren't up to date, nor
 * responsible for the proper working of compatibility patches made by any
 * third parties. VisuStella is not responsible for errors caused by any
 * user-provided custom code used for custom control effects including advanced
 * JavaScript notetags and/or plugin parameters that allow JavaScript code.
 *
 * 6. If a compatibility patch needs to be made through a third party that is
 * unaffiliated with VisuStella that involves using code from the VisuStella MZ
 * library, contact must be made with a member from VisuStella and have it
 * approved. The patch would be placed on VisuStella.com as a free download
 * to the public. Such patches cannot be sold for monetary gain, including
 * commissions, crowdfunding, and/or donations.
 * 
 * 7. If this VisuStella MZ plugin is a paid product, all project team members
 * must purchase their own individual copies of the paid product if they are to
 * use it. Usage includes working on related game mechanics, managing related
 * code, and/or using related Plugin Commands and features. Redistribution of
 * the plugin and/or its code to other members of the team is NOT allowed
 * unless they own the plugin itself as that conflicts with Article 4.
 * 
 * 8. Any extensions and/or addendums made to this plugin's Terms of Use can be
 * found on VisuStella.com and must be followed.
 *
 * ============================================================================
 * Credits
 * ============================================================================
 * 
 * If you are using this plugin, credit the following people in your game:
 * 
 * Team VisuStella
 * * Irina
 * * Arisu
 * * Olivia
 * * Yanfly
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.03: April 18, 2024
 * * Bug Fixes!
 * ** Fixed a bug where bust animations weren't playing on the right spot when
 *    using a Y anchor other than 1.0. Fix made by Irina.
 * 
 * Version 1.02: July 14, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * Feature Updates!
 * ** Plugin Parameter "JS: Position Y" default value changed to have a +5
 *    offset for better visual compatibility with Swaying feature.
 * * New Features!
 * ** New Plugin Commands added by Irina:
 * *** BREATHING: Start
 * *** BREATHING: Stop
 * **** Starts/stops breathing aspect for selected bust(s). Breathing makes it
 *      look like the bust graphic is more alive.
 * *** FIDGETING: Start
 * *** FIDGETING: Stop
 * **** Starts/stops fidgeting aspect for selected bust(s). Bust graphic moves
 *      back and forth.
 * *** SWAYING: Start
 * *** SWAYING: Stop
 * **** Starts/stops swaying aspect for selected bust(s). The bust sways its
 *      angle back and forth.
 * 
 * Version 1.01: December 9, 2021
 * * Optimization Update!
 * ** Plugin should run more optimized.
 *
 * Version 1.00 Official Release Date: December 6, 2021
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Basic
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Category_Basic
 * @text Category - Basic
 * @desc These are basic Picture Bust Plugin Commands.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Basic_EnterBust
 * @text BASIC: Enter Bust
 * @desc Generic entrance for ONE picture bust.
 * Walks in from a little behind and fades in.
 * 
 * @arg PictureID:eval
 * @text Picture ID
 * @desc What is the Picture ID to associate with this bust?
 * You may use JavaScript code.
 * @default 1
 * 
 * @arg PictureName:str
 * @text Picture File
 * @parent PictureID:eval
 * @type file
 * @dir img/pictures/
 * @desc What picture file do you wish to use?
 * @default >>>ATTENTION<<<
 * 
 * @arg Origin:str
 * @text Origin
 * @parent PictureID:eval
 * @type select
 * @option Upper Left
 * @option Center
 * @option Bust
 * @desc What kind of origin setting do you wish to use for this bust?
 * @default Bust
 * 
 * @arg Position:num
 * @text Screen Position
 * @type number
 * @max 10
 * @desc Insert a screen position value from 0 to 10.
 * Coordinates are determined by Plugin Parameters.
 * @default 0
 * 
 * @arg StartOffsetX:eval
 * @text Start Offset X
 * @parent Position:num
 * @desc What starting position to enter the bust from?
 * Negative: behind; Positive: front. You may use JavaScript.
 * @default -200
 * 
 * @arg StartOffsetY:eval
 * @text Start Offset Y
 * @parent Position:num
 * @desc What starting position to enter the bust from?
 * Negative: up; Positive: down. You may use JavaScript.
 * @default +0
 *
 * @arg EasingType:str
 * @text Entrance Easing
 * @parent Position:num
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Select which easing type you wish to apply.
 * @default OutSine
 *
 * @arg HorzMirror:str
 * @text Horizontal Mirror
 * @type select
 * @option None
 * @option Mirror
 * @option Auto
 * @option Auto-Reverse
 * @desc Apply horizontal mirroring for this bust?
 * @default Auto
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the bust entrance.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Basic_ExitBusts
 * @text BASIC: Exit Bust(s)
 * @desc Generic exit for picture bust(s).
 * Walks back and fades out.
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg EndOffsetX:eval
 * @text End Offset X
 * @parent PictureID:arrayeval
 * @desc What end position to exit the bust to?
 * Negative: behind; Positive: front. You may use JavaScript.
 * @default -200
 * 
 * @arg EndOffsetY:eval
 * @text End Offset Y
 * @parent PictureID:arrayeval
 * @desc What end position to exit the bust to?
 * Negative: up; Positive: down. You may use JavaScript.
 * @default +0
 *
 * @arg EasingType:str
 * @text Exit Easing
 * @parent PictureID:arrayeval
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Select which easing type you wish to apply.
 * @default InSine
 *
 * @arg FlipDirection:str
 * @text Flip Direction
 * @parent PictureID:arrayeval
 * @type select
 * @option None
 * @option Flip
 * @desc Flip direction when exiting?
 * @default None
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the bust exit.
 * @default 20
 *
 * @arg AutoErase:eval
 * @text Auto-Erase?
 * @parent Duration:eval
 * @type boolean
 * @on Auto-Erase
 * @off Don't Erase
 * @desc Automatically erase the bust(s) after fading out completely?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Basic_GraphicChange
 * @text BASIC: Graphic Change
 * @desc Changes ONE bust's graphic without changing any of its other
 * properties. Useful for quickly changing facial expressions.
 * 
 * @arg PictureID:eval
 * @text Picture ID
 * @desc What is the Picture ID to associate with this bust?
 * You may use JavaScript code.
 * @default 1
 * 
 * @arg PictureName:str
 * @text Picture File
 * @type file
 * @dir img/pictures/
 * @desc What picture file do you wish to use?
 * @default >>>ATTENTION<<<
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Basic_MirrorBust
 * @text BASIC: Mirror Bust(s)
 * @desc Change the facing direction the bust(s).
 * This alters the horizontal scaling of the bust(s).
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 *
 * @arg HorzMirror:str
 * @text Horizontal Mirror
 * @type select
 * @option None
 * @option Mirror
 * @option Auto
 * @option Auto-Reverse
 * @option Toggle
 * @desc How do you wish to affect the mirroring for the bust(s)?
 * @default Toggle
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Basic_OriginChange
 * @text BASIC: Origin Change Bust(s)
 * @desc Change the origin/anchor for bust(s).
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg Origin:str
 * @text Origin
 * @parent PictureID:eval
 * @type select
 * @option Upper Left
 * @option Center
 * @option Bust
 * @desc Pick what kind of origin setting to use for this bust?
 * "Bust" value is based on Plugin Parameters.
 * @default Bust
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the origin change.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Basic_PlayAniBust
 * @text BASIC: Play Animation on Bust(s)
 * @desc Plays a specific battle animation on bust(s).
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg AnimationID:num
 * @text Battle Animation ID
 * @parent PictureID:arrayeval
 * @type animation
 * @desc Select which battle animation to play on bust.
 * @default 1
 *
 * @arg Mirror:eval
 * @text Mirror Animation?
 * @parent AnimationID:num
 * @type boolean
 * @on Mirror
 * @off Normal
 * @desc Mirror the animation effect?
 * @default false
 *
 * @arg WaitForAnimation:eval
 * @text Wait For Animation?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until the animation is finished before continuing?
 * @default false
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Breathing
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Category_Breathing
 * @text Category - Breathing
 * @desc These are breathing related Picture Plugin Commands.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Breathing_Enable
 * @text BREATHING: Start
 * @desc Start breathing aspect for selected bust(s).
 * Makes it look like the bust graphic is more alive.
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg Speed
 * 
 * @arg SpeedX:eval
 * @text Speed X
 * @parent Speed
 * @desc Speed used for the horizontal breathing cycle.
 * Higher is slower. You may use JavaScript.
 * @default 20
 * 
 * @arg SpeedY:eval
 * @text Speed Y
 * @parent Speed
 * @desc Speed used for the vertical breathing cycle.
 * Higher is slower. You may use JavaScript.
 * @default 30
 * 
 * @arg Rate
 * 
 * @arg RateX:eval
 * @text Rate X
 * @parent Rate
 * @desc Rate used for the horizontal breathing cycle.
 * Determines change amount. You may use JavaScript.
 * @default 0.10
 * 
 * @arg RateY:eval
 * @text Rate Y
 * @parent Rate
 * @desc Rate used for the vertical breathing cycle.
 * Determines change amount. You may use JavaScript.
 * @default 0.80
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Breathing_Disable
 * @text BREATHING: Stop
 * @desc Stops breathing aspect for selected bust(s).
 * The bust graphic becomes static.
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Fade
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Category_Fade
 * @text Category - Fade
 * @desc These are fading related Picture Plugin Commands.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Fade_FadeIn
 * @text FADE: Fade In Bust(s)
 * @desc Brings selected picture bust(s) opacity levels to 255.
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the bust fade in.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Fade_FadeOut
 * @text FADE: Fade Out Bust(s)
 * @desc Brings selected picture bust(s) opacity levels to 0.
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the bust fade out.
 * @default 20
 *
 * @arg AutoErase:eval
 * @text Auto-Erase?
 * @parent Duration:eval
 * @type boolean
 * @on Auto-Erase
 * @off Don't Erase
 * @desc Automatically erase the bust(s) after fading out completely?
 * @default false
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Fade_OpacityBy
 * @text FADE: Opacity By X, Bust(s)
 * @desc Adjusts selected picture bust(s) opacity levels relatively.
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg AdjustOpacity:eval
 * @text Adjust Opacity
 * @desc Adjust opacity value of pictures by this amount.
 * Negative: Lower, Positive: Higher. You may use JavaScript.
 * @default +50
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the bust fading.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Fade_OpacityTo
 * @text FADE: Opacity To X, Bust(s)
 * @desc Brings selected picture bust(s) opacity levels to a custom value.
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg TargetOpacity:num
 * @text Target Opacity
 * @desc What opacity value do you wish to adjust the bust to?
 * Use a value between 0 and 255.
 * @type number
 * @min 0
 * @max 255
 * @default 128
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the bust fading.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Fidgeting
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Category_Fidgeting
 * @text Category - Fidgeting
 * @desc These are fidgeting related Picture Plugin Commands.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Fidgeting_Enable
 * @text FIDGETING: Start
 * @desc Starts fidgeting aspect for selected bust(s).
 * Bust graphic moves back and forth.
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg Speed
 * 
 * @arg SpeedX:eval
 * @text Speed X
 * @parent Speed
 * @desc Speed used for the horizontal fidgeting cycle.
 * Higher is slower. You may use JavaScript.
 * @default 30
 * 
 * @arg SpeedY:eval
 * @text Speed Y
 * @parent Speed
 * @desc Speed used for the vertical fidgeting cycle.
 * Higher is slower. You may use JavaScript.
 * @default 30
 * 
 * @arg Rate
 * @text Distance
 * 
 * @arg RateX:eval
 * @text Distance X
 * @parent Rate
 * @desc Max distance used for the horizontal fidgeting cycle.
 * Determines change amount. You may use JavaScript.
 * @default 5.00
 * 
 * @arg RateY:eval
 * @text Distance Y
 * @parent Rate
 * @desc Max distance used for the vertical fidgeting cycle.
 * Determines change amount. You may use JavaScript.
 * @default 0.00
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Fidgeting_Disable
 * @text FIDGETING: Stop
 * @desc Stops fidgeting aspect for selected bust(s).
 * The bust graphic becomes stationary.
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Move
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Category_Move
 * @text Category - Movement
 * @desc These are movement-related Picture Bust Plugin Commands.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Move_MoveByCoordinates
 * @text MOVE: Move Bust(s) By Coordinates
 * @desc Move bust(s) relative to current coordinates(s).
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg MoveX:str
 * @text Move By X
 * @parent PictureID:arrayeval
 * @desc Negative: left; Positive: right; "Unchanged" for none.
 * You may use JavaScript.
 * @default +100
 * 
 * @arg MoveY:str
 * @text Move By Y
 * @parent PictureID:arrayeval
 * @desc Negative: up; Positive: down; "Unchanged" for none.
 * You may use JavaScript.
 * @default Unchanged
 *
 * @arg EasingType:str
 * @text Move Easing
 * @parent PictureID:arrayeval
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Select which easing type you wish to apply.
 * @default InOutSine
 *
 * @arg FlipDirection:str
 * @text Flip Direction
 * @parent PictureID:arrayeval
 * @type select
 * @option None
 * @option Flip
 * @desc Flip direction when moving?
 * @default None
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the bust movement.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Move_MoveByPosition
 * @text MOVE: Move Bust(s) By Position
 * @desc Move bust(s) relative to current position(s).
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg MovePosition:eval
 * @text Move By Position
 * @parent PictureID:arrayeval
 * @desc Negative: left; Positive: right; "Unchanged" for none.
 * You may use JavaScript. Results between 0 and 10.
 * @default +1
 *
 * @arg EasingType:str
 * @text Move Easing
 * @parent PictureID:arrayeval
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Select which easing type you wish to apply.
 * @default InOutSine
 *
 * @arg FlipDirection:str
 * @text Flip Direction
 * @parent PictureID:arrayeval
 * @type select
 * @option None
 * @option Flip
 * @desc Flip direction when moving?
 * @default None
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the bust movement.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Move_MoveToCoordinates
 * @text MOVE: Move Bust(s) to Coordinates
 * @desc Move bust(s) to exact coordinates(s).
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg TargetX:str
 * @text Target X
 * @parent PictureID:arrayeval
 * @desc Target X coordinate. "Unchanged" for no changes.
 * You may use JavaScript.
 * @default Graphics.width / 2
 * 
 * @arg TargetY:str
 * @text Target Y
 * @parent PictureID:arrayeval
 * @desc Target Y coordinate. "Unchanged" for no changes.
 * You may use JavaScript.
 * @default Unchanged
 *
 * @arg EasingType:str
 * @text Move Easing
 * @parent PictureID:arrayeval
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Select which easing type you wish to apply.
 * @default InOutSine
 *
 * @arg FlipDirection:str
 * @text Flip Direction
 * @parent PictureID:arrayeval
 * @type select
 * @option None
 * @option Flip
 * @desc Flip direction when moving?
 * @default None
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the bust movement.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Move_MoveToPosition
 * @text MOVE: Move Bust(s) to Position
 * @desc Move bust(s) to the predetermined position.
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg TargetPosition:eval
 * @text Target Position
 * @parent PictureID:arrayeval
 * @desc Target predetermined position from 0 to 10.
 * You may use JavaScript.
 * @default 5
 *
 * @arg EasingType:str
 * @text Move Easing
 * @parent PictureID:arrayeval
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Select which easing type you wish to apply.
 * @default InOutSine
 *
 * @arg FlipDirection:str
 * @text Flip Direction
 * @parent PictureID:arrayeval
 * @type select
 * @option None
 * @option Flip
 * @desc Flip direction when moving?
 * @default None
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the bust movement.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Move_ResetToPosition
 * @text MOVE: Reset Bust(s) to Position
 * @desc Reset bust(s) to the current position(s).
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 *
 * @arg EasingType:str
 * @text Move Easing
 * @parent PictureID:arrayeval
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Select which easing type you wish to apply.
 * @default InOutSine
 *
 * @arg FlipDirection:str
 * @text Flip Direction
 * @parent PictureID:arrayeval
 * @type select
 * @option None
 * @option Flip
 * @desc Flip direction when moving?
 * @default None
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the bust movement.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Scale
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Category_Scale
 * @text Category - Scaling
 * @desc These are scaling-related Picture Bust Plugin Commands.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Scale_ScaleBy
 * @text SCALE: Scale Bust(s) By
 * @desc Scale bust(s) by specific amounts.
 * Value scale: 100 = 100% = 1.0
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg ScaleX:eval
 * @text Scale X By
 * @parent PictureID:arrayeval
 * @desc Alter (additively) the X scaling value by this.
 * You may use JavaScript.
 * @default +20
 * 
 * @arg ScaleY:eval
 * @text Scale Y By
 * @parent PictureID:arrayeval
 * @desc Alter (additively) the Y scaling value by this.
 * You may use JavaScript.
 * @default +20
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the bust scaling.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Scale_ScaleTo
 * @text SCALE: Scale Bust(s) To
 * @desc Scale bust(s) to specific values.
 * Value scale: 100 = 100% = 1.0
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg TargetScaleX:str
 * @text Target Scale X
 * @parent PictureID:arrayeval
 * @desc Set X scaling value to this.
 * You may use JavaScript. "Unchanged" for no changes.
 * @default 100
 * 
 * @arg TargetScaleY:str
 * @text Target Scale Y
 * @parent PictureID:arrayeval
 * @desc Set Y scaling value to this.
 * You may use JavaScript. "Unchanged" for no changes.
 * @default 100
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the bust scaling.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Scale_ScaleReset
 * @text SCALE: Scale Reset Bust(s)
 * @desc Resets the scale for bust(s) to the default
 * settings in the Plugin Parameters.
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the bust scaling.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Swaying
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Category_Swaying
 * @text Category - Swaying
 * @desc These are swaying related Picture Plugin Commands.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Swaying_Enable
 * @text SWAYING: Start
 * @desc Starts swaying aspect for selected bust(s).
 * The bust sways its angle back and forth.
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg Speed
 * 
 * @arg SpeedAngle:eval
 * @text Angle Speed
 * @parent Speed
 * @desc Speed used for the swaying cycle.
 * Higher is slower. You may use JavaScript.
 * @default 30
 * 
 * @arg Rate
 * @text Angle
 * 
 * @arg RateAngle:eval
 * @text Angle Sway
 * @parent Rate
 * @desc Max angle used for the swaying cycle.
 * Determines change amount. You may use JavaScript.
 * @default 2
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Swaying_Disable
 * @text SWAYING: Stop
 * @desc Stops swaying aspect for selected bust(s).
 * The no longer sways back and forth.
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Tone
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Category_Tone
 * @text Category - Tone
 * @desc These are tone-related Picture Bust Plugin Commands.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Tone_BrightBust
 * @text TONE: Bright Bust(s)
 * @desc Brighten bust(s) to use the Tone settings
 * found in the Plugin Parameters.
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the tone change.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Tone_DimBust
 * @text TONE: Dim Bust(s)
 * @desc Dims bust(s) to use the Tone settings
 * found in the Plugin Parameters.
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the tone change.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Tone_NormalBust
 * @text TONE: Normal Bust(s)
 * @desc Normalize bust(s) to no tone at all.
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the tone change.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Tone_PresetBust
 * @text TONE: Preset Tone for Bust(s)
 * @desc Use RPG Maker MZ's present tones/tints for bust(s).
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 * 
 * @arg Preset:str
 * @text Preset Name
 * @parent PictureID:arrayeval
 * @type select
 * @option Normal
 * @option Dark
 * @option Sepia
 * @option Sunset
 * @option Night
 * @desc What tone preset do you wish to apply?
 * @default Sepia
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the tone change.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Tone_CustomToneBust
 * @text TONE: Target Tone for Bust(s)
 * @desc Use a custom target tone for the bust(s).
 * 
 * @arg PictureID:arrayeval
 * @text Picture ID(s)
 * @type string[]
 * @desc What Picture ID(s) to associate with this command?
 * You may use JavaScript code.
 * @default ["1"]
 *
 * @arg customTone:eval
 * @text Custom Tone
 * @parent PictureID:arrayeval
 * @desc What tone do you want for the bust(s)?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 0, 0, 0]
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for the tone change.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_End
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @ ==========================================================================
 * @ Plugin Parameters
 * @ ==========================================================================
 *
 * @param BreakHead
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param VNPictureBusts
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 * 
 * @param Anchor
 * @text Anchor Settings
 *
 * @param AnchorX:num
 * @text Anchor X
 * @parent Anchor
 * @desc Determines the anchor/origin X setting for Picture Busts.
 * 0.0 is left, 0.5 is center, 1.0 is right.
 * @default 0.5
 *
 * @param AnchorY:num
 * @text Anchor Y
 * @parent Anchor
 * @desc Determines the anchor/origin Y setting for Picture Busts.
 * 0.0 is top, 0.5 is middle, 1.0 is bottom.
 * @default 1.0
 * 
 * @param Scale
 * @text Scale Settings
 *
 * @param ScaleX:num
 * @text Scale X
 * @parent Scale
 * @desc Scale X adjustment settings for Picture Busts.
 * Value scale: 100 = 100% = 1.0
 * @default 100
 *
 * @param ScaleY:num
 * @text Scale Y
 * @parent Scale
 * @desc Scale Y adjustment settings for Picture Busts.
 * Value scale: 100 = 100% = 1.0
 * @default 100
 *
 * @param InvertedScale:arraynum
 * @text Mirror Horizontally
 * @parent Scale
 * @type number[]
 * @max 10
 * @desc Which positions will be mirrored horizontally?
 * You want your Busts facing the center of the screen.
 * @default ["0","1","2","3","4"]
 * 
 * @param Screen
 * @text Screen Positioning
 *
 * @param ScreenX:func
 * @text JS: Position X
 * @parent Screen
 * @type note
 * @desc Code to determine used to calculate the X coordinate
 * for each screen position.
 * @default "// Declare Arguments\nconst position = arguments[0].clamp(0, 10);\n\n// Declare Variables\nconst bufferX = 200;\nconst width = Graphics.width - (bufferX * 2);\n\n// Calculate X Position\nx = Math.round(position * width / 10) + bufferX;\nx = x.clamp(bufferX, Graphics.width - bufferX);\n\n// Return X Value\nreturn x;"
 *
 * @param ScreenY:func
 * @text JS: Position Y
 * @parent Screen
 * @type note
 * @desc Code to determine used to calculate the Y coordinate
 * for each screen position.
 * @default "// Declare Arguments\nconst position = arguments[0].clamp(0, 10);\n\n// Declare Variables\nconst stagger = 0;\nconst difference = 5 - Math.abs(5 - position);\nlet y = Graphics.height;\n\n// Calculate Y Position\ny = Graphics.height + Math.round(difference * stagger) + 5;\n\n// Return Y Value\nreturn y;"
 * 
 * @param Tone
 * @text Tone Presets
 *
 * @param brightTone:eval
 * @text Bright Tone
 * @parent Tone
 * @desc What tone do you want for brightness?
 * Format: [Red, Green, Blue, Gray]
 * @default [34, 34, 34, 0]
 *
 * @param dimTone:eval
 * @text Dim Tone
 * @parent Tone
 * @desc What tone do you want for dimming?
 * Format: [Red, Green, Blue, Gray]
 * @default [-34, -34, 0, 34]
 *
 * @param BreakEnd1
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param End Of
 * @default Plugin Parameters
 *
 * @param BreakEnd2
 * @text --------------------------
 * @default ----------------------------------
 *
 */
//=============================================================================

const _0x15c6f8=_0x3504;(function(_0x4c8957,_0x1bceb6){const _0x1568ac=_0x3504,_0x220e8d=_0x4c8957();while(!![]){try{const _0xb1bce5=parseInt(_0x1568ac(0xdd))/0x1+parseInt(_0x1568ac(0x149))/0x2+parseInt(_0x1568ac(0x110))/0x3+parseInt(_0x1568ac(0x1a2))/0x4*(parseInt(_0x1568ac(0x1aa))/0x5)+parseInt(_0x1568ac(0xb0))/0x6*(parseInt(_0x1568ac(0x198))/0x7)+parseInt(_0x1568ac(0x98))/0x8*(parseInt(_0x1568ac(0x120))/0x9)+-parseInt(_0x1568ac(0x87))/0xa;if(_0xb1bce5===_0x1bceb6)break;else _0x220e8d['push'](_0x220e8d['shift']());}catch(_0x5d3bb3){_0x220e8d['push'](_0x220e8d['shift']());}}}(_0x16af,0xdd50e));function _0x3504(_0x518252,_0x2e9675){const _0x16afb9=_0x16af();return _0x3504=function(_0x350468,_0x421dca){_0x350468=_0x350468-0x70;let _0x4765f4=_0x16afb9[_0x350468];return _0x4765f4;},_0x3504(_0x518252,_0x2e9675);}var label=_0x15c6f8(0xa3),tier=tier||0x0,dependencies=[_0x15c6f8(0x188)],pluginData=$plugins[_0x15c6f8(0x1a9)](function(_0x6286c7){const _0x37200b=_0x15c6f8;return _0x6286c7[_0x37200b(0xc6)]&&_0x6286c7[_0x37200b(0xa1)][_0x37200b(0xcc)]('['+label+']');})[0x0];function _0x16af(){const _0x23bd44=['scaleX','speed','TargetX','setup','_targetScaleX','kFZcZ','targetSpritePosition','isVnPictureFidgeting','306GhLabf','SpeedAngle','return\x200','alignBottom','getVnPictureSwayingSettings','enabled','format','Move_MoveByCoordinates','length','ypKGX','TargetOpacity','TargetPosition','_vnSwaying','Origin','zsSMC','shift','_targetScaleY','nfpdt','_name','jjllB','RfwUQ','NPliV','_pictureContainer','ZRXWM','setVnPictureSwayingSettings','Fade_OpacityBy','Tone_BrightBust','removeAllAnimations','AnchorX','Basic_MirrorBust','OkdHb','BattleCoreVersionCheck','BUST','VXqKd','fNoUR','UNCHANGED','ARRAYEVAL','picture','AnimationID','frameCount','Tone_PresetBust','695710ZOtwvP','updatePictureAnimations','_targetY','startAnimation','Fade_FadeOut','round','Game_Interpreter_updateWaitMode','AUTO-REVERSE','cZSQI','YqVDd','_duration','_scaleY','destroy','ScreenY','dimTone','animationId','StartOffsetX','retrievePictureAnimation','wKBVt','epvEz','RateY','TargetY','SpeedX','isPictureAnimationPlaying','jhfjG','scaleY','getLastPluginCommandInterpreter','cckLz','abs','tint','Move_ResetToPosition','Fade_FadeIn','setVnPictureBreathingSettings','ywyaU','addLoadListener','ARRAYSTR','qfmlM','Game_Temp_initialize','erasePicture','Basic_PlayAniBust','Game_Picture_scaleY','customTone','VisuMZ_1_BattleCore\x20needs\x20to\x20be\x20updated\x20to\x20use\x0aBASIC:\x20Play\x20Animation\x20on\x20Bust(s)\x20plugin\x20command.','ScaleX','fwZdz','height','ECqvh','oGBQF','Swaying_Disable','addChild','vnPostChangeGraphic','removeChild','EVAL','NONE','kDTBJ','Spriteset_Base_removeAllAnimations','registerCommand','FlipDirection','findPictureTargetSprite','_targetAnchor','pictureAnimation','vnAutoErasePicture','Game_Picture_updateMove','VisuMZ_0_CoreEngine','_vnFidgeting','EAclc','setAnchor','isAnimationForEach','Spriteset_Base_updateAnimations','HorzMirror','Basic_GraphicChange','_pictureAnimationQueue','boAtb','AnchorY','TargetScaleX','BattleCore','applyVnBreathingScaleY','targets','initVnPictureBusts','4988851fQXJDy','_scene','ConvertParams','_opacity','STRUCT','call','applyVnFidgetingScaleX','qRfsl','FwpCS','MFOgV','28anJJzS','initVnPictureSlightMovements','animationShouldMirror','setVnPictureFidgetingSettings','Basic_EnterBust','Game_Picture_angle','STR','filter','737245uvCkMr','width','DBZUZ','HorzMirrorCheck','vnChangeGraphic','_vnBreathing','Fidgeting_Disable','Game_Picture_x','setVnBustAnchor','VisuMZ_1_BattleCore','Spriteset_Base_createPictures','InvertedScale','Game_Picture_scaleX','NIGHT','_anchor','setWaitMode','getVnPictureBreathingSettings','gycfP','_scaleX','EndOffsetX','match','loadPicture','CENTER','_animation','MoveY','Tone_CustomToneBust','Swaying_Enable','createPictureAnimation','32007820PtMHIo','MDuWj','dDAgY','Fade_OpacityTo','log','updateAnimations','stringify','push','apply','edalD','requestPictureAnimation','trim','uulCV','Scale_ScaleReset','Settings','applyVnSwaying','_pictureEffectsContainer','13192DZUCZF','anchor','FLIP','children','EndOffsetY','bhLCQ','brightTone','jKzTs','GSicl','description','UPPER\x20LEFT','VNPictureBusts','updateMove','thKai','NqBCz','getVnBustPosition','max','jEGhK','Tone_NormalBust','applyVnFidgetingScaleY','TargetScaleY','varcH','Linear','endAnimation','6zuFTyb','MoveX','clamp','movePicture','gZsSf','Basic_OriginChange','find','AutoErase','_origin','EasingType','_spriteset','FUNC','ZnAKO','WaitForAnimation','Scale_ScaleTo','eJIZc','prototype','createPictureAnimationSprite','map','NjFVl','initialize','Game_Picture_initialize','status','Sprite_Picture_updatePosition','SUNSET','Mirror','parse','GYGpp','includes','_targetOpacity','Game_Picture_y','_animationSprites','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','MIRROR','Position','Basic_ExitBusts','removeAllPictureAnimations','xFKkw','NDmJG','rate','PictureName','applyVnBreathingScaleX','animationBaseDelay','CxaHK','bind','1355824inpiXm','updatePositionVnFidgeting','PictureID','setEasingType','MovePosition','_wholeDuration','ARRAYNUM','ScreenX','JprKV','ScaleY','RmGqZ','updateWaitMode','ARRAYJSON','removePictureAnimation','createPictureEffectsContainer','parameters','Breathing_Disable','exit','QytNt','name','getVnPictureFidgetingSettings','updatePosition','clone','createPictures','NEBLu','angle','showPicture','mirror','setTargetAnchor','toUpperCase','pcHzj','setVnBustPosition','isPlaytest','setFrame','vnSetDuration','rAcBD','_pictureId','vnPictureBustPosition','opALW','_targetX','Sprite_Animation_targetSpritePosition','JSON','targetObjects','AoRSx','_vnPictureBustCoordinates','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','lastAnimationSprite','_vnPictureBustPosition','vwrzF','makePictureTargetSprites','Duration','1808133HhwuFb','thMmU','StartOffsetY','cos','version','worldTransform','RateX','SpeedY'];_0x16af=function(){return _0x23bd44;};return _0x16af();}VisuMZ[label][_0x15c6f8(0x95)]=VisuMZ[label][_0x15c6f8(0x95)]||{},VisuMZ[_0x15c6f8(0x19a)]=function(_0x45ad16,_0x5ac89f){const _0x4557fe=_0x15c6f8;for(const _0x4b76b4 in _0x5ac89f){if(_0x4b76b4[_0x4557fe(0x7f)](/(.*):(.*)/i)){if(_0x4557fe(0x12e)===_0x4557fe(0x12e)){const _0x148cfa=String(RegExp['$1']),_0x366896=String(RegExp['$2'])['toUpperCase']()[_0x4557fe(0x92)]();let _0x489bbe,_0xb8d8d6,_0x523625;switch(_0x366896){case'NUM':_0x489bbe=_0x5ac89f[_0x4b76b4]!==''?Number(_0x5ac89f[_0x4b76b4]):0x0;break;case _0x4557fe(0xe3):_0xb8d8d6=_0x5ac89f[_0x4b76b4]!==''?JSON['parse'](_0x5ac89f[_0x4b76b4]):[],_0x489bbe=_0xb8d8d6['map'](_0x3cdc6b=>Number(_0x3cdc6b));break;case _0x4557fe(0x17d):_0x489bbe=_0x5ac89f[_0x4b76b4]!==''?eval(_0x5ac89f[_0x4b76b4]):null;break;case _0x4557fe(0x144):_0xb8d8d6=_0x5ac89f[_0x4b76b4]!==''?JSON[_0x4557fe(0xca)](_0x5ac89f[_0x4b76b4]):[],_0x489bbe=_0xb8d8d6[_0x4557fe(0xc2)](_0x1b268f=>eval(_0x1b268f));break;case _0x4557fe(0x106):_0x489bbe=_0x5ac89f[_0x4b76b4]!==''?JSON[_0x4557fe(0xca)](_0x5ac89f[_0x4b76b4]):'';break;case _0x4557fe(0xe9):_0xb8d8d6=_0x5ac89f[_0x4b76b4]!==''?JSON[_0x4557fe(0xca)](_0x5ac89f[_0x4b76b4]):[],_0x489bbe=_0xb8d8d6[_0x4557fe(0xc2)](_0x4cd445=>JSON[_0x4557fe(0xca)](_0x4cd445));break;case _0x4557fe(0xbb):_0x489bbe=_0x5ac89f[_0x4b76b4]!==''?new Function(JSON[_0x4557fe(0xca)](_0x5ac89f[_0x4b76b4])):new Function(_0x4557fe(0x122));break;case'ARRAYFUNC':_0xb8d8d6=_0x5ac89f[_0x4b76b4]!==''?JSON['parse'](_0x5ac89f[_0x4b76b4]):[],_0x489bbe=_0xb8d8d6['map'](_0x2bca4e=>new Function(JSON['parse'](_0x2bca4e)));break;case _0x4557fe(0x1a8):_0x489bbe=_0x5ac89f[_0x4b76b4]!==''?String(_0x5ac89f[_0x4b76b4]):'';break;case _0x4557fe(0x16c):_0xb8d8d6=_0x5ac89f[_0x4b76b4]!==''?JSON[_0x4557fe(0xca)](_0x5ac89f[_0x4b76b4]):[],_0x489bbe=_0xb8d8d6['map'](_0x254cf4=>String(_0x254cf4));break;case _0x4557fe(0x19c):_0x523625=_0x5ac89f[_0x4b76b4]!==''?JSON['parse'](_0x5ac89f[_0x4b76b4]):{},_0x489bbe=VisuMZ[_0x4557fe(0x19a)]({},_0x523625);break;case'ARRAYSTRUCT':_0xb8d8d6=_0x5ac89f[_0x4b76b4]!==''?JSON[_0x4557fe(0xca)](_0x5ac89f[_0x4b76b4]):[],_0x489bbe=_0xb8d8d6['map'](_0x3bb8a6=>VisuMZ[_0x4557fe(0x19a)]({},JSON[_0x4557fe(0xca)](_0x3bb8a6)));break;default:continue;}_0x45ad16[_0x148cfa]=_0x489bbe;}else{const _0xb2e522=_0x15e60a(_0x24c19c['$1']);_0xb2e522<_0x12a03e?(_0x2e0ed3(_0x4557fe(0xd0)[_0x4557fe(0x126)](_0x384b6f,_0xb2e522,_0x4bb800)),_0x32c900['exit']()):_0x43f032=_0x79ec66[_0x4557fe(0xa8)](_0xb2e522,_0x12a78e);}}}return _0x45ad16;},(_0x1bc617=>{const _0x436982=_0x15c6f8,_0x357345=_0x1bc617['name'];for(const _0x37664f of dependencies){if(!Imported[_0x37664f]){if(_0x436982(0x10d)!==_0x436982(0x108)){alert('%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.'[_0x436982(0x126)](_0x357345,_0x37664f)),SceneManager[_0x436982(0xee)]();break;}else{const _0x3325e3=this['isMVAnimation'](_0x3c8582),_0x5135ef=new(_0x3325e3?_0x2643d3:_0x1c25ae)(),_0xc2d606=this['makePictureTargetSprites'](_0x3f35f4),_0x345783=this[_0x436982(0xda)](),_0x454310=_0x4e4e6c>_0x345783?this[_0x436982(0x10b)]():null;this[_0x436982(0x1a4)](_0x12bab0[0x0])&&(_0x1c04e1=!_0x48cbe2),_0x5135ef[_0x436982(0x107)]=_0x26f56c,_0x5135ef[_0x436982(0x11b)](_0xc2d606,_0x257ffe,_0xbb0925,_0x42e595,_0x454310),this['_pictureEffectsContainer'][_0x436982(0x17a)](_0x5135ef),this[_0x436982(0xcf)][_0x436982(0x8e)](_0x5135ef);}}}const _0x3cf327=_0x1bc617[_0x436982(0xa1)];if(_0x3cf327['match'](/\[Version[ ](.*?)\]/i)){const _0x1a0e53=Number(RegExp['$1']);if(_0x1a0e53!==VisuMZ[label]['version']){if('ypKGX'!==_0x436982(0x129)){if(_0x1a895b['isPlaytest']())_0x548c56[_0x436982(0x8b)](_0x29694f);}else alert(_0x436982(0x10a)[_0x436982(0x126)](_0x357345,_0x1a0e53)),SceneManager[_0x436982(0xee)]();}}if(_0x3cf327[_0x436982(0x7f)](/\[Tier[ ](\d+)\]/i)){const _0x25869d=Number(RegExp['$1']);_0x25869d<tier?(alert(_0x436982(0xd0)[_0x436982(0x126)](_0x357345,_0x25869d,tier)),SceneManager[_0x436982(0xee)]()):tier=Math[_0x436982(0xa8)](_0x25869d,tier);}VisuMZ[_0x436982(0x19a)](VisuMZ[label][_0x436982(0x95)],_0x1bc617[_0x436982(0xec)]);})(pluginData),VisuMZ['VNPictureBusts'][_0x15c6f8(0x1ad)]=function(_0x4bb058,_0x236c56){const _0x34bcac=_0x15c6f8;_0x4bb058=_0x4bb058[_0x34bcac(0xfa)]()[_0x34bcac(0x92)]();if(_0x4bb058===_0x34bcac(0x17e)){if(_0x34bcac(0x7c)===_0x34bcac(0x7c))return![];else{const _0x1a8596=this[_0x34bcac(0x7b)]();if(!_0x1a8596[_0x34bcac(0x125)])return 0x0;const _0x41bbc5=_0x3a3e3b[_0x34bcac(0x147)],_0x5ef292=_0x1a8596[_0x34bcac(0x119)]['x']||0.01,_0x5c7277=_0x1a8596[_0x34bcac(0xd7)]['x'];return _0x3adc07[_0x34bcac(0x113)](_0x41bbc5/_0x5ef292)*_0x5c7277;}}else{if(_0x4bb058===_0x34bcac(0xd1))return!![];else{if(_0x4bb058==='AUTO'){const _0x44bf00=VisuMZ[_0x34bcac(0xa3)]['Settings'];return _0x44bf00[_0x34bcac(0x76)][_0x34bcac(0xcc)](_0x236c56);}else{if(_0x4bb058===_0x34bcac(0x150)){const _0x4ecffc=VisuMZ['VNPictureBusts']['Settings'];return!_0x4ecffc[_0x34bcac(0x76)][_0x34bcac(0xcc)](_0x236c56);}}}}return![];},PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],_0x15c6f8(0x1a6),_0x139824=>{const _0x5f246d=_0x15c6f8;VisuMZ['ConvertParams'](_0x139824,_0x139824);const _0x17eff5=VisuMZ[_0x5f246d(0xa3)][_0x5f246d(0x95)],_0x431b97=(_0x139824[_0x5f246d(0xdf)]||0x1)['clamp'](0x1,0x64),_0x4ce289=_0x139824[_0x5f246d(0xd8)];if(_0x4ce289[_0x5f246d(0x92)]()['length']<=0x0)return;const _0x2cd1a9=_0x139824['Origin'][_0x5f246d(0xfa)]()[_0x5f246d(0x92)](),_0x4337c5=_0x139824[_0x5f246d(0xd2)][_0x5f246d(0xb2)](0x0,0xa),_0xaf9e82=ImageManager[_0x5f246d(0x102)](_0x4337c5),_0x3cf2bc=VisuMZ[_0x5f246d(0xa3)][_0x5f246d(0x1ad)](_0x139824[_0x5f246d(0x18e)],_0x4337c5),_0x26c0de=_0x139824[_0x5f246d(0x159)]*(_0x3cf2bc?0x1:-0x1),_0x447e74=_0x139824[_0x5f246d(0x112)];let _0x348504=_0x17eff5[_0x5f246d(0x174)]*(_0x3cf2bc?-0x1:0x1),_0x187dc0=_0x17eff5['ScaleX'],_0x133726=0x0;const _0x2e6eef=0x0;$gameScreen[_0x5f246d(0xf7)](_0x431b97,_0x4ce289,_0x2cd1a9===_0x5f246d(0xa2)?0x0:0x1,_0xaf9e82['x']+_0x26c0de,_0xaf9e82['y']+_0x447e74,_0x348504,_0x187dc0,_0x133726,_0x2e6eef),_0x133726=0xff,$gameScreen[_0x5f246d(0xb3)](_0x431b97,_0x2cd1a9===_0x5f246d(0xa2)?0x0:0x1,_0xaf9e82['x'],_0xaf9e82['y'],_0x348504,_0x187dc0,_0x133726,_0x2e6eef,_0x139824[_0x5f246d(0x10f)],0x0);const _0x35523f=$gameScreen[_0x5f246d(0x145)](_0x431b97);if(_0x35523f){_0x35523f[_0x5f246d(0xe0)](_0x139824[_0x5f246d(0xb9)]),_0x35523f[_0x5f246d(0xfc)](_0x4337c5);if(_0x2cd1a9===_0x5f246d(0x140))_0x35523f[_0x5f246d(0x73)](!![],!![]);}}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],_0x15c6f8(0xd3),_0x180c8f=>{const _0x524cd6=_0x15c6f8;VisuMZ['ConvertParams'](_0x180c8f,_0x180c8f);const _0x40414a=VisuMZ[_0x524cd6(0xa3)]['Settings'],_0x25e221=_0x180c8f['PictureID'],_0x4ec0a3=_0x180c8f[_0x524cd6(0x182)][_0x524cd6(0xfa)]()[_0x524cd6(0x92)]()===_0x524cd6(0x9a);for(let _0xc66049 of _0x25e221){if('thKai'!==_0x524cd6(0xa5)){if(this)this[_0x524cd6(0x132)]=_0x33c5ce;}else{_0xc66049=(_0xc66049||0x1)['clamp'](0x1,0x64);const _0x1f094a=$gameScreen[_0x524cd6(0x145)](_0xc66049);if(!_0x1f094a)continue;const _0x4c314b=_0x1f094a[_0x524cd6(0x79)],_0x561ba1=_0x1f094a[_0x524cd6(0x184)],_0x5b7b2c=_0x1f094a['_scaleX']<0x0,_0x478b6=_0x180c8f[_0x524cd6(0x7e)]*(_0x5b7b2c?0x1:-0x1),_0x3bf1f3=_0x180c8f[_0x524cd6(0x9c)];$gameScreen['movePicture'](_0xc66049,_0x1f094a[_0x524cd6(0xb8)],_0x1f094a['_x']+_0x478b6,_0x1f094a['_y']+_0x3bf1f3,_0x1f094a[_0x524cd6(0x7d)],_0x1f094a[_0x524cd6(0x154)],0x0,0x0,_0x180c8f[_0x524cd6(0x10f)],0x0),_0x1f094a[_0x524cd6(0x18b)](_0x4c314b),_0x1f094a[_0x524cd6(0xf9)](_0x561ba1),_0x1f094a[_0x524cd6(0xe0)](_0x180c8f['EasingType']),_0x1f094a[_0x524cd6(0xfc)](-0x1);_0x4ec0a3&&(_0x524cd6(0x191)!==_0x524cd6(0xad)?(_0x1f094a[_0x524cd6(0x7d)]*=-0x1,_0x1f094a[_0x524cd6(0x11c)]*=-0x1):_0x3dd522[_0x524cd6(0xa3)][_0x524cd6(0xc7)]['call'](this));if(_0x180c8f[_0x524cd6(0xb7)])$gameScreen[_0x524cd6(0x186)](_0xc66049,0x32);}}}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],_0x15c6f8(0x18f),_0x20f599=>{const _0x5620c6=_0x15c6f8;VisuMZ[_0x5620c6(0x19a)](_0x20f599,_0x20f599);const _0x2731be=_0x20f599[_0x5620c6(0xdf)],_0x45a4ac=_0x20f599[_0x5620c6(0xd8)];if(_0x45a4ac[_0x5620c6(0x92)]()[_0x5620c6(0x128)]<=0x0)return;const _0x5b68d1=$gameScreen[_0x5620c6(0x145)](_0x2731be);if(!_0x5b68d1)return;_0x5b68d1[_0x5620c6(0x1ae)](_0x45a4ac);}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],_0x15c6f8(0x13d),_0x55f86a=>{const _0x5df7d0=_0x15c6f8;VisuMZ[_0x5df7d0(0x19a)](_0x55f86a,_0x55f86a);const _0x2bb889=_0x55f86a[_0x5df7d0(0xdf)],_0x4c7b09=_0x55f86a[_0x5df7d0(0x18e)]['toUpperCase']()[_0x5df7d0(0x92)]();for(let _0x459e45 of _0x2bb889){if(_0x5df7d0(0x1a1)!==_0x5df7d0(0x133)){_0x459e45=(_0x459e45||0x1)[_0x5df7d0(0xb2)](0x1,0x64);const _0x2bed26=$gameScreen['picture'](_0x459e45);if(!_0x2bed26)continue;const _0x32b7d1=_0x2bed26[_0x5df7d0(0xa7)]();if(_0x4c7b09==='TOGGLE')_0x5df7d0(0x142)===_0x5df7d0(0x131)?(_0x3e1d15=_0x5a57cb(_0x4559fd['$1']),_0x4a401d=_0x279efd(_0x57be35['$2'])):_0x2bed26[_0x5df7d0(0x7d)]*=-0x1;else{let _0x300a2c=VisuMZ[_0x5df7d0(0xa3)]['HorzMirrorCheck'](_0x4c7b09,_0x32b7d1);_0x2bed26[_0x5df7d0(0x7d)]=Math[_0x5df7d0(0x165)](_0x2bed26[_0x5df7d0(0x7d)])*(_0x300a2c?-0x1:0x1);}_0x2bed26[_0x5df7d0(0x11c)]=_0x2bed26['_scaleX'];}else _0x20f7f3=_0x241d12(_0x135076['$1']),_0x353432=_0x59ff70(_0x5ba37b['$2']);}}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],_0x15c6f8(0xb5),_0x223248=>{const _0x23ba81=_0x15c6f8;VisuMZ[_0x23ba81(0x19a)](_0x223248,_0x223248);const _0x50c313=_0x223248['PictureID'],_0xe71e81=_0x223248[_0x23ba81(0x12d)][_0x23ba81(0xfa)]()[_0x23ba81(0x92)](),_0x40ee88=VisuMZ['VNPictureBusts'][_0x23ba81(0x95)],_0x5773ab={'x':_0x40ee88[_0x23ba81(0x13c)],'y':_0x40ee88[_0x23ba81(0x192)]};for(let _0x3cd6db of _0x50c313){if('RDVbm'===_0x23ba81(0x161)){const _0x4d4950=_0x55bd9e[_0x23ba81(0x80)](_0x55132c);_0x4d4950[_0x23ba81(0x16b)](this[_0x23ba81(0x17b)]['bind'](this,_0x12e796));}else{_0x3cd6db=(_0x3cd6db||0x1)['clamp'](0x1,0x64);const _0x59f44f=$gameScreen[_0x23ba81(0x145)](_0x3cd6db);if(!_0x59f44f)continue;let _0x58a0e4={'x':0x0,'y':0x0};if(_0xe71e81==='UPPER\x20LEFT')_0x58a0e4={'x':0x0,'y':0x0};else{if(_0xe71e81===_0x23ba81(0x81))_0x58a0e4={'x':0.5,'y':0.5};else{if(_0xe71e81===_0x23ba81(0x140))_0x23ba81(0x18a)==='XRpAA'?(_0x66b6ba['_scaleX']*=-0x1,_0x2a2452['_targetScaleX']*=-0x1):_0x58a0e4=_0x5773ab;else continue;}}_0x59f44f['setTargetAnchor'](_0x58a0e4),_0x59f44f[_0x23ba81(0xe0)](_0x23ba81(0xae)),_0x59f44f[_0x23ba81(0xff)](_0x223248[_0x23ba81(0x10f)]);}}}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],_0x15c6f8(0x170),_0x49a719=>{const _0x18f34d=_0x15c6f8;if(Imported[_0x18f34d(0x74)]&&VisuMZ[_0x18f34d(0x194)][_0x18f34d(0x114)]<1.47){if(_0x18f34d(0x15c)!==_0x18f34d(0x15c))try{const _0x4b1dff=_0x25ed86(_0x5155f5[_0x18f34d(0x193)]),_0x5e3481=_0x494a46[_0x18f34d(0x7d)]<0x0?-0x1:0x1;_0x5312e0[_0x18f34d(0x11c)]=_0x4b1dff*_0x5e3481;}catch(_0x207ba2){if(_0x334a9f['isPlaytest']())_0x392b2e[_0x18f34d(0x8b)](_0x207ba2);}else{if(!VisuMZ[_0x18f34d(0xa3)]['BattleCoreVersionCheck']){if(_0x18f34d(0x111)===_0x18f34d(0x111)){VisuMZ[_0x18f34d(0xa3)][_0x18f34d(0x13f)]=!![];const _0x1ffc42=_0x18f34d(0x173);alert(_0x1ffc42);}else{const _0x113647={},_0x4d65cb=_0x3097e4[_0x18f34d(0xa3)][_0x18f34d(0x95)];for(let _0x20d9be=0x0;_0x20d9be<=0xa;_0x20d9be++){const _0x3c76b0=_0x45103b[_0x18f34d(0x14e)](_0x4d65cb[_0x18f34d(0xe4)](_0x20d9be)),_0x85da78=_0xfba213[_0x18f34d(0x14e)](_0x4d65cb[_0x18f34d(0x156)](_0x20d9be));_0x113647[_0x20d9be]={'x':_0x3c76b0,'y':_0x85da78};}this['_vnPictureBustCoordinates']=_0x113647;}}return;}}VisuMZ[_0x18f34d(0x19a)](_0x49a719,_0x49a719);const _0x8ea49d=_0x49a719[_0x18f34d(0xdf)],_0x5e7e88=_0x49a719[_0x18f34d(0x146)];if(!$dataAnimations[_0x5e7e88])return;const _0x720538=_0x49a719[_0x18f34d(0xc9)];$gameTemp[_0x18f34d(0x91)](_0x8ea49d['clone'](),_0x5e7e88,_0x720538);const _0x3fd260=$gameTemp[_0x18f34d(0x163)]();_0x3fd260&&_0x49a719[_0x18f34d(0xbd)]&&(SceneManager['_scene']['_spriteset'][_0x18f34d(0x14a)](),_0x3fd260[_0x18f34d(0x7a)]('pictureAnimation'));}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],'Breathing_Enable',_0x32cf62=>{const _0x50d4df=_0x15c6f8;VisuMZ[_0x50d4df(0x19a)](_0x32cf62,_0x32cf62);const _0xde6cf2=_0x32cf62[_0x50d4df(0xdf)],_0x5dd2ff=_0x32cf62[_0x50d4df(0x15f)]||0x0,_0x24b115=_0x32cf62['SpeedY']||0x0,_0x3a4c3b=_0x32cf62['RateX']||0x0,_0x4c80a5=_0x32cf62[_0x50d4df(0x15d)]||0x0;for(let _0x5c8f4f of _0xde6cf2){if(_0x50d4df(0x164)==='eRmNc'){let _0x5bc46a=_0x47b3c1[_0x50d4df(0xa3)][_0x50d4df(0xce)][_0x50d4df(0x19d)](this);return _0x5bc46a+=this[_0x50d4df(0xab)](),_0x5bc46a;}else{_0x5c8f4f=(_0x5c8f4f||0x1)['clamp'](0x1,0x64);const _0x5ef4a2=$gameScreen['picture'](_0x5c8f4f);if(!_0x5ef4a2)continue;const _0x478800=_0x5ef4a2[_0x50d4df(0x7b)]();_0x478800['enabled']=!![],_0x478800[_0x50d4df(0x119)]['x']=_0x5dd2ff,_0x478800['speed']['y']=_0x24b115,_0x478800['rate']['x']=_0x3a4c3b,_0x478800['rate']['y']=_0x4c80a5,_0x5ef4a2[_0x50d4df(0x169)](_0x478800);}}}),PluginManager['registerCommand'](pluginData['name'],_0x15c6f8(0xed),_0x3a6587=>{const _0x53b0fe=_0x15c6f8;VisuMZ['ConvertParams'](_0x3a6587,_0x3a6587);const _0x42f34a=_0x3a6587[_0x53b0fe(0xdf)];for(let _0x9d425d of _0x42f34a){_0x9d425d=(_0x9d425d||0x1)[_0x53b0fe(0xb2)](0x1,0x64);const _0x27bcd6=$gameScreen[_0x53b0fe(0x145)](_0x9d425d);if(!_0x27bcd6)continue;const _0x57760f=_0x27bcd6[_0x53b0fe(0x7b)]();_0x57760f[_0x53b0fe(0x125)]=![],_0x27bcd6[_0x53b0fe(0x169)](_0x57760f);}}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],_0x15c6f8(0x168),_0x5ddd59=>{const _0x121ae7=_0x15c6f8;VisuMZ[_0x121ae7(0x19a)](_0x5ddd59,_0x5ddd59);const _0x45d325=_0x5ddd59[_0x121ae7(0xdf)];for(let _0x28e69f of _0x45d325){_0x28e69f=(_0x28e69f||0x1)[_0x121ae7(0xb2)](0x1,0x64);const _0xbe0226=$gameScreen[_0x121ae7(0x145)](_0x28e69f);if(!_0xbe0226)continue;_0xbe0226[_0x121ae7(0xff)](_0x5ddd59['Duration']),_0xbe0226[_0x121ae7(0xcd)]=0xff,_0xbe0226['setEasingType'](_0x121ae7(0xae));}}),PluginManager['registerCommand'](pluginData[_0x15c6f8(0xf0)],_0x15c6f8(0x14d),_0x30f838=>{const _0x141dbb=_0x15c6f8;VisuMZ['ConvertParams'](_0x30f838,_0x30f838);const _0x2671e8=_0x30f838[_0x141dbb(0xdf)];for(let _0x3f5adc of _0x2671e8){if(_0x141dbb(0xa0)===_0x141dbb(0xe5))return!![];else{_0x3f5adc=(_0x3f5adc||0x1)[_0x141dbb(0xb2)](0x1,0x64);const _0x4ffc87=$gameScreen[_0x141dbb(0x145)](_0x3f5adc);if(!_0x4ffc87)continue;_0x4ffc87['vnSetDuration'](_0x30f838[_0x141dbb(0x10f)]),_0x4ffc87[_0x141dbb(0xcd)]=0x0,_0x4ffc87[_0x141dbb(0xe0)](_0x141dbb(0xae));if(_0x30f838[_0x141dbb(0xb7)])$gameScreen[_0x141dbb(0x186)](_0x3f5adc,0x32);}}}),PluginManager['registerCommand'](pluginData[_0x15c6f8(0xf0)],_0x15c6f8(0x139),_0x355964=>{const _0x5dc8a7=_0x15c6f8;VisuMZ[_0x5dc8a7(0x19a)](_0x355964,_0x355964);const _0x2e78ed=_0x355964[_0x5dc8a7(0xdf)],_0x41106a=Number(_0x355964['AdjustOpacity'])||0x0;for(let _0x580ca3 of _0x2e78ed){_0x580ca3=(_0x580ca3||0x1)[_0x5dc8a7(0xb2)](0x1,0x64);const _0x3f28a9=$gameScreen[_0x5dc8a7(0x145)](_0x580ca3);if(!_0x3f28a9)continue;_0x3f28a9[_0x5dc8a7(0xff)](_0x355964[_0x5dc8a7(0x10f)]);const _0x21ef71=Math[_0x5dc8a7(0x14e)](_0x3f28a9[_0x5dc8a7(0xcd)]+_0x41106a);_0x3f28a9[_0x5dc8a7(0xcd)]=_0x21ef71['clamp'](0x0,0xff),_0x3f28a9[_0x5dc8a7(0xe0)](_0x5dc8a7(0xae));}}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],_0x15c6f8(0x8a),_0x2832f6=>{const _0x1be81a=_0x15c6f8;VisuMZ[_0x1be81a(0x19a)](_0x2832f6,_0x2832f6);const _0x14f8df=_0x2832f6[_0x1be81a(0xdf)],_0x3912a8=_0x2832f6[_0x1be81a(0x12a)][_0x1be81a(0xb2)](0x0,0xff);for(let _0x299ec2 of _0x14f8df){if(_0x1be81a(0x134)===_0x1be81a(0x178)){let _0x514e0f=_0x3e54ce[_0x1be81a(0xa3)][_0x1be81a(0x171)][_0x1be81a(0x19d)](this);return _0x514e0f+=this[_0x1be81a(0x195)](),_0x514e0f;}else{_0x299ec2=(_0x299ec2||0x1)[_0x1be81a(0xb2)](0x1,0x64);const _0x221be9=$gameScreen[_0x1be81a(0x145)](_0x299ec2);if(!_0x221be9)continue;_0x221be9[_0x1be81a(0xff)](_0x2832f6[_0x1be81a(0x10f)]),_0x221be9[_0x1be81a(0xcd)]=_0x3912a8,_0x221be9[_0x1be81a(0xe0)](_0x1be81a(0xae));}}}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],'Fidgeting_Enable',_0x266367=>{const _0x106f74=_0x15c6f8;VisuMZ[_0x106f74(0x19a)](_0x266367,_0x266367);const _0x5a18df=_0x266367[_0x106f74(0xdf)],_0x432c14=_0x266367[_0x106f74(0x15f)]||0x0,_0x3971e4=_0x266367[_0x106f74(0x117)]||0x0,_0x167621=_0x266367[_0x106f74(0x116)]||0x0,_0x1a9838=_0x266367[_0x106f74(0x15d)]||0x0;for(let _0x357502 of _0x5a18df){if('opALW'!==_0x106f74(0x103)){let _0x359099=_0x2427c0[_0x106f74(0xa3)][_0x106f74(0x77)]['call'](this);return _0x359099+=this[_0x106f74(0xd9)](),_0x359099;}else{_0x357502=(_0x357502||0x1)[_0x106f74(0xb2)](0x1,0x64);const _0x1a3fda=$gameScreen[_0x106f74(0x145)](_0x357502);if(!_0x1a3fda)continue;const _0x1fd687=_0x1a3fda[_0x106f74(0xf1)]();_0x1fd687[_0x106f74(0x125)]=!![],_0x1fd687[_0x106f74(0x119)]['x']=_0x432c14,_0x1fd687[_0x106f74(0x119)]['y']=_0x3971e4,_0x1fd687[_0x106f74(0xd7)]['x']=_0x167621,_0x1fd687[_0x106f74(0xd7)]['y']=_0x1a9838,_0x1a3fda[_0x106f74(0x1a5)](_0x1fd687);}}}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],_0x15c6f8(0x71),_0x4f25b2=>{const _0x342e58=_0x15c6f8;VisuMZ[_0x342e58(0x19a)](_0x4f25b2,_0x4f25b2);const _0xd2c6ff=_0x4f25b2[_0x342e58(0xdf)];for(let _0x4ac830 of _0xd2c6ff){_0x4ac830=(_0x4ac830||0x1)[_0x342e58(0xb2)](0x1,0x64);const _0x2d8575=$gameScreen[_0x342e58(0x145)](_0x4ac830);if(!_0x2d8575)continue;const _0x616cb8=_0x2d8575[_0x342e58(0xf1)]();_0x616cb8[_0x342e58(0x125)]=![],_0x2d8575['setVnPictureFidgetingSettings'](_0x616cb8);}}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],_0x15c6f8(0x127),_0x7199fc=>{const _0xd4ff89=_0x15c6f8;VisuMZ[_0xd4ff89(0x19a)](_0x7199fc,_0x7199fc);const _0xdc7e62=_0x7199fc['PictureID'],_0x38f5dd=_0x7199fc[_0xd4ff89(0x182)][_0xd4ff89(0xfa)]()[_0xd4ff89(0x92)]()==='FLIP';for(let _0x592929 of _0xdc7e62){_0x592929=(_0x592929||0x1)[_0xd4ff89(0xb2)](0x1,0x64);const _0x2c1a88=$gameScreen[_0xd4ff89(0x145)](_0x592929);if(!_0x2c1a88)continue;if(_0x7199fc[_0xd4ff89(0xb1)][_0xd4ff89(0xfa)]()[_0xd4ff89(0x92)]()!==_0xd4ff89(0x143))try{if(_0xd4ff89(0x100)!==_0xd4ff89(0x100)){const _0x7dba8f=this['_pictureEffectsContainer'];return _0x7dba8f&&_0x7dba8f[_0xd4ff89(0x9b)][_0xd4ff89(0x128)]>0x0;}else{const _0x1bb557=eval(_0x7199fc[_0xd4ff89(0xb1)]);_0x2c1a88['_duration']>0x0?_0x2c1a88['_targetX']+=_0x1bb557:'bhLCQ'!==_0xd4ff89(0x9d)?this[_0xd4ff89(0x86)](_0x1f7a1d):_0x2c1a88[_0xd4ff89(0x104)]=_0x2c1a88['_x']+_0x1bb557;}}catch(_0x5106d3){if(_0xd4ff89(0x175)!==_0xd4ff89(0x175)){_0x408486-=0x1;const _0x4e4309=0x64;_0x2b12b9(this[_0xd4ff89(0x186)][_0xd4ff89(0xdc)](this,_0x2df800,_0x4a99b9),_0x4e4309);}else{if($gameTemp[_0xd4ff89(0xfd)]())console[_0xd4ff89(0x8b)](_0x5106d3);}}if(_0x7199fc[_0xd4ff89(0x83)]['toUpperCase']()['trim']()!==_0xd4ff89(0x143))try{if('YqVDd'!==_0xd4ff89(0x152))this['erasePicture'](_0x4ca4e2);else{const _0x55d217=eval(_0x7199fc[_0xd4ff89(0x83)]);_0x2c1a88['_duration']>0x0?_0x2c1a88[_0xd4ff89(0x14b)]+=_0x55d217:_0x2c1a88['_targetY']=_0x2c1a88['_y']+_0x55d217;}}catch(_0x4f87c7){if($gameTemp[_0xd4ff89(0xfd)]())console['log'](_0x4f87c7);}_0x2c1a88['vnSetDuration'](_0x7199fc[_0xd4ff89(0x10f)]),_0x2c1a88[_0xd4ff89(0xe0)](_0x7199fc[_0xd4ff89(0xb9)]),_0x38f5dd&&(_0x2c1a88[_0xd4ff89(0x7d)]*=-0x1,_0x2c1a88['_targetScaleX']*=-0x1);}}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],'Move_MoveByPosition',_0x5623b9=>{const _0x126568=_0x15c6f8;VisuMZ['ConvertParams'](_0x5623b9,_0x5623b9);const _0x1ff8b5=_0x5623b9[_0x126568(0xdf)],_0xa583a0=_0x5623b9['FlipDirection'][_0x126568(0xfa)]()[_0x126568(0x92)]()===_0x126568(0x9a);for(let _0x2aef9f of _0x1ff8b5){if(_0x126568(0xa9)===_0x126568(0xa9)){_0x2aef9f=(_0x2aef9f||0x1)[_0x126568(0xb2)](0x1,0x64);const _0x1f1fdc=$gameScreen['picture'](_0x2aef9f);if(!_0x1f1fdc)continue;try{const _0x4365c9=eval(_0x5623b9[_0x126568(0xe1)]),_0x2f26d8=(_0x1f1fdc[_0x126568(0xa7)]()+_0x4365c9)[_0x126568(0xb2)](0x0,0xa),_0x4e4471=ImageManager[_0x126568(0x102)](_0x2f26d8);_0x1f1fdc[_0x126568(0x104)]=_0x4e4471['x'],_0x1f1fdc['_targetY']=_0x4e4471['y'],_0x1f1fdc['setVnBustPosition'](_0x2f26d8);}catch(_0x396250){if($gameTemp[_0x126568(0xfd)]())console[_0x126568(0x8b)](_0x396250);}_0x1f1fdc[_0x126568(0xff)](_0x5623b9[_0x126568(0x10f)]),_0x1f1fdc['setEasingType'](_0x5623b9[_0x126568(0xb9)]),_0xa583a0&&(_0x1f1fdc['_scaleX']*=-0x1,_0x1f1fdc[_0x126568(0x11c)]*=-0x1);}else _0x4a85fd['endAnimation']();}}),PluginManager['registerCommand'](pluginData['name'],'Move_MoveToCoordinates',_0x3a84d2=>{const _0x530a04=_0x15c6f8;VisuMZ[_0x530a04(0x19a)](_0x3a84d2,_0x3a84d2);const _0x5efa66=_0x3a84d2[_0x530a04(0xdf)],_0x5add42=_0x3a84d2['FlipDirection'][_0x530a04(0xfa)]()['trim']()==='FLIP';for(let _0x6fdfd of _0x5efa66){if(_0x530a04(0x88)===_0x530a04(0xfb)){if(_0x41162f[_0x530a04(0xfd)]())_0x41f00a[_0x530a04(0x8b)](_0x4f4d91);}else{_0x6fdfd=(_0x6fdfd||0x1)[_0x530a04(0xb2)](0x1,0x64);const _0x24bfc4=$gameScreen['picture'](_0x6fdfd);if(!_0x24bfc4)continue;if(_0x3a84d2['TargetX']['toUpperCase']()['trim']()!=='UNCHANGED'){if('LMAfG'!=='zvdXI')try{_0x24bfc4[_0x530a04(0x104)]=eval(_0x3a84d2[_0x530a04(0x11a)]);}catch(_0x6cd860){if($gameTemp[_0x530a04(0xfd)]())console['log'](_0x6cd860);}else{if(_0x38795[_0x530a04(0xfd)]())_0x441722[_0x530a04(0x8b)](_0x1b7778);}}if(_0x3a84d2[_0x530a04(0x15e)]['toUpperCase']()[_0x530a04(0x92)]()!==_0x530a04(0x143))try{_0x24bfc4[_0x530a04(0x14b)]=eval(_0x3a84d2[_0x530a04(0x15e)]);}catch(_0x1735b1){if(_0x530a04(0xef)!==_0x530a04(0xef)){const _0xccb591=this[_0x530a04(0xf1)]();if(!_0xccb591[_0x530a04(0x125)])return 0x0;const _0x4baa16=_0x97ac02['frameCount'],_0x30f15c=_0xccb591[_0x530a04(0x119)]['x']||0.01,_0x38c891=_0xccb591[_0x530a04(0xd7)]['x'];return _0x506ccf[_0x530a04(0x113)](_0x4baa16/_0x30f15c)*_0x38c891;}else{if($gameTemp[_0x530a04(0xfd)]())console[_0x530a04(0x8b)](_0x1735b1);}}_0x24bfc4[_0x530a04(0xff)](_0x3a84d2[_0x530a04(0x10f)]),_0x24bfc4['setEasingType'](_0x3a84d2[_0x530a04(0xb9)]),_0x5add42&&('NjFVl'===_0x530a04(0xc3)?(_0x24bfc4['_scaleX']*=-0x1,_0x24bfc4[_0x530a04(0x11c)]*=-0x1):(_0xa7bd43[_0x530a04(0xa3)][_0x530a04(0x16e)][_0x530a04(0x19d)](this),this[_0x530a04(0x190)]=[]));}}}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],'Move_MoveToPosition',_0x4ec1b2=>{const _0x2458c0=_0x15c6f8;VisuMZ['ConvertParams'](_0x4ec1b2,_0x4ec1b2);const _0x31212c=_0x4ec1b2[_0x2458c0(0xdf)],_0x1139d7=_0x4ec1b2[_0x2458c0(0x182)][_0x2458c0(0xfa)]()['trim']()===_0x2458c0(0x9a);for(let _0x3be7c3 of _0x31212c){if('dDAgY'===_0x2458c0(0x89)){_0x3be7c3=(_0x3be7c3||0x1)['clamp'](0x1,0x64);const _0x413e9e=$gameScreen[_0x2458c0(0x145)](_0x3be7c3);if(!_0x413e9e)continue;try{if(_0x2458c0(0xd5)===_0x2458c0(0x19f))_0x44b464=_0x7878ff['max'](_0x1bad99,_0x2eca5a);else{const _0x5c0372=(Number(eval(_0x4ec1b2[_0x2458c0(0x12b)]))||0x0)[_0x2458c0(0xb2)](0x0,0xa),_0x11c249=ImageManager[_0x2458c0(0x102)](_0x5c0372);_0x413e9e['_targetX']=_0x11c249['x'],_0x413e9e[_0x2458c0(0x14b)]=_0x11c249['y'],_0x413e9e[_0x2458c0(0xfc)](_0x5c0372);}}catch(_0x304e0c){if($gameTemp[_0x2458c0(0xfd)]())console[_0x2458c0(0x8b)](_0x304e0c);}_0x413e9e[_0x2458c0(0xff)](_0x4ec1b2[_0x2458c0(0x10f)]),_0x413e9e['setEasingType'](_0x4ec1b2[_0x2458c0(0xb9)]),_0x1139d7&&(_0x413e9e['_scaleX']*=-0x1,_0x413e9e[_0x2458c0(0x11c)]*=-0x1);}else _0x52ee0a[_0x2458c0(0x7d)]*=-0x1,_0x56fc71['_targetScaleX']*=-0x1;}}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],_0x15c6f8(0x167),_0x5e6ef8=>{const _0x3dd92b=_0x15c6f8;VisuMZ[_0x3dd92b(0x19a)](_0x5e6ef8,_0x5e6ef8);const _0x5f430b=_0x5e6ef8[_0x3dd92b(0xdf)],_0x27d0a1=_0x5e6ef8['FlipDirection'][_0x3dd92b(0xfa)]()[_0x3dd92b(0x92)]()===_0x3dd92b(0x9a);for(let _0xc6bcaa of _0x5f430b){_0xc6bcaa=(_0xc6bcaa||0x1)['clamp'](0x1,0x64);const _0x49abb6=$gameScreen[_0x3dd92b(0x145)](_0xc6bcaa);if(!_0x49abb6)continue;const _0x3fa5be=_0x49abb6['getVnBustPosition']()[_0x3dd92b(0xb2)](0x0,0xa),_0x54b24c=ImageManager[_0x3dd92b(0x102)](_0x3fa5be);_0x49abb6['_targetX']=_0x54b24c['x'],_0x49abb6[_0x3dd92b(0x14b)]=_0x54b24c['y'],_0x49abb6[_0x3dd92b(0xfc)](_0x3fa5be),_0x49abb6[_0x3dd92b(0xff)](_0x5e6ef8[_0x3dd92b(0x10f)]),_0x49abb6['setEasingType'](_0x5e6ef8[_0x3dd92b(0xb9)]);if(_0x27d0a1){if('zwjUf'!==_0x3dd92b(0x9f))_0x49abb6['_scaleX']*=-0x1,_0x49abb6[_0x3dd92b(0x11c)]*=-0x1;else return _0x2321dc[_0x3dd92b(0xa3)][_0x3dd92b(0x105)][_0x3dd92b(0x19d)](this,_0x442140);}}}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],'Scale_ScaleBy',_0x2e11c2=>{const _0x5c8465=_0x15c6f8;VisuMZ[_0x5c8465(0x19a)](_0x2e11c2,_0x2e11c2);const _0x4d19fb=_0x2e11c2['PictureID'];for(let _0x45fb6b of _0x4d19fb){if(_0x5c8465(0x135)===_0x5c8465(0x177))_0x39bcf6['_targetY']=_0x3b4b4a(_0x305810['TargetY']);else{_0x45fb6b=(_0x45fb6b||0x1)['clamp'](0x1,0x64);const _0x15bb63=$gameScreen[_0x5c8465(0x145)](_0x45fb6b);if(!_0x15bb63)continue;let _0x5b82c0=_0x2e11c2[_0x5c8465(0x174)]||0x0,_0x7a29f7=_0x2e11c2[_0x5c8465(0xe6)]||0x0;if(_0x15bb63['_scaleX']<0x0)_0x5b82c0*=-0x1;if(_0x15bb63[_0x5c8465(0x154)]<0x0)_0x7a29f7*=-0x1;_0x15bb63[_0x5c8465(0x153)]>0x0?(_0x15bb63[_0x5c8465(0x11c)]+=_0x5b82c0,_0x15bb63[_0x5c8465(0x130)]+=_0x7a29f7):(_0x15bb63['_targetScaleX']=_0x15bb63['_scaleX']+_0x5b82c0,_0x15bb63[_0x5c8465(0x130)]=_0x15bb63[_0x5c8465(0x154)]+_0x7a29f7),_0x15bb63[_0x5c8465(0xff)](_0x2e11c2['Duration']),_0x15bb63['setEasingType'](_0x5c8465(0xae));}}}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],_0x15c6f8(0xbe),_0x57449d=>{const _0x26ac6c=_0x15c6f8;VisuMZ[_0x26ac6c(0x19a)](_0x57449d,_0x57449d);const _0x351919=_0x57449d['PictureID'];for(let _0x4f2ba3 of _0x351919){if(_0x26ac6c(0x16d)===_0x26ac6c(0x1a0))_0x3d2986(_0x26ac6c(0x10a)[_0x26ac6c(0x126)](_0x5b84ea,_0x2ea177)),_0x58bc42[_0x26ac6c(0xee)]();else{_0x4f2ba3=(_0x4f2ba3||0x1)[_0x26ac6c(0xb2)](0x1,0x64);const _0x797c15=$gameScreen['picture'](_0x4f2ba3);if(!_0x797c15)continue;if(_0x57449d['TargetScaleX']['toUpperCase']()['trim']()!==_0x26ac6c(0x143))try{const _0x57ad52=eval(_0x57449d[_0x26ac6c(0x193)]),_0x42db39=_0x797c15[_0x26ac6c(0x7d)]<0x0?-0x1:0x1;_0x797c15[_0x26ac6c(0x11c)]=_0x57ad52*_0x42db39;}catch(_0x5f11b6){if($gameTemp['isPlaytest']())console[_0x26ac6c(0x8b)](_0x5f11b6);}if(_0x57449d[_0x26ac6c(0xac)][_0x26ac6c(0xfa)]()[_0x26ac6c(0x92)]()!==_0x26ac6c(0x143)){if(_0x26ac6c(0xe7)!=='umTbq')try{const _0x2789c7=eval(_0x57449d['TargetScaleY']),_0x48c7a8=_0x797c15[_0x26ac6c(0x154)]<0x0?-0x1:0x1;_0x797c15[_0x26ac6c(0x130)]=_0x2789c7*_0x48c7a8;}catch(_0x3ed01a){if($gameTemp['isPlaytest']())console[_0x26ac6c(0x8b)](_0x3ed01a);}else this[_0x26ac6c(0x145)]()[_0x26ac6c(0x11f)]()?this[_0x26ac6c(0xde)]():_0x89a3c0[_0x26ac6c(0xa3)][_0x26ac6c(0xc7)][_0x26ac6c(0x19d)](this);}_0x797c15['vnSetDuration'](_0x57449d[_0x26ac6c(0x10f)]),_0x797c15[_0x26ac6c(0xe0)](_0x26ac6c(0xae));}}}),PluginManager[_0x15c6f8(0x181)](pluginData['name'],_0x15c6f8(0x94),_0x2c8799=>{const _0x5bd156=_0x15c6f8;VisuMZ[_0x5bd156(0x19a)](_0x2c8799,_0x2c8799);const _0x3e3215=_0x2c8799[_0x5bd156(0xdf)],_0x400210=VisuMZ['VNPictureBusts']['Settings'];for(let _0x4a70ef of _0x3e3215){if(_0x5bd156(0xbc)==='ZnAKO'){_0x4a70ef=(_0x4a70ef||0x1)['clamp'](0x1,0x64);const _0x1556bb=$gameScreen[_0x5bd156(0x145)](_0x4a70ef);if(!_0x1556bb)continue;_0x1556bb['_targetScaleX']=_0x400210['ScaleX']*(_0x1556bb['_scaleX']>0x0?0x1:-0x1),_0x1556bb['_targetScaleY']=_0x400210[_0x5bd156(0xe6)]*(_0x1556bb['_scaleY']>0x0?0x1:-0x1),_0x1556bb[_0x5bd156(0xff)](_0x2c8799[_0x5bd156(0x10f)]),_0x1556bb[_0x5bd156(0xe0)](_0x5bd156(0xae));}else _0x1ce6d3[_0x5bd156(0x11c)]+=_0x32e4ac,_0x7ee02e['_targetScaleY']+=_0x453672;}}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],_0x15c6f8(0x85),_0x5638c8=>{const _0x469b62=_0x15c6f8;VisuMZ['ConvertParams'](_0x5638c8,_0x5638c8);const _0x35ae5=_0x5638c8[_0x469b62(0xdf)],_0x58d27f=_0x5638c8[_0x469b62(0x121)]||0x0,_0x57a45a=_0x5638c8['RateAngle']||0x0;for(let _0x1a7704 of _0x35ae5){_0x1a7704=(_0x1a7704||0x1)[_0x469b62(0xb2)](0x1,0x64);const _0x1510fc=$gameScreen[_0x469b62(0x145)](_0x1a7704);if(!_0x1510fc)continue;const _0x378583=_0x1510fc[_0x469b62(0x124)]();_0x378583['enabled']=!![],_0x378583[_0x469b62(0x119)][_0x469b62(0xf6)]=_0x58d27f,_0x378583[_0x469b62(0xd7)][_0x469b62(0xf6)]=_0x57a45a,_0x1510fc[_0x469b62(0x138)](_0x378583);}}),PluginManager[_0x15c6f8(0x181)](pluginData['name'],_0x15c6f8(0x179),_0xf007dc=>{const _0x20ca43=_0x15c6f8;VisuMZ['ConvertParams'](_0xf007dc,_0xf007dc);const _0x201767=_0xf007dc['PictureID'];for(let _0x355a41 of _0x201767){_0x355a41=(_0x355a41||0x1)[_0x20ca43(0xb2)](0x1,0x64);const _0x508d77=$gameScreen[_0x20ca43(0x145)](_0x355a41);if(!_0x508d77)continue;const _0x4058d3=_0x508d77[_0x20ca43(0x124)]();_0x4058d3[_0x20ca43(0x125)]=![],_0x508d77[_0x20ca43(0x138)](_0x4058d3);}}),PluginManager[_0x15c6f8(0x181)](pluginData['name'],_0x15c6f8(0x13a),_0x1bc0bb=>{const _0x41fb20=_0x15c6f8;VisuMZ['ConvertParams'](_0x1bc0bb,_0x1bc0bb);const _0x2b1d38=_0x1bc0bb[_0x41fb20(0xdf)],_0xe43348=VisuMZ[_0x41fb20(0xa3)][_0x41fb20(0x95)][_0x41fb20(0x9e)];for(let _0x4f14f8 of _0x2b1d38){_0x4f14f8=(_0x4f14f8||0x1)['clamp'](0x1,0x64);const _0x69d1c9=$gameScreen[_0x41fb20(0x145)](_0x4f14f8);if(!_0x69d1c9)continue;_0x69d1c9[_0x41fb20(0x166)](_0xe43348,_0x1bc0bb['Duration']);}}),PluginManager[_0x15c6f8(0x181)](pluginData['name'],'Tone_DimBust',_0x15b4a4=>{const _0x833a8c=_0x15c6f8;VisuMZ[_0x833a8c(0x19a)](_0x15b4a4,_0x15b4a4);const _0x55b215=_0x15b4a4[_0x833a8c(0xdf)],_0x23b4b0=VisuMZ['VNPictureBusts'][_0x833a8c(0x95)][_0x833a8c(0x157)];for(let _0x2233fd of _0x55b215){if('PhiEF'!=='XvgGX'){_0x2233fd=(_0x2233fd||0x1)['clamp'](0x1,0x64);const _0x29659c=$gameScreen[_0x833a8c(0x145)](_0x2233fd);if(!_0x29659c)continue;_0x29659c['tint'](_0x23b4b0,_0x15b4a4['Duration']);}else _0x261693[_0x833a8c(0x14b)]+=_0x2f229f;}}),PluginManager['registerCommand'](pluginData[_0x15c6f8(0xf0)],_0x15c6f8(0xaa),_0x228353=>{const _0x3fb83d=_0x15c6f8;VisuMZ[_0x3fb83d(0x19a)](_0x228353,_0x228353);const _0x37d6b5=_0x228353[_0x3fb83d(0xdf)],_0x55177a=[0x0,0x0,0x0,0x0];for(let _0x24c4cb of _0x37d6b5){_0x24c4cb=(_0x24c4cb||0x1)['clamp'](0x1,0x64);const _0xd35ada=$gameScreen['picture'](_0x24c4cb);if(!_0xd35ada)continue;_0xd35ada[_0x3fb83d(0x166)](_0x55177a,_0x228353[_0x3fb83d(0x10f)]);}}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],_0x15c6f8(0x148),_0x13c7c3=>{const _0x1f0cd9=_0x15c6f8;VisuMZ[_0x1f0cd9(0x19a)](_0x13c7c3,_0x13c7c3);const _0x39c847=_0x13c7c3['PictureID'];let _0x432c34=[0x0,0x0,0x0,0x0];switch(_0x13c7c3['Preset']['toUpperCase']()['trim']()){case'NORMAL':_0x432c34=[0x0,0x0,0x0,0x0];break;case'DARK':_0x432c34=[-0x44,-0x44,-0x44,0x0];break;case'SEPIA':_0x432c34=[0x22,-0x22,-0x44,0xaa];break;case _0x1f0cd9(0xc8):_0x432c34=[0x44,-0x22,-0x22,0x0];break;case _0x1f0cd9(0x78):_0x432c34=[-0x44,-0x44,0x0,0x44];break;}for(let _0x55268e of _0x39c847){_0x55268e=(_0x55268e||0x1)[_0x1f0cd9(0xb2)](0x1,0x64);const _0x3cf111=$gameScreen['picture'](_0x55268e);if(!_0x3cf111)continue;_0x3cf111[_0x1f0cd9(0x166)](_0x432c34,_0x13c7c3[_0x1f0cd9(0x10f)]);}}),PluginManager[_0x15c6f8(0x181)](pluginData[_0x15c6f8(0xf0)],_0x15c6f8(0x84),_0x3bb6e9=>{const _0x47c4eb=_0x15c6f8;VisuMZ['ConvertParams'](_0x3bb6e9,_0x3bb6e9);const _0x871789=_0x3bb6e9[_0x47c4eb(0xdf)],_0x5e7027=_0x3bb6e9[_0x47c4eb(0x172)];for(let _0x2ed2fd of _0x871789){_0x2ed2fd=(_0x2ed2fd||0x1)[_0x47c4eb(0xb2)](0x1,0x64);const _0x398b59=$gameScreen[_0x47c4eb(0x145)](_0x2ed2fd);if(!_0x398b59)continue;_0x398b59[_0x47c4eb(0x166)](_0x5e7027,_0x3bb6e9[_0x47c4eb(0x10f)]);}}),ImageManager[_0x15c6f8(0x102)]=function(_0x21fc54){const _0x3e8822=_0x15c6f8;if(!this[_0x3e8822(0x109)]){const _0x3d3403={},_0x3b0e83=VisuMZ['VNPictureBusts'][_0x3e8822(0x95)];for(let _0x5e7457=0x0;_0x5e7457<=0xa;_0x5e7457++){const _0x570486=Math[_0x3e8822(0x14e)](_0x3b0e83['ScreenX'](_0x5e7457)),_0x18378d=Math['round'](_0x3b0e83[_0x3e8822(0x156)](_0x5e7457));_0x3d3403[_0x5e7457]={'x':_0x570486,'y':_0x18378d};}this[_0x3e8822(0x109)]=_0x3d3403;}return this[_0x3e8822(0x109)][_0x21fc54]||new{'x':0x0,'y':0x0}();},VisuMZ[_0x15c6f8(0xa3)][_0x15c6f8(0x16e)]=Game_Temp['prototype'][_0x15c6f8(0xc4)],Game_Temp[_0x15c6f8(0xc0)][_0x15c6f8(0xc4)]=function(){const _0x200b33=_0x15c6f8;VisuMZ[_0x200b33(0xa3)]['Game_Temp_initialize'][_0x200b33(0x19d)](this),this['_pictureAnimationQueue']=[];},Game_Temp[_0x15c6f8(0xc0)]['requestPictureAnimation']=function(_0x2605ad,_0x321119,_0xd3e88c){const _0x4e0d3c=_0x15c6f8;_0xd3e88c=_0xd3e88c||![];if($dataAnimations[_0x321119]){const _0xa1c250={'targets':_0x2605ad,'animationId':_0x321119,'mirror':_0xd3e88c};this[_0x4e0d3c(0x190)][_0x4e0d3c(0x8e)](_0xa1c250);for(const _0x252dcc of _0x2605ad){if('uulCV'===_0x4e0d3c(0x93))_0x252dcc[_0x4e0d3c(0x14c)]&&_0x252dcc['startAnimation']();else{if(_0x3be3ae['VisuMZ_1_BattleCore']&&_0x11e922[_0x4e0d3c(0x194)][_0x4e0d3c(0x114)]<1.47){if(!_0xdc7dbb['VNPictureBusts'][_0x4e0d3c(0x13f)]){_0x30b759[_0x4e0d3c(0xa3)]['BattleCoreVersionCheck']=!![];const _0x39f211=_0x4e0d3c(0x173);_0x4442d6(_0x39f211);}return;}_0x48fa67[_0x4e0d3c(0x19a)](_0xface86,_0x4e14c7);const _0x1a2550=_0x17d59b[_0x4e0d3c(0xdf)],_0x4a6708=_0x4e5bfa[_0x4e0d3c(0x146)];if(!_0x90a1c7[_0x4a6708])return;const _0x41667a=_0x34a023[_0x4e0d3c(0xc9)];_0x120294[_0x4e0d3c(0x91)](_0x1a2550[_0x4e0d3c(0xf3)](),_0x4a6708,_0x41667a);const _0x19c98e=_0x4dee8d[_0x4e0d3c(0x163)]();_0x19c98e&&_0x18e314[_0x4e0d3c(0xbd)]&&(_0x349b06[_0x4e0d3c(0x199)][_0x4e0d3c(0xba)][_0x4e0d3c(0x14a)](),_0x19c98e[_0x4e0d3c(0x7a)](_0x4e0d3c(0x185)));}}}},Game_Temp['prototype'][_0x15c6f8(0x15a)]=function(){const _0x51bc40=_0x15c6f8;return this[_0x51bc40(0x190)][_0x51bc40(0x12f)]();},Game_Screen[_0x15c6f8(0xc0)][_0x15c6f8(0x186)]=function(_0xb1ea40,_0x2d1a28){const _0x118952=_0x15c6f8;if(_0x2d1a28<0x0)return;const _0x574f2b=this['picture'](_0xb1ea40);if(!_0x574f2b)return;if(_0x574f2b[_0x118952(0x19b)]<=0x0)_0x118952(0xd6)===_0x118952(0xd6)?this[_0x118952(0x16f)](_0xb1ea40):_0x442573=!_0x5ea86d;else{if(_0x118952(0x1ac)!==_0x118952(0x1ac)){if(_0x2f110b[_0x118952(0xfd)]())_0x38622c['log'](_0x5745f7);}else{_0x2d1a28-=0x1;const _0x3e0135=0x64;setTimeout(this[_0x118952(0x186)][_0x118952(0xdc)](this,_0xb1ea40,_0x2d1a28),_0x3e0135);}}},VisuMZ[_0x15c6f8(0xa3)]['Game_Picture_initialize']=Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0xc4)],Game_Picture[_0x15c6f8(0xc0)]['initialize']=function(){const _0x235f36=_0x15c6f8;VisuMZ[_0x235f36(0xa3)][_0x235f36(0xc5)]['call'](this),this[_0x235f36(0x197)](),this[_0x235f36(0x1a3)]();},Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0x197)]=function(){this['_vnPictureBustPosition']=-0x1;},Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0x1a3)]=function(){const _0x1a48d0=_0x15c6f8;this['_vnBreathing']={'enabled':![],'speed':{'x':0x1e,'y':0x1e},'rate':{'x':0.1,'y':0.5}},this[_0x1a48d0(0x189)]={'enabled':![],'speed':{'x':0x1e,'y':0x1e},'rate':{'x':0x5,'y':0x0}},this[_0x1a48d0(0x12c)]={'enabled':![],'speed':{'angle':0x1e},'rate':{'angle':0x5}};},VisuMZ[_0x15c6f8(0xa3)][_0x15c6f8(0x187)]=Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0xa4)],Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0xa4)]=function(){const _0x507304=_0x15c6f8,_0xacd118=this['_duration'];VisuMZ[_0x507304(0xa3)][_0x507304(0x187)][_0x507304(0x19d)](this);if(_0xacd118>0x0&&this[_0x507304(0x153)]<=0x0){this['_x']=this[_0x507304(0x104)],this['_y']=this[_0x507304(0x14b)],this['_scaleX']=this['_targetScaleX'],this['_scaleY']=this['_targetScaleY'],this[_0x507304(0x19b)]=this[_0x507304(0xcd)];if(this[_0x507304(0x79)]){if('cZSQI'!==_0x507304(0x151)){let _0x4259e3=_0x4aabfe[_0x507304(0xa3)][_0x507304(0x1a7)][_0x507304(0x19d)](this);return _0x4259e3+=this['applyVnSwaying'](),_0x4259e3;}else this[_0x507304(0x79)]['x']=this[_0x507304(0x184)]['x'],this[_0x507304(0x79)]['y']=this[_0x507304(0x184)]['y'];}}},Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0xfc)]=function(_0x384f33){const _0x53c489=_0x15c6f8;_0x384f33=Number(_0x384f33)||0x0,this[_0x53c489(0x10c)]=_0x384f33;},Game_Picture['prototype'][_0x15c6f8(0xa7)]=function(){const _0x1394ba=_0x15c6f8;return this[_0x1394ba(0x10c)]===undefined&&this[_0x1394ba(0x197)](),this[_0x1394ba(0x10c)];},Game_Picture['prototype'][_0x15c6f8(0x73)]=function(_0x5d991a,_0x26c204){const _0x425b12=_0x15c6f8,_0x2bf8ce=VisuMZ['VNPictureBusts'][_0x425b12(0x95)],_0x22c43={'x':_0x2bf8ce[_0x425b12(0x13c)],'y':_0x2bf8ce[_0x425b12(0x192)]};if(_0x5d991a)this[_0x425b12(0x18b)](_0x22c43);if(_0x26c204||this[_0x425b12(0x153)]<=0x0)this[_0x425b12(0xf9)](_0x22c43);},Game_Picture['prototype'][_0x15c6f8(0x1ae)]=function(_0x1a8fad){const _0x294649=_0x15c6f8,_0x4f7eb4=ImageManager['loadPicture'](_0x1a8fad);_0x4f7eb4[_0x294649(0x16b)](this[_0x294649(0x17b)][_0x294649(0xdc)](this,_0x1a8fad));},Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0x17b)]=function(_0x143d66){const _0x453146=_0x15c6f8;if(this)this[_0x453146(0x132)]=_0x143d66;},Game_Picture[_0x15c6f8(0xc0)]['vnSetDuration']=function(_0x1c393b){const _0x52be12=_0x15c6f8;_0x1c393b=Math[_0x52be12(0xa8)](_0x1c393b,0x1),this['_duration']=_0x1c393b,this[_0x52be12(0xe2)]=_0x1c393b;},Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0x7b)]=function(){const _0x156b92=_0x15c6f8;if(this[_0x156b92(0x70)]===undefined)this['initVnPictureSlightMovements']();return this[_0x156b92(0x70)];},Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0x169)]=function(_0x207f3e){const _0x5499ad=_0x15c6f8;if(this[_0x5499ad(0x70)]===undefined)this['initVnPictureSlightMovements']();this[_0x5499ad(0x70)]=JSON['parse'](JSON[_0x5499ad(0x8d)](_0x207f3e));},VisuMZ[_0x15c6f8(0xa3)][_0x15c6f8(0x77)]=Game_Picture['prototype'][_0x15c6f8(0x118)],Game_Picture[_0x15c6f8(0xc0)]['scaleX']=function(){const _0x270fc7=_0x15c6f8;let _0x10f4bb=VisuMZ[_0x270fc7(0xa3)]['Game_Picture_scaleX'][_0x270fc7(0x19d)](this);return _0x10f4bb+=this[_0x270fc7(0xd9)](),_0x10f4bb;},Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0xd9)]=function(){const _0x42c72b=_0x15c6f8,_0x66f852=this[_0x42c72b(0x7b)]();if(!_0x66f852['enabled'])return 0x0;const _0x2b1f89=Graphics[_0x42c72b(0x147)],_0x9c9ac1=_0x66f852[_0x42c72b(0x119)]['x']||0.01,_0x2f2c96=_0x66f852[_0x42c72b(0xd7)]['x'];return Math[_0x42c72b(0x113)](_0x2b1f89/_0x9c9ac1)*_0x2f2c96;},VisuMZ[_0x15c6f8(0xa3)]['Game_Picture_scaleY']=Game_Picture['prototype']['scaleY'],Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0x162)]=function(){const _0x158e30=_0x15c6f8;let _0x1e8188=VisuMZ[_0x158e30(0xa3)][_0x158e30(0x171)][_0x158e30(0x19d)](this);return _0x1e8188+=this[_0x158e30(0x195)](),_0x1e8188;},Game_Picture['prototype'][_0x15c6f8(0x195)]=function(){const _0x281489=_0x15c6f8,_0x4301a9=this[_0x281489(0x7b)]();if(!_0x4301a9[_0x281489(0x125)])return 0x0;const _0x62de74=Graphics[_0x281489(0x147)],_0x178fe6=_0x4301a9[_0x281489(0x119)]['y']||0.01,_0x4bdd39=_0x4301a9[_0x281489(0xd7)]['y'];return Math[_0x281489(0x113)](_0x62de74/_0x178fe6)*_0x4bdd39;},Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0xf1)]=function(){const _0x1d035b=_0x15c6f8;if(this[_0x1d035b(0x189)]===undefined)this[_0x1d035b(0x1a3)]();return this[_0x1d035b(0x189)];},Game_Picture['prototype'][_0x15c6f8(0x1a5)]=function(_0x5415eb){const _0xa0aa0b=_0x15c6f8;if(this['_vnFidgeting']===undefined)this[_0xa0aa0b(0x1a3)]();this[_0xa0aa0b(0x189)]=JSON['parse'](JSON[_0xa0aa0b(0x8d)](_0x5415eb));},Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0x11f)]=function(){return this['getVnPictureFidgetingSettings']()['enabled'];},VisuMZ[_0x15c6f8(0xa3)][_0x15c6f8(0x72)]=Game_Picture[_0x15c6f8(0xc0)]['x'],Game_Picture[_0x15c6f8(0xc0)]['x']=function(){const _0xd6f350=_0x15c6f8;let _0x4d801b=VisuMZ[_0xd6f350(0xa3)][_0xd6f350(0x72)][_0xd6f350(0x19d)](this);return _0x4d801b+=this[_0xd6f350(0x19e)](),_0x4d801b;},Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0x19e)]=function(){const _0x629a7d=_0x15c6f8,_0x3a8398=this[_0x629a7d(0xf1)]();if(!_0x3a8398[_0x629a7d(0x125)])return 0x0;const _0xd5644c=Graphics['frameCount'],_0x5e0e08=_0x3a8398[_0x629a7d(0x119)]['x']||0.01,_0x95dd25=_0x3a8398['rate']['x'];return Math[_0x629a7d(0x113)](_0xd5644c/_0x5e0e08)*_0x95dd25;},VisuMZ[_0x15c6f8(0xa3)]['Game_Picture_y']=Game_Picture['prototype']['y'],Game_Picture['prototype']['y']=function(){const _0x1f5249=_0x15c6f8;let _0x587b60=VisuMZ[_0x1f5249(0xa3)][_0x1f5249(0xce)][_0x1f5249(0x19d)](this);return _0x587b60+=this['applyVnFidgetingScaleY'](),_0x587b60;},Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0xab)]=function(){const _0x1568bf=_0x15c6f8,_0x2572c8=this[_0x1568bf(0xf1)]();if(!_0x2572c8[_0x1568bf(0x125)])return 0x0;const _0x21ef1b=Graphics['frameCount'],_0x1f1a11=_0x2572c8[_0x1568bf(0x119)]['y']||0.01,_0x1510b1=_0x2572c8[_0x1568bf(0xd7)]['y'];return Math[_0x1568bf(0x113)](_0x21ef1b/_0x1f1a11)*(_0x1510b1/0x2)+_0x1510b1/0x2;},VisuMZ[_0x15c6f8(0xa3)][_0x15c6f8(0xc7)]=Sprite_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0xf2)],Sprite_Picture['prototype'][_0x15c6f8(0xf2)]=function(){const _0x319690=_0x15c6f8;if(this[_0x319690(0x145)]()[_0x319690(0x11f)]()){if(_0x319690(0xcb)!=='hdbzH')this[_0x319690(0xde)]();else{if(!_0x2641f5[_0x319690(0xa3)][_0x319690(0x13f)]){_0xebcf70[_0x319690(0xa3)][_0x319690(0x13f)]=!![];const _0x5c577b=_0x319690(0x173);_0x50e94a(_0x5c577b);}return;}}else{if(_0x319690(0x17f)!==_0x319690(0xb4))VisuMZ['VNPictureBusts']['Sprite_Picture_updatePosition'][_0x319690(0x19d)](this);else{if(this[_0x319690(0x70)]===_0x101980)this[_0x319690(0x1a3)]();this[_0x319690(0x70)]=_0x20c02c[_0x319690(0xca)](_0x452125[_0x319690(0x8d)](_0x129c38));}}},Sprite_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0xde)]=function(){const _0x41a227=_0x15c6f8,_0x16a759=this[_0x41a227(0x145)]();this['x']=_0x16a759['x'](),this['y']=_0x16a759['y']();},Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0x124)]=function(){const _0x59637a=_0x15c6f8;if(this[_0x59637a(0x12c)]===undefined)this[_0x59637a(0x1a3)]();return this[_0x59637a(0x12c)];},Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0x138)]=function(_0x3225a5){const _0xa9ba4b=_0x15c6f8;if(this[_0xa9ba4b(0x12c)]===undefined)this[_0xa9ba4b(0x1a3)]();this['_vnSwaying']=JSON[_0xa9ba4b(0xca)](JSON[_0xa9ba4b(0x8d)](_0x3225a5));},VisuMZ[_0x15c6f8(0xa3)][_0x15c6f8(0x1a7)]=Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0xf6)],Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0xf6)]=function(){const _0x1ee807=_0x15c6f8;let _0x1ac102=VisuMZ[_0x1ee807(0xa3)][_0x1ee807(0x1a7)]['call'](this);return _0x1ac102+=this['applyVnSwaying'](),_0x1ac102;},Game_Picture[_0x15c6f8(0xc0)][_0x15c6f8(0x96)]=function(){const _0x29acd9=_0x15c6f8,_0x104a50=this[_0x29acd9(0x124)]();if(!_0x104a50[_0x29acd9(0x125)])return 0x0;const _0x12adde=Graphics['frameCount'],_0x5c7d22=_0x104a50[_0x29acd9(0x119)][_0x29acd9(0xf6)]||0.01,_0x4f31fa=_0x104a50[_0x29acd9(0xd7)][_0x29acd9(0xf6)];return Math[_0x29acd9(0x113)](_0x12adde/_0x5c7d22)*_0x4f31fa;},VisuMZ[_0x15c6f8(0xa3)][_0x15c6f8(0x14f)]=Game_Interpreter[_0x15c6f8(0xc0)]['updateWaitMode'],Game_Interpreter[_0x15c6f8(0xc0)][_0x15c6f8(0xe8)]=function(){const _0x433851=_0x15c6f8;if(this['_waitMode']===_0x433851(0x185)){if(SceneManager['_scene']['_spriteset'][_0x433851(0x160)]())return!![];this['_waitMode']='';}return VisuMZ[_0x433851(0xa3)][_0x433851(0x14f)][_0x433851(0x19d)](this);},VisuMZ['VNPictureBusts'][_0x15c6f8(0x75)]=Spriteset_Base[_0x15c6f8(0xc0)][_0x15c6f8(0xf4)],Spriteset_Base[_0x15c6f8(0xc0)][_0x15c6f8(0xf4)]=function(){const _0x45ad18=_0x15c6f8;VisuMZ[_0x45ad18(0xa3)][_0x45ad18(0x75)][_0x45ad18(0x19d)](this),this[_0x45ad18(0xeb)]();},Spriteset_Base[_0x15c6f8(0xc0)][_0x15c6f8(0xeb)]=function(){const _0x554163=_0x15c6f8,_0x51c00c=new Sprite();this[_0x554163(0x17a)](_0x51c00c);const _0x49e1ee=this['pictureContainerRect']();_0x51c00c[_0x554163(0xfe)](_0x49e1ee['x'],_0x49e1ee['y'],_0x49e1ee[_0x554163(0x1ab)],_0x49e1ee[_0x554163(0x176)]),this[_0x554163(0x97)]=_0x51c00c;},VisuMZ[_0x15c6f8(0xa3)][_0x15c6f8(0x18d)]=Spriteset_Base[_0x15c6f8(0xc0)][_0x15c6f8(0x8c)],Spriteset_Base[_0x15c6f8(0xc0)][_0x15c6f8(0x8c)]=function(){const _0x4293b1=_0x15c6f8;VisuMZ[_0x4293b1(0xa3)]['Spriteset_Base_updateAnimations'][_0x4293b1(0x19d)](this),this[_0x4293b1(0x14a)]();},Spriteset_Base[_0x15c6f8(0xc0)][_0x15c6f8(0x14a)]=function(){const _0x388ad1=_0x15c6f8;for(const _0x4f5675 of this[_0x388ad1(0xcf)]){if(!_0x4f5675['isPlaying']()){if('wKBVt'!==_0x388ad1(0x15b)){const _0x24690d=_0x35da9a(_0x40f907[_0x388ad1(0x193)]),_0x48b98b=_0x2bf448[_0x388ad1(0x7d)]<0x0?-0x1:0x1;_0x2ddf11['_targetScaleX']=_0x24690d*_0x48b98b;}else this[_0x388ad1(0xea)](_0x4f5675);}}this['processPictureAnimationRequests']();},Spriteset_Base[_0x15c6f8(0xc0)]['processPictureAnimationRequests']=function(){const _0x2fc799=_0x15c6f8;for(;;){const _0x5338a3=$gameTemp[_0x2fc799(0x15a)]();if(_0x5338a3)this['createPictureAnimation'](_0x5338a3);else{if(_0x2fc799(0x11d)!==_0x2fc799(0x11d)){const _0x4d9ff3=this['_animation']['name'];if(_0x4d9ff3[_0x2fc799(0x7f)](/<(?:HEAD|HEADER|TOP)>/i))_0x5a20aa=0x0;if(_0x4d9ff3[_0x2fc799(0x7f)](/<(?:FOOT|FOOTER|BOTTOM)>/i))_0x39a1fa=0x1;if(this[_0x2fc799(0x82)][_0x2fc799(0x123)])_0x597d87=0x1;if(_0x4d9ff3[_0x2fc799(0x7f)](/<(?:LEFT)>/i))_0x39ccdd=0x0;if(_0x4d9ff3['match'](/<(?:RIGHT)>/i))_0x16bed8=0x1;if(_0x4d9ff3[_0x2fc799(0x7f)](/<ANCHOR X:[ ](\d+\.?\d*)>/i))_0x130e21=_0x20df63(_0x4094dd['$1']);if(_0x4d9ff3[_0x2fc799(0x7f)](/<ANCHOR Y:[ ](\d+\.?\d*)>/i))_0xfc968e=_0x17e509(_0x935685['$1']);_0x4d9ff3[_0x2fc799(0x7f)](/<ANCHOR:[ ](\d+\.?\d*),[ ](\d+\.?\d*)>/i)&&(_0xe54e63=_0x364e61(_0x3edc8c['$1']),_0x30a178=_0x2e6b35(_0x428c0f['$2']));if(_0x4d9ff3[_0x2fc799(0x7f)](/<OFFSET X:[ ]([\+\-]\d+)>/i))_0x59337f=_0xb9db32(_0x4ad92d['$1']);if(_0x4d9ff3[_0x2fc799(0x7f)](/<OFFSET Y:[ ]([\+\-]\d+)>/i))_0x1f3c3e=_0x34f4f4(_0x1eeff5['$1']);_0x4d9ff3[_0x2fc799(0x7f)](/<OFFSET:[ ]([\+\-]\d+),[ ]([\+\-]\d+)>/i)&&(_0x171364=_0x3dd8c5(_0x5b49d1['$1']),_0x197ab1=_0x4a1cab(_0x2d0dbf['$2']));}else break;}}},Spriteset_Base['prototype'][_0x15c6f8(0x86)]=function(_0x52f774){const _0x3140ac=_0x15c6f8,_0x1bfb98=$dataAnimations[_0x52f774[_0x3140ac(0x158)]],_0x4d7f3b=_0x52f774[_0x3140ac(0x196)],_0x11c963=_0x52f774[_0x3140ac(0xf8)];let _0x1650f4=this[_0x3140ac(0xda)]();const _0x3ba8bc=this['animationNextDelay']();if(this[_0x3140ac(0x18c)](_0x1bfb98)){if(_0x3140ac(0xa6)===_0x3140ac(0x16a))this[_0x3140ac(0x79)]['x']=this['_targetAnchor']['x'],this['_anchor']['y']=this[_0x3140ac(0x184)]['y'];else for(const _0x3d49cc of _0x4d7f3b){this['createPictureAnimationSprite']([_0x3d49cc],_0x1bfb98,_0x11c963,_0x1650f4),_0x1650f4+=_0x3ba8bc;}}else this[_0x3140ac(0xc1)](_0x4d7f3b,_0x1bfb98,_0x11c963,_0x1650f4);},Spriteset_Base['prototype']['createPictureAnimationSprite']=function(_0x5dc0fe,_0x3b790c,_0x4426d3,_0x198b57){const _0x29ad07=_0x15c6f8,_0x1bb21b=this['isMVAnimation'](_0x3b790c),_0x24b958=new(_0x1bb21b?Sprite_AnimationMV:Sprite_Animation)(),_0x2c8fc9=this[_0x29ad07(0x10e)](_0x5dc0fe),_0x2a1145=this['animationBaseDelay'](),_0x188633=_0x198b57>_0x2a1145?this[_0x29ad07(0x10b)]():null;if(this['animationShouldMirror'](_0x5dc0fe[0x0])){if(_0x29ad07(0x141)==='wlIci')try{const _0x21e5f7=_0x12f347(_0x58762f[_0x29ad07(0xac)]),_0x182b0a=_0x4acd5d[_0x29ad07(0x154)]<0x0?-0x1:0x1;_0x1a9114[_0x29ad07(0x130)]=_0x21e5f7*_0x182b0a;}catch(_0xb964e1){if(_0x2600d8[_0x29ad07(0xfd)]())_0x4c771b[_0x29ad07(0x8b)](_0xb964e1);}else _0x4426d3=!_0x4426d3;}_0x24b958['targetObjects']=_0x5dc0fe,_0x24b958[_0x29ad07(0x11b)](_0x2c8fc9,_0x3b790c,_0x4426d3,_0x198b57,_0x188633),this[_0x29ad07(0x97)][_0x29ad07(0x17a)](_0x24b958),this[_0x29ad07(0xcf)][_0x29ad07(0x8e)](_0x24b958);},Spriteset_Base['prototype'][_0x15c6f8(0x10e)]=function(_0x7550e1){const _0x46fff4=_0x15c6f8,_0x92cfeb=[];for(const _0x2e6aac of _0x7550e1){if(_0x46fff4(0x137)==='bHTIo')try{_0x528059[_0x46fff4(0x14b)]=_0x47a6f2(_0x2c7a97['TargetY']);}catch(_0x167d59){if(_0x54b6f5[_0x46fff4(0xfd)]())_0x1a2824[_0x46fff4(0x8b)](_0x167d59);}else{const _0x5eb572=this[_0x46fff4(0x183)](_0x2e6aac);_0x5eb572&&_0x92cfeb['push'](_0x5eb572);}}return _0x92cfeb;},Spriteset_Base[_0x15c6f8(0xc0)][_0x15c6f8(0x183)]=function(_0x18ed8c){const _0x3d3eb8=_0x15c6f8;return this[_0x3d3eb8(0x136)][_0x3d3eb8(0x9b)][_0x3d3eb8(0xb6)](_0x1742e9=>_0x1742e9[_0x3d3eb8(0x101)]===_0x18ed8c);},Spriteset_Base[_0x15c6f8(0xc0)][_0x15c6f8(0xea)]=function(_0x233c4e){const _0x469986=_0x15c6f8;this['_animationSprites']['remove'](_0x233c4e),this['_pictureEffectsContainer'][_0x469986(0x17c)](_0x233c4e);for(const _0x545eda of _0x233c4e['targetObjects']){_0x545eda[_0x469986(0xaf)]&&_0x545eda[_0x469986(0xaf)]();}_0x233c4e[_0x469986(0x155)]();},VisuMZ[_0x15c6f8(0xa3)][_0x15c6f8(0x180)]=Spriteset_Base[_0x15c6f8(0xc0)][_0x15c6f8(0x13b)],Spriteset_Base[_0x15c6f8(0xc0)][_0x15c6f8(0x13b)]=function(){const _0x193324=_0x15c6f8;VisuMZ[_0x193324(0xa3)]['Spriteset_Base_removeAllAnimations'][_0x193324(0x19d)](this),this[_0x193324(0xd4)]();},Spriteset_Base['prototype'][_0x15c6f8(0xd4)]=function(){const _0x1b0cf7=_0x15c6f8;for(const _0x207357 of this[_0x1b0cf7(0xcf)]['clone']()){this[_0x1b0cf7(0xea)](_0x207357);}},Spriteset_Base[_0x15c6f8(0xc0)][_0x15c6f8(0x160)]=function(){const _0x3b495d=_0x15c6f8,_0x3e512e=this[_0x3b495d(0x97)];return _0x3e512e&&_0x3e512e[_0x3b495d(0x9b)][_0x3b495d(0x128)]>0x0;},VisuMZ['VNPictureBusts'][_0x15c6f8(0x105)]=Sprite_Animation[_0x15c6f8(0xc0)][_0x15c6f8(0x11e)],Sprite_Animation[_0x15c6f8(0xc0)]['targetSpritePosition']=function(_0x3ab5a1){const _0xd08ef9=_0x15c6f8;if(_0x3ab5a1['constructor']===Sprite_Picture){if(_0xd08ef9(0x90)==='KNOSs')this[_0xd08ef9(0xea)](_0x20dbfb);else{const _0x4fc139=new Point(0x0,0x0);let _0x13317b=0.5,_0x2d647a=0.5,_0x604fa5=0x0,_0x5b76d8=0x0;if(this[_0xd08ef9(0x82)]['alignBottom'])_0x2d647a=0x1;{if(_0xd08ef9(0xbf)===_0xd08ef9(0xbf)){const _0x273e4c=this[_0xd08ef9(0x82)]['name'];if(_0x273e4c[_0xd08ef9(0x7f)](/<(?:HEAD|HEADER|TOP)>/i))_0x2d647a=0x0;if(_0x273e4c[_0xd08ef9(0x7f)](/<(?:FOOT|FOOTER|BOTTOM)>/i))_0x2d647a=0x1;if(this['_animation'][_0xd08ef9(0x123)])_0x2d647a=0x1;if(_0x273e4c[_0xd08ef9(0x7f)](/<(?:LEFT)>/i))_0x13317b=0x0;if(_0x273e4c[_0xd08ef9(0x7f)](/<(?:RIGHT)>/i))_0x13317b=0x1;if(_0x273e4c[_0xd08ef9(0x7f)](/<ANCHOR X:[ ](\d+\.?\d*)>/i))_0x13317b=Number(RegExp['$1']);if(_0x273e4c[_0xd08ef9(0x7f)](/<ANCHOR Y:[ ](\d+\.?\d*)>/i))_0x2d647a=Number(RegExp['$1']);_0x273e4c[_0xd08ef9(0x7f)](/<ANCHOR:[ ](\d+\.?\d*),[ ](\d+\.?\d*)>/i)&&(_0x13317b=Number(RegExp['$1']),_0x2d647a=Number(RegExp['$2']));if(_0x273e4c[_0xd08ef9(0x7f)](/<OFFSET X:[ ]([\+\-]\d+)>/i))_0x604fa5=Number(RegExp['$1']);if(_0x273e4c[_0xd08ef9(0x7f)](/<OFFSET Y:[ ]([\+\-]\d+)>/i))_0x5b76d8=Number(RegExp['$1']);if(_0x273e4c[_0xd08ef9(0x7f)](/<OFFSET:[ ]([\+\-]\d+),[ ]([\+\-]\d+)>/i)){if(_0xd08ef9(0x13e)!==_0xd08ef9(0x13e)){const _0x25842b=_0x228e2a[_0xd08ef9(0x14e)](_0x3fe6ad[_0xd08ef9(0xe4)](_0x20d647)),_0x4a210b=_0x56c91c[_0xd08ef9(0x14e)](_0x2956f4[_0xd08ef9(0x156)](_0x5a9c64));_0x2c9ccc[_0x500d36]={'x':_0x25842b,'y':_0x4a210b};}else _0x604fa5=Number(RegExp['$1']),_0x5b76d8=Number(RegExp['$2']);}}else return _0xbd0b40[_0xd08ef9(0xc6)]&&_0x50f93e[_0xd08ef9(0xa1)][_0xd08ef9(0xcc)]('['+_0x3649e2+']');}return _0x4fc139['x']=(_0x13317b-_0x3ab5a1[_0xd08ef9(0x99)]['x'])*_0x3ab5a1[_0xd08ef9(0x1ab)]+_0x604fa5,_0x4fc139['y']=(_0x2d647a-_0x3ab5a1['anchor']['y'])*_0x3ab5a1[_0xd08ef9(0x176)]+_0x5b76d8,_0x3ab5a1['updateTransform'](),_0x3ab5a1[_0xd08ef9(0x115)][_0xd08ef9(0x8f)](_0x4fc139);}}else{if(_0xd08ef9(0xdb)===_0xd08ef9(0xf5)){const _0x2485a1=this[_0xd08ef9(0x145)]();this['x']=_0x2485a1['x'](),this['y']=_0x2485a1['y']();}else return VisuMZ[_0xd08ef9(0xa3)]['Sprite_Animation_targetSpritePosition'][_0xd08ef9(0x19d)](this,_0x3ab5a1);}};