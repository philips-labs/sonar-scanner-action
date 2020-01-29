# Sonar Scanner Action

A Github action for running static analysis on your codebase using SonarQube.


## Required parameters

| Parameter | Description                                                  |
| --------- | :----------------------------------------------------------- |
| app       | Your application's name in SonarQube                         |
| baseDir   | Your application sources or at least where the sonar.properties file is stored |
| login     | SonarQube login token                                        |
| url       | SonarQube server url                                         |
## Software Requirements

sonar-scanner needs to be available on the target system. There are several public actions that can ensure the availability of Sonar-scanner. 

