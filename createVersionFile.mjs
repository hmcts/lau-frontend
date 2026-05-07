import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';


function runGitCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (e) {
    console.log(`Failed to run git command "${command}": `, e);
    return 'unknown';
  }
}

function getCommitHash() {
  return runGitCommand('git rev-parse HEAD');
}

function getCommitDate() {
  const date = runGitCommand('git log -1 --format=%cI');

  return date !== 'unknown' ? new Date(date).toUTCString() : 'unknown';
}

function getAppVersion() {
  const packageJsonFilePath = `${process.env.NODE_PATH || '.'}/package.json`;
  const packageJsonData = JSON.parse(readFileSync(packageJsonFilePath));
  return packageJsonData.version;
}

function createVersionFile() {
  const versionFilePath = `${process.env.NODE_PATH || '.'}/version`;

  const content = [
    `version: ${getAppVersion()}`,
    `commit: ${getCommitHash()}`,
    `date: ${getCommitDate()}`,
    '',
  ].join('\n');

  writeFileSync(versionFilePath, content);

}

createVersionFile();
