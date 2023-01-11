# unplugin-chii

[![NPM version](https://img.shields.io/npm/v/unplugin-chii?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-chii)

## Install

```bash
npm i unplugin-chii
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Starter from 'unplugin-chii/vite'

export default defineConfig({
  plugins: [
    Starter({ /* options */ }),
  ],
})
```

Example: [`vite-playground/`](https://github.com/Binbiubiubiu/unplugin-chii/tree/main/vite-playground)

<br></details>


<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  /* ... */
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    require('unplugin-chii/webpack')({ /* options */ })
  ]
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
    ['unplugin-chii/nuxt', { /* options */ }],
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
      require('unplugin-chii/webpack')({ /* options */ }),
    ],
  },
}
```

<br></details>

