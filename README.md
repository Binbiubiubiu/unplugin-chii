# unplugin-chii

[![NPM version](https://img.shields.io/npm/v/unplugin-chii?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-chii) [![CI](https://github.com/Binbiubiubiu/unplugin-chii/actions/workflows/ci.yml/badge.svg)](https://github.com/Binbiubiubiu/unplugin-chii/actions/workflows/ci.yml) [![codecov](https://codecov.io/gh/Binbiubiubiu/unplugin-chii/branch/main/graph/badge.svg?token=lN8p3F3hYN)](https://codecov.io/gh/Binbiubiubiu/unplugin-chii)

## Install

```bash
npm i unplugin-chii
```

## Option

| name     | type    | description |
| -------- | ------- | ----------- |
| enable   | boolean |             |
| port     | number  |             |
| host     | string  |             |
| domain   | string  |             |
| cdn      | string  |             |
| https    | string  |             |
| sslCert  | string  |             |
| sslKey   | string  |             |
| basePath | string  |             |

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Starter from 'unplugin-chii/vite'

export default defineConfig({
  plugins: [
    Starter({
      /* options */
    }),
  ],
})
```

Example: [`vite-playground/`](https://github.com/Binbiubiubiu/unplugin-chii/tree/main/vite-playground)

<br></details>

<details>
<summary>Webpack</summary><br>

> You need to set `WEBPACK_SERVE` environment variable to non-falsy

```ts
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  /* ... */
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    require('unplugin-chii/webpack')({
      /* options */
    }),
  ],
}
```

Example: [`webpack-playground/`](https://github.com/Binbiubiubiu/unplugin-chii/tree/main/webpack-playground/)

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default {
  buildModules: [
    [
      'unplugin-chii/nuxt',
      {
        /* options */
      },
    ],
  ],
}
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-chii/webpack')({
        /* options */
      }),
    ],
  },
}
```

<br></details>
