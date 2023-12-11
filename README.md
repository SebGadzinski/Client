# BlackboxVueQuasarApp

This is the client application that connects to BlackBoxVueQuasarAppServer project for authority and data

## Connection to BlackBoxVueQuasarAppServer

The auth and data services are making api calls to the server with parameters, no queries. This is to minimize database attacks.

## Features

-   i18n Translations
    -   Currently just english and french
-   Firebase Analytics
-   JWT Token Verification with Axios
-   pinia State Stores
-   Google gtag
    -   Tag routes or errors
-   Capacitator to run on android and ios!
-   Theming made easy!

## Themes

Themes are found inside of src/themes.
Example:

```
const typeTheme = {
    primary: "#d32f2f",
    secondary: "#ffffff",
    accent: "#ff8a80",
    positive: "#76c7c0",
    negative: "#c62828",
    info: "#0288d1",
    warning: "#fbc02d",
    background: "#ffffff",
  };
```

export { lightTheme, darkTheme }

## Layout Architecture

Inside of src/layouts contains different layouts that can be used for the authorization and main view's of the application

### /auth

This is where all auth layouts can be placed

### /main

This is where all the main layouts of the application are stored.

### Switching Layouts

Inside of src/router/routes.js you can change the main layout by changing the layout placed in the routes objet at the bottom.

## Set Up

### Firebase Notifications and Analytics

-   Create firebase project
-   Add app for ios and Android
-   Get google services json for each project
    -   Android: Put in /src-capacitor/android/app/google-services.json
    -   ios: Put in /src-capacitor/ios/App/App/GoogleServices-Info.plist

### Google Gtag

-   Get GOOGLE_MEASUREMENT_ID from Google Analytics
    -   Click admin settings and it should be on inner tab besise your project name
-   Add to src/boot/google-analytics.js

### Icon set up

-   Generate all icons neccesary for ios and android by running the command inside of /icongenie-command file.

## Npm Scripts

1. ```
   npm run lint
   ```

-   Check to see if there is any compiler issues

    #### Command

        eslint --ext .js,.vue ./

2. ```
   npm run test
   ```

-   Ensure that npm is installed and working

    #### Command

        echo \"No test specified\" && exit 0"

### Run Project

1. ```
   npm run dev
   ```

-   Run app in development enviorment

    #### Command

        npx quasar dev"

2.  ```
    npm run android
    ```

-   Run the android application in development enviorment
-   Ensure you have android studio installed
-   Ensure you have a android emulator installed as well, if not then connect your android phone via usb and ensure it is selected in android studio.
-   Once you run this command you will need to either press the run button in android studio or the debug button

    #### Command

        npx quasar dev -m capacitor -T android

3.  ```
    npm run ios
    ```

-   Run the ios application in development enviorment
-   ensure this is running on a mac
-   ensure you have xcode installed
-   ensure you have a emulator for a i device
-   Once you run this command you will need to press the run button in xcode

    #### Command

        quasar dev -m capacitor -T ios

#### Tip

When running the project in android or ios mode you can get a better log information when you inspect with chrome developer tools.

### Building Project

Don't use these often as they bump the package.json version

1.  ```
    npm run build-ios
    ```

-   Ensure you are not running the ios project when running this command
-   Bumps the package.json version
-   Sets up build for ios deployment

    #### Command

        npm version patch && quasar build -m capacitor -T ios --ide

2.  ```
    npm run build-android
    ```

-   Ensure you are not running the android project when running this command
-   Bumps the package.json version
-   Sets up build for ios deployment

    #### Command

        npm version patch && quasar build -m capacitor -T android --ide"

3.  ```
    npm run build-www
    ```

-   Ensure you are not running any other projects
-   Bumps the package.json version
-   Creates a www folder in capacitor

    #### Command

         npm version patch && quasar build -m capacitor -T android --skip-pkg",

### Other

1.  ```
    npm run bump-android
    ```

-   Bumps android package.json version

    #### Command

        npm version patch && quasar dev -m capacitor -T android

2.  ```
    npm run capgo
    ```

-   Ensures mobile development is possible?

    #### Command

        npm run capgo --prefix ./src-capacitor

3.  ```
    push-dev
    ```

-   Bumps package.json version
-   Builds android app ready for development

    #### Command

        npm version patch && quasar build -m capacitor -T android --skip-pkg && npm run capgo-dev --prefix ./src-capacitor

4. ```
   npm push-release
   ```

-   Bumps package.json version
-   Builds android app ready for production

#### Command

    npm version patch && quasar build -m capacitor -T android --skip-pkg && npm run capgo-release --prefix ./src-capacitor

## Publishing Project

### web

    npm run build-www

-   Where your server is running:
    -   Copy all files inside of the /src-capacitor/www folder
    -   Paste into the server folder, it will overwrite everything

### ios android

    npm run build-www

-   Open up the folder in /src-capacitator/www
-   Create a zip folder from all content and label it dist.zip
-   Wherever your server is running:

    -   Look at the version in package.json and create a folder in your APP_VERSION_DIRECTORY with that as the name (exp: 1.0.0)
    -   Put the dist.zip folder inside

## Publish For Testing

For more help, view the example videos

### ios testflight

-   Update build version in xcode to package.json version

    npm run build-ios

-   Archive project in xcode
-   View archived project and deploy it
-   Go to test flight in apple developer console
-   Complete uploading to testflight there

### android open testing

-   Bump version in /src-capacitor/android/app/build.gradle

    npm run build-android

-   Generate signed apk's in android studio
-   Ensure you have a sha key and store it in a safe location. Make a duplicate and store it in a usb
-   Go to google play store open testing and add the apk
-   Follow any rules there
