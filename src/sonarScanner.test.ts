import { sonarScanner } from './sonarScanner';
import { exec } from '@actions/exec';

jest.mock('@actions/exec');
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

describe('SonarQube Scanner Action', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env['INPUT_PROJECTNAME'] = 'HelloWorld';
    process.env['INPUT_PROJECTKEY'] = 'key';
    process.env['INPUT_BASEDIR'] = 'src/';
    process.env['INPUT_TOKEN'] = 'Dummy-Security-Token';
    process.env['INPUT_URL'] = 'http://example.com';
    process.env['INPUT_SCMPROVIDER'] = 'git';
    process.env['INPUT_SOURCEENCODING'] = 'UTF-8';
    process.env['INPUT_ENABLEPULLREQUESTDECORATION'] = 'false';
  });

  it.each`
    option                 | value
    ${'INPUT_PROJECTNAME'} | ${'projectName'}
    ${'INPUT_PROJECTKEY'}  | ${'projectKey'}
    ${'INPUT_TOKEN'}       | ${'token'}
    ${'INPUT_URL'}         | ${'url'}
  `(
    `should throw an error when the option $value is missing`,
    async ({ option, value }) => {
      expect.assertions(1);
      delete process.env[option];

      try {
        await sonarScanner();
      } catch (e) {
        expect(e.message).toContain(`not supplied: ${value}`);
      }
    },
  );

  it('starts the action when all parameters are set', async () => {
    await sonarScanner();
    expect(exec).toHaveBeenCalledWith('sonar-scanner', [
      '-Dsonar.login=Dummy-Security-Token',
      '-Dsonar.host.url=http://example.com',
      '-Dsonar.projectBaseDir=src/',
      '-Dsonar.projectKey=key',
      '-Dsonar.projectName=HelloWorld',
      '-Dsonar.scm.provider=git',
      '-Dsonar.sourceEncoding=UTF-8',
    ]);
  });

  it('throws an error when SonarQube fails', async () => {
    expect.assertions(1);

    const mockedExec = exec as jest.Mock<Promise<number>>;
    mockedExec.mockImplementation(() => {
      return new Promise((reject) => {
        reject(1);
      });
    });

    try {
      await sonarScanner();
    } catch (e) {
      expect(e.message).toBe('SonarScanner failed');
    }
  });

  describe('Pull Request', () => {
    beforeEach(() => {
      jest.resetModules();
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
});
