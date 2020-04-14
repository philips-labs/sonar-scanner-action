import * as core from '@actions/core';
import { context } from '@actions/github';
import { exec } from '@actions/exec';

export const sonarScanner = async () => {
  const projectName = core.getInput('projectName', { required: true });
  const projectKey = core.getInput('projectKey', { required: true });
  const baseDir = core.getInput('baseDir', { required: true });
  const token = core.getInput('token', { required: true });
  const url = core.getInput('url', { required: true });
  const scmProvider = core.getInput('scmProvider', { required: true });
  const sourceEncoding = core.getInput('sourceEncoding', { required: false });
  const enablePullRequestDecoration = JSON.parse(
    core.getInput('enablePullRequestDecoration', { required: false }),
  );

  const sonarParameters: string[] = [
    `-Dsonar.login=${token}`,
    `-Dsonar.host.url=${url}`,
    `-Dsonar.projectBaseDir=${baseDir}`,
    `-Dsonar.projectKey=${projectKey}`,
    `-Dsonar.projectName=${projectName}`,
    `-Dsonar.scm.provider=${scmProvider}`,
    `-Dsonar.sourceEncoding=${sourceEncoding}`,
  ];

  core.info(`
    Using Configuration:

    ProjectName                 : ${projectName}
    ProjectKey                  : ${projectKey}
    BaseDir                     : ${baseDir}
    Token                       : ${token}
    URL                         : ${url}
    scmProvider                 : ${scmProvider}
    sourceEncoding              : ${sourceEncoding}
    enablePullRequestDecoration : ${enablePullRequestDecoration}
  `);

  const pr: any = context.payload.pull_request;

  if (enablePullRequestDecoration && pr) {
    core.info(`
    -- Configuration for pull request decoration:
       Pull request number       : ${pr.number}
       Pull request branch       : ${pr.base.ref}
       Pull request base branch  : ${pr.head.ref}
    `);

    sonarParameters.push(`-Dsonar.pullrequest.key=${pr.number}`);
    sonarParameters.push(`-Dsonar.pullrequest.base=${pr.base.ref}`);
    sonarParameters.push(`-Dsonar.pullrequest.branch=${pr.head.ref}`);
  }

  core.startGroup('Running SonarQube');
  core.debug(
    `Running SonarQube with parameters: ${sonarParameters.join(', ')}`,
  );
  const errorCode = await exec('sonar-scanner', sonarParameters);

  if (errorCode === 1) {
    core.setFailed('SonarScanner failed.');
    throw new Error('SonarScanner failed');
  }

  core.endGroup();
};
