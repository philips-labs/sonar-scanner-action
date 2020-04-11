# Sonar Scanner Action

A Github action for running static analysis on your codebase using SonarQube inside a Docker container.

## Required parameters

| Parameter                   | Description                                                              | required | default |
| --------------------------- | :----------------------------------------------------------------------- | -------- | ------- |
| projectName                 | Your application's name in SonarQube                                     | yes      |         |
| projectKey                  | Unique value for your project in SonarQube                               | yes      |         |
| baseDir                     | Relative path to your sonar.properties file (default: `.`)               | no       | `.`     |
| token                       | SonarQube login token                                                    | yes      |         |
| url                         | SonarQube server url                                                     | yes      |         |
| scmPovider                  | SCM provider                                                             | no       | `git`   |
| sourceEncoding              | Encoding of the source files                                             | no       | `UTF-8` |
| enablePullRequestDecoration | Decorate a pull request. PR, branch and base are extracted from the pull | no       | `false` |

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
        token: ${{ secrets.SONARQUBE_TOKEN }}
        projectName: My Project Name
        projectKey: project.key.from.sonar.qube
        url: https://your.sonar.instance.io/
```

An example for decorating a pull request looks as follow.

```yml
on:
  push:
  pull_request:

  name: SonarQube
  runs-on: self-hosted
  steps:
    - uses: philips-labs/sonar-scanner-action@v1
      with:
        token: ${{ secrets.SONARQUBE_TOKEN }}
        projectName: My Project Name
        projectKey: project.key.from.sonar.qube
        url: https://your.sonar.instance.io/
        enablePullRequestDecoration: true
```
