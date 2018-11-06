const utils = require('./utils');
const fs = require('fs');
const ANDROID_SDK = './android-sdk';
const ANDROID_SDK_ZIP_OUTPUT = 'sdk-tools.zip';
const ANDROID_SDK_MANAGER = `${ANDROID_SDK}/tools/bin/sdkmanager`;
const BUILD_TOOLS_VERSION = `28.0.3`;
const PLATFORM_VERSION = `android-28`;

(function main() {
	downloadSdkTools();
})();

function downloadSdkTools() {
	const downloadUrl = getSdkToolsUrl();
	
	if (downloadUrl && !fs.existsSync(ANDROID_SDK_MANAGER)) {
		utils.downloadZip(
			getSdkToolsUrl(),  
			ANDROID_SDK, 
			ANDROID_SDK_ZIP_OUTPUT,
			installSdk
		);
	} else {
		installSdk();
	}
}

function installSdk() {
	console.log(`Installing the android sdk ${PLATFORM_VERSION}, and build-tools version ${BUILD_TOOLS_VERSION}...`);
	ensureAndroidRepoExists();
	fs.chmodSync(ANDROID_SDK_MANAGER, 0o555);
	utils.exec(`yes | ${ANDROID_SDK_MANAGER} "build-tools;${BUILD_TOOLS_VERSION}" "platforms;${PLATFORM_VERSION}"`)
}

function ensureAndroidRepoExists() {
	// TODO create /Users/rachidox/.android/repositories.cfg
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