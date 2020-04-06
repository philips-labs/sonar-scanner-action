"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sonarScanner_1 = require("./src/sonarScanner");
const core = __importStar(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
async function run() {
    try {
        // Get the JSON webhook payload for the event that triggered the workflow
        const payload = JSON.stringify(github_1.default.context.payload);
        console.log(`The event payload: ${payload}`);
        await sonarScanner_1.sonarScanner();
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
