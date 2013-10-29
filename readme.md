# Codeivate for Chrome

![0](https://raw.github.com/BeryJu/Codeivate-Chrome/master/images/icon.png)

![0](https://raw.github.com/BeryJu/Codeivate-Chrome/master/images/popout.png)

![0](https://raw.github.com/codeivate/Codeivate-Chrome/master/images/level.png)


# Installation

1. Open [chrome://extensions/](chrome://extensions/)
2. Drag the .crx in dist/ from a folder onto the Extension page opened above
3. Right click on the new Codeivate icon select 'options'
4. Enter your Codeivate username

# Contribute

## Building 

0. Install Node.js [nodejs.org](http://nodejs.org/)

1. Install grunt

`npm install -g grunt-cli`

2. Install TypeScript

`npm install -g typescript`

3. Install dependencies

`npm install`

4. Build

`grunt`

## Files

### src/extension/Extension.ts

The Main Extension, i.e. Updating, Authenticating and Parsing

### src/extension/Language.ts

Data Structure for a Codeivate Langauge, holds Name, Level and Points.

### src/extension/User.ts

Data Structure for the User Profile, holds Name, Level and more.

### src/lib/chrome.d.ts

Declares Chrome Extension API's for TypeScript compiler

### src/lib/webkit.d.ts

Declares webkit's Notification API for the TypeScript compiler