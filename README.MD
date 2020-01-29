# Sonar Scanner Action

A Github action for running static analysis on your codebase using SonarQube.


Required Parameters from your pipeline:

| Parameter | Description                                                  |
| --------- | :----------------------------------------------------------- |
| app       | Your application's name in SonarQube                         |
| baseDir   | Your application sources or at least where the sonar.properties file is stored |
| login     | SonarQube login token                                        |
| url       | SonarQube server url                                         |


