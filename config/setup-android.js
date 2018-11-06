/**
 * Android and cordova setup utils
 * "setup-android": "node ./config/setup-android",
 * "android:setup": "npm run setup-android downloadDependencies",
 * "cordova": "node run setup-android cordova",
 * "android:build": "npm run cordova build android",
 * "android:clean": "npm run cordova clean android"
*/

const utils = require('./utils');
const fs = require('fs');
const prependPath = require('prepend-path');
const path = require('path');

const ANDROID_SDK = './android-sdk';
const ANDROID_SDK_ZIP_OUTPUT = 'sdk-tools.zip';
const ANDROID_SDK_MANAGER = `${ANDROID_SDK}/tools/bin/sdkmanager`;
const BUILD_TOOLS_VERSION = `28.0.3`;
const PLATFORM_VERSION = `android-28`;
const GRADLE_ZIP_OUTPUT = 'gradle.zip';
const GRADLE_VERSION = `4.10.2`;
const GRADLE_EXTRACT_PATH = './android-sdk';
const GRADLE_PATH = `${GRADLE_EXTRACT_PATH}/gradle-${GRADLE_VERSION}`

module.exports.withAndroidEnv = function(command) {
	prependPath(path.resolve(`${GRADLE_PATH}/bin`));
	prependPath(path.resolve(`${ANDROID_SDK}/platform-tools`));
	prependPath(path.resolve(`${ANDROID_SDK}/tools`));
	utils.exec(`ANDROID_HOME=${path.resolve(ANDROID_SDK)} GRADLE_HOME=${path.resolve(GRADLE_PATH)} ${command}`);
}

module.exports.cordova = function(command) {
	const cordovaExectuable = './node_modules/.bin/cordova';

	if (!fs.existsSync(cordovaExectuable)) {
		console.error('Cordova is not installed in the project, please: npm install cordova');
		return;
	}

	this.withAndroidEnv(`${cordovaExectuable} ${command}`);
}

module.exports.downloadDependencies = function() {
	downloadSdkTools();
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
	utils.exec(`yes | ${ANDROID_SDK_MANAGER} "build-tools;${BUILD_TOOLS_VERSION}" "platforms;${PLATFORM_VERSION}"`)
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

require('make-runnable/custom')({
	printOutputFrame: false
})