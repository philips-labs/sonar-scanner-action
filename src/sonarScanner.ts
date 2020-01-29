import * as core from '@actions/core';
import { exec } from '@actions/exec';

export const sonarScanner = async () => {
  const appName = core.getInput('app', { required: true });
  const baseDir = core.getInput('baseDir', { required: true });
  const token = core.getInput('token', { required: true });
  const url = core.getInput('url', { required: true });

  core.startGroup('Running SonarQube');
  const errorCode = await exec('sonar-scanner', [
    `-Dsonar.login="${token}"`,
    `-Dsonar.host.url="${url}"`,
    `-Dsonar.projectBaseDir="${baseDir}"`,
    `-Dsonar.projectKey="${appName}"`,
    `-Dsonar.projectName="${appName}"`,
    `-Dsonar.scm.provider=git`,
    `-Dsonar.sourceEncoding=UTF-8`,
  ]);

  if (errorCode === 1) {
    throw new Error('SonarScanner failed');
  }

  core.endGroup();
};
