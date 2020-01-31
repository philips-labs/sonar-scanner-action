import { sonarScanner } from './sonarScanner';
import { exec } from '@actions/exec';

jest.mock('@actions/exec');

describe('SonarQube Scanner Action', () => {
  beforeEach(() => {
    process.env['INPUT_APP'] = 'HelloWorld';
    process.env['INPUT_BASEDIR'] = 'src/';
    process.env['INPUT_TOKEN'] = 'Dummy-Security-Token';
    process.env['INPUT_URL'] = 'http://example.com';
  });

  it.each`
    option             | value
    ${'INPUT_BASEDIR'} | ${'baseDir'}
    ${'INPUT_APP'}     | ${'app'}
    ${'INPUT_TOKEN'}   | ${'token'}
    ${'INPUT_URL'}     | ${'url'}
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
      '-Dsonar.login="Dummy-Security-Token"',
      '-Dsonar.host.url="http://example.com"',
      '-Dsonar.projectBaseDir="src/"',
      '-Dsonar.projectKey="HelloWorld"',
      '-Dsonar.projectName="HelloWorld"',
      '-Dsonar.scm.provider=git',
      '-Dsonar.sourceEncoding=UTF-8',
    ]);
  });

  it('throws an error when SonarQube fails', async () => {
    expect.assertions(1);

    const mockedExec = exec as jest.Mock<Promise<number>>;
    mockedExec.mockImplementation(() => {
      return new Promise(reject => {
        reject(1);
      });
    });

    try {
      await sonarScanner();
    } catch (e) {
      expect(e.message).toBe('SonarScanner failed');
    }
  });
});
