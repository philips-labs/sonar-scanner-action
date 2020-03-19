# Sonar Scanner Action

A Github action for running static analysis on your codebase using SonarQube inside a Docker container.

## Required parameters

| Parameter   | Description                                                |
| ----------- | :--------------------------------------------------------- |
| projectName | Your application's name in SonarQube                       |
| projectKey  | Unique value for your project in SonarQube                 |
| baseDir     | Relative path to your sonar.properties file (default: `.`) |
| token       | SonarQube login token                                      |
| url         | SonarQube server url                                       |

## Sample Configuration

To prevent your token from showing in the runner's output, it is advised to store the token configuration inside of a github secret variable.

The listing below uses the secret `SONARQUBE_TOKEN` from your project's configuration.

```yml
sonarqube:
  name: SonarQube
  runs-on: self-hosted
  steps:
    - uses: philips-labs/sonar-scanner-action@v1
      with:
        app: Control Tower Backend
        baseDir: .
        token: ${{ secrets.SONARQUBE_TOKEN }}
        projectName: Your Project Name
        projectKey: project.key.from.sonar.qube
        url: https://your.sonar.instance.io/
```
