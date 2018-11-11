const utils = require('./utils');
const fs = require('fs');
const prependPath = require('prepend-path');
const path = require('path');

const ANDROID_SDK = './android-sdk';
const ANDROID_SDK_ZIP_OUTPUT = 'sdk-tools.zip';
const ANDROID_SDK_MANAGER = `${ANDROID_SDK}/tools/bin/sdkmanager${process.platform === 'win32' ? '.bat' : ''}`;
const BUILD_TOOLS_VERSION = `28.0.3`;
const PLATFORM_VERSION = `android-28`;
const GRADLE_ZIP_OUTPUT = 'gradle.zip';
const GRADLE_VERSION = `4.10.2`;
const GRADLE_EXTRACT_PATH = ANDROID_SDK;
const GRADLE_PATH = `${GRADLE_EXTRACT_PATH}/gradle-${GRADLE_VERSION}`

module.exports.exec = function (commands) {
  const resolve = p => path.resolve(p);

  prependPath(resolve(`${GRADLE_PATH}/bin`));
  prependPath(resolve(`${ANDROID_SDK}/platform-tools`));
  prependPath(resolve(`${ANDROID_SDK}/tools`));

  const env = Object.assign(process.env, {}, {
    'ANDROID_HOME': resolve(ANDROID_SDK),
    'GRADLE_HOME': resolve(GRADLE_PATH)
  });

  if (commands && commands.length > 0) {
    const executable = isRelative(commands[0]) ? path.resolve(commands[0]) : commands[0];
    const args = commands.slice(1, commands.length).join(' ');
    console.log(`[android-utils] - executing: ${executable} ${args}`);
    utils.exec(`${executable} ${args}`, env);
  } else {
    console.error(`npm-android-utils exec didn't receive any commands`);
  }
}

module.exports.downloadDependencies = function () {
  downloadSdkTools();
}


function isRelative(p) {
  return p.indexOf('./') != -1 ||
    p.indexOf('.\\') != -1 ||
    p.indexOf('/.') != -1 ||
    p.indexOf('\\.') != -1 ||
    p.indexOf('..') != -1;
}

function downloadSdkTools() {
  const downloadUrl = getSdkToolsUrl();

  if (downloadUrl && !fs.existsSync(ANDROID_SDK_MANAGER)) {
    utils.downloadZip(
      getSdkToolsUrl(),
      ANDROID_SDK,
      ANDROID_SDK_ZIP_OUTPUT,
      () => onSdkToolsDownloaded()
    );
  } else {
    onSdkToolsDownloaded();
  }
}

function onSdkToolsDownloaded() {
  downloadGradle();
}

function downloadGradle() {
  const downloadUrl = getGradleUrl();

  if (downloadUrl && !fs.existsSync(GRADLE_PATH)) {
    utils.downloadZip(
      getGradleUrl(),
      GRADLE_EXTRACT_PATH,
      GRADLE_ZIP_OUTPUT,
      () => onGradleDownloaded()
    );
  } else {
    onGradleDownloaded();
  }
}

function onGradleDownloaded() {
  prependPath(path.resolve(`${GRADLE_PATH}/bin`));
  fs.chmodSync(`${GRADLE_PATH}/bin/gradle`, 0o555);
  installAndroidSdk()
}

function getGradleUrl() {
  return `https://downloads.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip`;
}

function installAndroidSdk() {
  console.log(`Installing the android sdk ${PLATFORM_VERSION}, and build-tools version ${BUILD_TOOLS_VERSION}...`);
  fs.chmodSync(ANDROID_SDK_MANAGER, 0o555);
  utils.exec(`yes | ${path.resolve(ANDROID_SDK_MANAGER)} "build-tools;${BUILD_TOOLS_VERSION}" "platforms;${PLATFORM_VERSION}"`)
}

function getSdkToolsUrl() {
  // Mapping of the platform 
  let mapping = {
    'win32': 'windows',
    'darwin': 'darwin',
    'linux': 'linux'
  }

  if (!mapping[process.platform]) {
    console.error(`Your platform ${process.platform} is not supported by the android setup script.`);
    return;
  }

  let sdkZip = `sdk-tools-${mapping[process.platform]}-4333796.zip`;
  return `https://dl.google.com/android/repository/${sdkZip}`;
}