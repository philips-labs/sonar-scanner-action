import { sonarScanner } from './src/sonarScanner';
import * as core from '@actions/core';
import github from '@actions/github';

async function run(): Promise<void> {
  try {
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload)
    console.log(`The event payload: ${payload}`);

    await sonarScanner();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
