import { sonarScanner } from './src/sonarScanner';
import { exec } from '@actions/exec';

jest.mock('@actions/exec');

describe('SonarQube Scanner Action', () => {
  it('should throw an error when the app parameter is missing', async () => {
    try {
      await sonarScanner();
    } catch (e) {
      expect(e.message).toContain('not supplied: app');
    }
  });

  it('should throw an error when the baseDir parameter is missing', async () => {
    process.env['INPUT_APP'] = 'HelloWorld';

    try {
      await sonarScanner();
    } catch (e) {
      expect(e.message).toContain('not supplied: baseDir');
    }
  });

  it('should throw an error when the token parameter is missing', async () => {
    process.env['INPUT_APP'] = 'HelloWorld';
    process.env['INPUT_BASEDIR'] = 'src/';

    try {
      await sonarScanner();
    } catch (e) {
      expect(e.message).toContain('not supplied: token');
    }
  });

  it('should throw an error when the SonarQube URL parameter is missing', async () => {
    process.env['INPUT_APP'] = 'HelloWorld';
    process.env['INPUT_BASEDIR'] = 'src/';
    process.env['INPUT_TOKEN'] = 'Dummy-Security-Token';

    try {
      await sonarScanner();
    } catch (e) {
      expect(e.message).toContain('not supplied: url');
    }
  });

  it('starts the action when all parameters are set', async () => {
    process.env['INPUT_APP'] = 'HelloWorld';
    process.env['INPUT_BASEDIR'] = 'src/';
    process.env['INPUT_TOKEN'] = 'Dummy-Security-Token';
    process.env['INPUT_URL'] = 'http://example.com';

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
    process.env['INPUT_APP'] = 'HelloWorld';
    process.env['INPUT_BASEDIR'] = 'src/';
    process.env['INPUT_TOKEN'] = 'Dummy-Security-Token';
    process.env['INPUT_URL'] = 'http://example.com';

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
