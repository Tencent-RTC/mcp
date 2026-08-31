## How to switch the logged-in userId?

First call `destroyed` to clean up the instance and log out, then call `init` to reinitialize and log in.

## Common issues and solutions for Vue2 and Vue3 mini program package size

### Is code compression enabled?

Using the [TUICallKit-Vue2 demo](https://github.com/tencentyun/TUICallKit/tree/main/uni-app/TUICallKit-Miniprogram/TUICallKit-Vue2) as an example, the following comparison shows the effect of checking **Compress code at runtime** (**851KB -> 454KB, reduced by 50%**):

Steps: In HBuilder, go to **Run** > **Run to Mini Program Simulator** > check **Compress code at runtime**.

[≤ v1.4.4]

### How to prevent dependency packages from being bundled into the main package's `common/vendor.js`?

When using **Build npm** in **WeChat DevTools**, we want HBuilder to avoid bundling dependencies from `node_modules` into the main package's `common/vendor.js` (**this causes duplicate dependencies and increases the main package size**).

[Vue2]

It is recommended to configure this via `vue.config.js`.
- The optional `vue.config.js` config file should be placed in the project root directory.

- `vue.config.js` is typically used to configure `webpack` and other build options. When HBuilder uses Vue2 to develop mini programs, `vue.config.js` is automatically loaded during build and packaging.

Using the [TUICallKit-Vue2 demo](https://github.com/tencentyun/TUICallKit/tree/main/uni-app/TUICallKit-Miniprogram/TUICallKit-Vue2) as an example, the following comparison shows the effect of excluding dependencies from the main package's `common/vendor.js` (**805KB -> 256KB, reduced by 68%**):

Steps:
1. Import package dependencies in pages using `require`:

``` javascript
// Page imports MUST use require, NOT import
const TIM = require('tim-wx-sdk');
```
2. Configure `vue.config.js` as follows:

``` javascript
// vue.config.js configuration
module.exports = {
  configureWebpack: {
      externals: {
          'tim-wx-sdk': 'commonjs tim-wx-sdk', // ~550KB
      },
  }
}
```

> **Note:**
> **Page dependency imports MUST use require, NOT import!**
>
> Reason: When using `import`, HBuilder compiles the import statements during mini program packaging, which prevents using `tim-wx-sdk` from `node_modules`. The `require` approach is not compiled.
>

### How to build npm?
1. Based on communication with uni-app technical staff, HBuilder currently does not support a **Build npm** feature like **WeChat DevTools**. They have no plans to support it.

To use **WeChat DevTools > Tools > Build npm**, you must create `package.json` and run `npm install` in the **WeChat DevTools terminal** first. Only then can you **Build npm**:

``` bash
npm init -y && npm install xx
```

### How to use `copy-webpack-plugin` to improve efficiency?

In section [3. How to build npm](#e999cfb9-07ef-4a7c-b32c-acf55caaac6b) above, you need to create `package.json` in the WeChat DevTools terminal and install dependencies. Using `copy-webpack-plugin` can reduce this step and improve efficiency.

Using the [TUICallKit-Vue2 demo](https://github.com/tencentyun/TUICallKit/tree/main/uni-app/TUICallKit-Miniprogram/TUICallKit-Vue2) as an example:

Steps:
1. Install `copy-webpack-plugin`:

   > **Note:**
   >
   > **The latest version of copy-webpack-plugin is not compatible. v5.0.0 is recommended (lock the version)**
   >

``` javascript
npm install -D copy-webpack-plugin@5.0.0
```
2. Use the `copy-webpack-plugin` plugin in `vue.config.js`:

``` javascript
// vue.config.js configuration
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  configureWebpack: {
      plugins: [
          new CopyWebpackPlugin([
              {
                  from: path.join(__dirname, '/node_modules/@tencentcloud/call-uikit-wechat'),
                  to: path.join(__dirname, '/unpackage/dist/dev/mp-weixin/node_modules/@tencentcloud/call-uikit-wechat')
              },
              {
                  from: path.join(__dirname, '/node_modules/trtc-wx-sdk'),
                  to: path.join(__dirname, '/unpackage/dist/dev/mp-weixin/node_modules/trtc-wx-sdk')
              },
              {
                  from: path.join(__dirname, '/node_modules/tim-wx-sdk'),
                  to: path.join(__dirname, '/unpackage/dist/dev/mp-weixin/node_modules/tim-wx-sdk')
              },
              {
                  from: path.join(__dirname, '/node_modules/tsignaling-wx'),
                  to: path.join(__dirname, '/unpackage/dist/dev/mp-weixin/node_modules/tsignaling-wx')
              },
              {
                  from: path.join(__dirname, '/node_modules/tuicall-engine-wx'),
                  to: path.join(__dirname, '/unpackage/dist/dev/mp-weixin/node_modules/tuicall-engine-wx')
              },
              {
                  from: path.join(__dirname, '/package.json'),
                  to: path.join(__dirname, '/unpackage/dist/dev/mp-weixin/package.json')
              }
          ])
      ]
  }
}
```

[Vue3]

No `vite.config.js` configuration is needed. Just use `require` to import:
``` javascript
// Page imports MUST use require, NOT import
const TIM = require('tim-wx-sdk');
```

For reference: [TUICallKit-Vue3 demo](https://github.com/tencentyun/TUICallKit/tree/main/uni-app/TUICallKit-Miniprogram/TUICallKit-Vue3).

### How to build npm?
1. Based on communication with uni-app technical staff, HBuilder currently does not support a **Build npm** feature like **WeChat DevTools**. They have no plans to support it.

To use **WeChat DevTools > Tools > Build npm**, you must create `package.json` and run `npm install` in the **WeChat DevTools terminal** first:

``` javascript
npm init -y && npm install tuicall-engine-wx@1.5.6
```

## Vue2 uni-app packaged WeChat mini program — no ringtone sound?

This is because in Vue2, uni-app packaging encodes ringtone files as base64, which is not supported by the ringtone playback API.

Follow these steps to resolve:
- Step 1: In your project's `TUICallKit` source code, modify the ringtone import method.

   ``` javascript
   // Replace ringtone file import with the following code
   import CALLER_BELL from '../assets/phone_dialing.mp3';
   import CALLEE_BELL from '../assets/phone_ringing.mp3';
   console.debug(CALLEE_BELL, CALLER_BELL);
   let DEFAULT_CALLER_BELL_FILEPATH = '/assets/phone_dialing.mp3';
   let DEFAULT_CALLEE_BELL_FILEPATH = '/assets/phone_ringing.mp3';
   ```

- Step 2: Modify the `vue.config.js` file in your project.

   ``` javascript
   // Inside chainWebpack(config)
   config.module
         .rule('mp3')
         .test(/\.mp3$/)
         .use('file-loader')
         .loader('file-loader')
         .options({
           esModule: false,
           name: 'assets/[name].[ext]'
         })
         .end();
   ```

## What are SDKAppID and SecretKey?
- **SDKAppID**: The IM application ID, used for business isolation. Different SDKAppIDs cannot communicate with each other.

- **SecretKey**: The IM application secret key. Must be used together with SDKAppID to generate the authentication ticket UserSig for legitimate use of IM services.

## What is UserSig and how to generate it?
- UserSig is the password for logging into Instant Messaging (IM). It is essentially ciphertext obtained by encrypting information such as the UserID.

- The recommended approach is to integrate the UserSig calculation code on your server side and provide a project-facing API. When UserSig is needed, your project requests a dynamic UserSig from the business server. For more details, see [Server-side UserSig Generation](https://cloud.tencent.com/document/product/269/32688#GeneratingdynamicUserSig).

## How to handle TUICallKit TypeScript validation errors?

[.eslintignore]
``` plaintext
TUICallKit
```

[tsconfig.json]
``` json
{
  "compilerOptions": {
      "noImplicitAny": true
   }
}
```

## How to disable beauty filters?
- Web: Beauty filters are disabled by default.

- Mini Program: Call the [setBeautyLevel API](https://cloud.tencent.com/document/product/647/78761#setBeautyLevel) with parameter 0 to disable the default beauty filter.

   ``` javascript
   TUICallKitServer.getTUICallEngineInstance().setBeautyLevel(0);
   ```
