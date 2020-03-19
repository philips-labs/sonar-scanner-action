"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec_1 = require("@actions/exec");
exports.sonarScanner = async () => {
    const projectName = core.getInput('projectName', { required: true });
    const projectKey = core.getInput('projectKey', { required: true });
    const baseDir = core.getInput('baseDir', { required: true });
    const token = core.getInput('token', { required: true });
    const url = core.getInput('url', { required: true });
    core.info(`
    Using Configuration:

    ProjectName: ${projectName}
    ProjectKey:  ${projectKey}
    BaseDir:     ${baseDir}
    Token:       ${token}
    URL:         ${url}
  `);
    core.startGroup('Running SonarQube');
    const errorCode = await exec_1.exec('sonar-scanner', [
        `-Dsonar.login="${token}"`,
        `-Dsonar.host.url=${url}`,
        `-Dsonar.projectBaseDir="${baseDir}"`,
        `-Dsonar.projectKey="${projectKey}"`,
        `-Dsonar.projectName="${projectName}"`,
        `-Dsonar.scm.provider=git`,
        `-Dsonar.sourceEncoding=UTF-8`,
    ]);
    if (errorCode === 1) {
        throw new Error('SonarScanner failed');
    }
    core.endGroup();
};
