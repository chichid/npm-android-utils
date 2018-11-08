# About
This project is to provide android build tools to simplify its use using npm based projects (such as Hybrid web applications)

# Features
 * Download the android SDK and build Tools (I)
 * Run the android SDK and tools using npm scripts

# Setup
Add the following command to your package json:

```
"scripts: {
    "android:exec": "node ./node_modules/npm-android-utils/setup-android exec"
}
```

The android:exec script allows to run a command withing an android environment (ANDROID_HOME, GRADLE_HOME, etc.)

# Notes
If you recently uninstalled Android Studio from your Windows machine. Please make sure you delete the C:\Program Files\Android as gradle will stay there
