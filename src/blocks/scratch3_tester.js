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
const STORE_WAITING = true;

class Scratch3TesterBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;


    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives () {
        return {
            init_figure_number: this.tester_zuban,
            test_finish: this.tester_test_finish,
            measure_range_check: this.tester_measure_range_check,
            choose_number: this.tester_choose_number,
            choose_item: this.tester_choose_item,
            set_clock: this.tester_set_clock,
            test_mode: this.tester_test_mode,
            key_push: this.tester_key_push,
            test_result: this.tester_test_result,
            load_output_off: this.tester_load_output_off,
            resistance_output: this.tester_resistance_output,
            resistance_output_k: this.tester_resistance_output_k,
            voltage_output_m: this.tester_voltage_output_m,
            voltage_output: this.tester_voltage_output,
            current_output_m: this.tester_current_output_m,
            pt_output: this.tester_pt_output,
            k_output: this.tester_k_output,
            connection_off: this.tester_connection_off,
            connection_change: this.tester_connection_change
        };
    }

    tester_zuban(args, util) {
        let broadcastVar
        broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
            "OtY)I@9bA@qCCrI%uhb[", "zuban");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

    tester_test_finish(args, util) {
        let broadcastVar
        broadcastVa2r = util.runtime.getTargetForStage().lookupBroadcastMsg(
            "Hw%^=btylCHTYm{j_Bc/", "test_finish");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

    tester_measure_range_check(args, util) {
        let broadcastVar
        broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
            "0[%ROq{PwCS6EqEEny)y", "measure_range");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

    tester_choose_number(args, util) {
        let broadcastVar
        broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
            "|NkVF~A-auYQF;rf.f`q", "test_num");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

    tester_choose_item(args, util) {
        let broadcastVar
        broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
            "m:E{p~yJON*EDvzXE#/=", "test_list");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

    tester_set_clock(args, util) {
        let broadcastVar
        broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
            "*;Ux[[9v`aIWHN%Sb25u", "clock_check");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

    tester_test_mode(args, util) {
        let broadcastVar
        broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
            ".hPeE|HLUqIp1cIr9m{D", "test_start");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

    tester_key_push(args, util) {
        let broadcastVar
        broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
            "ERr^5y#FezBPsR`y9rZ3", "key_push");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

    tester_test_result(args, util) {
        let broadcastVar
        broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
            "E,NA4t7$,P-X6UoiS,g,", "test_result");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

    tester_load_output_off(args, util) {
        let broadcastVar
        broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
            "y$V^8G0+?SDWB[1zW-^Q", "dummy_off");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

    tester_resistance_output(args, util) {
        let broadcastVar
        broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
            "N$_X?^!0#?7awcsB^QzF", "resistance");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

    tester_resistance_output_k(args, util) {
        let broadcastVar
        broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
            "Jn?fFo.M2KHonHD{jc}a", "resistance_k");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

    tester_voltage_output_m(args, util) {
        let broadcastVar
        broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
            "Wy(Oah!xP)ab4)`9s%q4", "voltage_m");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

    tester_voltage_output(args, util) {
        let broadcastVar
        broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
            "Yk2iT45EWLVwMgy#6b;9", "voltage");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

    tester_current_output_m(args, util) {
        let broadcastVar
        broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
            "Zx2zPo%Ops4s9~O35.pu", "ampare_m");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

    tester_pt_output(args, util) {
        let broadcastVar
        broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
            "]zL*oSF3yc%+XhQ7nM)3", "pt_100");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

    tester_k_output(args, util) {
        let broadcastVar
        broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
            "R9X|aU=^@.qftdN^gfCW", "k_thermo");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

    tester_connection_off(args, util) {
        let broadcastVar
        broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
            "d?uu6S.Tpao+c5v0K~P+", "connection_off");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

    tester_connection_change(args, util) {
        let broadcastVar
        broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg(
            "**oTu1WO[~do-)cOCpB@", "connection_change");
        if (broadcastVar) {
            const broadcastOption = broadcastVar.name;
            util.startHats('event_whenbroadcastreceived', {
                BROADCAST_OPTION: broadcastOption
            });
        }
    }

}

module.exports = Scratch3TesterBlocks;

