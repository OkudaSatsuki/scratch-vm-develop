const Cast = require('../util/cast');
const MathUtil = require('../util/math-util');
const Timer = require('../util/timer');

const STORE_WAITING = true;

class Scratch3RubyBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.waitingSounds = {};
        this.stopAllSounds = this.stopAllSounds.bind(this);
        this._stopWaitingSoundsForTarget = this._stopWaitingSoundsForTarget.bind(this);
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives () {
        return {
            mrubyc_gpio_set_level: this.gpio_set_level,
            mrubyc_sw_state: this.sw_state,
            mrubyc_gpio_sound: this.gpio_sound
        };
    }

    gpio_set_level (args, util) {
        let broadcastVar 
        switch (args.PIN){
            case "13":
                if(args.STATE == 1){
                    broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
                    ":fg=#PIt?O]H1R3bL|-@", "LED1_ON");
                } else{
                    broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
                    "jB.Bmtf8#Pn;l+#j-nv5", "LED1_OFF");
                }
                break;
            case "12":
                if(args.STATE == 1){
                    broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
                    ":T+Vnb,60ETE?k{q42Y(", "LED2_ON");
                } else{
                    broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
                    "d$Jcxp2k.s!)}5Tk:)7n", "LED2_OFF",);
                }
                break;
            case "14":
                if(args.STATE == 1){
                    broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
                    "eD{PS`Gpiq?QY(z=Vud^", "LED3_ON");
                } else{
                    broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
                    "V7QLZ[!28SwYKC%9Qt%!", "LED3_OFF");
                }
                break;
            case "27":
                if(args.STATE == 1){
                    broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
                    "r|tlChnUw_;_;TX_6su,", "LED4_ON");
                } else{
                    broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
                    "?X@rIW{M*pm#Tl$]N5`s", "LED4_OFF",);
                }
                break;
            case "26":
                if(args.STATE == 1){
                    broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
                    "B}E@~Q=*9v)Q|QhBany|", "LED5_ON");
                } else{
                    broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
                    "-3i=x%d@1~aP?_SyTjhE", "LED5_OFF");
                }
                break;
            case "25":
                if(args.STATE == 1){
                    broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
                    "-lki(J];7/dzM!0G.U3Y", "LED6_ON");
                } else{
                    broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
                    "t?QmJ9t,~*.sBC6m7W=`", "LED6_OFF");
                }
                break;
            case "33":
                if(args.STATE == 1){
                    broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
                    "rD9XH8C74/x.YCqs+Cpl", "LED7_ON");
                } else{
                    broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
                    "gE2-xX`w}*1?g(5r|NRi", "LED7_OFF");
                }
                break;
            case "32":
                if(args.STATE == 1){
                    broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
                    "ZIgJ1z}XX9J{Y?s:/SKI", "LED8_ON");
                } else{
                    broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
                    "AkLpZaK0[C]$Q?S`Wht?", "LED8_OFF");
                }
        }
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }
    sw_state (args, util) {
        let variable;
        switch(args.SW){
            case '34':
                variable = util.target.lookupOrCreateVariable(
                    '@nQP*7F(2o3MmbwmSca[', 'SW1');
                break;
            case '35':
                variable = util.target.lookupOrCreateVariable(
                    '7b,Kl9om_IBH!zsGN^@a', 'SW2');
                break;
            case '18':
                variable = util.target.lookupOrCreateVariable(
                    'H~`ef]DRRjb+Y)0Nas;z', 'SW3');
                break;
            case '19':
                variable = util.target.lookupOrCreateVariable(
                    'Py%2VX0mW0*Q%Hg2O(XM', 'SW4');
                break;
        }
        return variable.value;
    }
    gpio_sound (args, util) {
        this._playSound(args.SOUND, util,);
        setTimeout(this.stopAllSounds,Cast.toNumber(args.TIME));
    }
    _playSound(args, util, store_waiting) {
        let index;
        switch(args){
            case '261':
                index = this._getSoundIndex("c3", util);
                break;
            case '294':
                index = this._getSoundIndex("d3", util);
                break;
            case '329':
                index = this._getSoundIndex("e3", util);
                break;
            case '349':
                index = this._getSoundIndex("f3", util);
                break;
            case '391':
                    index = this._getSoundIndex("g3", util);
                    break;
            case '440':
                    index = this._getSoundIndex("a3", util);
                    break;
            case '493':
                    index = this._getSoundIndex("b3", util);
                    break;
            case '523':
                    index = this._getSoundIndex("c4", util);
                    break;
        } 
        if (index >= 0) {
            const {target} = util;
            const {sprite} = target;
            const {soundId} = sprite.sounds[index];
            if (sprite.soundBank) {
                if (store_waiting === STORE_WAITING) {
                    this._addWaitingSound(target.id, soundId);
                } else {
                    this._removeWaitingSound(target.id, soundId);
                }
                return sprite.soundBank.playSound(target, soundId);
            }
        }
    }

    _addWaitingSound (targetId, soundId) {
        if (!this.waitingSounds[targetId]) {
            this.waitingSounds[targetId] = new Set();
        }
        this.waitingSounds[targetId].add(soundId);
    }

    _removeWaitingSound (targetId, soundId) {
        if (!this.waitingSounds[targetId]) {
            return;
        }
        this.waitingSounds[targetId].delete(soundId);
    }

    _getSoundIndex (soundName, util) {
        // if the sprite has no sounds, return -1
        const len = util.target.sprite.sounds.length;
        if (len === 0) {
            return -1;
        }

        // look up by name first
        const index = this.getSoundIndexByName(soundName, util);
        if (index !== -1) {
            return index;
        }

        // then try using the sound name as a 1-indexed index
        const oneIndexedIndex = parseInt(soundName, 10);
        if (!isNaN(oneIndexedIndex)) {
            return MathUtil.wrapClamp(oneIndexedIndex - 1, 0, len - 1);
        }

        // could not be found as a name or converted to index, return -1
        return -1;
    }

    getSoundIndexByName (soundName, util) {
        const sounds = util.target.sprite.sounds;
        for (let i = 0; i < sounds.length; i++) {
            if (sounds[i].name === soundName) {
                return i;
            }
        }
        // if there is no sound by that name, return -1
        return -1;
    }

    stopAllSounds () {
        if (this.runtime.targets === null) return;
        const allTargets = this.runtime.targets;
        for (let i = 0; i < allTargets.length; i++) {
            this._stopAllSoundsForTarget(allTargets[i]);
        }
    }

    _stopAllSoundsForTarget (target) {
        if (target.sprite.soundBank) {
            target.sprite.soundBank.stopAllSounds(target);
            if (this.waitingSounds[target.id]) {
                this.waitingSounds[target.id].clear();
            }
        }
    }

    _stopWaitingSoundsForTarget (target) {
        if (target.sprite.soundBank) {
            if (this.waitingSounds[target.id]) {
                for (const soundId of this.waitingSounds[target.id].values()) {
                    target.sprite.soundBank.stop(target, soundId);
                }
                this.waitingSounds[target.id].clear();
            }
        }
    }
}

module.exports = Scratch3RubyBlocks;
