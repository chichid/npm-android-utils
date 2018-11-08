# About
This project is to provide android build tools to simplify its use using npm based projects (such as Hybrid web applications)

# Features
 * Download the android SDK and build Tools (I)
 * Run the android SDK and tools using npm scripts

# Scripts

Add the android:exec
```
"scripts: {
    "android:exec": "node ./node_modules/npm-android-utils/android-utils exec"
}
```

This allows using "npm run android:exec {COMMAND} {ARGS}" within an Android Environment (ANDROID_HOME, Gradle, etc.). For example to run the command "cordova build android": 

```
npm run android:exec cordova build android
```

# Notes
If you recently uninstalled Android Studio from your Windows machine. Please make sure you delete the C:\Program Files\Android as gradle will stay there
