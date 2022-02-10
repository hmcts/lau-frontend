const execSync = require('child_process').execSync;
const readFileSync = require('fs').readFileSync;
const writeFileSync = require('fs').writeFileSync;

function getGitCommitHash() {
  return execSync('git rev-parse HEAD').toString().trim();
}

function getGitCommitDate() {
  return execSync('git log -1 --format=%cd').toString().trim();
}

function getAppVersion() {
  const packageJsonFilePath = `${process.env.NODE_PATH || '.'}/package.json`;
  const packageJsonData = JSON.parse(readFileSync(packageJsonFilePath));

  return packageJsonData.version;
}

function createVersionFile() {
  const versionFilePath = `${process.env.NODE_PATH || '.'}/version`;
  const fileData = {
    version: getAppVersion(),
    commit: getGitCommitHash(),
    date: getGitCommitDate(),
  };

  writeFileSync(versionFilePath, JSON.stringify(fileData));
}

createVersionFile();
