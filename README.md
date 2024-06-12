<!-- ix-docs-ignore -->

![imgix logo](https://assets.imgix.net/sdk-imgix-logo.svg)

A Strapi Plugin that integrates any type of Upload Provider with imgix's [Asset Manager](https://docs.imgix.com/setup/asset-manager). Unleash the Potential of Your Media with AI.

[![npm version](https://img.shields.io/github/package-json/v/imgix/strapi-plugin-imgix?label=npm&logo=npm)](https://www.npmjs.com/package/@imgix/strapi-plugin-imgix)
[![Build Status](https://circleci.com/gh/imgix/strapi-plugin-imgix.svg?style=shield)](https://circleci.com/gh/imgix/strapi-plugin-imgix)
[![Downloads](https://img.shields.io/npm/dm/@imgix/strapi-plugin-imgix.svg)](https://www.npmjs.com/package/@imgix/strapi-plugin-imgix)
[![License](https://img.shields.io/github/license/imgix/strapi-plugin-imgix.svg?color=informational)](https://github.com/imgix/strapi-plugin-imgix/blob/main/LICENSE.md)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fimgix%2Fstrapi-plugin-imgix.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fimgix%2Fstrapi-plugin-imgix?ref=badge_shield)

---

<!-- prettier-ignore-start -->

<!-- toc -->


### Table of Contents

1. [✨ Features](#-features)
2. [⏳ Installation](#-installation)
3. [🖐 Requirements](#-requirements)
4. [🔧 Configuration](#-configuration)
   - [imgix configuration](#imgix-configuration)
   - [Settings page configuration](#settings-page-configuration)
   - [File configuration file](#file-configuration)
   - [Security Middleware Configuration](#security-middleware-configuration)
5. [🎨 Rendering images](#-rendering-images)
6. [👨‍💻 Community support](#-community-support)
7. [📝 License](#-license)

<!-- tocstop -->

<!-- prettier-ignore-end -->

## ⏳ Installation

### Via Strapi Marketplace

As a ✅ **verified** plugin by Strapi team we're available on the [**Strapi Marketplace**](https://market.strapi.io/plugins/strapi-plugin-imgix) as well as **In-App Marketplace** where you can follow the installation instructions.

<div style="margin: 20px 0" align="center">
  <img style="width: 100%; height: auto;" src="public/assets/marketplace.png" alt="Strapi In-App Marketplace" />
</div>

### Via command line

(Use **yarn** to install this plugin within your Strapi project (recommended). [Install yarn with these docs](https://yarnpkg.com/lang/en/docs/install/).)

```bash
yarn add strapi-plugin-imgix@latest
```

After successful installation you've to re-build your Strapi instance. To archive that simply use:

```bash
yarn build
yarn develop
```

or just run Strapi in the development mode with `--watch-admin` option:

```bash
yarn develop --watch-admin
```

The **imgix** plugin should appear in the **Plugins** section of Strapi sidebar after you run app again.

As a next step you must configure your the plugin by the way you want to. See [**Configuration**](#🔧-configuration) section.

All done. Enjoy 🎉

### Working in development mode

1. Clone repository

   ```
   git clone git@github.com:imgix/strapi-plugin-imgix.git
   ```

2. Create a soft link in your strapi project to plugin build folder

   ```sh
   ln -s <your path>/strapi-plugin-imgix/dist <your path>/strapi-project/src/plugins/imgix
   ```

3. Modify `config/plugins.{js,ts}` for `imgix`

  ```js
  //...
  'imgix': {
    enabled: true,
    resolve: './src/plugins/imgix',
    //...
  }
  //...
  ```

4. Run develop or build command

   ```ts
   // Watch for file changes
   yarn develop
   // or run build without nodemon
   yarn build:dev
   ```

## 🖐 Requirements

Complete installation requirements are exact same as for Strapi itself and can be found in the documentation under [Installation Requirements](https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html).

**Minimum environment requirements**

- Node.js `>=18.0.0 <=20.x.x`
- NPM `>=6.x.x`

In our minimum support we're following [official Node.js releases timelines](https://nodejs.org/en/about/releases/).

**Supported Strapi versions**:

- Strapi v4.24.x (recently tested)
- Strapi v4.x


## 🔧 Configuration

To start your journey with **imgix plugin** you must first setup your **imgix account** and then your Strapi instance using the dedicated Settings page via the `config/plugins.{js,ts}`. 

### imgix configuration
1. [Create an account](https://docs.imgix.com/getting-started/setup/quick-start-guide)
2. [Setup source](https://docs.imgix.com/getting-started/setup/creating-sources)
3. [Setup token / API key](https://dashboard.imgix.com/api-keys) - **Ensure that the generated key has the following permission: `Sources`**


### Settings page configuration

You can easly access via `Strapi Settings -> Section: IMGIX Plugin -> Configuration`. On dedicated page you will be able to setup all crucial properties which drives the integration with **imgix**.

To run the basic functionality you need to specify just following properties:
- Source - Webfolder or Other
- Media Library Source URL - Example: `http://localhost:1337/public/images/`
- imgix Source URL - Example: `https://img1234.imgix.net`

Advanced section is mandatory for `Source type == Other` and enables plugin to operate using **imgix Management API** and control single resources. To make that work you need to configure following parameters:
- [API Key](https://dashboard.imgix.com/api-keys)
- [Source ID](https://docs.imgix.com/apis/management/overview#making-requests)

<div style="margin: 20px 0" align="center">
  <img style="width: 100%; height: auto;" src="public/assets/configuration.png" alt="Plugin configuration" />
</div>

> _Note_
> Default configuration for your plugin is fetched from `config/plugins.{js,ts}` or directly from the plugin itself. If you would like to customize the default state to which you might revert, please follow the next section.

### File configuration

To setup amend default plugin configuration we recommend to put following snippet as part of `config/plugins.{js,ts}` or `config/<env>/plugins.{js,ts}` file. If the file does not exist yet, you have to create it manually. If you've got already configurations for other plugins stores by this way, use just the `imgix` part within exising `plugins` item.

```ts
// config/plugins.{js,ts}

module.exports = ({ env }) => ({
  //...
  'imgix': {
    enabled: true,
    config: {
        mediaLibrarySourceUrl: '<MEDIA SOURCE OF YOUR PROVIDER OR YOUR DOMAIN>', // Example: https://my-awss3-bucket-for-strapi.s3.eu-central-1.amazonaws.com/ or https://mydomain.com/uploads/
        apiKey: '<YOUR IMGIX API KEY / TOKEN HERE>',
        source: {
            type: '<SOURCE TYPE>' // 'other' or 'webfolder'. Default: 'other'
            id: '<SOURCE ID STRING>', // Example: 
            url: '<IMGIX SOURCE URL>', // Example: https://my-source.imgix.net
        },
    },
  },
  //...
});
```

### Security Middleware Configuration
The default settings of the **Strapi Security Middleware** will not allow you do display uploaded images thumbnails directly in the **Media Library** interface. That's the common setting to change as per various external media providers which are integrated with Strapi.
You will need to modify the `contentSecurityPolicy` settings by replacing `strapi::security` string with the object bellow instead.

```ts 
// config/middlewares.{js,ts}

module.exports = [
  // ...
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            '<IMGIX SOURCE URL>', // Example: https://my-source.imgix.net
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            '<IMGIX SOURCE URL>', // Example: https://my-source.imgix.net
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  // ...
];
```

#### Properties

- `mediaLibrarySourceUrl` - url of your local / provider image source of *Strapi Media Library*. Example: `http://localhost:1337/public/images/`
- `apiKey` - **imgix** Management API Key ([setup](https://dashboard.imgix.com/api-keys))
- `source.id` -  your **imgix** source id as a 24-character string ([setup](https://docs.imgix.com/apis/management/overview#making-requests))
- `source.url` - you **imgix** source url / subdomain. Example: `https://img1234.imgix.net`


## 🎨 Rendering images

Images provided by the Strapi Media Library with imgix Integration Plugin runing enables you to use the full set of **imgix** functionalities out of the box using a Render API query parameters or SDKs.

### Render API

See the full documentation **[here](https://docs.imgix.com/apis/rendering/overview)**

### SDK

**imgix** support multiple different frontend libraries by ready to use SDKs, like:
- JavaScript
- React
- Vue
- Gatsby
- and more. 

To get the full list please check the dedicated **[Libraries directory](https://docs.imgix.com/libraries)**.

## 👨‍💻 Community support

Plugin was implemented &amp; is maintained by the **[VirtusLab Open Source Team](https://virtuslab.com)**.

For general help using Strapi, please refer to [the official Strapi documentation](https://strapi.io/documentation/). For additional help, you can use one of these channels to ask a question:

- [Discord](https://discord.strapi.io/) We're present on official Strapi Discord workspace. Find us by `[VirtusLab]` prefix and DM.
- [GitHub](https://github.com/VirtusLab-Open-Source/strapi-plugin-comments/issues) (Bug reports, Contributions, Questions and Discussions)
- [E-mail](mailto:strapi@virtuslab.com) - we will respond back as soon as possible

## 📝 License

[MIT License](LICENSE.md) Copyright (c) [imgix, Inc.](https://www.imgix.com/) &amp; [VirtusLab Sp. z o.o.](https://virtuslab.com/)