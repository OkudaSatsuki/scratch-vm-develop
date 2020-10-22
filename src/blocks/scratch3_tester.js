const Cast = require('../util/cast');
const Clone = require('../util/clone');
const RenderedTarget = require('../sprites/rendered-target');
const uid = require('../util/uid');
const StageLayering = require('../engine/stage-layering');
const getMonitorIdForBlockWithArgs = require('../util/get-monitor-id');
const MathUtil = require('../util/math-util');

/**
 * @typedef {object} BubbleState - the bubble state associated with a particular target.
 * @property {Boolean} onSpriteRight - tracks whether the bubble is right or left of the sprite.
 * @property {?int} drawableId - the ID of the associated bubble Drawable, null if none.
 * @property {string} text - the text of the bubble.
 * @property {string} type - the type of the bubble, "say" or "think"
 * @property {?string} usageId - ID indicating the most recent usage of the say/think bubble.
 *      Used for comparison when determining whether to clear a say/think bubble.
 */

class Scratch3TesterBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        this._onTargetChanged = this._onTargetChanged.bind(this);
        this._onResetBubbles = this._onResetBubbles.bind(this);
        this._onTargetWillExit = this._onTargetWillExit.bind(this);
        this._updateBubble = this._updateBubble.bind(this);

        // Reset all bubbles on start/stop
        //this.runtime.on('PROJECT_STOP_ALL', this._onResetBubbles);
        //this.runtime.on('targetWasRemoved', this._onTargetWillExit);

        // Enable other blocks to use bubbles like ask/answer
        this.runtime.on('SAY', this._updateBubble);
    }

    /**
     * The default bubble state, to be used when a target has no existing bubble state.
     * @type {BubbleState}
     */
    static get DEFAULT_BUBBLE_STATE () {
        return {
            drawableId: null,
            onSpriteRight: true,
            skinId: null,
            text: '',
            type: 'say',
            usageId: null
        };
    }

    /**
     * The key to load & store a target's bubble-related state.
     * @type {string}
     */
    static get STATE_KEY () {
        return 'Scratch.looks';
    }

    /**
     * Limit for say bubble string.
     * @const {string}
     */
    static get SAY_BUBBLE_LIMIT () {
        return 330;
    }

    /**
     * Limit for ghost effect
     * @const {object}
     */
    static get EFFECT_GHOST_LIMIT (){
        return {min: 0, max: 100};
    }

    /**
     * Limit for brightness effect
     * @const {object}
     */
    static get EFFECT_BRIGHTNESS_LIMIT (){
        return {min: -100, max: 100};
    }

    /**
     * @param {Target} target - collect bubble state for this target. Probably, but not necessarily, a RenderedTarget.
     * @returns {BubbleState} the mutable bubble state associated with that target. This will be created if necessary.
     * @private
     */
    _getBubbleState (target) {
        let bubbleState = target.getCustomState(Scratch3TesterBlocks.STATE_KEY);
        if (!bubbleState) {
            bubbleState = Clone.simple(Scratch3TesterBlocks.DEFAULT_BUBBLE_STATE);
            target.setCustomState(Scratch3TesterBlocks.STATE_KEY, bubbleState);
        }
        return bubbleState;
    }

    /**
     * Handle a target which has moved.
     * @param {RenderedTarget} target - the target which has moved.
     * @private
     */
    _onTargetChanged (target) {
        const bubbleState = this._getBubbleState(target);
        if (bubbleState.drawableId) {
            this._positionBubble(target);
        }
    }

    /**
     * Handle a target which is exiting.
     * @param {RenderedTarget} target - the target.
     * @private
     */
    _onTargetWillExit (target) {
        const bubbleState = this._getBubbleState(target);
        if (bubbleState.drawableId && bubbleState.skinId) {
            this.runtime.renderer.destroyDrawable(bubbleState.drawableId, StageLayering.SPRITE_LAYER);
            this.runtime.renderer.destroySkin(bubbleState.skinId);
            bubbleState.drawableId = null;
            bubbleState.skinId = null;
            this.runtime.requestRedraw();
        }
        target.removeListener(RenderedTarget.EVENT_TARGET_VISUAL_CHANGE, this._onTargetChanged);
    }

    /**
     * Handle project start/stop by clearing all visible bubbles.
     * @private
     */
    _onResetBubbles () {
        for (let n = 0; n < this.runtime.targets.length; n++) {
            const bubbleState = this._getBubbleState(this.runtime.targets[n]);
            bubbleState.text = '';
            this._onTargetWillExit(this.runtime.targets[n]);
        }
        clearTimeout(this._bubbleTimeout);
    }

    /**
     * Position the bubble of a target. If it doesn't fit on the specified side, flip and rerender.
     * @param {!Target} target Target whose bubble needs positioning.
     * @private
     */
    _positionBubble (target) {
        if (!target.visible) return;
        const bubbleState = this._getBubbleState(target);
        const [bubbleWidth, bubbleHeight] = this.runtime.renderer.getCurrentSkinSize(bubbleState.drawableId);
        let targetBounds;
        try {
            targetBounds = target.getBoundsForBubble();
        } catch (error_) {
            // Bounds calculation could fail (e.g. on empty costumes), in that case
            // use the x/y position of the target.
            targetBounds = {
                left: target.x,
                right: target.x,
                top: target.y,
                bottom: target.y
            };
        }
        const stageSize = this.runtime.renderer.getNativeSize();
        const stageBounds = {
            left: -stageSize[0] / 2,
            right: stageSize[0] / 2,
            top: stageSize[1] / 2,
            bottom: -stageSize[1] / 2
        };
        if (bubbleState.onSpriteRight && bubbleWidth + targetBounds.right > stageBounds.right &&
            (targetBounds.left - bubbleWidth > stageBounds.left)) { // Only flip if it would fit
            bubbleState.onSpriteRight = false;
            this._renderBubble(target);
        } else if (!bubbleState.onSpriteRight && targetBounds.left - bubbleWidth < stageBounds.left &&
            (bubbleWidth + targetBounds.right < stageBounds.right)) { // Only flip if it would fit
            bubbleState.onSpriteRight = true;
            this._renderBubble(target);
        } else {
            this.runtime.renderer.updateDrawableProperties(bubbleState.drawableId, {
                position: [
                    bubbleState.onSpriteRight ? (
                        Math.max(
                            stageBounds.left, // Bubble should not extend past left edge of stage
                            Math.min(stageBounds.right - bubbleWidth, targetBounds.right)
                        )
                    ) : (
                        Math.min(
                            stageBounds.right - bubbleWidth, // Bubble should not extend past right edge of stage
                            Math.max(stageBounds.left, targetBounds.left - bubbleWidth)
                        )
                    ),
                    // Bubble should not extend past the top of the stage
                    Math.min(stageBounds.top, targetBounds.bottom + bubbleHeight)
                ]
            });
            this.runtime.requestRedraw();
        }
    }

    /**
     * Create a visible bubble for a target. If a bubble exists for the target,
     * just set it to visible and update the type/text. Otherwise create a new
     * bubble and update the relevant custom state.
     * @param {!Target} target Target who needs a bubble.
     * @return {undefined} Early return if text is empty string.
     * @private
     */
    _renderBubble (target) {
        if (!this.runtime.renderer) return;

        const bubbleState = this._getBubbleState(target);
        const {type, text, onSpriteRight} = bubbleState;

        // Remove the bubble if target is not visible, or text is being set to blank.
        if (!target.visible || text === '') {
            this._onTargetWillExit(target);
            return;
        }

        if (bubbleState.skinId) {
            this.runtime.renderer.updateTextSkin(bubbleState.skinId, type, text, onSpriteRight, [0, 0]);
        } else {
            target.addListener(RenderedTarget.EVENT_TARGET_VISUAL_CHANGE, this._onTargetChanged);
            bubbleState.drawableId = this.runtime.renderer.createDrawable(StageLayering.SPRITE_LAYER);
            bubbleState.skinId = this.runtime.renderer.createTextSkin(type, text, bubbleState.onSpriteRight, [0, 0]);
            this.runtime.renderer.updateDrawableProperties(bubbleState.drawableId, {
                skinId: bubbleState.skinId
            });
        }

        this._positionBubble(target);
    }

    /**
     * The entry point for say/think blocks. Clears existing bubble if the text is empty.
     * Set the bubble custom state and then call _renderBubble.
     * @param {!Target} target Target that say/think blocks are being called on.
     * @param {!string} type Either "say" or "think"
     * @param {!string} text The text for the bubble, empty string clears the bubble.
     * @private
     */
    _updateBubble (target, type, text) {
        const bubbleState = this._getBubbleState(target);
        bubbleState.type = type;
        bubbleState.text = text;
        bubbleState.usageId = uid();
        this._renderBubble(target);
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives () {
        return {
            tester_test_result: this.test_result
        };
    }

    test_result (args, util) {
        this._say(args,util);
    }

    _say (args, util) {
        const { exec } = require('child_process');
        
        // @TODO in 2.0 calling say/think resets the right/left bias of the bubble
        let message = args.TEST_RESULT;
        if (typeof message === 'number') {
            message = parseFloat(message.toFixed(2));
        }
        message = String(message).substr(0, Scratch3TesterBlocks.SAY_BUBBLE_LIMIT);
        this.runtime.emit('SAY', util.target, 'say', message);
    }
}

module.exports = Scratch3TesterBlocks;

