# UCL Assistant - App

App source code for UCL Assistant.

## Getting up and running

You'll need the Expo XDE client or the Expo command line client. Get them from
[here](https://expo.io/tools). You'll also need Yarn or NPM installed.

Copy `app.example.json` to `app.json` and add your own Google Maps API key and
either modify or delete the Sentry sourcemap hook. Remember to update the APP_JSON env variable in Travis if you modify `app.json`.

The Google Maps API key is optional but without it you won't be able to use Maps
on Android. You'll want to create an API key on the
[Google APIs console](https://console.developers.google.com/apis/) and then give
the key access to the Google Maps Android API.

Install the necessary dependencies with `npm i`

Then you can start the app with `npm run start`

## Which API server?

production mode: uses ucl-assistant.uclapi.com

development mode: uses ucl-assistant.herokuapp.com

## Saving user data

The app uses [redux-persist](https://github.com/rt2zz/redux-persist) to save the
app state to the device storage. In the future, for extra security, the `user`
reducer will be saved using the `Expo.SecureStore` API.

## Deployment

To publish the latest version of UCL Assistant over-the-air via Expo

```
$ npm run publish
```

To build a APK/IPA, which will also publish the current version of UCL Assistant

```
$ npm run build
```

To upload the APK/IPA to the Play/App Store.

```
$ npm run upload
```

When uploading to the Play Store, there should be an `android.json` containing the credentials for the service account in the project root folder. This is the credentials JSON file that can be obtained from the [Google Developers Console](https://console.developers.google.com/project/685091039853/apiui/credential) (see `android.example.json`).

When uploading to the App Store, there should be an `ios.json` containing the credentials for the App Store Connect account (see `ios.example.json`).

### Details

Expo allows us to update the app seamlessly OTA.

### Automatic Deployment

### Manual Deployment

To manually publish:

    expo publish --release-channel production-[VERSION CODE]

`[VERSION CODE]` should follow semantic versioning, e.g. 2.0.0.

Similarly, to create a new app binary (when native code is modified, e.g. for an Expo SDK update)

    expo build:android --release-channel production-[VERSION CODE]
    expo build:ios --release-channel production-[VERSION CODE]
