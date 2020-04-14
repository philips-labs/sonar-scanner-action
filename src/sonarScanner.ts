import * as core from '@actions/core';
import { context } from '@actions/github';
import { exec } from '@actions/exec';

jest.mock('@actions/github', () => ({
  ...jest.requireActual('@actions/github'),
  context: {
    payload: {
      pull_request: {
        number: 101,
        base: {
          ref: 'master',
        },
        head: {
          ref: 'feature/featureX',
        },
      },
    },
  },
}));

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
  core.debug('Running SonarQube with parameters: ${sonarParameters}');
  const errorCode = await exec('sonar-scanner', sonarParameters);

  if (errorCode === 1) {
    core.setFailed('SonarScanner failed.');
    throw new Error('SonarScanner failed');
  }

  core.endGroup();
};

describe('SonarQube Scanner Action for a Pull Request', () => {
  beforeEach(() => {
    process.env['INPUT_PROJECTNAME'] = 'HelloWorld';
    process.env['INPUT_PROJECTKEY'] = 'key';
    process.env['INPUT_BASEDIR'] = '.';
    process.env['INPUT_TOKEN'] = 'Dummy-Security-Token';
    process.env['INPUT_URL'] = 'http://example.com';
    process.env['INPUT_SCMPROVIDER'] = 'git';
    process.env['INPUT_SOURCEENCODING'] = 'UTF-8';
  });

  it('starts the action for pull request decoration.', async () => {
    process.env['INPUT_ENABLEPULLREQUESTDECORATION'] = 'true';

    await sonarScanner();
    expect(exec).toHaveBeenCalledWith('sonar-scanner', [
      '-Dsonar.login=Dummy-Security-Token',
      '-Dsonar.host.url=http://example.com',
      '-Dsonar.projectBaseDir=.',
      '-Dsonar.projectKey=key',
      '-Dsonar.projectName=HelloWorld',
      '-Dsonar.scm.provider=git',
      '-Dsonar.sourceEncoding=UTF-8',
      '-Dsonar.pullrequest.key=101',
      '-Dsonar.pullrequest.base=master',
      '-Dsonar.pullrequest.branch=feature/featureX',
    ]);
  });

  it('starts the action for pull request without decoration.', async () => {
    process.env['INPUT_ENABLEPULLREQUESTDECORATION'] = 'false';

    await sonarScanner();
    expect(exec).toHaveBeenCalledWith('sonar-scanner', [
      '-Dsonar.login=Dummy-Security-Token',
      '-Dsonar.host.url=http://example.com',
      '-Dsonar.projectBaseDir=.',
      '-Dsonar.projectKey=key',
      '-Dsonar.projectName=HelloWorld',
      '-Dsonar.scm.provider=git',
      '-Dsonar.sourceEncoding=UTF-8',
    ]);
  });
});
