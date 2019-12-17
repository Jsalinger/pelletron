# Tips and tricks for developing on Windows with WSL2

## Getting things setup

* Run ADB by creating soft link to adb.exe in WSL:

    ```shell
    sudo ln -s /mnt/c/Users/drenk/AppData/Local/Android/Sdk/platform-tools/adb.exe /usr/local/bin/adb
    ```

* Access WSL2 filesystem in Windows Explorer: `\\wsl$`

* Install Java v8 for React Native (really just the first and last lines):

    ```shell
    sudo apt upgrade
    sudo apt install default-jre
    sudo apt install openjdk-11-jre-headless
    sudo apt install openjdk-8-jre-headless
    sudo apt install openjdk-8-jdk
    ```

    Then, you can see which JRE versions are installed by running, and selecting a version: `sudo update-alternatives --config java`
    And which JDK versions are installed by running

* Add a `local.properties` file to the `/android` path of the project, to indicate Android SDK location, that looks like this:

    ```bash
    sdk.dir = /mnt/c/Users/drenk/AppData/Local/Android/Sdk
    ```

* Clever technique to avoid adb vs adb.exe problems - https://stackoverflow.com/a/57483381 (create copy of adb.exe file to adb - no extension, in Windows)
