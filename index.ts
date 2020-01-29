import { sonarScanner } from './src/sonarScanner';
import * as core from '@actions/core';

async function run(): Promise<void> {
  try {
    sonarScanner();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
