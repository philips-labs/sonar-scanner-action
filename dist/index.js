"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sonarScanner_1 = require("./src/sonarScanner");
const core = __importStar(require("@actions/core"));
async function run() {
    try {
        sonarScanner_1.sonarScanner();
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
