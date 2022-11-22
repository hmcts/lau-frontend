const git = require('git-rev-sync');
const yaml = require('js-yaml');
const readFileSync = require('fs').readFileSync;
const writeFileSync = require('fs').writeFileSync;

function getCommitHash() {
  let commitHash = 'unknown';
  try {
    commitHash = git.long();
  } catch (e) {
    console.log('Failed to retrieve commit hash: ', e);
  }
  return commitHash;
}

function getCommitDate() {
  let commitDate = 'unknown';
  try {
    commitDate = git.date()?.toUTCString();
  } catch (e) {
    console.log('Failed to retrieve commit date: ', e);
  }
  return commitDate;
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
    commit: getCommitHash(),
    date: getCommitDate(),
  };

  writeFileSync(versionFilePath, yaml.dump(fileData, {}));
}

createVersionFile();
