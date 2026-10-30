<img alt="React Native Typescript Boilerplate" src="../assets/logo.png" width="1050"/>

# 🍺 Project Structure

## File structure

`index.js` is the entry-point for our file, and is mandatory.
`App.tsx` is the main-point for our application.

- `/android` - contains native code specific to the Android OS
- `/ios` - native code specific to iOS
- `/docs` - as the name suggests - any docs
- `/src` - contains our JS and style code.
  - `/screens` - contains all screens/pages
  - `/services` - app-wide services
    - `/api` - generic network handling with API constants
    - `/event-emitter` - singleton event bus to use it everywhere in the project
    - `/models` - generic models should lay here
    - `/navigation` - navigation system lay here
  - `/shared` - whole app-wide shared
    - `/components` - app-wide shared components
    - `/constants` - app-wide shared constant variables
    - `/localization` - app-wide localization
    - `/theme` - app-wide theme which contains `color palette` and `fonts`
  - `/utils` - generic util functions
  - `index.js` - the starting place for our app
  - `App.tsx` - the main place for our app

## Project Structure on Flat Design

```
├───android
├───ios
├───src
│   ├───screens
│   │   ├───detail
│   │   │   ├───DetailScreen.style.ts
│   │   │   └───DetailScreen.tsx
│   │   ├───home
│   │   │   ├───HomeScreen.style.ts
│   │   │   └───HomeScreen.tsx
│   │   ├───notification
│   │   │   ├───NotificationScreen.style.ts
│   │   │   └───NotificationScreen.tsx
│   │   ├───profile
│   │   │   ├───ProfileScreen.style.ts
│   │   │   └───ProfileScreen.tsx
│   │   └───search
│   │       ├───SearchScreen.style.ts
│   │       └───SearchScreen.tsx
│   ├───services
│   │   ├───api
│   │   │   ├───api.constant.ts
│   │   │   └───index.ts
│   │   ├───event-emitter
│   │   │   └───index.ts
│   │   ├───models
│   │   │   └───index.ts
│   │   └───navigation
│   │       └───index.tsx
│   ├───shared
│   │   ├───components
│   │   │   └───text-wrapper
│   │   ├───constants
│   │   │   └───index.ts
│   │   ├───localization
│   │   │   └───index.ts
│   │   └───theme
│   │       ├───fonts.ts
│   │       └───themes.ts
│   └───utils
│       └───index.ts
├───.babelrc
├───.commitlintrc.json
├───.eslintignore
├───.eslintrc.js
├───.gitattributes
├───.gitignore
├───.npmignore
├───.prettierignore
├───.prettierrc
├───.watchmanconfig
├───app.json
├───App.tsx
├───global.d.ts
├───index.js
├───metro.config.js
├───package-lock.json
├───package.json
├───react-native.config.js
├───README.md
├───tsconfig.json
```
