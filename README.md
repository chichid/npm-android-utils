# About
This project is to provide android build tools to simplify its use using npm based projects (such as Hybrid web applications)

# Features
 * Download the android SDK and build Tools (I)
 * Run the android SDK and tools using npm scripts

# Usage

Add the android:utils
```
"scripts: {
    "android-utils": "./node_modules/.bin/android-utils",
}
```

This allows to use the available android-utils commands: 
* npm run android-utils downloadDependencies: download the android SDK and dependencies (Gradle, Platforms, etc.).
* npm run android-utils exec: allows the execution of commands within the Android environment that downloadDependencies has setup.

# Example

The following is a full setup for a cordova project using android:

```
"scripts": {
    "android-utils": "./node_modules/.bin/android-utils",
    "postinstall": "npm run cordova:android:setup && npm run android-utils downloadDependencies",
    "android:exec": "npm run android-utils exec",
    "cordova": "npm run android:exec ./node_modules/.bin/cordova",
    "cordova:android:setup": "./node_modules/.bin/cordova platforms add android",
    "cordova:android:build": "npm run cordova build android",
    "cordova:android:clean": "npm run cordova clean android"
}
```

# Notes
If you recently uninstalled Android Studio from your Windows machine. Please make sure you delete the C:\Program Files\Android as gradle will stay there
