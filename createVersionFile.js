const git = require('git-rev-sync');
const readFileSync = require('fs').readFileSync;
const writeFileSync = require('fs').writeFileSync;

function getAppVersion() {
  const packageJsonFilePath = `${process.env.NODE_PATH || '.'}/package.json`;
  const packageJsonData = JSON.parse(readFileSync(packageJsonFilePath));

  return packageJsonData.version;
}

function createVersionFile() {
  const versionFilePath = `${process.env.NODE_PATH || '.'}/version`;
  const fileData = {
    version: getAppVersion(),
    commit: git.long(),
    date: git.date()?.toUTCString(),
  };

  writeFileSync(versionFilePath, JSON.stringify(fileData));
}

createVersionFile();
